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

    // Groupes de portfolios (multi-portfolio par user)
    // Le groupe 'default' est implicite et pointe sur la table portfolios.
    // Les autres groupes sont stockes dans portfolios_extra.
    `CREATE TABLE IF NOT EXISTS portfolio_groups (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    )`,

    // Holdings pour les portfolios additionnels (non-default)
    // Le PK inclut group_id pour permettre le meme produit dans plusieurs groupes
    `CREATE TABLE IF NOT EXISTS portfolios_extra (
        user_id TEXT NOT NULL,
        group_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        qty INTEGER NOT NULL DEFAULT 0,
        cost REAL NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, group_id, product_name)
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

    // Mapping codes-barres EAN -> nom de produit (partage entre tous les users)
    `CREATE TABLE IF NOT EXISTS barcodes (
        ean TEXT PRIMARY KEY,
        product_name TEXT NOT NULL,
        added_by TEXT,
        created_at TEXT NOT NULL
    )`,

    // Historique de transactions (achats / ventes) par utilisateur
    `CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        type TEXT NOT NULL,
        qty INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        fees REAL NOT NULL DEFAULT 0,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL
    )`,

    // Indexes pour requêtes fréquentes
    `CREATE INDEX IF NOT EXISTS idx_portfolios_user ON portfolios(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_pf_history_user_date ON portfolio_history(user_id, date)`,
    `CREATE INDEX IF NOT EXISTS idx_price_history_product_date ON price_history(product_id, date)`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_user_product ON transactions(user_id, product_name)`,
    `CREATE INDEX IF NOT EXISTS idx_pf_groups_user ON portfolio_groups(user_id, sort_order)`,
    `CREATE INDEX IF NOT EXISTS idx_pf_extra_user_group ON portfolios_extra(user_id, group_id)`,
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

export async function updateUserPassword(id, salt, hash) {
    await db.execute({
        sql: 'UPDATE users SET salt = ?, hash = ? WHERE id = ?',
        args: [salt, hash, id],
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

// Recupere toutes les entrees price_history d'un coup (pour calcul de l'indice marche).
// On ne prend que median != NULL pour eviter les jours sans donnees.
export async function getAllPriceHistory() {
    const r = await db.execute(
        'SELECT product_id, date, median FROM price_history WHERE median IS NOT NULL ORDER BY date ASC'
    );
    return r.rows.map(row => ({
        productId: row.product_id,
        date: row.date,
        median: Number(row.median),
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

// ── Multi-portfolios (groupes) ──────────────────────────────
//
// Le groupe 'default' (id virtuel) correspond a l'ancienne table portfolios.
// Les groupes additionnels sont stockes dans portfolio_groups (metadata) +
// portfolios_extra (holdings).

export async function listPortfolioGroups(userId) {
    const r = await db.execute({
        sql: 'SELECT id, name, icon, color, sort_order, created_at FROM portfolio_groups WHERE user_id = ? ORDER BY sort_order ASC, created_at ASC',
        args: [userId],
    });
    return r.rows.map(row => ({
        id: row.id,
        name: row.name,
        icon: row.icon || '💼',
        color: row.color || '#22c55e',
        sortOrder: Number(row.sort_order) || 0,
        createdAt: row.created_at,
    }));
}

export async function createPortfolioGroup(id, userId, { name, icon, color, sortOrder }) {
    await db.execute({
        sql: 'INSERT INTO portfolio_groups (id, user_id, name, icon, color, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [id, userId, name, icon || null, color || null, sortOrder || 0, new Date().toISOString()],
    });
}

export async function updatePortfolioGroup(id, userId, { name, icon, color, sortOrder }) {
    const updates = [];
    const args = [];
    if (name !== undefined) { updates.push('name = ?'); args.push(name); }
    if (icon !== undefined) { updates.push('icon = ?'); args.push(icon); }
    if (color !== undefined) { updates.push('color = ?'); args.push(color); }
    if (sortOrder !== undefined) { updates.push('sort_order = ?'); args.push(sortOrder); }
    if (updates.length === 0) return false;
    args.push(id, userId);
    const r = await db.execute({
        sql: `UPDATE portfolio_groups SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        args,
    });
    return r.rowsAffected > 0;
}

export async function deletePortfolioGroup(id, userId) {
    // Supprime aussi les holdings du groupe
    await db.execute({
        sql: 'DELETE FROM portfolios_extra WHERE user_id = ? AND group_id = ?',
        args: [userId, id],
    });
    const r = await db.execute({
        sql: 'DELETE FROM portfolio_groups WHERE id = ? AND user_id = ?',
        args: [id, userId],
    });
    return r.rowsAffected > 0;
}

export async function getPortfolioByGroup(userId, groupId) {
    if (groupId === 'default') {
        return await getPortfolio(userId);
    }
    const r = await db.execute({
        sql: 'SELECT product_name, qty, cost FROM portfolios_extra WHERE user_id = ? AND group_id = ?',
        args: [userId, groupId],
    });
    const out = {};
    for (const row of r.rows) {
        out[row.product_name] = { qty: Number(row.qty) || 0, cost: Number(row.cost) || 0 };
    }
    return out;
}

export async function setPortfolioByGroup(userId, groupId, holdings) {
    if (groupId === 'default') {
        return await setPortfolio(userId, holdings);
    }
    const now = Date.now();
    const statements = [
        { sql: 'DELETE FROM portfolios_extra WHERE user_id = ? AND group_id = ?', args: [userId, groupId] },
    ];
    for (const [productName, data] of Object.entries(holdings || {})) {
        const qty = Number(data?.qty) || 0;
        if (qty <= 0) continue; // pas de stockage des qty=0
        const cost = Number(data?.cost) || 0;
        statements.push({
            sql: 'INSERT INTO portfolios_extra (user_id, group_id, product_name, qty, cost, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            args: [userId, groupId, productName, qty, cost, now],
        });
    }
    await db.batch(statements, 'write');
}

// ── Barcodes (EAN -> product_name) ──────────────────────────

export async function getBarcode(ean) {
    const r = await db.execute({
        sql: 'SELECT ean, product_name, added_by, created_at FROM barcodes WHERE ean = ?',
        args: [ean],
    });
    if (!r.rows[0]) return null;
    return {
        ean: r.rows[0].ean,
        productName: r.rows[0].product_name,
        addedBy: r.rows[0].added_by,
        createdAt: r.rows[0].created_at,
    };
}

export async function listBarcodes() {
    const r = await db.execute('SELECT ean, product_name, added_by, created_at FROM barcodes ORDER BY created_at DESC');
    return r.rows.map(row => ({
        ean: row.ean,
        productName: row.product_name,
        addedBy: row.added_by,
        createdAt: row.created_at,
    }));
}

export async function setBarcode(ean, productName, addedBy) {
    await db.execute({
        sql: `INSERT INTO barcodes (ean, product_name, added_by, created_at)
              VALUES (?, ?, ?, ?)
              ON CONFLICT (ean) DO UPDATE SET
                product_name = excluded.product_name,
                added_by = excluded.added_by`,
        args: [ean, productName, addedBy || null, new Date().toISOString()],
    });
}

export async function deleteBarcode(ean) {
    const r = await db.execute({
        sql: 'DELETE FROM barcodes WHERE ean = ?',
        args: [ean],
    });
    return r.rowsAffected > 0;
}

// ── Transactions (achats / ventes) ──────────────────────────

export async function listTransactions(userId) {
    const r = await db.execute({
        sql: `SELECT id, product_name, type, qty, unit_price, fees, date, notes, created_at
              FROM transactions WHERE user_id = ?
              ORDER BY date DESC, created_at DESC`,
        args: [userId],
    });
    return r.rows.map(row => ({
        id: row.id,
        productName: row.product_name,
        type: row.type,
        qty: Number(row.qty),
        unitPrice: Number(row.unit_price),
        fees: Number(row.fees),
        date: row.date,
        notes: row.notes || '',
        createdAt: row.created_at,
    }));
}

export async function createTransaction(userId, tx) {
    await db.execute({
        sql: `INSERT INTO transactions
              (id, user_id, product_name, type, qty, unit_price, fees, date, notes, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
            tx.id,
            userId,
            tx.productName,
            tx.type,
            tx.qty,
            tx.unitPrice,
            tx.fees || 0,
            tx.date,
            tx.notes || null,
            new Date().toISOString(),
        ],
    });
}

export async function deleteTransaction(userId, id) {
    const r = await db.execute({
        sql: 'DELETE FROM transactions WHERE id = ? AND user_id = ?',
        args: [id, userId],
    });
    return r.rowsAffected > 0;
}
