// ============================================================
//  PokéScellé — Backend proxy eBay
//  Authentification OAuth, recherche ventes, cache JSON
// ============================================================

import 'dotenv/config';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// ── Couche DB (libSQL / Turso ou SQLite local) ──────────────
import {
    db, DB_MODE, initSchema,
    getUserById, getUserByUsername, createUser, updateUserPassword,
    getPortfolio, setPortfolio, listPortfolioUserIds,
    getPortfolioHistory, upsertPortfolioHistory,
    getPriceHistory, upsertPriceHistory, getAllPriceHistory,
    listTransactions, createTransaction, deleteTransaction,
    getBarcode, listBarcodes, setBarcode, deleteBarcode,
    getCache as dbGetCache, setCache as dbSetCache, deleteCache as dbDeleteCache,
    getAllCache as dbGetAllCache,
    getCustomQueries, setCustomQuery,
    getOrCreateAppSecret,
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

// ── Auth / Users ────────────────────────────────────────────

// TOKEN_SECRET : env var prioritaire, sinon secret persistant en DB
// initialise dans start() avant app.listen(). Ne JAMAIS utiliser une
// valeur aleatoire en fallback : elle changerait a chaque redeploy et
// invaliderait toutes les sessions (effet "compte supprime").
let TOKEN_SECRET = process.env.TOKEN_SECRET || null;

async function ensureDataDirs() {
    // Encore utilisé pour le fichier SQLite local si pas de Turso
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
}

function hashPassword(password, salt) {
    salt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password, salt, hash) {
    const result = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return result === hash;
}

function createToken(userId) {
    const payload = { id: userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }; // 7 jours
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
    return `${data}.${sig}`;
}

function verifyToken(token) {
    if (!token) return null;
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
}

function authMiddleware(req, res, next) {
    // Token soit dans le header Authorization, soit en query (pour navigator.sendBeacon
    // qui ne supporte pas les headers custom)
    let token = null;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
        token = auth.slice(7);
    } else if (req.query && typeof req.query.token === 'string' && req.query.token) {
        token = req.query.token;
    }
    if (!token) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
    req.userId = payload.id;
    next();
}

// Portfolio via DB — on garde ces alias pour minimiser les changements plus bas
async function readPortfolio(userId) {
    const pf = await getPortfolio(userId);
    return pf && Object.keys(pf).length > 0 ? pf : null;
}

async function writePortfolio(userId, portfolio) {
    await setPortfolio(userId, portfolio);
}

const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID;
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
const EBAY_AFFILIATE_CAMPAIGN_ID = process.env.EBAY_AFFILIATE_CAMPAIGN_ID || '';

function toAffiliateUrl(url) {
    if (!url || !EBAY_AFFILIATE_CAMPAIGN_ID) return url;
    try {
        const encoded = encodeURIComponent(url);
        return `https://rover.ebay.com/rover/1/709-53476-19255-0/1?mpre=${encoded}&campid=${EBAY_AFFILIATE_CAMPAIGN_ID}&toolid=10001`;
    } catch {
        return url;
    }
}
const IS_SANDBOX = process.env.EBAY_ENV === 'sandbox';

const EBAY_AUTH_URL = IS_SANDBOX
    ? 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
    : 'https://api.ebay.com/identity/v1/oauth2/token';

const EBAY_API_URL = IS_SANDBOX
    ? 'https://api.sandbox.ebay.com'
    : 'https://api.ebay.com';

// ── Cache & Historique (DB) ─────────────────────────────────

const CACHE_TTL = 1 * 60 * 60 * 1000; // 1 heure

async function appendHistory(productId, priceData) {
    const today = new Date().toISOString().slice(0, 10);
    await upsertPriceHistory(productId, {
        date: today,
        median: priceData.price,
        low: priceData.low,
        high: priceData.high,
        lastPrice: priceData.lastListing?.price || priceData.price,
        sampleSize: priceData.sampleSize,
    });
}

async function readHistory(productId) {
    return getPriceHistory(productId);
}

async function readCache(key) {
    return dbGetCache(key, CACHE_TTL);
}

async function writeCache(key, data) {
    return dbSetCache(key, data);
}

// ── eBay OAuth ───────────────────────────────────────────────

let tokenCache = { token: null, expires: 0 };

async function getAccessToken() {
    if (tokenCache.token && Date.now() < tokenCache.expires) {
        return tokenCache.token;
    }

    const credentials = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString('base64');

    const res = await fetch(EBAY_AUTH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`,
        },
        body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`eBay auth failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    tokenCache = {
        token: data.access_token,
        expires: Date.now() + (data.expires_in - 60) * 1000,
    };

    return tokenCache.token;
}

// ── eBay Search (Browse API) ─────────────────────────────────

async function searchEbaySold(query, limit = 20, priceRange = null) {
    const token = await getAccessToken();

    const filters = ['conditionIds:{1000}']; // Neuf uniquement
    if (priceRange) {
        filters.push(`price:[${priceRange.min}..${priceRange.max}],priceCurrency:EUR`);
    }

    const params = new URLSearchParams({
        q: query,
        limit: String(limit),
        filter: filters.join(','),
        sort: 'price',
    });

    const res = await fetch(
        `${EBAY_API_URL}/buy/browse/v1/item_summary/search?${params}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR',
                'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=FR',
            },
        }
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`eBay search failed (${res.status}): ${text}`);
    }

    return res.json();
}

// ── Scoring des résultats eBay (précision des prix) ─────────
//
// Chaque item eBay retourné par la recherche est noté 0-100.
// On elimine les items sous un seuil avant de calculer la médiane.
// But : virer lots, cartes gradées, produits en langue étrangère,
// vendeurs douteux, sleeves/playmats mal catalogués en "booster", etc.

const SUSPICIOUS_PATTERNS = [
    // Lots et multi-packs
    { re: /\blot\s*de\s*\d+/i,              penalty: 45, safeIfQueryMatch: /\blot\b/i },
    { re: /\b\d+\s*x\s+/i,                  penalty: 40 },
    { re: /\bx\s*\d+(?!\s*(mm|cm|g))/i,     penalty: 35 },
    { re: /\bpack\s*de\s*\d+/i,             penalty: 35 },
    { re: /\bmultipack\b/i,                 penalty: 40 },

    // Cartes gradées (pas notre cible : on track le scellé)
    { re: /\b(PSA|CGC|BGS)\s*\d/i,          penalty: 70 },
    { re: /\b(PSA|CGC|BGS)\b/i,             penalty: 50 },
    { re: /\b(graded|slab|noté|notee)\b/i,  penalty: 55 },

    // Langues non FR (on track la version française)
    { re: /\b(japanese|japonais|japonaise|jap)\b/i,     penalty: 55 },
    { re: /\b(english|anglais|anglaise|engl)\b/i,       penalty: 50 },
    { re: /\b(italien|italiano|italiana|ita)\b/i,       penalty: 50 },
    { re: /\b(espagnol|espagnola|espanol|esp)\b/i,      penalty: 50 },
    { re: /\b(allemand|deutsch|german|ger)\b/i,         penalty: 50 },

    // Contrefacons / produits manifestement non scelles
    { re: /\b(proxy|fake|reproduction|réplique|replica|custom)\b/i, penalty: 80 },
    { re: /\b(vide|empty)\b/i,                          penalty: 70 },

    // Accessoires mal catalogues
    { re: /\b(sleeve|playmat|classeur|binder|tapis)\b/i, penalty: 55 },
    { re: /\bdeck[\s-]?box\b/i,                          penalty: 50 },
    { re: /\bjumbo\b/i,                                  penalty: 40 },
];

function scoreItem(item, product) {
    let score = 60; // base
    const title = item.title || '';
    const queryRaw = (product?.query || '').toLowerCase();

    // Penalites par mot-cle suspect (sauf si legitime dans la query du produit)
    for (const { re, penalty, safeIfQueryMatch } of SUSPICIOUS_PATTERNS) {
        if (safeIfQueryMatch && safeIfQueryMatch.test(queryRaw)) continue;
        if (re.test(title)) score -= penalty;
    }

    // Bonus : mots significatifs du nom produit retrouvés dans le titre
    if (product?.name) {
        const keywords = product.name
            .toLowerCase()
            .replace(/[àâäéèêëîïôöùûüç]/g, c => ({ 'à':'a','â':'a','ä':'a','é':'e','è':'e','ê':'e','ë':'e','î':'i','ï':'i','ô':'o','ö':'o','ù':'u','û':'u','ü':'u','ç':'c' }[c] || c))
            .split(/\s+/)
            .filter(w => w.length >= 4);
        if (keywords.length > 0) {
            const titleNorm = title.toLowerCase().replace(/[àâäéèêëîïôöùûüç]/g, c => ({ 'à':'a','â':'a','ä':'a','é':'e','è':'e','ê':'e','ë':'e','î':'i','ï':'i','ô':'o','ö':'o','ù':'u','û':'u','ü':'u','ç':'c' }[c] || c));
            const matches = keywords.filter(w => titleNorm.includes(w)).length;
            score += Math.round((matches / keywords.length) * 25);
        }
    }

    // Bonus/penalite selon la fiabilite du vendeur
    const fb = Number(item.seller?.feedbackScore || 0);
    const pct = parseFloat(item.seller?.feedbackPercentage || 0);
    if (fb >= 500 && pct >= 99) score += 10;
    else if (fb >= 100 && pct >= 98) score += 5;
    else if (fb < 20 || pct < 95) score -= 15;

    return Math.max(0, Math.min(100, score));
}

// Mediane ponderee : chaque prix est pondéré par la qualité de son listing.
// Un item a score 90 pese ~2x plus lourd qu'un item a score 50. Resultat :
// les listings propres tirent le prix mediane, les listings marginaux pesent moins.
function weightedMedian(pairs) {
    // pairs = [{ price, weight }, ...] — trié par prix croissant
    const total = pairs.reduce((s, p) => s + p.weight, 0);
    if (total <= 0) return pairs[Math.floor(pairs.length / 2)].price;
    const half = total / 2;
    let cum = 0;
    for (let i = 0; i < pairs.length; i++) {
        cum += pairs[i].weight;
        if (cum >= half) {
            // Lissage entre deux prix si on tombe pile sur la frontière
            if (cum === half && i + 1 < pairs.length) {
                return (pairs[i].price + pairs[i + 1].price) / 2;
            }
            return pairs[i].price;
        }
    }
    return pairs[pairs.length - 1].price;
}

function extractPrices(ebayResponse, limits, query, product = null) {
    const items = ebayResponse.itemSummaries || [];

    if (items.length === 0) return null;

    // 1) Pre-filtre : prix valide + dans la fourchette absolue
    const priceValid = items.filter(item => {
        const val = parseFloat(item.price?.value);
        if (isNaN(val) || val <= 0) return false;
        if (limits && (val < limits.min || val > limits.max)) return false;
        return true;
    });

    if (priceValid.length === 0) return null;

    // 2) Score + filtre par seuil de confiance (tri par prix croissant)
    const scored = priceValid
        .map(item => ({ item, score: scoreItem(item, product) }))
        .filter(s => s.score >= 45)
        .sort((a, b) => parseFloat(a.item.price.value) - parseFloat(b.item.price.value));

    // Si le filtre est trop strict (0 resultat), on relache : priceValid
    // notes avec leur score reel, tries par prix. Mieux vaut un prix approx qu'aucun.
    const finalScored = scored.length > 0
        ? scored
        : priceValid
            .map(item => ({ item, score: scoreItem(item, product) }))
            .sort((a, b) => parseFloat(a.item.price.value) - parseFloat(b.item.price.value));
    const strictFiltered = scored.length > 0;

    const validItems = finalScored.map(s => s.item);
    const prices = validItems.map(item => parseFloat(item.price.value));

    // 3) Prix median pondere par le score : les meilleurs listings tirent le prix.
    // Weight = (score - 40)² pour amplifier l'ecart entre un bon (90) et un passable (50).
    // Un score 90 pese ~7x plus qu'un score 50, ~14x plus qu'un score 45.
    const weightedPairs = finalScored.map(s => ({
        price: parseFloat(s.item.price.value),
        weight: Math.max(1, Math.pow(s.score - 40, 2)),
    }));
    const medianPrice = weightedMedian(weightedPairs);

    // Mediane simple pour reference / telemetrie
    const sortedP = [...prices].sort((a, b) => a - b);
    const mid = Math.floor(sortedP.length / 2);
    const plainMedian = sortedP.length % 2 === 0
        ? (sortedP[mid - 1] + sortedP[mid]) / 2
        : sortedP[mid];

    // Article le moins cher (1er résultat trié par prix croissant) pour l'image
    const cheapest = validItems[0];
    const cheapestPrice = parseFloat(cheapest.price.value);

    const lastListing = {
        title: cheapest.title || '',
        price: cheapestPrice,
        currency: cheapest.price?.currency || 'EUR',
        url: toAffiliateUrl(cheapest.itemWebUrl || ''),
        image: cheapest.image?.imageUrl || cheapest.thumbnailImages?.[0]?.imageUrl || '',
    };

    // Moyenne des scores (indicateur de qualite globale du sample)
    const avgScore = Math.round(
        finalScored.reduce((s, x) => s + x.score, 0) / finalScored.length
    );

    // Lien de recherche affilié
    const searchUrl = toAffiliateUrl(`https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(query)}&_sop=15&LH_BIN=1`);

    return {
        price: Math.round(medianPrice * 100) / 100,
        plainMedian: Math.round(plainMedian * 100) / 100,
        lastPrice: Math.round(cheapestPrice * 100) / 100,
        low: Math.min(...prices),
        high: Math.max(...prices),
        sampleSize: validItems.length,
        rawSampleSize: priceValid.length,   // avant filtre score
        filtered: strictFiltered,           // true si le score a ecarté des resultats
        avgScore,                            // qualite moyenne du sample (0-100)
        lastUpdated: new Date().toISOString(),
        lastListing,
        searchUrl,
    };
}

// ── Catalogue de produits à suivre ───────────────────────────

// Génère les 6 produits pour une série
// minPrice / maxPrice : tolérance de prix pour filtrer les résultats eBay (modifiable par produit)
function serieProducts(id, nom, code, opts = {}) {
    const nl = opts.noLimits;
    return [
        { id: `${id}-etb`,       query: `ETB ${nom} ${code}`,               name: `ETB ${nom}`,            minPrice: nl ? 0 : 40,   maxPrice: nl ? 99999 : 800 },
        { id: `${id}-display`,    query: `display ${nom} ${code} -demi`,    name: `Display 36 ${nom}`,     minPrice: nl ? 0 : 150,  maxPrice: nl ? 99999 : 1500 },
        { id: `${id}-display18`,  query: `demi display ${nom} ${code}`,     name: `Display 18 ${nom}`,     minPrice: nl ? 0 : 80,   maxPrice: nl ? 99999 : 600 },
        { id: `${id}-tripack`,    query: `tripack ${nom} ${code}`,          name: `Tripack ${nom}`,        minPrice: nl ? 0 : 12,   maxPrice: nl ? 99999 : 80 },
        { id: `${id}-bundle`,     query: `bundle ${nom} ${code}`,           name: `Bundle 6 ${nom}`,       minPrice: nl ? 0 : 25,   maxPrice: nl ? 99999 : 200 },
        { id: `${id}-booster`,    query: `booster ${nom} ${code} -display -lot`, name: `Booster ${nom}`,    minPrice: nl ? 0 : 4,    maxPrice: nl ? 99999 : 40 },
    ];
}

const PRODUCTS_TO_TRACK = [
    ...serieProducts('ev01', 'Écarlate et Violet', 'EV01'),
    ...serieProducts('ev02', 'Évolutions à Paldea', 'EV02'),
    ...serieProducts('ev03', 'Flammes Obsidiennes', 'EV03'),
    { id: 'ev35-etb',        query: 'ETB Pokémon 151 EV3.5',                    name: 'ETB Pokémon 151',                    minPrice: 300, maxPrice: 10000 },
    { id: 'ev35-bundle',     query: 'bundle Pokémon 151 EV3.5',                name: 'Bundle 6 Pokémon 151',               minPrice: 30,  maxPrice: 10000 },
    { id: 'ev35-booster',    query: 'booster Pokémon 151 EV3.5',               name: 'Booster Pokémon 151',                minPrice: 15,  maxPrice: 10000 },
    { id: 'ev35-dispbundle', query: 'display bundle Pokémon 151 EV3.5',        name: 'Display Bundle Pokémon 151',         minPrice: 0,   maxPrice: 99999 },
    ...serieProducts('ev04', 'Faille Paradoxe', 'EV04'),
    ...serieProducts('ev45', 'Destinées de Paldea', 'EV4.5'),
    ...serieProducts('ev05', 'Forces Temporelles', 'EV05'),
    ...serieProducts('ev06', 'Mascarade Crépusculaire', 'EV06'),
    ...serieProducts('ev65', 'Fable Nébuleuse', 'EV6.5'),
    ...serieProducts('ev07', 'Couronne Stellaire', 'EV07'),
    ...serieProducts('ev08', 'Étincelles Déferlantes', 'EV08'),
    ...serieProducts('ev85', 'Évolutions Prismatiques', 'EV8.5'),
    { id: 'ev85-dispbundle', query: 'display bundle Évolutions Prismatiques EV8.5', name: 'Display Bundle Évolutions Prismatiques', minPrice: 0, maxPrice: 99999 },
    ...serieProducts('ev09', 'Aventures Ensemble', 'EV09'),
    ...serieProducts('ev10', 'Rivalités Destinées', 'EV10'),
    ...serieProducts('ev10.5fn', 'Foudre Noire (EV10.5)', 'EV10.5'),
    ...serieProducts('ev10.5fb', 'Flamme Blanche (EV10.5)', 'EV10.5'),
    ...serieProducts('me01', 'Méga-Évolution', 'ME01'),
    ...serieProducts('me02', 'Flammes Fantasmagoriques', 'ME02'),
    ...serieProducts('me2.5', 'Héros Transcendants', 'ME2.5'),
    { id: 'me2.5-dispbundle', query: 'display bundle Héros Transcendants ME2.5', name: 'Display Bundle Héros Transcendants', minPrice: 400, maxPrice: 99999 },
    ...serieProducts('me03', 'Équilibre Parfait', 'ME03'),
    // Épée et Bouclier (séries anciennes — prix plus élevés, limites adaptées)
    { id: 'swsh11-etb',       query: 'ETB Origine Perdue EB11',                    name: 'ETB Origine Perdue',            minPrice: 100, maxPrice: 800 },
    { id: 'swsh11-display',   query: 'display Origine Perdue EB11 -demi',          name: 'Display 36 Origine Perdue',     minPrice: 200, maxPrice: 1500 },
    { id: 'swsh11-display18', query: 'demi display Origine Perdue EB11',           name: 'Display 18 Origine Perdue',     minPrice: 80,  maxPrice: 600 },
    { id: 'swsh11-tripack',   query: 'tripack Origine Perdue EB11',                name: 'Tripack Origine Perdue',        minPrice: 20,  maxPrice: 120 },
    { id: 'swsh11-bundle',    query: 'bundle Origine Perdue EB11',                 name: 'Bundle 6 Origine Perdue',       minPrice: 40,  maxPrice: 200 },
    { id: 'swsh11-booster',   query: 'booster Origine Perdue EB11 -display -lot',  name: 'Booster Origine Perdue',        minPrice: 5,   maxPrice: 60 },
    { id: 'swsh12-etb',       query: 'ETB Tempête Argentée EB12',                  name: 'ETB Tempête Argentée',          minPrice: 100, maxPrice: 800 },
    { id: 'swsh12-display',   query: 'display Tempête Argentée EB12 -demi',        name: 'Display 36 Tempête Argentée',   minPrice: 200, maxPrice: 1500 },
    { id: 'swsh12-display18', query: 'demi display Tempête Argentée EB12',         name: 'Display 18 Tempête Argentée',   minPrice: 80,  maxPrice: 600 },
    { id: 'swsh12-tripack',   query: 'tripack Tempête Argentée EB12',              name: 'Tripack Tempête Argentée',      minPrice: 20,  maxPrice: 120 },
    { id: 'swsh12-bundle',    query: 'bundle Tempête Argentée EB12',               name: 'Bundle 6 Tempête Argentée',     minPrice: 40,  maxPrice: 200 },
    { id: 'swsh12-booster',   query: 'booster Tempête Argentée EB12 -display -lot', name: 'Booster Tempête Argentée',     minPrice: 5,   maxPrice: 60 },
    { id: 'swsh12.5-etb',       query: 'ETB Zénith Suprême EB12.5',                  name: 'ETB Zénith Suprême',          minPrice: 100, maxPrice: 800 },
    { id: 'swsh12.5-display',   query: 'display Zénith Suprême EB12.5 -demi',        name: 'Display 36 Zénith Suprême',   minPrice: 200, maxPrice: 1500 },
    { id: 'swsh12.5-display18', query: 'demi display Zénith Suprême EB12.5',         name: 'Display 18 Zénith Suprême',   minPrice: 80,  maxPrice: 600 },
    { id: 'swsh12.5-tripack',   query: 'tripack Zénith Suprême EB12.5',              name: 'Tripack Zénith Suprême',      minPrice: 20,  maxPrice: 120 },
    { id: 'swsh12.5-bundle',    query: 'bundle Zénith Suprême EB12.5',               name: 'Bundle 6 Zénith Suprême',     minPrice: 40,  maxPrice: 200 },
    { id: 'swsh12.5-booster',   query: 'booster Zénith Suprême EB12.5 -display -lot', name: 'Booster Zénith Suprême',     minPrice: 5,   maxPrice: 60 },
    // EB01–EB03 (2020 — les plus anciennes, prix élevés)
    { id: 'swsh01-etb',       query: 'ETB Épée et Bouclier EB01',                       name: 'ETB Épée et Bouclier',            minPrice: 80,  maxPrice: 500 },
    { id: 'swsh01-display',   query: 'display Épée et Bouclier EB01 -demi',             name: 'Display 36 Épée et Bouclier',     minPrice: 150, maxPrice: 1000 },
    { id: 'swsh01-display18', query: 'demi display Épée et Bouclier EB01',              name: 'Display 18 Épée et Bouclier',     minPrice: 60,  maxPrice: 400 },
    { id: 'swsh01-tripack',   query: 'tripack Épée et Bouclier EB01',                   name: 'Tripack Épée et Bouclier',        minPrice: 15,  maxPrice: 80 },
    { id: 'swsh01-bundle',    query: 'bundle Épée et Bouclier EB01',                    name: 'Bundle 6 Épée et Bouclier',       minPrice: 30,  maxPrice: 150 },
    { id: 'swsh01-booster',   query: 'booster Épée et Bouclier EB01 -display -lot',     name: 'Booster Épée et Bouclier',        minPrice: 5,   maxPrice: 40 },
    { id: 'swsh02-etb',       query: 'ETB Clash des Rebelles EB02',                     name: 'ETB Clash des Rebelles',          minPrice: 80,  maxPrice: 500 },
    { id: 'swsh02-display',   query: 'display Clash des Rebelles EB02 -demi',           name: 'Display 36 Clash des Rebelles',   minPrice: 150, maxPrice: 1000 },
    { id: 'swsh02-display18', query: 'demi display Clash des Rebelles EB02',            name: 'Display 18 Clash des Rebelles',   minPrice: 60,  maxPrice: 400 },
    { id: 'swsh02-tripack',   query: 'tripack Clash des Rebelles EB02',                 name: 'Tripack Clash des Rebelles',      minPrice: 15,  maxPrice: 80 },
    { id: 'swsh02-bundle',    query: 'bundle Clash des Rebelles EB02',                  name: 'Bundle 6 Clash des Rebelles',     minPrice: 30,  maxPrice: 150 },
    { id: 'swsh02-booster',   query: 'booster Clash des Rebelles EB02 -display -lot',   name: 'Booster Clash des Rebelles',      minPrice: 5,   maxPrice: 40 },
    { id: 'swsh03-etb',       query: 'ETB Ténèbres Embrasées EB03',                     name: 'ETB Ténèbres Embrasées',          minPrice: 80,  maxPrice: 500 },
    { id: 'swsh03-display',   query: 'display Ténèbres Embrasées EB03 -demi',           name: 'Display 36 Ténèbres Embrasées',   minPrice: 150, maxPrice: 1000 },
    { id: 'swsh03-display18', query: 'demi display Ténèbres Embrasées EB03',            name: 'Display 18 Ténèbres Embrasées',   minPrice: 60,  maxPrice: 400 },
    { id: 'swsh03-tripack',   query: 'tripack Ténèbres Embrasées EB03',                 name: 'Tripack Ténèbres Embrasées',      minPrice: 15,  maxPrice: 80 },
    { id: 'swsh03-bundle',    query: 'bundle Ténèbres Embrasées EB03',                  name: 'Bundle 6 Ténèbres Embrasées',     minPrice: 30,  maxPrice: 150 },
    { id: 'swsh03-booster',   query: 'booster Ténèbres Embrasées EB03 -display -lot',   name: 'Booster Ténèbres Embrasées',      minPrice: 5,   maxPrice: 40 },
    // EB03.5–EB06 (2020–2021)
    { id: 'swsh03.5-etb',       query: 'ETB La Voie du Maître EB03.5',                    name: 'ETB La Voie du Maître',           minPrice: 60,  maxPrice: 400 },
    { id: 'swsh03.5-display',   query: 'display La Voie du Maître EB03.5 -demi',          name: 'Display 36 La Voie du Maître',    minPrice: 120, maxPrice: 800 },
    { id: 'swsh03.5-display18', query: 'demi display La Voie du Maître EB03.5',           name: 'Display 18 La Voie du Maître',    minPrice: 50,  maxPrice: 350 },
    { id: 'swsh03.5-tripack',   query: 'tripack La Voie du Maître EB03.5',                name: 'Tripack La Voie du Maître',       minPrice: 12,  maxPrice: 60 },
    { id: 'swsh03.5-bundle',    query: 'bundle La Voie du Maître EB03.5',                 name: 'Bundle 6 La Voie du Maître',      minPrice: 25,  maxPrice: 120 },
    { id: 'swsh03.5-booster',   query: 'booster La Voie du Maître EB03.5 -display -lot',  name: 'Booster La Voie du Maître',       minPrice: 5,   maxPrice: 35 },
    { id: 'swsh04-etb',       query: 'ETB Voltage Éclatant EB04',                       name: 'ETB Voltage Éclatant',            minPrice: 60,  maxPrice: 400 },
    { id: 'swsh04-display',   query: 'display Voltage Éclatant EB04 -demi',             name: 'Display 36 Voltage Éclatant',     minPrice: 120, maxPrice: 800 },
    { id: 'swsh04-display18', query: 'demi display Voltage Éclatant EB04',              name: 'Display 18 Voltage Éclatant',     minPrice: 50,  maxPrice: 350 },
    { id: 'swsh04-tripack',   query: 'tripack Voltage Éclatant EB04',                   name: 'Tripack Voltage Éclatant',        minPrice: 12,  maxPrice: 60 },
    { id: 'swsh04-bundle',    query: 'bundle Voltage Éclatant EB04',                    name: 'Bundle 6 Voltage Éclatant',       minPrice: 25,  maxPrice: 120 },
    { id: 'swsh04-booster',   query: 'booster Voltage Éclatant EB04 -display -lot',     name: 'Booster Voltage Éclatant',        minPrice: 5,   maxPrice: 35 },
    { id: 'swsh04.5-etb',       query: 'ETB Destinées Radieuses EB04.5',                  name: 'ETB Destinées Radieuses',         minPrice: 60,  maxPrice: 400 },
    { id: 'swsh04.5-display',   query: 'display Destinées Radieuses EB04.5 -demi',        name: 'Display 36 Destinées Radieuses',  minPrice: 120, maxPrice: 800 },
    { id: 'swsh04.5-display18', query: 'demi display Destinées Radieuses EB04.5',         name: 'Display 18 Destinées Radieuses',  minPrice: 50,  maxPrice: 350 },
    { id: 'swsh04.5-tripack',   query: 'tripack Destinées Radieuses EB04.5',              name: 'Tripack Destinées Radieuses',     minPrice: 12,  maxPrice: 60 },
    { id: 'swsh04.5-bundle',    query: 'bundle Destinées Radieuses EB04.5',               name: 'Bundle 6 Destinées Radieuses',    minPrice: 25,  maxPrice: 120 },
    { id: 'swsh04.5-booster',   query: 'booster Destinées Radieuses EB04.5 -display -lot', name: 'Booster Destinées Radieuses',    minPrice: 5,   maxPrice: 35 },
    { id: 'swsh05-etb',       query: 'ETB Styles de Combat EB05',                       name: 'ETB Styles de Combat',            minPrice: 60,  maxPrice: 400 },
    { id: 'swsh05-display',   query: 'display Styles de Combat EB05 -demi',             name: 'Display 36 Styles de Combat',     minPrice: 120, maxPrice: 800 },
    { id: 'swsh05-display18', query: 'demi display Styles de Combat EB05',              name: 'Display 18 Styles de Combat',     minPrice: 50,  maxPrice: 350 },
    { id: 'swsh05-tripack',   query: 'tripack Styles de Combat EB05',                   name: 'Tripack Styles de Combat',        minPrice: 12,  maxPrice: 60 },
    { id: 'swsh05-bundle',    query: 'bundle Styles de Combat EB05',                    name: 'Bundle 6 Styles de Combat',       minPrice: 25,  maxPrice: 120 },
    { id: 'swsh05-booster',   query: 'booster Styles de Combat EB05 -display -lot',     name: 'Booster Styles de Combat',        minPrice: 5,   maxPrice: 35 },
    { id: 'swsh06-etb',       query: 'ETB Règne de Glace EB06',                         name: 'ETB Règne de Glace',              minPrice: 60,  maxPrice: 400 },
    { id: 'swsh06-display',   query: 'display Règne de Glace EB06 -demi',               name: 'Display 36 Règne de Glace',       minPrice: 120, maxPrice: 800 },
    { id: 'swsh06-display18', query: 'demi display Règne de Glace EB06',                name: 'Display 18 Règne de Glace',       minPrice: 50,  maxPrice: 350 },
    { id: 'swsh06-tripack',   query: 'tripack Règne de Glace EB06',                     name: 'Tripack Règne de Glace',          minPrice: 12,  maxPrice: 60 },
    { id: 'swsh06-bundle',    query: 'bundle Règne de Glace EB06',                      name: 'Bundle 6 Règne de Glace',         minPrice: 25,  maxPrice: 120 },
    { id: 'swsh06-booster',   query: 'booster Règne de Glace EB06 -display -lot',       name: 'Booster Règne de Glace',          minPrice: 5,   maxPrice: 35 },
    // EB07–EB10 + EB10.5 (2021–2022)
    { id: 'swsh07-etb',       query: 'ETB Évolution Céleste EB07',                      name: 'ETB Évolution Céleste',           minPrice: 50,  maxPrice: 350 },
    { id: 'swsh07-display',   query: 'display Évolution Céleste EB07 -demi',            name: 'Display 36 Évolution Céleste',    minPrice: 100, maxPrice: 700 },
    { id: 'swsh07-display18', query: 'demi display Évolution Céleste EB07',             name: 'Display 18 Évolution Céleste',    minPrice: 40,  maxPrice: 300 },
    { id: 'swsh07-tripack',   query: 'tripack Évolution Céleste EB07',                  name: 'Tripack Évolution Céleste',       minPrice: 10,  maxPrice: 50 },
    { id: 'swsh07-bundle',    query: 'bundle Évolution Céleste EB07',                   name: 'Bundle 6 Évolution Céleste',      minPrice: 20,  maxPrice: 100 },
    { id: 'swsh07-booster',   query: 'booster Évolution Céleste EB07 -display -lot',    name: 'Booster Évolution Céleste',       minPrice: 4,   maxPrice: 30 },
    { id: 'swsh08-etb',       query: 'ETB Poing de Fusion EB08',                        name: 'ETB Poing de Fusion',             minPrice: 50,  maxPrice: 350 },
    { id: 'swsh08-display',   query: 'display Poing de Fusion EB08 -demi',              name: 'Display 36 Poing de Fusion',      minPrice: 100, maxPrice: 700 },
    { id: 'swsh08-display18', query: 'demi display Poing de Fusion EB08',               name: 'Display 18 Poing de Fusion',      minPrice: 40,  maxPrice: 300 },
    { id: 'swsh08-tripack',   query: 'tripack Poing de Fusion EB08',                    name: 'Tripack Poing de Fusion',         minPrice: 10,  maxPrice: 50 },
    { id: 'swsh08-bundle',    query: 'bundle Poing de Fusion EB08',                     name: 'Bundle 6 Poing de Fusion',        minPrice: 20,  maxPrice: 100 },
    { id: 'swsh08-booster',   query: 'booster Poing de Fusion EB08 -display -lot',      name: 'Booster Poing de Fusion',         minPrice: 4,   maxPrice: 30 },
    { id: 'swsh09-etb',       query: 'ETB Stars Étincelantes EB09',                     name: 'ETB Stars Étincelantes',          minPrice: 50,  maxPrice: 350 },
    { id: 'swsh09-display',   query: 'display Stars Étincelantes EB09 -demi',           name: 'Display 36 Stars Étincelantes',   minPrice: 100, maxPrice: 700 },
    { id: 'swsh09-display18', query: 'demi display Stars Étincelantes EB09',            name: 'Display 18 Stars Étincelantes',   minPrice: 40,  maxPrice: 300 },
    { id: 'swsh09-tripack',   query: 'tripack Stars Étincelantes EB09',                 name: 'Tripack Stars Étincelantes',      minPrice: 10,  maxPrice: 50 },
    { id: 'swsh09-bundle',    query: 'bundle Stars Étincelantes EB09',                  name: 'Bundle 6 Stars Étincelantes',     minPrice: 20,  maxPrice: 100 },
    { id: 'swsh09-booster',   query: 'booster Stars Étincelantes EB09 -display -lot',   name: 'Booster Stars Étincelantes',      minPrice: 4,   maxPrice: 30 },
    { id: 'swsh10-etb',       query: 'ETB Astres Radieux EB10',                         name: 'ETB Astres Radieux',              minPrice: 50,  maxPrice: 350 },
    { id: 'swsh10-display',   query: 'display Astres Radieux EB10 -demi',               name: 'Display 36 Astres Radieux',       minPrice: 100, maxPrice: 700 },
    { id: 'swsh10-display18', query: 'demi display Astres Radieux EB10',                name: 'Display 18 Astres Radieux',       minPrice: 40,  maxPrice: 300 },
    { id: 'swsh10-tripack',   query: 'tripack Astres Radieux EB10',                     name: 'Tripack Astres Radieux',          minPrice: 10,  maxPrice: 50 },
    { id: 'swsh10-bundle',    query: 'bundle Astres Radieux EB10',                      name: 'Bundle 6 Astres Radieux',         minPrice: 20,  maxPrice: 100 },
    { id: 'swsh10-booster',   query: 'booster Astres Radieux EB10 -display -lot',       name: 'Booster Astres Radieux',          minPrice: 4,   maxPrice: 30 },
    { id: 'swsh10.5-etb',       query: 'ETB Pokémon GO EB10.5',                           name: 'ETB Pokémon GO',                  minPrice: 50,  maxPrice: 350 },
    { id: 'swsh10.5-display',   query: 'display Pokémon GO EB10.5 -demi',                 name: 'Display 36 Pokémon GO',           minPrice: 100, maxPrice: 700 },
    { id: 'swsh10.5-display18', query: 'demi display Pokémon GO EB10.5',                  name: 'Display 18 Pokémon GO',           minPrice: 40,  maxPrice: 300 },
    { id: 'swsh10.5-tripack',   query: 'tripack Pokémon GO EB10.5',                       name: 'Tripack Pokémon GO',              minPrice: 10,  maxPrice: 50 },
    { id: 'swsh10.5-bundle',    query: 'bundle Pokémon GO EB10.5',                        name: 'Bundle 6 Pokémon GO',             minPrice: 20,  maxPrice: 100 },
    { id: 'swsh10.5-booster',   query: 'booster Pokémon GO EB10.5 -display -lot',         name: 'Booster Pokémon GO',              minPrice: 4,   maxPrice: 30 },
    // Coffrets spéciaux (UPC)
    { id: 'upc-151',         query: 'UPC Pokemon 151 ultra premium',                    name: 'UPC Pokémon 151',                 minPrice: 300, maxPrice: 5000 },
    { id: 'upc-ev85',        query: 'UPC Evolutions Prismatiques ultra premium',        name: 'UPC Évolutions Prismatiques',     minPrice: 200, maxPrice: 3000 },
    { id: 'upc-dracaufeu',   query: 'coffret ultra premium dracaufeu pokemon',          name: 'UPC Dracaufeu',                   minPrice: 200, maxPrice: 3000 },
];

// ── Fetch specific eBay item by URL ─────────────────────────

function extractItemIdFromUrl(url) {
    // https://www.ebay.fr/itm/387882426822?...
    const match = url.match(/\/itm\/(\d+)/);
    return match ? match[1] : null;
}

async function fetchEbayItem(legacyId) {
    const token = await getAccessToken();
    const itemId = `v1|${legacyId}|0`;

    const res = await fetch(
        `${EBAY_API_URL}/buy/browse/v1/item/${encodeURIComponent(itemId)}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR',
                'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=FR',
            },
        }
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`eBay item fetch failed (${res.status}): ${text}`);
    }

    return res.json();
}

function extractItemPrice(item) {
    const price = parseFloat(item.price?.value);
    if (isNaN(price)) return null;

    return {
        price,
        low: price,
        high: price,
        sampleSize: 1,
        lastUpdated: new Date().toISOString(),
        lastListing: {
            title: item.title || '',
            price,
            currency: item.price?.currency || 'EUR',
            url: toAffiliateUrl(item.itemWebUrl || ''),
            image: item.image?.imageUrl || '',
        },
        linkedItem: true,
    };
}

// ── Custom queries (overrides) ──────────────────────────────
// Format: { "product-id": { query: "...", url: "...", fixedPrice: 580 } }
// fixedPrice : force un prix de marché fixe (ignore eBay)
// url : fetch cet item spécifique au lieu de chercher

// Custom queries via DB
async function loadCustomQueries() {
    return getCustomQueries();
}

async function saveCustomQueries(queries) {
    // Utilise setCustomQuery individuel si peu de changements, sinon remplacement global
    // Ici on fait simple : on laisse le helper DB gérer via setCustomQuery
    // Pour les endpoints qui appelaient saveCustomQueries(allQueries),
    // on itère. Simple et correct.
    const existing = await getCustomQueries();
    const allKeys = new Set([...Object.keys(existing), ...Object.keys(queries)]);
    for (const key of allKeys) {
        if (queries[key]) {
            await setCustomQuery(key, queries[key]);
        } else if (existing[key]) {
            await setCustomQuery(key, null);
        }
    }
}

// ── Routes ───────────────────────────────────────────────────

// Servir les fichiers statiques
app.use(express.static(__dirname, {
    index: 'index.html',
    extensions: ['html'],
}));

// API : prix d'un produit spécifique
app.get('/api/price/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = PRODUCTS_TO_TRACK.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Produit inconnu' });
    }

    try {
        // Vérifier le cache
        const cached = await readCache(productId);
        if (cached) {
            return res.json({ ...cached, source: 'cache' });
        }

        const customQueries = await loadCustomQueries();
        const custom = customQueries[productId];

        let priceData;

        // Si un prix fixe est défini, l'utiliser directement
        if (custom?.fixedPrice) {
            const fp = custom.fixedPrice;
            priceData = {
                price: fp, lastPrice: fp, low: fp, high: fp,
                sampleSize: 1, lastUpdated: new Date().toISOString(),
                lastListing: { title: 'Prix fixé manuellement', price: fp, currency: 'EUR', url: '', image: '' },
                fixedPrice: true,
            };
        }

        // Si un lien eBay spécifique est défini, fetch cet item
        if (!priceData && custom?.url) {
            const legacyId = extractItemIdFromUrl(custom.url);
            if (legacyId) {
                const item = await fetchEbayItem(legacyId);
                priceData = extractItemPrice(item);
            }
        }

        // Sinon, recherche classique avec filtre de prix du produit
        if (!priceData) {
            const query = custom?.query || product.query;
            const limits = { min: product.minPrice, max: product.maxPrice };
            const ebayData = await searchEbaySold(query, 20, limits);
            priceData = extractPrices(ebayData, limits, query, product);
        }

        if (!priceData) {
            return res.json({ error: 'Aucun résultat eBay', name: product.name });
        }

        const result = { id: productId, name: product.name, ...priceData };
        await writeCache(productId, result);
        appendHistory(productId, priceData).catch(() => {});

        res.json({ ...result, source: 'ebay' });
    } catch (err) {
        console.error(`Erreur pour ${productId}:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

// API : tous les prix EN CACHE uniquement (pas de fetch eBay).
// Renvoie en 1 requête tout ce qui est dans la table cache et pas expiré.
// Beaucoup plus rapide que 218 appels individuels au boot.
app.get('/api/prices-cached', async (_req, res) => {
    try {
        // On renvoie TOUT le cache sans filtre TTL. Le client decide lui-meme
        // quelles entrees sont fraiches grace a _cachedAt (il a son propre TTL).
        // Ca permet un render instantane meme si le dernier refresh date > 1h.
        const all = await dbGetAllCache(null);
        // On filtre pour ne renvoyer que les produits actuellement suivis
        const validIds = new Set(PRODUCTS_TO_TRACK.map(p => p.id));
        const out = {};
        for (const [id, data] of Object.entries(all)) {
            if (validIds.has(id)) out[id] = data;
        }
        res.json({
            count: Object.keys(out).length,
            ttl: CACHE_TTL,
            generatedAt: Date.now(),
            prices: out,
        });
    } catch (err) {
        console.error('Erreur /api/prices-cached:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API : tous les prix (avec cache)
app.get('/api/prices', async (req, res) => {
    const results = [];

    for (const product of PRODUCTS_TO_TRACK) {
        try {
            const cached = await readCache(product.id);
            if (cached) {
                results.push({ ...cached, source: 'cache' });
                continue;
            }

            // Throttle entre chaque appel eBay
            await new Promise(r => setTimeout(r, 300));

            const limits = { min: product.minPrice, max: product.maxPrice };
            const ebayData = await searchEbaySold(product.query, 20, limits);
            const priceData = extractPrices(ebayData, limits, product.query, product);

            if (priceData) {
                const result = { id: product.id, name: product.name, ...priceData };
                await writeCache(product.id, result);
                appendHistory(product.id, priceData).catch(() => {});
                results.push({ ...result, source: 'ebay' });
            } else {
                results.push({ id: product.id, name: product.name, price: null, error: 'Aucun résultat' });
            }
        } catch (err) {
            console.error(`Erreur pour ${product.id}:`, err.message);
            results.push({ id: product.id, name: product.name, price: null, error: err.message });
        }
    }

    res.json({
        count: results.length,
        lastUpdated: new Date().toISOString(),
        products: results,
    });
});

// Helper : force le refresh d'un produit (ignore le cache, utilise les custom queries)
async function refreshProductPrice(product) {
    const customQueries = await loadCustomQueries();
    const custom = customQueries[product.id];

    let priceData;

    if (custom?.fixedPrice) {
        const fp = custom.fixedPrice;
        priceData = {
            price: fp, lastPrice: fp, low: fp, high: fp,
            sampleSize: 1, lastUpdated: new Date().toISOString(),
            lastListing: { title: 'Prix fixé manuellement', price: fp, currency: 'EUR', url: '', image: '' },
            fixedPrice: true,
        };
    }

    if (!priceData && custom?.url) {
        const legacyId = extractItemIdFromUrl(custom.url);
        if (legacyId) {
            const item = await fetchEbayItem(legacyId);
            priceData = extractItemPrice(item);
        }
    }

    if (!priceData) {
        const query = custom?.query || product.query;
        const limits = { min: product.minPrice, max: product.maxPrice };
        const ebayData = await searchEbaySold(query, 20, limits);
        priceData = extractPrices(ebayData, limits, query, product);
    }

    if (!priceData) return null;

    const result = { id: product.id, name: product.name, ...priceData };
    await writeCache(product.id, result);
    appendHistory(product.id, priceData).catch(() => {});
    return result;
}

// API : forcer le rafraîchissement d'un produit
app.post('/api/refresh/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = PRODUCTS_TO_TRACK.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Produit inconnu' });
    }

    try {
        const result = await refreshProductPrice(product);
        if (!result) {
            return res.json({ error: 'Aucun résultat eBay', name: product.name });
        }
        res.json({ ...result, source: 'ebay-fresh' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API : liste des produits suivis
app.get('/api/catalog', (_req, res) => {
    res.json(PRODUCTS_TO_TRACK.map(p => ({ id: p.id, name: p.name, query: p.query })));
});

// API : historique de prix d'un produit
app.get('/api/history/:productId', async (req, res) => {
    const history = await readHistory(req.params.productId);
    res.json(history);
});

// API : variations 7 jours pour tous les produits
app.get('/api/trends-7d', async (_req, res) => {
    const result = {};
    for (const p of PRODUCTS_TO_TRACK) {
        const history = await readHistory(p.id);
        if (history.length < 2) continue;
        const now = history[history.length - 1];
        // Trouver l'entrée d'il y a 7 jours (ou la plus ancienne dispo)
        const target = new Date();
        target.setDate(target.getDate() - 7);
        const targetStr = target.toISOString().slice(0, 10);
        let old = history[0];
        for (const h of history) {
            if (h.date <= targetStr) old = h;
        }
        if (old.date === now.date) continue;
        const priceBefore = old.median || old.lastPrice || 0;
        const priceNow = now.median || now.lastPrice || 0;
        if (priceBefore > 0 && priceNow > 0) {
            result[p.name] = {
                priceBefore,
                priceNow,
                change: Math.round(((priceNow - priceBefore) / priceBefore) * 100 * 10) / 10
            };
        }
    }
    res.json(result);
});

// API : mouvements de prix sur N jours (1, 7, 30, etc.)
// Retourne pour CHAQUE produit avec historique : prix avant, prix maintenant,
// variation en € et %, dates de comparaison. Trie cote front.
app.get('/api/movers', async (req, res) => {
    const days = Math.max(1, Math.min(365, parseInt(req.query.days) || 1));
    const target = new Date();
    target.setDate(target.getDate() - days);
    const targetStr = target.toISOString().slice(0, 10);

    const items = [];
    for (const p of PRODUCTS_TO_TRACK) {
        const history = await readHistory(p.id);
        if (history.length < 2) continue;
        const now = history[history.length - 1];
        // Cherche l'entree la plus proche de la date cible (pas plus recente que la cible)
        let old = null;
        for (const h of history) {
            if (h.date <= targetStr) old = h;
        }
        // Fallback : si pas d'entree assez ancienne, prend la plus ancienne dispo
        if (!old && history.length > 1) old = history[0];
        if (!old || old.date === now.date) continue;

        const priceBefore = old.median || old.lastPrice || 0;
        const priceNow = now.median || now.lastPrice || 0;
        if (priceBefore <= 0 || priceNow <= 0) continue;

        const deltaEur = priceNow - priceBefore;
        const deltaPct = (deltaEur / priceBefore) * 100;
        items.push({
            id: p.id,
            name: p.name,
            type: p.id.split('-').pop(),  // suffix du produit (etb, display, etc.)
            priceBefore: Math.round(priceBefore * 100) / 100,
            priceNow: Math.round(priceNow * 100) / 100,
            deltaEur: Math.round(deltaEur * 100) / 100,
            deltaPct: Math.round(deltaPct * 100) / 100,
            dateBefore: old.date,
            dateNow: now.date,
        });
    }
    res.json({
        days,
        targetDate: targetStr,
        count: items.length,
        items,
    });
});

// ── Barcodes (EAN -> produit) ───────────────────────────────
//
// Lookup : public (read-only). Tout user (meme non-connecte) peut
// chercher un EAN pour identifier un produit.
// Mapping : authentifie. Pour eviter le spam, seuls les users connectes
// peuvent ajouter ou modifier un mapping. Le mapping est partage entre
// tous les users (un user qui scanne enrichit la base pour tout le monde).

app.get('/api/barcodes/:ean', async (req, res) => {
    const ean = String(req.params.ean || '').trim();
    if (!ean || !/^\d{8,14}$/.test(ean)) {
        return res.status(400).json({ error: 'EAN invalide' });
    }
    try {
        const entry = await getBarcode(ean);
        if (!entry) return res.status(404).json({ error: 'EAN inconnu', ean });
        // Verifie que le produit existe encore dans le catalogue
        const exists = PRODUCTS_TO_TRACK.some(p => p.name === entry.productName);
        res.json({ ...entry, productExists: exists });
    } catch (e) {
        console.error('[barcodes/get] error:', e);
        res.status(500).json({ error: 'Erreur lecture EAN' });
    }
});

app.post('/api/barcodes', authMiddleware, async (req, res) => {
    const { ean, productName } = req.body || {};
    const cleanEan = String(ean || '').trim();
    if (!cleanEan || !/^\d{8,14}$/.test(cleanEan)) {
        return res.status(400).json({ error: 'EAN invalide (8 a 14 chiffres requis)' });
    }
    if (!productName || typeof productName !== 'string') {
        return res.status(400).json({ error: 'Nom de produit requis' });
    }
    // Verifie que le produit existe dans le catalogue (anti-spam : pas de
    // mapping vers un produit qui n'existe pas).
    const exists = PRODUCTS_TO_TRACK.some(p => p.name === productName);
    if (!exists) {
        return res.status(400).json({ error: 'Produit introuvable dans le catalogue' });
    }
    try {
        const me = await getUserById(req.userId);
        await setBarcode(cleanEan, productName, me?.username || null);
        res.json({ ok: true, ean: cleanEan, productName });
    } catch (e) {
        console.error('[barcodes/set] error:', e);
        res.status(500).json({ error: 'Erreur enregistrement' });
    }
});

app.get('/api/barcodes', authMiddleware, async (_req, res) => {
    try {
        const list = await listBarcodes();
        res.json({ count: list.length, barcodes: list });
    } catch (e) {
        console.error('[barcodes/list] error:', e);
        res.status(500).json({ error: 'Erreur lecture' });
    }
});

app.delete('/api/barcodes/:ean', authMiddleware, requireAdmin, async (req, res) => {
    const ean = String(req.params.ean || '').trim();
    try {
        const ok = await deleteBarcode(ean);
        if (!ok) return res.status(404).json({ error: 'EAN introuvable' });
        res.json({ ok: true });
    } catch (e) {
        console.error('[barcodes/delete] error:', e);
        res.status(500).json({ error: 'Erreur suppression' });
    }
});

// Import bulk : POST avec un body { mappings: [{ean, productName}, ...] }
// Reservé admin. Valide chaque mapping individuellement, retourne un rapport.
app.post('/api/barcodes/bulk', authMiddleware, requireAdmin, async (req, res) => {
    const { mappings } = req.body || {};
    if (!Array.isArray(mappings)) {
        return res.status(400).json({ error: 'mappings doit etre un tableau' });
    }
    const result = { added: 0, updated: 0, errors: [], total: mappings.length };
    const me = await getUserById(req.userId);
    const adminLabel = me?.username || 'admin';

    for (const m of mappings) {
        const ean = String(m.ean || '').trim();
        const productName = String(m.productName || '').trim();
        if (!ean || !/^\d{8,14}$/.test(ean)) {
            result.errors.push({ ean, error: 'EAN invalide' });
            continue;
        }
        if (!productName) {
            result.errors.push({ ean, error: 'productName vide' });
            continue;
        }
        const exists = PRODUCTS_TO_TRACK.some(p => p.name === productName);
        if (!exists) {
            result.errors.push({ ean, error: `Produit '${productName}' introuvable` });
            continue;
        }
        try {
            const existing = await getBarcode(ean);
            await setBarcode(ean, productName, adminLabel);
            if (existing) result.updated++; else result.added++;
        } catch (e) {
            result.errors.push({ ean, error: e.message || 'erreur inconnue' });
        }
    }

    res.json(result);
});

// API : indice "marche scelle"
//
// Methodologie : equal-weighted geometric. Pour chaque jour D :
//   - on prend les produits qui ont un prix sur D ET sur la baseline
//   - index(D) = 100 * geomean( price[D] / price[baseline] )
// Geomean evite qu'un produit qui x10 ecrase la moyenne ; equal-weighted
// donne autant de poids a un booster qu'a un display (philosophie : tracker
// "le marche du scelle" et non "la valeur d'un panier moyen").
//
// Baseline = le 1er jour ou on a au moins MIN_PRODUCTS produits avec un prix.
// Cache 1h pour limiter le cout DB sur Turso (snapshot quotidien => peu de churn).
const MARKET_INDEX_MIN_PRODUCTS = 20;
const MARKET_INDEX_CACHE_TTL_MS = 60 * 60 * 1000; // 1h
let _marketIndexCache = null;
let _marketIndexCacheAt = 0;

function computeMarketIndex(rows) {
    // rows: [{ productId, date, median }]
    // 1) Indexe par date -> { productId: price }
    const byDate = new Map();
    for (const r of rows) {
        if (!byDate.has(r.date)) byDate.set(r.date, {});
        byDate.get(r.date)[r.productId] = r.median;
    }
    const sortedDates = [...byDate.keys()].sort();
    if (sortedDates.length === 0) return { baseline: null, points: [] };

    // 2) Baseline = 1er jour avec >= MIN_PRODUCTS
    let baselineDate = null;
    let baselinePrices = null;
    for (const d of sortedDates) {
        const prices = byDate.get(d);
        if (Object.keys(prices).length >= MARKET_INDEX_MIN_PRODUCTS) {
            baselineDate = d;
            baselinePrices = prices;
            break;
        }
    }
    if (!baselineDate) {
        // Pas assez de donnees historiques -> on prend le 1er jour dispo malgre tout
        baselineDate = sortedDates[0];
        baselinePrices = byDate.get(baselineDate);
    }

    // 3) Pour chaque date >= baseline, calcule l'index
    const points = [];
    for (const d of sortedDates) {
        if (d < baselineDate) continue;
        const prices = byDate.get(d);
        // Geomean sur les produits presents dans baseline ET aujourd'hui
        let logSum = 0;
        let n = 0;
        for (const [pid, price] of Object.entries(prices)) {
            const base = baselinePrices[pid];
            if (!base || base <= 0 || price <= 0) continue;
            logSum += Math.log(price / base);
            n++;
        }
        if (n === 0) continue;
        const value = 100 * Math.exp(logSum / n);
        points.push({ date: d, value: Math.round(value * 100) / 100, sampleSize: n });
    }
    return {
        baseline: baselineDate,
        baselineProducts: Object.keys(baselinePrices).length,
        points,
    };
}

app.get('/api/market-index', async (_req, res) => {
    try {
        const now = Date.now();
        if (_marketIndexCache && (now - _marketIndexCacheAt) < MARKET_INDEX_CACHE_TTL_MS) {
            return res.json({ ..._marketIndexCache, cached: true });
        }
        const rows = await getAllPriceHistory();
        const result = computeMarketIndex(rows);
        // Stats annexes : variations sur differentes fenetres
        const pts = result.points;
        const last = pts[pts.length - 1] || null;
        const findBefore = (days) => {
            const target = new Date();
            target.setDate(target.getDate() - days);
            const targetStr = target.toISOString().slice(0, 10);
            let best = null;
            for (const p of pts) {
                if (p.date <= targetStr) best = p;
            }
            return best;
        };
        const variations = last ? {
            d1: ((last.value - (findBefore(1)?.value ?? last.value)) / (findBefore(1)?.value ?? last.value)) * 100,
            d7: ((last.value - (findBefore(7)?.value ?? last.value)) / (findBefore(7)?.value ?? last.value)) * 100,
            d30: ((last.value - (findBefore(30)?.value ?? last.value)) / (findBefore(30)?.value ?? last.value)) * 100,
            allTime: last.value - 100,
        } : null;
        const payload = {
            baseline: result.baseline,
            baselineProducts: result.baselineProducts,
            currentValue: last?.value ?? null,
            currentDate: last?.date ?? null,
            variations,
            points: pts,
        };
        _marketIndexCache = payload;
        _marketIndexCacheAt = now;
        res.json({ ...payload, cached: false });
    } catch (e) {
        console.error('[market-index] error:', e);
        res.status(500).json({ error: 'Erreur calcul indice marche' });
    }
});

// API : statut
app.get('/api/status', async (_req, res) => {
    const hasCredentials = !!(EBAY_CLIENT_ID && EBAY_CLIENT_ID !== 'your_app_id_here');
    // Diagnostic Turso (sans leak du token) : on regarde quels noms d'env vars sont presents
    const tursoUrl = process.env.TURSO_DATABASE_URL || '';
    const tursoToken = process.env.TURSO_AUTH_TOKEN || '';
    const envKeys = Object.keys(process.env).filter(k => /TURSO|DATABASE|LIBSQL/i.test(k));
    res.json({
        mode: IS_SANDBOX ? 'sandbox' : 'production',
        hasCredentials,
        storage: DB_MODE,
        trackedProducts: PRODUCTS_TO_TRACK.length,
        turso: {
            urlSet: !!tursoUrl,
            urlPrefix: tursoUrl ? tursoUrl.slice(0, 20) + '…' : null,
            tokenSet: !!tursoToken,
            tokenLen: tursoToken.length || 0,
            envKeysFound: envKeys,
        },
    });
});

// ── Query Management Routes ─────────────────────────────────

// Récupérer la config eBay d'un produit
app.get('/api/query/:productId', async (req, res) => {
    const product = PRODUCTS_TO_TRACK.find(p => p.id === req.params.productId);
    if (!product) return res.status(404).json({ error: 'Produit inconnu' });

    const customQueries = await loadCustomQueries();
    const custom = customQueries[product.id] || {};
    res.json({
        id: product.id,
        name: product.name,
        defaultQuery: product.query,
        customQuery: custom.query || null,
        customUrl: custom.url || null,
        mode: custom.url ? 'url' : 'search',
    });
});

// Modifier la config eBay d'un produit
app.put('/api/query/:productId', async (req, res) => {
    const product = PRODUCTS_TO_TRACK.find(p => p.id === req.params.productId);
    if (!product) return res.status(404).json({ error: 'Produit inconnu' });

    const { query, url } = req.body;
    const customQueries = await loadCustomQueries();

    if (url && url.trim()) {
        const trimmedUrl = url.trim();
        const legacyId = extractItemIdFromUrl(trimmedUrl);
        if (legacyId) {
            // Mode lien direct vers un article spécifique
            customQueries[product.id] = { url: trimmedUrl };
        } else if (trimmedUrl.includes('ebay.') && (trimmedUrl.includes('/sch/') || trimmedUrl.includes('_nkw='))) {
            // Lien de recherche eBay — extraire les mots-clés
            try {
                const parsed = new URL(trimmedUrl);
                const nkw = parsed.searchParams.get('_nkw');
                if (nkw) {
                    customQueries[product.id] = { query: nkw };
                } else {
                    customQueries[product.id] = { url: trimmedUrl };
                }
            } catch {
                return res.status(400).json({ error: 'URL invalide' });
            }
        } else {
            return res.status(400).json({ error: 'Lien eBay invalide. Formats acceptés : https://www.ebay.fr/itm/123456789 ou lien de recherche eBay' });
        }
    } else if (query && query.trim()) {
        // Mode recherche personnalisée
        customQueries[product.id] = { query: query.trim() };
    } else {
        // Revenir au défaut
        delete customQueries[product.id];
    }

    await saveCustomQueries(customQueries);

    // Supprimer le cache pour forcer un refresh
    try { await dbDeleteCache(product.id); } catch {}

    res.json({ ok: true });
});

// ── Auth Routes ─────────────────────────────────────────────

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }
    if (username.length < 3) {
        return res.status(400).json({ error: 'Nom d\'utilisateur trop court (min 3 caractères)' });
    }
    if (password.length < 4) {
        return res.status(400).json({ error: 'Mot de passe trop court (min 4 caractères)' });
    }

    const uid = username.toLowerCase().trim();
    const existing = await getUserById(uid);
    if (existing) {
        return res.status(409).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }

    const { salt, hash } = hashPassword(password);
    await createUser(uid, username.trim(), salt, hash);

    // Pas besoin de remplir un portfolio vide : l'absence de ligne = qty 0, cost 0
    const token = createToken(uid);
    res.json({ token, username: username.trim() });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const uid = username.toLowerCase().trim();
    const user = await getUserById(uid);

    // Messages differencies : un utilisateur qui ne s'y retrouve pas doit savoir
    // si son compte existe ou si c'est juste le mot de passe qui est faux.
    if (!user) {
        return res.status(404).json({ error: `Aucun compte avec le nom "${username.trim()}"`, code: 'USER_NOT_FOUND' });
    }
    if (!verifyPassword(password, user.salt, user.hash)) {
        return res.status(401).json({ error: 'Mot de passe incorrect', code: 'WRONG_PASSWORD' });
    }

    const token = createToken(uid);
    res.json({ token, username: user.username });
});

app.get('/api/me', authMiddleware, async (req, res) => {
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json({ username: user.username });
});

// ── Admin endpoints ─────────────────────────────────────────
//
// Accessibles uniquement a l'admin (par defaut 'dorian', surchargeable via
// env var ADMIN_USERNAME). Ne renvoient JAMAIS de donnees sensibles
// (salt, hash). Toute action destructive (delete user) est protegee contre
// l'auto-suppression et journalisee.

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'dorian').toLowerCase();

// Middleware : valide que l'utilisateur authentifie est l'admin
async function requireAdmin(req, res, next) {
    const me = await getUserById(req.userId);
    if (!me || me.username.toLowerCase() !== ADMIN_USERNAME) {
        return res.status(403).json({ error: 'Reserve admin' });
    }
    req.adminUser = me;
    next();
}

// Liste les comptes (sans salt/hash). Inclut un flag "isAdmin" et le nb de
// positions dans le portfolio de chaque user pour avoir un apercu rapide.
app.get('/api/admin/users', authMiddleware, requireAdmin, async (req, res) => {
    const result = await db.execute('SELECT id, username, created_at FROM users ORDER BY created_at DESC');
    const users = [];
    for (const r of result.rows) {
        // Compte les positions non vides du portfolio (utile pour decider qui supprimer)
        const pf = await getPortfolio(r.id);
        const positionCount = Object.values(pf).filter(v => v && v.qty > 0).length;
        users.push({
            id: r.id,
            username: r.username,
            createdAt: r.created_at,
            isAdmin: r.username.toLowerCase() === ADMIN_USERNAME,
            positionCount,
        });
    }
    res.json({
        adminUsername: ADMIN_USERNAME,
        count: users.length,
        users,
    });
});

// Stats globales de l'app (nombre users, portfolios actifs, top produits)
app.get('/api/admin/stats', authMiddleware, requireAdmin, async (_req, res) => {
    try {
        const usersR = await db.execute('SELECT COUNT(*) AS n FROM users');
        const totalUsers = Number(usersR.rows[0].n);

        // Portfolios non vides : distinct user_id avec au moins 1 ligne qty > 0
        const activeR = await db.execute('SELECT COUNT(DISTINCT user_id) AS n FROM portfolios WHERE qty > 0');
        const activeUsers = Number(activeR.rows[0].n);

        // Top 5 produits les plus possedes (somme qty toutes positions confondues)
        const topR = await db.execute(`
            SELECT product_name, SUM(qty) AS total_qty, COUNT(DISTINCT user_id) AS holders
            FROM portfolios
            WHERE qty > 0
            GROUP BY product_name
            ORDER BY total_qty DESC
            LIMIT 5
        `);
        const topProducts = topR.rows.map(r => ({
            name: r.product_name,
            totalQty: Number(r.total_qty),
            holders: Number(r.holders),
        }));

        // Comptes par jour des 7 derniers jours
        const since = new Date();
        since.setDate(since.getDate() - 7);
        const recentR = await db.execute({
            sql: 'SELECT COUNT(*) AS n FROM users WHERE created_at >= ?',
            args: [since.toISOString()],
        });
        const newUsersLast7d = Number(recentR.rows[0].n);

        // Volume DB approximatif
        const phR = await db.execute('SELECT COUNT(*) AS n FROM price_history');
        const pfHistR = await db.execute('SELECT COUNT(*) AS n FROM portfolio_history');

        res.json({
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            newUsersLast7d,
            trackedProducts: PRODUCTS_TO_TRACK.length,
            priceHistoryRows: Number(phR.rows[0].n),
            portfolioHistoryRows: Number(pfHistR.rows[0].n),
            topProducts,
        });
    } catch (e) {
        console.error('[admin/stats] error:', e);
        res.status(500).json({ error: 'Erreur stats' });
    }
});

// Supprime un compte (et son portfolio + son historique). Bloque l'auto-suppression.
app.delete('/api/admin/users/:id', authMiddleware, requireAdmin, async (req, res) => {
    const { id } = req.params;
    if (id === req.adminUser.id) {
        return res.status(400).json({ error: 'Impossible de supprimer son propre compte admin' });
    }
    const target = await getUserById(id);
    if (!target) return res.status(404).json({ error: 'Utilisateur introuvable' });
    try {
        // Cascade manuelle (pas de FK declaree dans le schema)
        await db.execute({ sql: 'DELETE FROM portfolios WHERE user_id = ?', args: [id] });
        await db.execute({ sql: 'DELETE FROM portfolio_history WHERE user_id = ?', args: [id] });
        await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });
        console.log(`[admin] ${req.adminUser.username} a supprime le compte ${target.username} (${id})`);
        res.json({ ok: true, deleted: { id, username: target.username } });
    } catch (e) {
        console.error('[admin/delete-user] error:', e);
        res.status(500).json({ error: 'Erreur suppression' });
    }
});

// Genere un nouveau mot de passe temporaire pour un user. Le retourne UNE
// SEULE FOIS (pas stocke en clair). L'admin doit le transmettre au user via
// un canal securise (telephone, sms...) qui le change ensuite via l'UI.
app.post('/api/admin/users/:id/reset-password', authMiddleware, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const target = await getUserById(id);
    if (!target) return res.status(404).json({ error: 'Utilisateur introuvable' });
    try {
        // Mot de passe temporaire : 12 chars alphanumeriques lisibles (sans 0/O/1/l ambigus)
        const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
        let tempPassword = '';
        const bytes = crypto.randomBytes(12);
        for (let i = 0; i < 12; i++) tempPassword += ALPH[bytes[i] % ALPH.length];

        const { salt, hash } = hashPassword(tempPassword);
        await updateUserPassword(id, salt, hash);
        console.log(`[admin] ${req.adminUser.username} a reset le mdp de ${target.username} (${id})`);
        res.json({ ok: true, username: target.username, tempPassword });
    } catch (e) {
        console.error('[admin/reset-password] error:', e);
        res.status(500).json({ error: 'Erreur reset' });
    }
});

// Changer de mot de passe (demande l'ancien pour confirmer)
app.post('/api/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis' });
    }
    if (newPassword.length < 4) {
        return res.status(400).json({ error: 'Nouveau mot de passe trop court (min 4 caractères)' });
    }
    if (newPassword === currentPassword) {
        return res.status(400).json({ error: 'Le nouveau mot de passe doit être différent' });
    }
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    if (!verifyPassword(currentPassword, user.salt, user.hash)) {
        return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
    }
    const { salt, hash } = hashPassword(newPassword);
    await updateUserPassword(req.userId, salt, hash);
    res.json({ ok: true });
});

// ── Portfolio Routes (auth required) ────────────────────────

app.get('/api/portfolio', authMiddleware, async (req, res) => {
    const portfolio = await readPortfolio(req.userId);
    res.json(portfolio || {});
});

app.put('/api/portfolio', authMiddleware, async (req, res) => {
    await writePortfolio(req.userId, req.body);
    res.json({ ok: true });
});

// Alias POST pour navigator.sendBeacon (qui ne supporte que POST)
app.post('/api/portfolio', authMiddleware, async (req, res) => {
    await writePortfolio(req.userId, req.body);
    res.json({ ok: true });
});

// ── Portfolio History (par utilisateur, via DB) ─────────────

async function computeSnapshot(userId) {
    const pf = await getPortfolio(userId);
    let totalInvested = 0, totalValue = 0;
    let heldProducts = 0, pricedProducts = 0;
    for (const product of PRODUCTS_TO_TRACK) {
        const h = pf[product.name];
        if (!h || h.qty <= 0) continue;
        heldProducts++;
        totalInvested += h.qty * h.cost;

        // Cherche un prix : d'abord le cache, sinon le dernier historique connu
        // (evite d'ecrire value=0 quand le cache vient d'etre vide par un redeploy)
        const cached = await readCache(product.id);
        let price = cached?.price || 0;
        if (price <= 0) {
            try {
                const hist = await getPriceHistory(product.id);
                if (hist && hist.length > 0) {
                    // hist est tri ASC, on prend le dernier
                    price = Number(hist[hist.length - 1].median) || 0;
                }
            } catch {}
        }
        if (price > 0) {
            pricedProducts++;
            totalValue += h.qty * price;
        }
    }

    // Si moins de 50% des produits detenus ont un prix, le snapshot n'est pas fiable.
    // On retourne null pour que le caller skip l'ecriture.
    const coverage = heldProducts === 0 ? 1 : pricedProducts / heldProducts;
    if (heldProducts > 0 && coverage < 0.5) {
        console.warn(`[Portfolio] Snapshot ${userId} skip : couverture prix ${pricedProducts}/${heldProducts} trop faible`);
        return null;
    }

    const today = new Date().toISOString().slice(0, 10);
    return {
        date: today,
        invested: Math.round(totalInvested * 100) / 100,
        value: Math.round(totalValue * 100) / 100,
        pnl: Math.round((totalValue - totalInvested) * 100) / 100,
        coverage: Math.round(coverage * 100),   // % de positions dont on connait le prix
    };
}

async function snapshotPortfolio() {
    console.log('[Portfolio] Snapshot en cours...');
    try {
        const userIds = await listPortfolioUserIds();
        for (const userId of userIds) {
            try {
                const entry = await computeSnapshot(userId);
                if (!entry) {
                    console.log(`[Portfolio] Snapshot ${userId} skipped (prix indisponibles)`);
                    continue;
                }
                await upsertPortfolioHistory(userId, entry);
                console.log(`[Portfolio] Snapshot ${userId}: investi=${entry.invested}€, valeur=${entry.value}€, P&L=${entry.pnl}€ (${entry.coverage}% couvert)`);
            } catch (err) {
                console.error(`[Portfolio] Erreur snapshot ${userId}:`, err.message);
            }
        }
        console.log('[Portfolio] Snapshot terminé');
    } catch (err) {
        console.error('[Portfolio] Erreur snapshot globale:', err.message);
    }
}

// API : historique du portfolio (par utilisateur)
app.get('/api/portfolio-history', authMiddleware, async (req, res) => {
    const history = await getPortfolioHistory(req.userId);
    res.json(history);
});

// API : forcer un snapshot pour l'utilisateur connecté
app.post('/api/portfolio-snapshot', authMiddleware, async (req, res) => {
    const entry = await computeSnapshot(req.userId);
    if (!entry) {
        return res.status(409).json({
            ok: false,
            error: 'Prix insuffisants pour un snapshot fiable',
            code: 'INSUFFICIENT_COVERAGE',
        });
    }
    await upsertPortfolioHistory(req.userId, entry);
    const history = await getPortfolioHistory(req.userId);
    res.json({ ok: true, entries: history.length, coverage: entry.coverage });
});

// ── Transactions (achats/ventes) ────────────────────────────
//
// Modele : chaque transaction est un evenement (date, type, qty, prix, frais).
// Le portfolio (qty actuelles) reste gere a la main par l'utilisateur ; les
// transactions servent au calcul de P&L realise et au PRU pondere.

app.get('/api/transactions', authMiddleware, async (req, res) => {
    try {
        const txs = await listTransactions(req.userId);
        res.json(txs);
    } catch (e) {
        console.error('[transactions/list] error:', e);
        res.status(500).json({ error: 'Erreur lecture transactions' });
    }
});

app.post('/api/transactions', authMiddleware, async (req, res) => {
    const { productName, type, qty, unitPrice, fees, date, notes } = req.body || {};

    // Validations metier
    if (!productName || typeof productName !== 'string') {
        return res.status(400).json({ error: 'Nom de produit requis' });
    }
    if (!['buy', 'sell'].includes(type)) {
        return res.status(400).json({ error: 'Type doit etre "buy" ou "sell"' });
    }
    const qtyN = parseInt(qty);
    const priceN = parseFloat(unitPrice);
    const feesN = parseFloat(fees) || 0;
    if (!Number.isFinite(qtyN) || qtyN <= 0) {
        return res.status(400).json({ error: 'Quantite doit etre un entier positif' });
    }
    if (!Number.isFinite(priceN) || priceN < 0) {
        return res.status(400).json({ error: 'Prix unitaire invalide' });
    }
    if (!Number.isFinite(feesN) || feesN < 0) {
        return res.status(400).json({ error: 'Frais invalides' });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'Date doit etre au format YYYY-MM-DD' });
    }

    const id = crypto.randomUUID();
    try {
        await createTransaction(req.userId, {
            id, productName, type,
            qty: qtyN, unitPrice: priceN, fees: feesN,
            date, notes: (notes || '').slice(0, 500),
        });
        res.json({ ok: true, id });
    } catch (e) {
        console.error('[transactions/create] error:', e);
        res.status(500).json({ error: 'Erreur creation transaction' });
    }
});

app.delete('/api/transactions/:id', authMiddleware, async (req, res) => {
    try {
        const ok = await deleteTransaction(req.userId, req.params.id);
        if (!ok) return res.status(404).json({ error: 'Transaction introuvable' });
        res.json({ ok: true });
    } catch (e) {
        console.error('[transactions/delete] error:', e);
        res.status(500).json({ error: 'Erreur suppression' });
    }
});

// Stats agregees : pour chaque produit acheté/vendu, calcule le PRU FIFO,
// la qty restante, le P&L realise (sur les ventes effectuees) et donne
// les totaux globaux.
app.get('/api/transactions/stats', authMiddleware, async (req, res) => {
    try {
        const txs = await listTransactions(req.userId);
        // Reordonne par date croissante pour un FIFO chronologique correct
        const sorted = [...txs].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

        const perProduct = {};
        let totalBought = 0, totalSold = 0, totalFees = 0;
        let realizedPnl = 0;

        for (const tx of sorted) {
            const k = tx.productName;
            if (!perProduct[k]) perProduct[k] = { lots: [], totalBoughtQty: 0, totalSoldQty: 0, totalBoughtCost: 0, totalSoldRevenue: 0, totalFees: 0, realizedPnl: 0 };
            const acc = perProduct[k];
            acc.totalFees += tx.fees;
            totalFees += tx.fees;

            if (tx.type === 'buy') {
                // Cout par exemplaire = (qty*unit + frais) / qty
                const costPerUnit = (tx.qty * tx.unitPrice + tx.fees) / tx.qty;
                acc.lots.push({ qty: tx.qty, costPerUnit });
                acc.totalBoughtQty += tx.qty;
                acc.totalBoughtCost += tx.qty * tx.unitPrice + tx.fees;
                totalBought += tx.qty * tx.unitPrice + tx.fees;
            } else { // sell
                let remaining = tx.qty;
                let costBasis = 0;
                while (remaining > 0 && acc.lots.length > 0) {
                    const lot = acc.lots[0];
                    const take = Math.min(remaining, lot.qty);
                    costBasis += take * lot.costPerUnit;
                    lot.qty -= take;
                    remaining -= take;
                    if (lot.qty <= 0) acc.lots.shift();
                }
                // Si on vend plus qu'on n'a achete, on tracke quand meme la vente
                // mais le costBasis reste celui des lots dispo (P&L sera optimiste).
                const revenue = tx.qty * tx.unitPrice - tx.fees;
                const pnl = revenue - costBasis;
                acc.totalSoldQty += tx.qty;
                acc.totalSoldRevenue += revenue;
                acc.realizedPnl += pnl;
                totalSold += revenue;
                realizedPnl += pnl;
            }
        }

        // Aplati les lots restants pour calculer la qty restante et PRU moyen
        const products = Object.entries(perProduct).map(([name, acc]) => {
            const remainingQty = acc.lots.reduce((s, l) => s + l.qty, 0);
            const remainingCost = acc.lots.reduce((s, l) => s + l.qty * l.costPerUnit, 0);
            const avgCost = remainingQty > 0 ? remainingCost / remainingQty : 0;
            return {
                productName: name,
                boughtQty: acc.totalBoughtQty,
                soldQty: acc.totalSoldQty,
                remainingQty,
                avgCost: Math.round(avgCost * 100) / 100,
                totalCost: Math.round(acc.totalBoughtCost * 100) / 100,
                totalRevenue: Math.round(acc.totalSoldRevenue * 100) / 100,
                realizedPnl: Math.round(acc.realizedPnl * 100) / 100,
                fees: Math.round(acc.totalFees * 100) / 100,
            };
        }).sort((a, b) => Math.abs(b.realizedPnl) - Math.abs(a.realizedPnl));

        res.json({
            totals: {
                txCount: txs.length,
                totalBought: Math.round(totalBought * 100) / 100,
                totalSold: Math.round(totalSold * 100) / 100,
                totalFees: Math.round(totalFees * 100) / 100,
                realizedPnl: Math.round(realizedPnl * 100) / 100,
            },
            products,
        });
    } catch (e) {
        console.error('[transactions/stats] error:', e);
        res.status(500).json({ error: 'Erreur stats' });
    }
});

// ── Cron Job quotidien (déclenché par GitHub Actions / UptimeRobot / …) ──
// Protégé par header x-cron-secret (env var CRON_SECRET)
// 1) Collecte les produits détenus par au moins un user
// 2) Rafraichit les prix eBay pour ces produits uniquement (limite les appels API)
// 3) Lance le snapshot portfolio pour tous les users
const CRON_SECRET = process.env.CRON_SECRET || '';

async function runDailyCron() {
    const start = Date.now();
    const summary = { refreshed: 0, failed: 0, users: 0, ownedProducts: 0, errors: [] };

    // Collecte des produits détenus (DB)
    const userIds = await listPortfolioUserIds();
    summary.users = userIds.length;
    const ownedIds = new Set();
    for (const uid of userIds) {
        try {
            const pf = await getPortfolio(uid);
            for (const product of PRODUCTS_TO_TRACK) {
                const h = pf[product.name];
                if (h && h.qty > 0) ownedIds.add(product.id);
            }
        } catch (err) {
            summary.errors.push(`read pf ${uid}: ${err.message}`);
        }
    }

    summary.ownedProducts = ownedIds.size;
    console.log(`[Cron] ${ownedIds.size} produits détenus à rafraichir`);

    // Refresh les prix (throttle pour ménager l'API eBay)
    for (const productId of ownedIds) {
        const product = PRODUCTS_TO_TRACK.find(p => p.id === productId);
        if (!product) continue;
        try {
            await refreshProductPrice(product);
            summary.refreshed++;
            await new Promise(r => setTimeout(r, 400));
        } catch (err) {
            summary.failed++;
            summary.errors.push(`${productId}: ${err.message}`);
            console.error(`[Cron] refresh ${productId} failed:`, err.message);
        }
    }

    // Snapshot
    await snapshotPortfolio();

    summary.durationMs = Date.now() - start;
    console.log(`[Cron] Terminé en ${Math.round(summary.durationMs / 1000)}s`, summary);
    return summary;
}

app.post('/api/cron/daily', async (req, res) => {
    const provided = req.headers['x-cron-secret'] || req.query.secret;
    if (!CRON_SECRET) {
        return res.status(503).json({ error: 'CRON_SECRET non configuré côté serveur' });
    }
    if (provided !== CRON_SECRET) {
        return res.status(401).json({ error: 'Secret invalide' });
    }
    try {
        const summary = await runDailyCron();
        res.json({ ok: true, ...summary });
    } catch (err) {
        console.error('[Cron] Erreur fatale:', err);
        res.status(500).json({ error: err.message });
    }
});

// Cron minuit : snapshot portfolio
function scheduleMidnightSnapshot() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // prochain minuit
    const msUntilMidnight = midnight.getTime() - now.getTime();

    console.log(`[Portfolio] Prochain snapshot dans ${Math.round(msUntilMidnight / 60000)} min`);

    setTimeout(() => {
        snapshotPortfolio();
        // Puis toutes les 24h
        setInterval(snapshotPortfolio, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
}

// ── Start ────────────────────────────────────────────────────

async function start() {
    await ensureDataDirs();
    await initSchema();

    // Initialise TOKEN_SECRET : env var prioritaire, sinon secret
    // persistant dans la DB (genere une seule fois, survit aux redeploys).
    if (!TOKEN_SECRET) {
        TOKEN_SECRET = await getOrCreateAppSecret('token');
        console.log('[auth] TOKEN_SECRET charge depuis la DB (persistant)');
    } else {
        console.log('[auth] TOKEN_SECRET charge depuis env var');
    }

    app.listen(PORT, () => {
        const mode = IS_SANDBOX ? 'SANDBOX' : 'PRODUCTION';
        const creds = EBAY_CLIENT_ID && EBAY_CLIENT_ID !== 'your_app_id_here' ? '✓' : '✗ (configurer .env)';
        console.log(`
┌─────────────────────────────────────────┐
│  PokéScellé — Serveur démarré           │
│  http://localhost:${PORT}                  │
│  Mode eBay : ${mode.padEnd(26)}│
│  Credentials : ${creds.padEnd(23)}│
│  Produits suivis : ${String(PRODUCTS_TO_TRACK.length).padEnd(20)}│
│  Stockage : ${DB_MODE.padEnd(28)}│
└─────────────────────────────────────────┘
`);

        // Snapshot initial au démarrage (après 30s pour laisser le cache se remplir)
        setTimeout(snapshotPortfolio, 30000);
        scheduleMidnightSnapshot();
    });
}

start().catch(err => {
    console.error('Fatal startup error:', err);
    process.exit(1);
});
