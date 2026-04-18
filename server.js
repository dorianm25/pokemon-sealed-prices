// ============================================================
//  PokéScellé — Backend proxy eBay
//  Authentification OAuth, recherche ventes, cache JSON
// ============================================================

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

// ── Auth / Users ────────────────────────────────────────────

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const PORTFOLIOS_DIR = path.join(__dirname, 'data', 'portfolios');
const PORTFOLIO_HISTORY_FILE = path.join(__dirname, 'data', 'portfolio-history.json');
const TOKEN_SECRET = process.env.TOKEN_SECRET || crypto.randomBytes(32).toString('hex');

async function ensureDataDirs() {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    await fs.mkdir(PORTFOLIOS_DIR, { recursive: true });
}

async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

async function writeUsers(users) {
    await ensureDataDirs();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
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
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    const payload = verifyToken(auth.slice(7));
    if (!payload) {
        return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
    req.userId = payload.id;
    next();
}

async function readPortfolio(userId) {
    try {
        const file = path.join(PORTFOLIOS_DIR, `${userId}.json`);
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

async function writePortfolio(userId, portfolio) {
    await ensureDataDirs();
    const file = path.join(PORTFOLIOS_DIR, `${userId}.json`);
    await fs.writeFile(file, JSON.stringify(portfolio, null, 2));
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

// ── Cache ────────────────────────────────────────────────────

const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_TTL = 1 * 60 * 60 * 1000; // 1 heure
const HISTORY_DIR = path.join(__dirname, 'data', 'history');

async function ensureCacheDir() {
    await fs.mkdir(CACHE_DIR, { recursive: true });
}

// ── Historique de prix ───────────────────────────────────────

async function appendHistory(productId, priceData) {
    await fs.mkdir(HISTORY_DIR, { recursive: true });
    const file = path.join(HISTORY_DIR, `${productId}.json`);
    let history = [];
    try {
        const raw = await fs.readFile(file, 'utf-8');
        history = JSON.parse(raw);
    } catch {}

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const entry = {
        date: today,
        median: priceData.price,
        low: priceData.low,
        high: priceData.high,
        lastPrice: priceData.lastListing?.price || priceData.price,
        sampleSize: priceData.sampleSize,
    };

    // Remplacer l'entrée du jour si elle existe, sinon ajouter
    const idx = history.findIndex(h => h.date === today);
    if (idx >= 0) {
        history[idx] = entry;
    } else {
        history.push(entry);
    }

    // Garder max 90 jours
    if (history.length > 90) history = history.slice(-90);

    await fs.writeFile(file, JSON.stringify(history, null, 2));
}

async function readHistory(productId) {
    try {
        const file = path.join(HISTORY_DIR, `${productId}.json`);
        const raw = await fs.readFile(file, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

async function readCache(key) {
    try {
        const file = path.join(CACHE_DIR, `${key}.json`);
        const stat = await fs.stat(file);
        if (Date.now() - stat.mtimeMs > CACHE_TTL) return null;
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

async function writeCache(key, data) {
    await ensureCacheDir();
    const file = path.join(CACHE_DIR, `${key}.json`);
    await fs.writeFile(file, JSON.stringify(data, null, 2));
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

function extractPrices(ebayResponse, limits, query) {
    const items = ebayResponse.itemSummaries || [];

    if (items.length === 0) return null;

    const validItems = items.filter(item => {
        const val = parseFloat(item.price?.value);
        if (isNaN(val) || val <= 0) return false;
        if (limits && (val < limits.min || val > limits.max)) return false;
        return true;
    });

    if (validItems.length === 0) return null;

    const prices = validItems.map(item => parseFloat(item.price.value));
    prices.sort((a, b) => a - b);

    // Prix médian = plus représentatif du marché
    const mid = Math.floor(prices.length / 2);
    const medianPrice = prices.length % 2 === 0
        ? (prices[mid - 1] + prices[mid]) / 2
        : prices[mid];

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

    // Lien de recherche affilié
    const searchUrl = toAffiliateUrl(`https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(query)}&_sop=15&LH_BIN=1`);

    return {
        price: Math.round(medianPrice * 100) / 100,
        lastPrice: Math.round(cheapestPrice * 100) / 100,
        low: Math.min(...prices),
        high: Math.max(...prices),
        sampleSize: validItems.length,
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

const CUSTOM_QUERIES_FILE = path.join(__dirname, 'data', 'custom-queries.json');

async function loadCustomQueries() {
    try {
        const data = await fs.readFile(CUSTOM_QUERIES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

async function saveCustomQueries(queries) {
    await ensureDataDirs();
    await fs.writeFile(CUSTOM_QUERIES_FILE, JSON.stringify(queries, null, 2));
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
            priceData = extractPrices(ebayData, limits, query);
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
            const priceData = extractPrices(ebayData, limits, product.query);

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
        priceData = extractPrices(ebayData, limits, query);
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

// API : statut
app.get('/api/status', async (_req, res) => {
    const hasCredentials = !!(EBAY_CLIENT_ID && EBAY_CLIENT_ID !== 'your_app_id_here');
    res.json({
        mode: IS_SANDBOX ? 'sandbox' : 'production',
        hasCredentials,
        cacheDir: CACHE_DIR,
        trackedProducts: PRODUCTS_TO_TRACK.length,
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
    try {
        await fs.unlink(path.join(CACHE_DIR, `${product.id}.json`));
    } catch {}

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

    const users = await readUsers();
    const uid = username.toLowerCase().trim();

    if (users[uid]) {
        return res.status(409).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }

    const { salt, hash } = hashPassword(password);
    users[uid] = { username: username.trim(), salt, hash, createdAt: new Date().toISOString() };
    await writeUsers(users);

    // Créer un portfolio vide pour le nouvel utilisateur
    const emptyPortfolio = {};
    for (const p of PRODUCTS_TO_TRACK) {
        emptyPortfolio[p.name] = { qty: 0, cost: 0 };
    }
    await writePortfolio(uid, emptyPortfolio);

    const token = createToken(uid);
    res.json({ token, username: users[uid].username });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const users = await readUsers();
    const uid = username.toLowerCase().trim();
    const user = users[uid];

    if (!user || !verifyPassword(password, user.salt, user.hash)) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = createToken(uid);
    res.json({ token, username: user.username });
});

app.get('/api/me', authMiddleware, async (req, res) => {
    const users = await readUsers();
    const user = users[req.userId];
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json({ username: user.username });
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

// ── Portfolio History (par utilisateur) ──────────────────────

const PORTFOLIO_HISTORY_DIR = path.join(__dirname, 'data', 'portfolio-history');

async function ensureHistoryDir() {
    await fs.mkdir(PORTFOLIO_HISTORY_DIR, { recursive: true });
}

async function readPortfolioHistory(userId) {
    try {
        if (userId) {
            const file = path.join(PORTFOLIO_HISTORY_DIR, `${userId}.json`);
            return JSON.parse(await fs.readFile(file, 'utf-8'));
        }
        return JSON.parse(await fs.readFile(PORTFOLIO_HISTORY_FILE, 'utf-8'));
    } catch {
        return [];
    }
}

async function writePortfolioHistory(userId, history) {
    await ensureHistoryDir();
    const file = path.join(PORTFOLIO_HISTORY_DIR, `${userId}.json`);
    await fs.writeFile(file, JSON.stringify(history, null, 2));
}

async function snapshotPortfolio() {
    console.log('[Portfolio] Snapshot en cours...');
    try {
        let allFiles;
        try {
            allFiles = await fs.readdir(PORTFOLIOS_DIR);
        } catch {
            allFiles = [];
        }

        for (const file of allFiles) {
            if (!file.endsWith('.json')) continue;
            const userId = file.replace('.json', '');
            try {
                const portfolio = JSON.parse(await fs.readFile(path.join(PORTFOLIOS_DIR, file), 'utf-8'));

                let totalInvested = 0, totalValue = 0;
                for (const product of PRODUCTS_TO_TRACK) {
                    const h = portfolio[product.name];
                    if (!h || h.qty <= 0) continue;
                    totalInvested += h.qty * h.cost;
                    const cached = await readCache(product.id);
                    const price = cached?.price || 0;
                    totalValue += h.qty * price;
                }

                const today = new Date().toISOString().slice(0, 10);
                const entry = { date: today, invested: Math.round(totalInvested * 100) / 100, value: Math.round(totalValue * 100) / 100, pnl: Math.round((totalValue - totalInvested) * 100) / 100 };

                const history = await readPortfolioHistory(userId);
                const idx = history.findIndex(h => h.date === today);
                if (idx >= 0) history[idx] = entry;
                else history.push(entry);
                if (history.length > 365) history.splice(0, history.length - 365);

                await writePortfolioHistory(userId, history);
                console.log(`[Portfolio] Snapshot ${userId}: investi=${entry.invested}€, valeur=${entry.value}€, P&L=${entry.pnl}€`);
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
    const history = await readPortfolioHistory(req.userId);
    res.json(history);
});

// API : forcer un snapshot pour l'utilisateur connecté
app.post('/api/portfolio-snapshot', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const portfolio = await readPortfolio(userId);
    if (!portfolio) return res.json({ ok: true, entries: 0 });

    let totalInvested = 0, totalValue = 0;
    for (const product of PRODUCTS_TO_TRACK) {
        const h = portfolio[product.name];
        if (!h || h.qty <= 0) continue;
        totalInvested += h.qty * h.cost;
        const cached = await readCache(product.id);
        const price = cached?.price || 0;
        totalValue += h.qty * price;
    }

    const today = new Date().toISOString().slice(0, 10);
    const entry = { date: today, invested: Math.round(totalInvested * 100) / 100, value: Math.round(totalValue * 100) / 100, pnl: Math.round((totalValue - totalInvested) * 100) / 100 };

    const history = await readPortfolioHistory(userId);
    const idx = history.findIndex(h => h.date === today);
    if (idx >= 0) history[idx] = entry;
    else history.push(entry);
    if (history.length > 365) history.splice(0, history.length - 365);

    await writePortfolioHistory(userId, history);
    res.json({ ok: true, entries: history.length });
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

    // Collecte des produits détenus
    const ownedIds = new Set();
    try {
        const allFiles = await fs.readdir(PORTFOLIOS_DIR);
        for (const file of allFiles) {
            if (!file.endsWith('.json')) continue;
            try {
                const portfolio = JSON.parse(await fs.readFile(path.join(PORTFOLIOS_DIR, file), 'utf-8'));
                for (const product of PRODUCTS_TO_TRACK) {
                    const h = portfolio[product.name];
                    if (h && h.qty > 0) ownedIds.add(product.id);
                }
            } catch (err) {
                summary.errors.push(`read ${file}: ${err.message}`);
            }
        }
    } catch {}

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

    // Compte les users
    try {
        const allFiles = await fs.readdir(PORTFOLIOS_DIR);
        summary.users = allFiles.filter(f => f.endsWith('.json')).length;
    } catch {}

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
└─────────────────────────────────────────┘
`);

    // Snapshot initial au démarrage (après 30s pour laisser le cache se remplir)
    setTimeout(snapshotPortfolio, 30000);
    scheduleMidnightSnapshot();
});
