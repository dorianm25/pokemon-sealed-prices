// ============================================================
//  Script de migration — JSON files → libSQL/SQLite
//  Usage:
//    node migrate-to-db.js           (migre vers SQLite local)
//    node migrate-to-db.js --turso   (migre vers Turso si env vars set)
// ============================================================

import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import {
    db, DB_MODE, initSchema,
    createUser, getUserById,
    setPortfolio,
    upsertPortfolioHistory,
    upsertPriceHistory,
    setCache,
    setCustomQuery,
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_DIR = path.join(__dirname, 'data');
const PORTFOLIOS_DIR = path.join(DATA_DIR, 'portfolios');
const PORTFOLIO_HISTORY_DIR = path.join(DATA_DIR, 'portfolio-history');
const PRICE_HISTORY_DIR = path.join(DATA_DIR, 'history');
const CACHE_DIR = path.join(__dirname, 'cache');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CUSTOM_QUERIES_FILE = path.join(DATA_DIR, 'custom-queries.json');

async function safeReadJson(file) {
    try {
        return JSON.parse(await fs.readFile(file, 'utf-8'));
    } catch (err) {
        if (err.code !== 'ENOENT') console.warn(`  ⚠ ${path.basename(file)}: ${err.message}`);
        return null;
    }
}

async function safeReadDir(dir) {
    try {
        return await fs.readdir(dir);
    } catch {
        return [];
    }
}

async function migrateUsers() {
    console.log('\n📥 Migration : users');
    const users = await safeReadJson(USERS_FILE) || {};
    let count = 0, skipped = 0;
    for (const [uid, u] of Object.entries(users)) {
        const existing = await getUserById(uid);
        if (existing) { skipped++; continue; }
        await createUser(uid, u.username, u.salt, u.hash);
        count++;
    }
    console.log(`  ✓ ${count} users créés, ${skipped} déjà présents`);
    return count;
}

async function migratePortfolios() {
    console.log('\n📥 Migration : portfolios');
    const files = await safeReadDir(PORTFOLIOS_DIR);
    let count = 0, positions = 0;
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const uid = file.replace(/\.json$/, '');
        const pf = await safeReadJson(path.join(PORTFOLIOS_DIR, file));
        if (!pf) continue;

        // Nettoyer : enlève les entrées à qty 0 ET cost 0 (bruit du register vide historique)
        const clean = {};
        for (const [name, v] of Object.entries(pf)) {
            if (!v) continue;
            const qty = Number(v.qty) || 0;
            const cost = Number(v.cost) || 0;
            if (qty > 0 || cost > 0) {
                clean[name] = { qty, cost };
                positions++;
            }
        }
        await setPortfolio(uid, clean);
        count++;
    }
    console.log(`  ✓ ${count} portfolios, ${positions} positions`);
    return count;
}

async function migratePortfolioHistory() {
    console.log('\n📥 Migration : portfolio-history');
    const files = await safeReadDir(PORTFOLIO_HISTORY_DIR);
    let entries = 0;
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const uid = file.replace(/\.json$/, '');
        const hist = await safeReadJson(path.join(PORTFOLIO_HISTORY_DIR, file));
        if (!Array.isArray(hist)) continue;
        for (const e of hist) {
            if (!e?.date) continue;
            await upsertPortfolioHistory(uid, {
                date: e.date,
                invested: Number(e.invested) || 0,
                value: Number(e.value) || 0,
                pnl: Number(e.pnl) || 0,
            });
            entries++;
        }
    }
    console.log(`  ✓ ${entries} entrées d'historique portfolio`);
    return entries;
}

async function migratePriceHistory() {
    console.log('\n📥 Migration : price-history');
    const files = await safeReadDir(PRICE_HISTORY_DIR);
    let products = 0, points = 0;
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const pid = file.replace(/\.json$/, '');
        const hist = await safeReadJson(path.join(PRICE_HISTORY_DIR, file));
        if (!Array.isArray(hist)) continue;
        products++;
        for (const e of hist) {
            if (!e?.date) continue;
            await upsertPriceHistory(pid, {
                date: e.date,
                median: e.median,
                low: e.low,
                high: e.high,
                lastPrice: e.lastPrice,
                sampleSize: e.sampleSize,
            });
            points++;
        }
    }
    console.log(`  ✓ ${products} produits, ${points} points de prix`);
    return points;
}

async function migrateCache() {
    console.log('\n📥 Migration : cache eBay');
    const files = await safeReadDir(CACHE_DIR);
    let count = 0;
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const key = file.replace(/\.json$/, '');
        const data = await safeReadJson(path.join(CACHE_DIR, file));
        if (!data) continue;
        await setCache(key, data);
        count++;
    }
    console.log(`  ✓ ${count} entrées de cache`);
    return count;
}

async function migrateCustomQueries() {
    console.log('\n📥 Migration : custom queries');
    const queries = await safeReadJson(CUSTOM_QUERIES_FILE) || {};
    let count = 0;
    for (const [pid, data] of Object.entries(queries)) {
        await setCustomQuery(pid, data);
        count++;
    }
    console.log(`  ✓ ${count} custom queries`);
    return count;
}

async function main() {
    console.log(`\n🚀 Migration vers ${DB_MODE === 'turso' ? 'Turso' : 'SQLite local'}`);
    console.log('─'.repeat(50));

    console.log('\n🔧 Init du schema...');
    await initSchema();
    console.log('  ✓ Schema OK');

    const results = {
        users: await migrateUsers(),
        portfolios: await migratePortfolios(),
        portfolioHistory: await migratePortfolioHistory(),
        priceHistory: await migratePriceHistory(),
        cache: await migrateCache(),
        customQueries: await migrateCustomQueries(),
    };

    console.log('\n' + '─'.repeat(50));
    console.log('✅ Migration terminée\n');
    console.log('Résumé:', results);

    process.exit(0);
}

main().catch(err => {
    console.error('\n❌ Erreur fatale:', err);
    process.exit(1);
});
