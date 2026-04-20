// ============================================================
//  PokéScellé — Couche DB (libSQL / Turso compatible)
//  - En local : utilise un fichier SQLite (data/pokescelle.db)
//  - En prod : utilise Turso via TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
// ============================================================

import { createClient } from '@libsql/client';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Choix de l'URL : Turso si configuré, sinon fichier local
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const LOCAL_DB_PATH = path.join(__dirname, 'data', 'pokescelle.db');

const dbConfig = TURSO_URL
    ? { url: TURSO_URL, authToken: TURSO_TOKEN }
    : { url: `file:${LOCAL_DB_PATH}` };

export const db = createClient(dbConfig);
export const DB_MODE = TURSO_URL ? 'turso' : 'local';

// ── Schema ──────────────────────────────────────────────────

const SCHEMA = [
    `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        salt TEXT NOT NULL,
        hash TEXT NOT NULL,
        created_at TEXT NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS portfolios (
        user_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        qty INTEGER NOT NULL DEFAULT 0,
        cost REAL NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, product_name)
    )`,

    `CREATE TABLE IF NOT EXISTS portfolio_history (
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        invested REAL NOT NULL DEFAULT 0,
        value REAL NOT NULL DEFAULT 0,
        pnl REAL NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, date)
    )`,

    `CREATE TABLE IF NOT EXISTS price_history (
        product_id TEXT NOT NULL,
        date TEXT NOT NULL,
        median REAL,
        low REAL,
        high REAL,
        last_price REAL,
        sample_size INTEGER,
        PRIMARY KEY (product_id, date)
    )`,

    `CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS custom_queries (
        product_id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )`,

    // Indexes pour requêtes fréquentes
    `CREATE INDEX IF NOT EXISTS idx_portfolios_user ON portfolios(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_pf_history_user_date ON portfolio_history(user_id, date)`,
    `CREATE INDEX IF NOT EXISTS idx_price_history_product_date ON price_history(product_id, date)`,
];

export async function initSchema() {
    for (const stmt of SCHEMA) {
        await db.execute(stmt);
    }
}

// ── Users ───────────────────────────────────────────────────

export async function getUserById(id) {
    const r = await db.execute({
        sql: 'SELECT id, username, salt, hash, created_at FROM users WHERE id = ?',
        args: [id],
    });
    return r.rows[0] || null;
}

export async function getUserByUsername(username) {
    const r = await db.execute({
        sql: 'SELECT id, username, salt, hash, created_at FROM users WHERE LOWER(username) = LOWER(?)',
        args: [username],
    });
    return r.rows[0] || null;
}

export async function createUser(id, username, salt, hash) {
    await db.execute({
        sql: 'INSERT INTO users (id, username, salt, hash, created_at) VALUES (?, ?, ?, ?, ?)',
        args: [id, username, salt, hash, new Date().toISOString()],
    });
}

// ── Portfolios ──────────────────────────────────────────────

// Retourne le portfolio d'un user sous forme d'objet { [productName]: { qty, cost } }
export async function getPortfolio(userId) {
    const r = await db.execute({
        sql: 'SELECT product_name, qty, cost FROM portfolios WHERE user_id = ?',
        args: [userId],
    });
    const out = {};
    for (const row of r.rows) {
        out[row.product_name] = { qty: Number(row.qty), cost: Number(row.cost) };
    }
    return out;
}

// Remplace le portfolio entier d'un user (batch dans une transaction)
export async function setPortfolio(userId, portfolio) {
    const statements = [
        { sql: 'DELETE FROM portfolios WHERE user_id = ?', args: [userId] },
    ];
    const now = Date.now();
    for (const [name, v] of Object.entries(portfolio || {})) {
        if (!v) continue;
        const qty = Number(v.qty) || 0;
        const cost = Number(v.cost) || 0;
        // On ne stocke que les lignes avec qty > 0 pour éviter les entrées vides
        if (qty <= 0 && cost <= 0) continue;
        statements.push({
            sql: 'INSERT INTO portfolios (user_id, product_name, qty, cost, updated_at) VALUES (?, ?, ?, ?, ?)',
            args: [userId, name, qty, cost, now],
        });
    }
    await db.batch(statements, 'write');
}

// Liste tous les user_id qui ont au moins une position
export async function listPortfolioUserIds() {
    const r = await db.execute('SELECT DISTINCT user_id FROM portfolios');
    return r.rows.map(row => row.user_id);
}

// ── Portfolio History ───────────────────────────────────────

export async function getPortfolioHistory(userId) {
    const r = await db.execute({
        sql: 'SELECT date, invested, value, pnl FROM portfolio_history WHERE user_id = ? ORDER BY date ASC',
        args: [userId],
    });
    return r.rows.map(row => ({
        date: row.date,
        invested: Number(row.invested),
        value: Number(row.value),
        pnl: Number(row.pnl),
    }));
}

// Upsert d'une entrée pour une date donnée (remplace si existe)
export async function upsertPortfolioHistory(userId, entry) {
    await db.execute({
        sql: `INSERT INTO portfolio_history (user_id, date, invested, value, pnl)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT (user_id, date) DO UPDATE SET
                invested = excluded.invested,
                value = excluded.value,
                pnl = excluded.pnl`,
        args: [userId, entry.date, entry.invested, entry.value, entry.pnl],
    });
    // Cap à 365 jours : supprimer les plus vieux
    await db.execute({
        sql: `DELETE FROM portfolio_history
              WHERE user_id = ?
              AND date NOT IN (
                SELECT date FROM portfolio_history
                WHERE user_id = ?
                ORDER BY date DESC LIMIT 365
              )`,
        args: [userId, userId],
    });
}

// ── Price History (par produit) ─────────────────────────────

export async function getPriceHistory(productId) {
    const r = await db.execute({
        sql: 'SELECT date, median, low, high, last_price, sample_size FROM price_history WHERE product_id = ? ORDER BY date ASC',
        args: [productId],
    });
    return r.rows.map(row => ({
        date: row.date,
        median: row.median == null ? undefined : Number(row.median),
        low: row.low == null ? undefined : Number(row.low),
        high: row.high == null ? undefined : Number(row.high),
        lastPrice: row.last_price == null ? undefined : Number(row.last_price),
        sampleSize: row.sample_size == null ? undefined : Number(row.sample_size),
    }));
}

export async function upsertPriceHistory(productId, entry) {
    await db.execute({
        sql: `INSERT INTO price_history (product_id, date, median, low, high, last_price, sample_size)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT (product_id, date) DO UPDATE SET
                median = excluded.median,
                low = excluded.low,
                high = excluded.high,
                last_price = excluded.last_price,
                sample_size = excluded.sample_size`,
        args: [productId, entry.date, entry.median ?? null, entry.low ?? null, entry.high ?? null, entry.lastPrice ?? null, entry.sampleSize ?? null],
    });
    // Cap à 90 jours
    await db.execute({
        sql: `DELETE FROM price_history
              WHERE product_id = ?
              AND date NOT IN (
                SELECT date FROM price_history
                WHERE product_id = ?
                ORDER BY date DESC LIMIT 90
              )`,
        args: [productId, productId],
    });
}

// ── Cache (TTL basé sur updated_at) ─────────────────────────

export async function getCache(key, ttlMs) {
    const r = await db.execute({
        sql: 'SELECT data, updated_at FROM cache WHERE key = ?',
        args: [key],
    });
    const row = r.rows[0];
    if (!row) return null;
    if (ttlMs && Date.now() - Number(row.updated_at) > ttlMs) return null;
    try { return JSON.parse(row.data); } catch { return null; }
}

export async function setCache(key, data) {
    await db.execute({
        sql: `INSERT INTO cache (key, data, updated_at) VALUES (?, ?, ?)
              ON CONFLICT (key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
        args: [key, JSON.stringify(data), Date.now()],
    });
}

export async function deleteCache(key) {
    await db.execute({ sql: 'DELETE FROM cache WHERE key = ?', args: [key] });
}

// Lit tout le cache en 1 requête. Retourne { [key]: data } pour les entrées
// non expirées (si ttlMs est fourni). Inclut aussi updatedAt pour permettre
// au client de raisonner sur la fraîcheur.
export async function getAllCache(ttlMs) {
    const r = await db.execute('SELECT key, data, updated_at FROM cache');
    const now = Date.now();
    const out = {};
    for (const row of r.rows) {
        const updatedAt = Number(row.updated_at);
        if (ttlMs && now - updatedAt > ttlMs) continue;
        try {
            const data = JSON.parse(row.data);
            out[row.key] = { ...data, _cachedAt: updatedAt };
        } catch {}
    }
    return out;
}

// ── App Secrets (persistant, survit aux redeploys) ──────────
// Utilisé pour TOKEN_SECRET notamment : si la variable d'env n'est pas
// definie, on persiste un secret genere une seule fois dans la DB pour
// qu'il survive aux redemarrages (sinon tous les tokens sont invalides).
// Utilise la table cache avec un prefixe dedié.
export async function getOrCreateAppSecret(name) {
    const key = `__app_secret__${name}`;
    const r = await db.execute({
        sql: 'SELECT data FROM cache WHERE key = ?',
        args: [key],
    });
    if (r.rows[0]) {
        try {
            const parsed = JSON.parse(r.rows[0].data);
            if (parsed && typeof parsed.value === 'string' && parsed.value.length >= 32) {
                return parsed.value;
            }
        } catch {}
    }
    const value = crypto.randomBytes(32).toString('hex');
    await db.execute({
        sql: `INSERT INTO cache (key, data, updated_at) VALUES (?, ?, ?)
              ON CONFLICT (key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
        args: [key, JSON.stringify({ value, createdAt: Date.now() }), Date.now()],
    });
    return value;
}

// ── Custom Queries ──────────────────────────────────────────

export async function getCustomQueries() {
    const r = await db.execute('SELECT product_id, data FROM custom_queries');
    const out = {};
    for (const row of r.rows) {
        try { out[row.product_id] = JSON.parse(row.data); } catch {}
    }
    return out;
}

export async function setCustomQueries(queries) {
    const statements = [{ sql: 'DELETE FROM custom_queries', args: [] }];
    for (const [pid, data] of Object.entries(queries || {})) {
        statements.push({
            sql: 'INSERT INTO custom_queries (product_id, data) VALUES (?, ?)',
            args: [pid, JSON.stringify(data)],
        });
    }
    await db.batch(statements, 'write');
}

export async function setCustomQuery(productId, data) {
    if (!data) {
        await db.execute({ sql: 'DELETE FROM custom_queries WHERE product_id = ?', args: [productId] });
        return;
    }
    await db.execute({
        sql: `INSERT INTO custom_queries (product_id, data) VALUES (?, ?)
              ON CONFLICT (product_id) DO UPDATE SET data = excluded.data`,
        args: [productId, JSON.stringify(data)],
    });
}
