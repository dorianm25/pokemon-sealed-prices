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
const IS_SANDBOX = process.env.EBAY_ENV === 'sandbox';

const EBAY_AUTH_URL = IS_SANDBOX
    ? 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
    : 'https://api.ebay.com/identity/v1/oauth2/token';

const EBAY_API_URL = IS_SANDBOX
    ? 'https://api.sandbox.ebay.com'
    : 'https://api.ebay.com';

// ── Cache ────────────────────────────────────────────────────

const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 heures
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

function extractPrices(ebayResponse, limits) {
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
        url: cheapest.itemWebUrl || '',
        image: cheapest.image?.imageUrl || cheapest.thumbnailImages?.[0]?.imageUrl || '',
    };

    return {
        price: Math.round(medianPrice * 100) / 100,
        lastPrice: Math.round(cheapestPrice * 100) / 100,
        low: Math.min(...prices),
        high: Math.max(...prices),
        sampleSize: validItems.length,
        lastUpdated: new Date().toISOString(),
        lastListing,
    };
}

// ── Catalogue de produits à suivre ───────────────────────────

// Génère les 6 produits pour une série
// minPrice / maxPrice : tolérance de prix pour filtrer les résultats eBay (modifiable par produit)
function serieProducts(id, nom, code, opts = {}) {
    const nl = opts.noLimits;
    return [
        { id: `${id}-etb`,       query: `ETB ${nom} ${code}`,               name: `ETB ${nom}`,            minPrice: nl ? 0 : 40,   maxPrice: nl ? 99999 : 10000 },
        { id: `${id}-display`,    query: `display ${nom} ${code}`,          name: `Display 36 ${nom}`,     minPrice: nl ? 0 : 220,  maxPrice: nl ? 99999 : 10000 },
        { id: `${id}-display18`,  query: `demi display ${nom} ${code}`,     name: `Display 18 ${nom}`,     minPrice: nl ? 0 : 100,  maxPrice: nl ? 99999 : 10000 },
        { id: `${id}-tripack`,    query: `tripack ${nom} ${code}`,          name: `Tripack ${nom}`,        minPrice: nl ? 0 : 18,   maxPrice: nl ? 99999 : 10000 },
        { id: `${id}-bundle`,     query: `bundle ${nom} ${code}`,           name: `Bundle 6 ${nom}`,       minPrice: nl ? 0 : 30,   maxPrice: nl ? 99999 : 10000 },
        { id: `${id}-booster`,    query: `booster ${nom} ${code}`,          name: `Booster ${nom}`,        minPrice: nl ? 0 : 7,    maxPrice: nl ? 99999 : 10000 },
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
            url: item.itemWebUrl || '',
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
            priceData = extractPrices(ebayData, limits);
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
            const priceData = extractPrices(ebayData, limits);

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

// API : forcer le rafraîchissement d'un produit
app.post('/api/refresh/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = PRODUCTS_TO_TRACK.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Produit inconnu' });
    }

    try {
        const limits = { min: product.minPrice, max: product.maxPrice };
        const ebayData = await searchEbaySold(product.query, 20, limits);
        const priceData = extractPrices(ebayData, limits);

        if (!priceData) {
            return res.json({ error: 'Aucun résultat eBay', name: product.name });
        }

        const result = { id: productId, name: product.name, ...priceData };
        await writeCache(productId, result);
        appendHistory(productId, priceData).catch(() => {});

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

// ── Portfolio History ────────────────────────────────────────

async function readPortfolioHistory() {
    try {
        const data = await fs.readFile(PORTFOLIO_HISTORY_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function writePortfolioHistory(history) {
    await ensureDataDirs();
    await fs.writeFile(PORTFOLIO_HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function snapshotPortfolio() {
    console.log('[Portfolio] Snapshot en cours...');
    try {
        // Lire tous les portfolios utilisateurs
        let allFiles;
        try {
            allFiles = await fs.readdir(PORTFOLIOS_DIR);
        } catch {
            allFiles = [];
        }

        // Agréger: pour chaque produit, prendre le max qty trouvé (ou le premier user)
        // Si pas de fichiers, utiliser le portfolio par défaut du frontend
        let portfolio = {};
        for (const file of allFiles) {
            if (!file.endsWith('.json')) continue;
            try {
                const data = JSON.parse(await fs.readFile(path.join(PORTFOLIOS_DIR, file), 'utf-8'));
                for (const [name, h] of Object.entries(data)) {
                    if (h.qty > 0) {
                        if (!portfolio[name] || h.qty > portfolio[name].qty) {
                            portfolio[name] = h;
                        }
                    }
                }
            } catch {}
        }

        // Calculer la valeur totale avec les prix en cache
        let totalInvested = 0, totalValue = 0;
        for (const product of PRODUCTS_TO_TRACK) {
            const h = portfolio[product.name];
            if (!h || h.qty <= 0) continue;
            totalInvested += h.qty * h.cost;

            // Lire le prix en cache
            const cached = await readCache(product.id);
            const price = cached?.price || 0;
            totalValue += h.qty * price;
        }

        const today = new Date().toISOString().slice(0, 10);
        const entry = { date: today, invested: Math.round(totalInvested * 100) / 100, value: Math.round(totalValue * 100) / 100, pnl: Math.round((totalValue - totalInvested) * 100) / 100 };

        const history = await readPortfolioHistory();
        const idx = history.findIndex(h => h.date === today);
        if (idx >= 0) {
            history[idx] = entry;
        } else {
            history.push(entry);
        }
        // Garder max 365 jours
        if (history.length > 365) history.splice(0, history.length - 365);

        await writePortfolioHistory(history);
        console.log(`[Portfolio] Snapshot OK: investi=${entry.invested}€, valeur=${entry.value}€, P&L=${entry.pnl}€`);
    } catch (err) {
        console.error('[Portfolio] Erreur snapshot:', err.message);
    }
}

// API : historique du portfolio
app.get('/api/portfolio-history', async (_req, res) => {
    const history = await readPortfolioHistory();
    res.json(history);
});

// API : forcer un snapshot maintenant
app.post('/api/portfolio-snapshot', async (_req, res) => {
    await snapshotPortfolio();
    const history = await readPortfolioHistory();
    res.json({ ok: true, entries: history.length });
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
