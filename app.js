// ============================================================
//  PokéScellé — Données & logique
//  Prix indicatifs marché FR — Avril 2026
// ============================================================

// Helper : génère les 6 produits pour une série
function serie(code, nom, bloc, overrides = {}) {
    const b = bloc === 'EV' ? 'Écarlate et Violet' : bloc === 'ME' ? 'Méga-Évolution' : bloc === 'EB' ? 'Épée et Bouclier' : bloc;
    const base = [
        { name: `ETB ${nom}`,           ext: `${code} — ${nom}`, serie: b, type: 'etb',       price: 54.99, old: 54.99, trend: 0, low: 50, high: 60 },
        { name: `Display 36 ${nom}`,    ext: `${code} — ${nom}`, serie: b, type: 'display',   price: 215,   old: 215,   trend: 0, low: 200, high: 230 },
        { name: `Display 18 ${nom}`,    ext: `${code} — ${nom}`, serie: b, type: 'display18', price: 107,   old: 107,   trend: 0, low: 95, high: 115 },
        { name: `Tripack ${nom}`,       ext: `${code} — ${nom}`, serie: b, type: 'tripack',   price: 17.99, old: 17.99, trend: 0, low: 15, high: 20 },
        { name: `Bundle 6 ${nom}`,      ext: `${code} — ${nom}`, serie: b, type: 'bundle',    price: 35,    old: 35,    trend: 0, low: 30, high: 40 },
        { name: `Booster ${nom}`,       ext: `${code} — ${nom}`, serie: b, type: 'booster',   price: 6.99,  old: 6.99,  trend: 0, low: 5, high: 8 },
    ];
    for (const item of base) {
        const ov = overrides[item.type];
        if (ov) Object.assign(item, ov);
        if (item.old > 0 && item.price !== item.old) {
            item.trend = Math.round(((item.price - item.old) / item.old) * 100);
        }
    }
    return base;
}

const products = [
    ...serie('EV01', 'Écarlate et Violet', 'EV'),
    ...serie('EV02', 'Évolutions à Paldea', 'EV'),
    ...serie('EV03', 'Flammes Obsidiennes', 'EV'),
    { name: 'ETB Pokémon 151', ext: 'EV3.5 — Pokémon 151', serie: 'Écarlate et Violet', type: 'etb', price: 54.99, old: 54.99, trend: 0, low: 50, high: 60 },
    { name: 'Bundle 6 Pokémon 151', ext: 'EV3.5 — Pokémon 151', serie: 'Écarlate et Violet', type: 'bundle', price: 35, old: 35, trend: 0, low: 30, high: 40 },
    { name: 'Booster Pokémon 151', ext: 'EV3.5 — Pokémon 151', serie: 'Écarlate et Violet', type: 'booster', price: 6.99, old: 6.99, trend: 0, low: 5, high: 8 },
    { name: 'Display Bundle Pokémon 151', ext: 'EV3.5 — Pokémon 151', serie: 'Écarlate et Violet', type: 'dispbundle', price: 0, old: 0, trend: 0, low: 0, high: 0 },
    ...serie('EV04', 'Faille Paradoxe', 'EV'),
    ...serie('EV4.5', 'Destinées de Paldea', 'EV', { etb: { price: 130, old: 80, low: 100, high: 150 } }),
    ...serie('EV05', 'Forces Temporelles', 'EV'),
    ...serie('EV06', 'Mascarade Crépusculaire', 'EV'),
    ...serie('EV6.5', 'Fable Nébuleuse', 'EV'),
    ...serie('EV07', 'Couronne Stellaire', 'EV'),
    ...serie('EV08', 'Étincelles Déferlantes', 'EV'),
    ...serie('EV8.5', 'Évolutions Prismatiques', 'EV', { etb: { price: 100, old: 54.99, low: 80, high: 120 }, display: { price: 500, old: 520, low: 450, high: 550 } }),
    { name: 'Display Bundle Évolutions Prismatiques', ext: 'EV8.5 — Évolutions Prismatiques', serie: 'Écarlate et Violet', type: 'dispbundle', price: 0, old: 0, trend: 0, low: 0, high: 0 },
    ...serie('EV09', 'Aventures Ensemble', 'EV', { display: { price: 200, old: 190, low: 180, high: 220 } }),
    ...serie('EV10', 'Rivalités Destinées', 'EV', { etb: { price: 130, old: 54.99, low: 100, high: 160 }, display: { price: 350, old: 215, low: 300, high: 400 }, display18: { price: 170, old: 107, low: 140, high: 200 } }),
    ...serie('EV10.5', 'Foudre Noire (EV10.5)', 'EV', { etb: { price: 80, old: 54.99, low: 65, high: 95 } }),
    ...serie('EV10.5', 'Flamme Blanche (EV10.5)', 'EV', { etb: { price: 80, old: 54.99, low: 65, high: 95 } }),
    ...serie('ME01', 'Méga-Évolution', 'ME', { etb: { price: 85, old: 54.99, low: 70, high: 100 }, display: { price: 280, old: 215, low: 250, high: 310 }, display18: { price: 65, old: 107, low: 55, high: 75 } }),
    ...serie('ME02', 'Flammes Fantasmagoriques', 'ME', { etb: { price: 80, old: 54.99, low: 65, high: 95 }, display: { price: 250, old: 215, low: 220, high: 280 }, display18: { price: 35, old: 107, low: 30, high: 45 } }),
    ...serie('ME2.5', 'Héros Transcendants', 'ME', { etb: { price: 80, old: 54.99, low: 65, high: 95 } }),
    { name: 'Display Bundle Héros Transcendants', ext: 'ME2.5 — Héros Transcendants', serie: 'Méga-Évolution', type: 'dispbundle', price: 0, old: 0, trend: 0, low: 0, high: 0 },
    ...serie('ME03', 'Équilibre Parfait', 'ME'),
    // Épée et Bouclier
    ...serie('EB11', 'Origine Perdue', 'EB', { etb: { price: 350, old: 54.99, low: 280, high: 400 }, display: { price: 550, old: 215, low: 250, high: 850 }, tripack: { price: 40, old: 17.99, low: 35, high: 80 }, bundle: { price: 90, old: 35, low: 70, high: 120 }, booster: { price: 15, old: 6.99, low: 10, high: 40 } }),
    ...serie('EB12', 'Tempête Argentée', 'EB', { etb: { price: 310, old: 54.99, low: 200, high: 400 }, display: { price: 400, old: 215, low: 330, high: 470 }, tripack: { price: 44, old: 17.99, low: 40, high: 50 }, bundle: { price: 75, old: 35, low: 60, high: 100 }, booster: { price: 15, old: 6.99, low: 10, high: 40 } }),
    ...serie('EB12.5', 'Zénith Suprême', 'EB', { etb: { price: 320, old: 54.99, low: 299, high: 500 }, display: { price: 500, old: 215, low: 400, high: 700 }, tripack: { price: 60, old: 17.99, low: 50, high: 80 }, booster: { price: 25, old: 6.99, low: 19, high: 40 } }),
    ...serie('EB01', 'Épée et Bouclier', 'EB', { etb: { price: 120, old: 54.99, low: 80, high: 200 }, display: { price: 300, old: 215, low: 200, high: 500 }, tripack: { price: 30, old: 17.99, low: 20, high: 50 }, bundle: { price: 60, old: 35, low: 40, high: 90 }, booster: { price: 10, old: 6.99, low: 7, high: 20 } }),
    ...serie('EB02', 'Clash des Rebelles', 'EB', { etb: { price: 130, old: 54.99, low: 80, high: 220 }, display: { price: 280, old: 215, low: 180, high: 450 }, tripack: { price: 28, old: 17.99, low: 18, high: 45 }, bundle: { price: 55, old: 35, low: 35, high: 85 }, booster: { price: 9, old: 6.99, low: 6, high: 18 } }),
    ...serie('EB03', 'Ténèbres Embrasées', 'EB', { etb: { price: 200, old: 54.99, low: 120, high: 350 }, display: { price: 450, old: 215, low: 300, high: 700 }, tripack: { price: 35, old: 17.99, low: 25, high: 60 }, bundle: { price: 70, old: 35, low: 50, high: 110 }, booster: { price: 12, old: 6.99, low: 8, high: 25 } }),
    ...serie('EB03.5', 'La Voie du Maître', 'EB', { etb: { price: 250, old: 54.99, low: 150, high: 400 }, display: { price: 500, old: 215, low: 350, high: 800 }, tripack: { price: 40, old: 17.99, low: 30, high: 70 }, bundle: { price: 80, old: 35, low: 55, high: 130 }, booster: { price: 15, old: 6.99, low: 10, high: 30 } }),
    ...serie('EB04', 'Voltage Éclatant', 'EB', { etb: { price: 160, old: 54.99, low: 100, high: 280 }, display: { price: 380, old: 215, low: 250, high: 600 }, tripack: { price: 30, old: 17.99, low: 20, high: 55 }, bundle: { price: 65, old: 35, low: 40, high: 100 }, booster: { price: 11, old: 6.99, low: 7, high: 22 } }),
    ...serie('EB04.5', 'Destinées Radieuses', 'EB', { etb: { price: 280, old: 54.99, low: 180, high: 450 }, display: { price: 600, old: 215, low: 400, high: 900 }, tripack: { price: 45, old: 17.99, low: 30, high: 75 }, bundle: { price: 90, old: 35, low: 60, high: 140 }, booster: { price: 18, old: 6.99, low: 12, high: 35 } }),
    ...serie('EB05', 'Styles de Combat', 'EB', { etb: { price: 100, old: 54.99, low: 65, high: 180 }, display: { price: 250, old: 215, low: 160, high: 400 }, tripack: { price: 25, old: 17.99, low: 16, high: 40 }, bundle: { price: 50, old: 35, low: 30, high: 75 }, booster: { price: 8, old: 6.99, low: 5, high: 15 } }),
    ...serie('EB06', 'Règne de Glace', 'EB', { etb: { price: 110, old: 54.99, low: 70, high: 200 }, display: { price: 270, old: 215, low: 170, high: 420 }, tripack: { price: 26, old: 17.99, low: 17, high: 42 }, bundle: { price: 52, old: 35, low: 32, high: 80 }, booster: { price: 9, old: 6.99, low: 6, high: 16 } }),
    ...serie('EB07', 'Évolution Céleste', 'EB', { etb: { price: 400, old: 54.99, low: 300, high: 600 }, display: { price: 700, old: 215, low: 500, high: 1000 }, tripack: { price: 50, old: 17.99, low: 35, high: 80 }, bundle: { price: 100, old: 35, low: 70, high: 150 }, booster: { price: 20, old: 6.99, low: 15, high: 35 } }),
    ...serie('EB08', 'Poing de Fusion', 'EB', { etb: { price: 150, old: 54.99, low: 90, high: 250 }, display: { price: 350, old: 215, low: 220, high: 550 }, tripack: { price: 30, old: 17.99, low: 20, high: 50 }, bundle: { price: 60, old: 35, low: 40, high: 95 }, booster: { price: 10, old: 6.99, low: 7, high: 20 } }),
    ...serie('EB09', 'Stars Étincelantes', 'EB', { etb: { price: 180, old: 54.99, low: 120, high: 300 }, display: { price: 400, old: 215, low: 280, high: 650 }, tripack: { price: 35, old: 17.99, low: 22, high: 55 }, bundle: { price: 70, old: 35, low: 45, high: 110 }, booster: { price: 12, old: 6.99, low: 8, high: 22 } }),
    ...serie('EB10', 'Astres Radieux', 'EB', { etb: { price: 130, old: 54.99, low: 80, high: 220 }, display: { price: 320, old: 215, low: 200, high: 500 }, tripack: { price: 28, old: 17.99, low: 18, high: 45 }, bundle: { price: 55, old: 35, low: 35, high: 85 }, booster: { price: 9, old: 6.99, low: 6, high: 18 } }),
    ...serie('EB10.5', 'Pokémon GO', 'EB', { etb: { price: 140, old: 54.99, low: 90, high: 250 }, display: { price: 350, old: 215, low: 230, high: 550 }, tripack: { price: 30, old: 17.99, low: 20, high: 50 }, bundle: { price: 60, old: 35, low: 40, high: 95 }, booster: { price: 11, old: 6.99, low: 7, high: 22 } }),
    // Coffrets spéciaux
    { name: 'UPC Pokémon 151', ext: 'EV3.5 — Pokémon 151', serie: 'Écarlate et Violet', type: 'coffret', price: 500, old: 119.99, trend: 0, low: 400, high: 700 },
    { name: 'UPC Évolutions Prismatiques', ext: 'EV8.5 — Évolutions Prismatiques', serie: 'Écarlate et Violet', type: 'coffret', price: 350, old: 119.99, trend: 0, low: 280, high: 450 },
    { name: 'UPC Dracaufeu', ext: 'Special — Dracaufeu', serie: 'Écarlate et Violet', type: 'coffret', price: 400, old: 119.99, trend: 0, low: 300, high: 600 },
];

// ── Helpers ──────────────────────────────────────────────────

function fmt(price) {
    // Defensif : undefined/null/NaN -> '—' au lieu de crasher tout le render()
    if (price == null || Number.isNaN(Number(price))) return '—';
    if (price >= 1000) return price.toLocaleString('fr-FR') + ' €';
    return price.toLocaleString('fr-FR', { minimumFractionDigits: price % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
}

function trendClass(t) {
    return t > 5 ? 'trend-up' : t < -5 ? 'trend-down' : 'trend-flat';
}

function trendLabel(t) {
    const sign = t > 0 ? '+' : '';
    const arrow = t > 5 ? '↑' : t < -5 ? '↓' : '→';
    return `${arrow} ${sign}${t} %`;
}

const TYPE_LABELS = { etb: 'ETB', display: 'DISPLAY 36', display18: 'DISPLAY 18', tripack: 'TRIPACK', bundle: 'BUNDLE', booster: 'BOOSTER', dispbundle: 'DISPLAY BUNDLE', coffret: 'COFFRET' };

// Blocs & Séries — structure pour l'accordéon sidebar
const BLOCS_SERIES = [
    { bloc: 'Écarlate et Violet', series: [
        'Écarlate et Violet', 'Évolutions à Paldea', 'Flammes Obsidiennes', 'Pokémon 151',
        'Faille Paradoxe', 'Destinées de Paldea', 'Forces Temporelles', 'Mascarade Crépusculaire',
        'Fable Nébuleuse', 'Couronne Stellaire', 'Étincelles Déferlantes', 'Évolutions Prismatiques',
        'Aventures Ensemble', 'Rivalités Destinées', 'Foudre Noire (EV10.5)', 'Flamme Blanche (EV10.5)',
    ]},
    { bloc: 'Méga-Évolution', series: [
        'Méga-Évolution', 'Flammes Fantasmagoriques', 'Héros Transcendants', 'Équilibre Parfait',
    ]},
    { bloc: 'Épée et Bouclier', series: [
        'Épée et Bouclier', 'Clash des Rebelles', 'Ténèbres Embrasées', 'La Voie du Maître',
        'Voltage Éclatant', 'Destinées Radieuses', 'Styles de Combat', 'Règne de Glace',
        'Évolution Céleste', 'Poing de Fusion', 'Stars Étincelantes', 'Astres Radieux',
        'Pokémon GO', 'Origine Perdue', 'Tempête Argentée', 'Zénith Suprême',
    ]},
    { bloc: 'Soleil et Lune', series: [
        'Soleil et Lune', 'Gardiens Ascendants', 'Ombres Ardentes', 'Invasion Carmin',
        'Ultra-Prisme', 'Lumière Interdite', 'Tempête Céleste', 'Tonnerre Perdu',
        'Team Up', 'Alliance Infaillible', 'Harmonie des Esprits', 'Éclipse Cosmique',
        'Soleil et Lune 12',
    ]},
    { bloc: 'XY', series: [
        'XY', 'Étincelles', 'Poings Furieux', 'Phantôme Forces',
        'Primo Choc', 'Roaring Skies', 'Origines Antiques', 'Impulsion Turbo',
        'Rupture Turbo', 'Offensive Vapeur', 'Évolutions',
    ]},
    { bloc: 'Noir et Blanc', series: [
        'Noir et Blanc', 'Pouvoirs Émergents', 'Nobles Victoires', 'Destinées Futures',
        'Explorateurs Obscurs', 'Dragons Exaltés', 'Frontières Franchies',
        'Tempête Plasma', 'Glaciation Plasma', 'Explosion Plasma', 'Legendary Treasures',
    ]},
    { bloc: 'HeartGold SoulSilver', series: [
        'HeartGold SoulSilver', 'Déchainement', 'Indomptable', 'Triomphe', 'Appel des Légendes',
    ]},
    { bloc: 'Platine', series: [
        'Platine', 'Rivaux Émergeants', 'Vainqueurs Suprêmes', 'Arceus',
    ]},
    { bloc: 'Diamant et Perle', series: [
        'Diamant et Perle', 'Trésors Mystérieux', 'Merveilles Secrètes',
        'Aube Majestueuse', 'Éveil des Légendes', 'Tempête',
    ]},
    { bloc: 'EX', series: [
        'Rubis & Saphir', 'Tempête de Sable', 'Dragon', 'Magma VS Aqua',
        'Rouge Feu & Vert Feuille', 'Deoxys', 'Émeraude', 'Forces Cachées',
        'Espèces Delta', 'Légendes Oubliées', 'Créateurs de Légendes', 'Gardiens de Cristal',
        'Île des Dragons', 'Gardiens du Pouvoir',
    ]},
    { bloc: 'Wizards', series: [
        'Set de Base', 'Jungle', 'Fossile', 'Team Rocket',
        'Gym Heroes', 'Gym Challenge', 'Neo Genesis', 'Neo Discovery',
        'Neo Revelation', 'Neo Destiny', 'Expedition', 'Aquapolis', 'Skyridge',
    ]},
];

const SERIES_ICONS = {
    'Écarlate et Violet': { icon: '🔴', color: '#e74c3c' },
    'Méga-Évolution': { icon: '🧬', color: '#9b59b6' },
    'Épée et Bouclier': { icon: '⚔️', color: '#3498db' },
    'Soleil et Lune': { icon: '☀️', color: '#f39c12' },
    'XY': { icon: '✖️', color: '#2ecc71' },
    'Noir et Blanc': { icon: '⚫', color: '#7f8c8d' },
    'HeartGold SoulSilver': { icon: '💛', color: '#f1c40f' },
    'Platine': { icon: '💎', color: '#bdc3c7' },
    'Diamant et Perle': { icon: '💠', color: '#1abc9c' },
    'EX': { icon: '⭐', color: '#e67e22' },
    'Wizards': { icon: '🧙', color: '#8e44ad' },
};

let activeBlocs = new Set(['Écarlate et Violet', 'Méga-Évolution', 'Épée et Bouclier']); // blocs cochés par défaut
let openBloc = null; // bloc déplié (accordéon)
let activeSerie = null;

function renderBlocsAccordion() {
    const container = document.getElementById('blocsAccordion');
    container.innerHTML = BLOCS_SERIES.map(b => {
        const isChecked = activeBlocs.has(b.bloc);
        const isOpen = openBloc === b.bloc;
        const hasProducts = products.some(p => p.serie === b.bloc);
        return `<div class="bloc-item ${isOpen ? 'open' : ''}">
            <div class="bloc-header" onclick="toggleOpenBloc('${b.bloc.replace(/'/g, "\\'")}')">
                <label class="bloc-check" onclick="event.stopPropagation()">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleBlocFilter('${b.bloc.replace(/'/g, "\\'")}', this.checked)">
                    <span class="bloc-icon" style="color:${(SERIES_ICONS[b.bloc]||{}).color||'var(--text-muted)'}">${(SERIES_ICONS[b.bloc]||{}).icon||'📦'}</span>
                    <span class="${hasProducts ? '' : 'bloc-empty'}">${b.bloc}</span>
                </label>
                <span class="bloc-chevron">${isOpen ? '▾' : '›'}</span>
            </div>
            ${isOpen ? `<div class="bloc-series">
                ${b.series.map(s => {
                    const isActive = activeSerie === s;
                    const count = products.filter(p => p.ext?.includes(s)).length;
                    return `<div class="serie-link ${isActive ? 'active' : ''} ${count === 0 ? 'serie-empty' : ''}"
                        onclick="filterBySerie('${s.replace(/'/g, "\\'")}', '${b.bloc.replace(/'/g, "\\'")}')">${s}${count > 0 ? ` <span class="serie-count">${count}</span>` : ''}</div>`;
                }).join('')}
            </div>` : ''}
        </div>`;
    }).join('');
}

function toggleOpenBloc(bloc) {
    openBloc = openBloc === bloc ? null : bloc;
    renderBlocsAccordion();
}

function toggleBlocFilter(bloc, checked) {
    if (checked) {
        activeBlocs.add(bloc);
    } else {
        activeBlocs.delete(bloc);
    }
    activeSerie = null;
    render();
}

function filterBySerie(serie, bloc) {
    if (activeSerie === serie) {
        activeSerie = null;
    } else {
        activeSerie = serie;
    }
    renderBlocsAccordion();
    render();
}

// ── Mobile sidebar toggle ──────────────────────────────────

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}

// ── eBay Map ────────────────────────────────────────────────

function getEbayId(productName) {
    for (const [id, name] of Object.entries(EBAY_PRODUCT_MAP)) {
        if (name === productName) return id;
    }
    return null;
}

function buildEbayMap() {
    const series = [
        ['ev01', 'Écarlate et Violet'], ['ev02', 'Évolutions à Paldea'], ['ev03', 'Flammes Obsidiennes'],
        ['ev35', 'Pokémon 151'], ['ev04', 'Faille Paradoxe'], ['ev45', 'Destinées de Paldea'],
        ['ev05', 'Forces Temporelles'], ['ev06', 'Mascarade Crépusculaire'], ['ev65', 'Fable Nébuleuse'],
        ['ev07', 'Couronne Stellaire'], ['ev08', 'Étincelles Déferlantes'], ['ev85', 'Évolutions Prismatiques'],
        ['ev09', 'Aventures Ensemble'], ['ev10', 'Rivalités Destinées'], ['ev10.5fn', 'Foudre Noire (EV10.5)'],
        ['ev10.5fb', 'Flamme Blanche (EV10.5)'], ['me01', 'Méga-Évolution'], ['me02', 'Flammes Fantasmagoriques'],
        ['me2.5', 'Héros Transcendants'], ['me03', 'Équilibre Parfait'],
        ['swsh11', 'Origine Perdue'], ['swsh12', 'Tempête Argentée'], ['swsh12.5', 'Zénith Suprême'],
        ['swsh01', 'Épée et Bouclier'], ['swsh02', 'Clash des Rebelles'], ['swsh03', 'Ténèbres Embrasées'],
        ['swsh03.5', 'La Voie du Maître'], ['swsh04', 'Voltage Éclatant'], ['swsh04.5', 'Destinées Radieuses'],
        ['swsh05', 'Styles de Combat'], ['swsh06', 'Règne de Glace'], ['swsh07', 'Évolution Céleste'],
        ['swsh08', 'Poing de Fusion'], ['swsh09', 'Stars Étincelantes'], ['swsh10', 'Astres Radieux'],
        ['swsh10.5', 'Pokémon GO'],
    ];
    const types = [['etb', 'ETB'], ['display', 'Display 36'], ['display18', 'Display 18'], ['tripack', 'Tripack'], ['bundle', 'Bundle 6'], ['booster', 'Booster']];
    const map = {};
    for (const [sid, sname] of series) {
        for (const [tid, tprefix] of types) {
            map[`${sid}-${tid}`] = `${tprefix} ${sname}`;
        }
    }
    // Produits spéciaux
    map['ev35-dispbundle'] = 'Display Bundle Pokémon 151';
    map['ev85-dispbundle'] = 'Display Bundle Évolutions Prismatiques';
    map['me2.5-dispbundle'] = 'Display Bundle Héros Transcendants';
    map['upc-151'] = 'UPC Pokémon 151';
    map['upc-ev85'] = 'UPC Évolutions Prismatiques';
    map['upc-dracaufeu'] = 'UPC Dracaufeu';
    return map;
}

const EBAY_PRODUCT_MAP = buildEbayMap();

// ── Render Cards ────────────────────────────────────────────

function renderCard(p, i) {
    const ebayId = getEbayId(p.name);
    const editBtn = ebayId ? `<button class="btn-ebay-edit" onclick="event.stopPropagation();openQueryEditor('${ebayId}','${p.name.replace(/'/g, "\\'")}')" title="Modifier la source">⚙</button>` : '';

    const favs = getFavorites();
    const isFav = favs.includes(p.name);
    const favBtn = `<button class="product-fav-btn ${isFav ? 'fav-active' : ''}" data-name="${p.name.replace(/"/g, '&quot;')}" onclick="toggleFavorite('${p.name.replace(/'/g, "\\'")}', event)" title="Favoris">${isFav ? '★' : '☆'}</button>`;
    const cmpBtn = `<button class="product-cmp-btn" onclick="toggleCompare('${p.name.replace(/'/g, "\\'")}', event)" title="Comparer">⚖</button>`;
    const wl = getWishlist();
    const isWish = wl.includes(p.name);
    const wishBtn = `<button class="product-wish-btn ${isWish ? 'wish-active' : ''}" onclick="toggleWishlist('${p.name.replace(/'/g, "\\'")}', event)" title="Wishlist">${isWish ? '🛒' : '🛒'}</button>`;

    const imgSrc = p.lastListing?.image;
    const imgHtml = imgSrc
        ? `<img src="${imgSrc}" alt="${p.name}" loading="lazy">`
        : `<div class="product-img-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
           </div>`;

    // Trend badge
    const trendVal = p.trend || 0;
    let badgeHtml = '';
    if (trendVal > 5) badgeHtml = `<span class="product-trend-badge badge-up">+${trendVal}%</span>`;
    else if (trendVal < -5) badgeHtml = `<span class="product-trend-badge badge-down">${trendVal}%</span>`;
    else if (p._ebayLoaded) badgeHtml = `<span class="product-trend-badge badge-stable">→ 0%</span>`;

    // Skeleton state while eBay prices load
    const isLoading = !p._ebayLoaded;
    const priceClass = isLoading ? 'product-price-value skeleton' : 'product-price-value';
    const subClass = isLoading ? 'product-price-sub skeleton' : 'product-price-sub';

    return `<article class="product" data-product-name="${p.name.replace(/"/g, '&quot;')}" style="--i:${i}" onclick="openDetail('${p.name.replace(/'/g, "\\'")}')">
    <div class="product-img">
        ${imgHtml}
        ${editBtn}
        ${badgeHtml}
        ${favBtn}
        ${cmpBtn}
        ${wishBtn}
    </div>
    <div class="product-info">
        <div class="product-name-row">
            <span class="product-name">${p.name}</span>
            <span class="product-type type-${p.type}">${TYPE_LABELS[p.type] || p.type}</span>
        </div>
        <div class="product-prices">
            <div class="product-price-col">
                <span class="product-price-label">Dernier prix</span>
                <span class="${priceClass}">${fmt(p.lastPrice || p.lastListing?.price || p.price)}</span>
            </div>
            <div class="product-price-col" style="text-align:right">
                <span class="product-price-label">résultats</span>
                <span class="${subClass}">${p.sampleSize || '—'}</span>
            </div>
        </div>
        ${(p.lastListing?.url || p.searchUrl) ? `<a class="btn-buy-ebay" href="${p.lastListing?.url || p.searchUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Acheter sur eBay
        </a>` : ''}
    </div>
</article>`;
}

function updateCard(productName) {
    const card = document.querySelector(`[data-product-name="${CSS.escape(productName)}"]`);
    if (!card) return;
    const p = products.find(pr => pr.name === productName);
    if (!p) return;

    const priceEl = card.querySelector('.product-price-value');
    const subEl = card.querySelector('.product-price-sub');

    if (priceEl) {
        priceEl.classList.remove('skeleton');
        priceEl.textContent = fmt(p.lastPrice || p.lastListing?.price || p.price);
        priceEl.classList.add('price-updated');
        setTimeout(() => priceEl.classList.remove('price-updated'), 1200);
    }
    if (subEl) {
        subEl.classList.remove('skeleton');
        subEl.textContent = p.sampleSize || '—';
    }

    // Update trend badge
    const imgArea = card.querySelector('.product-img');
    const oldBadge = imgArea.querySelector('.product-trend-badge');
    if (oldBadge) oldBadge.remove();
    const trendVal = p.trend || 0;
    if (trendVal > 5) {
        imgArea.insertAdjacentHTML('beforeend', `<span class="product-trend-badge badge-up">+${trendVal}%</span>`);
    } else if (trendVal < -5) {
        imgArea.insertAdjacentHTML('beforeend', `<span class="product-trend-badge badge-down">${trendVal}%</span>`);
    } else {
        imgArea.insertAdjacentHTML('beforeend', `<span class="product-trend-badge badge-stable">→ 0%</span>`);
    }

    // Update buy button
    const infoArea = card.querySelector('.product-info');
    if (!infoArea.querySelector('.btn-buy-ebay') && (p.lastListing?.url || p.searchUrl)) {
        infoArea.insertAdjacentHTML('beforeend', `<a class="btn-buy-ebay" href="${p.lastListing?.url || p.searchUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Acheter sur eBay
        </a>`);
    }

    // Update image if available
    if (p.lastListing?.image) {
        const existingImg = imgArea.querySelector('img');
        if (!existingImg) {
            const placeholder = imgArea.querySelector('.product-img-placeholder');
            if (placeholder) {
                const img = document.createElement('img');
                img.src = p.lastListing.image;
                img.alt = p.name;
                img.loading = 'lazy';
                placeholder.replaceWith(img);
            }
        }
    }
}

// ── Product Detail Modal ────────────────────────────────────

function openDetail(productName) {
    const p = products.find(pr => pr.name === productName);
    if (!p) return;

    const existing = document.getElementById('detailOverlay');
    if (existing) existing.remove();

    const ebayId = getEbayId(p.name);
    const tClass = trendClass(p.trend);
    const tText = trendLabel(p.trend);

    const div = document.createElement('div');
    div.id = 'detailOverlay';
    div.className = 'detail-overlay open';
    div.innerHTML = `
        <div class="detail-modal">
            <div class="detail-banner">
                <button class="detail-banner-close" onclick="document.getElementById('detailOverlay').remove()">&times;</button>
            </div>
            <div class="detail-body">
                <div class="detail-sidebar">
                    <h2 class="detail-product-name">${p.name}</h2>
                    <p class="detail-product-ext">${p.ext} — ${p.serie}</p>
                    <div class="detail-nav">
                        <button class="detail-nav-link active">📊 Aperçu Global</button>
                        ${p.lastListing?.url ? `<a class="detail-nav-link" href="${p.lastListing.url}" target="_blank" rel="noopener">🔗 Voir sur eBay</a>` : ''}
                        ${p.searchUrl ? `<a class="detail-nav-link" href="${p.searchUrl}" target="_blank" rel="noopener">🛒 Rechercher sur eBay</a>` : ''}
                        ${ebayId ? `<button class="detail-nav-link" onclick="document.getElementById('detailOverlay').remove();openQueryEditor('${ebayId}','${p.name.replace(/'/g, "\\'")}')">⚙ Modifier la source</button>` : ''}
                        <button class="detail-nav-link" onclick="saveNote('${p.name.replace(/'/g, "\\'")}')">📝 ${getNotes()[p.name] ? 'Modifier la note' : 'Ajouter une note'}</button>
                        <button class="detail-nav-link" onclick="setAlert('${p.name.replace(/'/g, "\\'")}')">🔔 Alerte de prix</button>
                    </div>
                    ${getNotes()[p.name] ? `<div class="detail-note"><strong>📝 Note :</strong> ${getNotes()[p.name]}</div>` : ''}
                    ${p.lastListing ? `
                    <div style="border-top:1px solid var(--border);padding-top:12px">
                        <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:8px">Dernier article trouvé</div>
                        <div class="sale-row" style="border:none;padding:0">
                            ${p.lastListing.image ? `<img class="sale-img" src="${p.lastListing.image}" alt="">` : ''}
                            <div class="sale-info">
                                <div class="sale-title">${p.lastListing.title || ''}</div>
                            </div>
                            <span class="sale-price">${fmt(p.lastListing.price)}</span>
                        </div>
                    </div>` : ''}
                </div>
                <div class="detail-main">
                    <h3 class="detail-section-title">Indicateurs de performances</h3>
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-label">Prix médian</div>
                            <div class="kpi-value">${fmt(p.price)}</div>
                            <div class="kpi-sub">${p.sampleSize || 0} résultats</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Dernier prix</div>
                            <div class="kpi-value" style="color:#58a6ff">${fmt(p.lastPrice || p.lastListing?.price)}</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Prix minimum</div>
                            <div class="kpi-value">${fmt(p.low)}</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Prix maximum</div>
                            <div class="kpi-value">${fmt(p.high)}</div>
                        </div>
                    </div>
                    <div class="detail-chart-section">
                        <div class="detail-chart-head">
                            <h4>Évolution des prix</h4>
                            <div class="chart-period-bar" id="chartPeriodBar">
                                <button class="chart-period-btn" data-period="1" onclick="setChartPeriod(1)">24h</button>
                                <button class="chart-period-btn" data-period="7" onclick="setChartPeriod(7)">7j</button>
                                <button class="chart-period-btn active" data-period="30" onclick="setChartPeriod(30)">30j</button>
                                <button class="chart-period-btn" data-period="90" onclick="setChartPeriod(90)">90j</button>
                                <button class="chart-period-btn" data-period="0" onclick="setChartPeriod(0)">Tout</button>
                            </div>
                        </div>
                        <div class="detail-chart-card">
                            <canvas id="priceChart" height="200"></canvas>
                            <p id="priceChartEmpty" style="color:var(--text-muted);font-size:13px;text-align:center;display:none;margin:20px 0">
                                Les données s'accumulent jour après jour. Revenez demain pour voir l'évolution !
                            </p>
                            <div class="chart-period-stats" id="chartPeriodStats"></div>
                        </div>
                    </div>
                    <div class="detail-sales">
                        <h4 style="font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:12px">Détails</h4>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px">
                            <div>
                                <span style="color:var(--text-muted)">Type :</span>
                                <span class="product-type type-${p.type}" style="margin-left:6px">${TYPE_LABELS[p.type]}</span>
                            </div>
                            <div>
                                <span style="color:var(--text-muted)">Série :</span>
                                <span style="color:var(--text-secondary);margin-left:6px">${p.serie}</span>
                            </div>
                            <div>
                                <span style="color:var(--text-muted)">Extension :</span>
                                <span style="color:var(--text-secondary);margin-left:6px">${p.ext}</span>
                            </div>
                            <div>
                                <span style="color:var(--text-muted)">Ancien prix :</span>
                                <span style="color:var(--text-secondary);margin-left:6px">${fmt(p.old)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    div.addEventListener('click', e => { if (e.target === div) div.remove(); });
    document.body.appendChild(div);

    // Charger l'historique et dessiner le graphique
    if (ebayId) loadPriceChart(ebayId);
}

let priceChartInstance = null;
let _priceChartHistory = [];   // cache pour switching de periode sans refetch
let _priceChartPeriod = 30;     // periode courante en jours (0 = tout)

async function loadPriceChart(productId) {
    try {
        const res = await fetch(`/api/history/${productId}`);
        _priceChartHistory = await res.json();
        renderPriceChartForPeriod(_priceChartPeriod);
    } catch (e) {
        const emptyMsg = document.getElementById('priceChartEmpty');
        if (emptyMsg) {
            emptyMsg.style.display = 'block';
            emptyMsg.textContent = 'Erreur de chargement de l\'historique';
        }
    }
}

function setChartPeriod(days) {
    _priceChartPeriod = days;
    document.querySelectorAll('.chart-period-btn').forEach(b => {
        b.classList.toggle('active', String(b.dataset.period) === String(days));
    });
    renderPriceChartForPeriod(days);
}

function renderPriceChartForPeriod(days) {
    const canvas = document.getElementById('priceChart');
    const emptyMsg = document.getElementById('priceChartEmpty');
    const statsEl = document.getElementById('chartPeriodStats');
    if (!canvas) return;

    let history = [..._priceChartHistory];

    // Filtrage par periode (0 = tout)
    if (days > 0 && history.length > 0) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().slice(0, 10);
        history = history.filter(h => h.date >= cutoffStr);
        // Si 24h et qu'on n'a qu'une entree dans la fenetre, on ajoute la
        // derniere entree avant pour avoir au moins 2 points (sinon graphique vide)
        if (days === 1 && history.length < 2 && _priceChartHistory.length > 1) {
            const latest = _priceChartHistory[_priceChartHistory.length - 1];
            const previous = _priceChartHistory[_priceChartHistory.length - 2];
            history = [previous, latest];
        }
    }

    // Etat vide
    if (history.length < 1) {
        canvas.style.display = 'none';
        if (emptyMsg) {
            emptyMsg.style.display = 'block';
            emptyMsg.textContent = days === 1
                ? 'Pas encore de variation 24h disponible'
                : days > 0
                    ? `Pas encore de données sur les ${days} derniers jours`
                    : 'Les données s\'accumulent jour après jour. Revenez demain pour voir l\'évolution !';
        }
        if (statsEl) statsEl.innerHTML = '';
        if (priceChartInstance) { priceChartInstance.destroy(); priceChartInstance = null; }
        return;
    }

    canvas.style.display = '';
    if (emptyMsg) emptyMsg.style.display = 'none';

    // Stats sur la periode visible (variation, min, max)
    const first = history[0];
    const last = history[history.length - 1];
    const firstPrice = first.median || first.lastPrice || 0;
    const lastPrice = last.median || last.lastPrice || 0;
    const deltaEur = lastPrice - firstPrice;
    const deltaPct = firstPrice > 0 ? (deltaEur / firstPrice) * 100 : 0;
    const cls = deltaPct > 0.3 ? 'positive' : deltaPct < -0.3 ? 'negative' : 'flat';
    const sign = deltaPct >= 0 ? '+' : '';
    const minVal = Math.min(...history.map(h => h.median || h.lastPrice || Infinity).filter(v => isFinite(v)));
    const maxVal = Math.max(...history.map(h => h.median || h.lastPrice || 0));

    if (statsEl) {
        statsEl.innerHTML = `
            <div class="cps-row">
                <span class="cps-label">Variation</span>
                <span class="cps-val ${cls}">${sign}${deltaEur.toFixed(2)} € (${sign}${deltaPct.toFixed(2)} %)</span>
            </div>
            <div class="cps-row">
                <span class="cps-label">Min · Max</span>
                <span class="cps-val">${minVal.toFixed(2)} € · ${maxVal.toFixed(2)} €</span>
            </div>
            <div class="cps-row">
                <span class="cps-label">Points</span>
                <span class="cps-val">${history.length} jour${history.length > 1 ? 's' : ''}</span>
            </div>
        `;
    }

    if (priceChartInstance) priceChartInstance.destroy();

    const labels = history.map(h => {
        const d = new Date(h.date);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    });

    priceChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Prix médian',
                    data: history.map(h => h.median),
                    borderColor: '#2ea043',
                    backgroundColor: 'rgba(46,160,67,0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: history.length > 14 ? 0 : 4,
                    pointHoverRadius: 5,
                },
                {
                    label: 'Dernier prix',
                    data: history.map(h => h.lastPrice),
                    borderColor: '#58a6ff',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 3],
                    tension: 0.3,
                    pointRadius: history.length > 14 ? 0 : 4,
                    pointHoverRadius: 5,
                },
                {
                    label: 'Min',
                    data: history.map(h => h.low),
                    borderColor: 'rgba(255,255,255,0.15)',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    tension: 0.3,
                    pointRadius: 0,
                },
                {
                    label: 'Max',
                    data: history.map(h => h.high),
                    borderColor: 'rgba(255,255,255,0.15)',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    tension: 0.3,
                    pointRadius: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: {
                    labels: { color: '#8b949e', usePointStyle: true, pointStyle: 'line', padding: 16, font: { size: 12 } },
                },
                tooltip: {
                    backgroundColor: '#1a2030',
                    titleColor: '#e6edf3',
                    bodyColor: '#8b949e',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)} €`,
                    },
                },
            },
            scales: {
                x: {
                    ticks: { color: '#484f58', font: { size: 11 } },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                },
                y: {
                    ticks: { color: '#484f58', font: { size: 11 }, callback: v => v + ' €' },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                },
            },
        },
    });
}

// ── eBay Query Editor ───────────────────────────────────────

async function openQueryEditor(ebayId, productName) {
    try {
        const res = await fetch(`/api/query/${ebayId}`);
        const data = await res.json();

        const existing = document.getElementById('queryEditorModal');
        if (existing) existing.remove();

        const isUrl = data.mode === 'url';

        const div = document.createElement('div');
        div.id = 'queryEditorModal';
        div.className = 'modal-overlay open';
        div.innerHTML = `
            <div class="modal">
                <button class="modal-close" onclick="document.getElementById('queryEditorModal').remove()">&times;</button>
                <h3 style="margin-bottom:4px;font-size:14px;color:var(--text-primary)">Source de prix eBay</h3>
                <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">${productName}</p>

                <div class="modal-tabs" style="margin-bottom:14px">
                    <button class="modal-tab ${!isUrl ? 'active' : ''}" onclick="switchQueryMode('search')">Recherche</button>
                    <button class="modal-tab ${isUrl ? 'active' : ''}" onclick="switchQueryMode('url')">Lien direct</button>
                </div>

                <div id="queryModeSearch" style="display:${!isUrl ? 'block' : 'none'}">
                    <div class="auth-field">
                        <label>Requête par défaut</label>
                        <input type="text" value="${data.defaultQuery}" disabled style="opacity:0.5">
                    </div>
                    <div class="auth-field">
                        <label>Requête personnalisée (vide = défaut)</label>
                        <input type="text" id="customQueryInput" value="${data.customQuery || ''}" placeholder="${data.defaultQuery}">
                    </div>
                </div>

                <div id="queryModeUrl" style="display:${isUrl ? 'block' : 'none'}">
                    <div class="auth-field">
                        <label>Lien eBay de l'article à suivre</label>
                        <input type="url" id="customUrlInput" value="${data.customUrl || ''}" placeholder="https://www.ebay.fr/itm/123… ou lien de recherche">
                    </div>
                    <p style="font-size:11px;color:var(--text-muted);margin-bottom:10px">Lien d'un article (/itm/) ou d'une recherche eBay.</p>
                </div>

                <div class="auth-error" id="queryError"></div>
                <div style="display:flex;gap:8px">
                    <button class="btn-submit" style="flex:1" onclick="saveQuery('${ebayId}',false)">Enregistrer</button>
                    <button class="btn-submit" style="flex:0 0 auto;background:#1f6feb" onclick="saveQuery('${ebayId}',true)">Enregistrer & actualiser</button>
                </div>
            </div>
        `;
        div.addEventListener('click', e => { if (e.target === div) div.remove(); });
        document.body.appendChild(div);
    } catch {
        alert('Erreur de chargement');
    }
}

let _queryMode = 'search';

function switchQueryMode(mode) {
    _queryMode = mode;
    document.getElementById('queryModeSearch').style.display = mode === 'search' ? 'block' : 'none';
    document.getElementById('queryModeUrl').style.display = mode === 'url' ? 'block' : 'none';
    document.querySelectorAll('#queryEditorModal .modal-tab').forEach((tab, i) => {
        tab.classList.toggle('active', (i === 0 && mode === 'search') || (i === 1 && mode === 'url'));
    });
}

async function saveQuery(ebayId, refresh = false) {
    const queryInput = document.getElementById('customQueryInput');
    const urlInput = document.getElementById('customUrlInput');
    const errorEl = document.getElementById('queryError');
    errorEl.textContent = '';

    const searchVisible = document.getElementById('queryModeSearch').style.display !== 'none';
    const body = {};

    if (!searchVisible && urlInput.value.trim()) {
        body.url = urlInput.value.trim();
    } else if (searchVisible && queryInput.value.trim()) {
        body.query = queryInput.value.trim();
    }

    try {
        const res = await fetch(`/api/query/${ebayId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const result = await res.json();
        if (!res.ok) {
            errorEl.textContent = result.error || 'Erreur';
            return;
        }

        if (refresh) {
            errorEl.style.color = 'var(--green-light)';
            errorEl.textContent = 'Actualisation en cours…';
            // Force le bypass du cache serveur via /api/refresh
            const priceRes = await fetch(`/api/refresh/${ebayId}`, { method: 'POST' });
            const priceData = await priceRes.json();
            if (priceData.price) {
                applyEbayPrice(priceData);
                // Met à jour le cache client pour éviter de revoir l'ancienne valeur
                try {
                    const cache = loadClientPriceCache();
                    cache[ebayId] = { cachedAt: Date.now(), data: priceData };
                    saveClientPriceCache(cache);
                } catch {}
                render();
                renderTrends();
            }
        }

        document.getElementById('queryEditorModal').remove();
    } catch {
        errorEl.textContent = 'Erreur de connexion';
    }
}

// ── Section Switching ────────────────────────────────────────

let currentSection = 'catalogue';

function switchSection(section, e) {
    if (e) e.preventDefault();

    if (section === 'portfolio' && !currentUser) {
        openAuthModal('login');
        return;
    }
    if (section === 'admin' && !isAdminUser()) {
        // Garde-fou cote client (le serveur refuse aussi 403)
        showToast?.('🔒', 'Accès refusé', 'Section réservée à l\'administrateur');
        return;
    }
    if (section === 'transactions' && !currentUser) {
        openAuthModal('login');
        return;
    }

    currentSection = section;

    // Fermer sidebar sur mobile
    if (window.innerWidth <= 640) {
        document.querySelector('.sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('open');
    }

    // Update nav (sidebar + bottom nav synchronises)
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === section);
    });
    document.querySelectorAll('.bottom-nav-item').forEach(link => {
        link.classList.toggle('active', link.dataset && link.dataset.section === section);
    });

    // Show/hide sections
    document.getElementById('sectionDashboard').style.display = section === 'dashboard' ? 'block' : 'none';
    document.getElementById('sectionCatalogue').style.display = section === 'catalogue' ? 'block' : 'none';
    document.getElementById('sectionPortfolio').style.display = section === 'portfolio' ? 'block' : 'none';
    document.getElementById('sectionTendances').style.display = section === 'tendances' ? 'block' : 'none';
    document.getElementById('sectionSimulation').style.display = section === 'simulation' ? 'block' : 'none';
    const adminSec = document.getElementById('sectionAdmin');
    if (adminSec) adminSec.style.display = section === 'admin' ? 'block' : 'none';
    const txSec = document.getElementById('sectionTransactions');
    if (txSec) txSec.style.display = section === 'transactions' ? 'block' : 'none';
    const moversSec = document.getElementById('sectionMovers');
    if (moversSec) moversSec.style.display = section === 'movers' ? 'block' : 'none';

    // Show/hide sidebar filters
    document.getElementById('sidebarFilters').style.display = section === 'catalogue' ? 'block' : 'none';

    if (section === 'dashboard') renderDashboard();
    if (section === 'portfolio') renderPortfolio();
    if (section === 'tendances') renderTrends();
    if (section === 'simulation') renderSimulation();
    if (section === 'admin') loadAdminPage();
    if (section === 'transactions') loadTransactionsPage();
    if (section === 'movers') loadMoversPage();
}

// Helper : verifie si l'utilisateur connecte est l'admin (par defaut 'dorian').
// Liste alignee avec server.js (ADMIN_USERNAME, default 'dorian').
function isAdminUser() {
    return !!currentUser && currentUser.toLowerCase() === 'dorian';
}

// Met a jour la visibilite du lien Admin dans la sidebar selon le user connecte
function updateAdminLinkVisibility() {
    const link = document.getElementById('sidebarLinkAdmin');
    if (link) {
        link.style.display = isAdminUser() ? 'flex' : 'none';
    }
    // Lien Transactions visible des qu'on est connecte (gate identique au portfolio)
    const txLink = document.getElementById('sidebarLinkTx');
    if (txLink) {
        txLink.style.display = currentUser ? 'flex' : 'none';
    }
    // Si on quitte le compte admin alors qu'on est sur la section admin, on rebascule
    if (currentSection === 'admin' && !isAdminUser()) {
        switchSection('catalogue');
    }
    if (currentSection === 'transactions' && !currentUser) {
        switchSection('catalogue');
    }
}

// ── Filter / Sort ────────────────────────────────────────────

let activeType = '';

function setTypeFilter(type) {
    activeType = type;
    document.querySelectorAll('.chip').forEach(c => {
        c.classList.toggle('active', c.dataset.type === type || (!type && c.dataset.type === ''));
    });
    render();
}

// ── Recherche floue (Fuse.js) ────────────────────────────────
// Index construit une fois — les champs indexés (name/serie/ext) sont statiques
let _fuseProducts = null;
function getFuseProducts() {
    if (!_fuseProducts && typeof Fuse !== 'undefined') {
        _fuseProducts = new Fuse(products, {
            keys: [
                { name: 'name', weight: 0.7 },
                { name: 'ext', weight: 0.2 },
                { name: 'serie', weight: 0.1 },
            ],
            threshold: 0.35,         // 0 = strict, 1 = tout matche
            ignoreLocation: true,    // match n'importe où dans la chaine
            minMatchCharLength: 2,
            includeScore: true,
        });
    }
    return _fuseProducts;
}

function fuzzyMatchProducts(query) {
    const q = (query || '').trim();
    if (!q) return null; // pas de recherche
    const fuse = getFuseProducts();
    if (!fuse) {
        // Fallback includes() si Fuse pas encore chargé
        const qLower = q.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(qLower) ||
            (p.ext || '').toLowerCase().includes(qLower) ||
            (p.serie || '').toLowerCase().includes(qLower)
        );
    }
    return fuse.search(q).map(r => r.item);
}

function getFiltered() {
    const q = document.getElementById('searchInput').value;
    const prix = document.getElementById('filterPrix').value;
    const sort = document.getElementById('sortBy').value;

    // Si recherche active, on part de la liste ordonnée par pertinence Fuse
    const fuzzyList = fuzzyMatchProducts(q);
    const hasQuery = fuzzyList !== null;
    const base = hasQuery ? fuzzyList : products;

    let list = base.filter(p => {
        if (activeType && p.type !== activeType) return false;
        if (activeBlocs.size > 0 && !activeBlocs.has(p.serie)) return false;
        if (showFavOnly && !getFavorites().includes(p.name)) return false;
        if (activeSerie && !p.ext?.includes(activeSerie)) return false;
        if (prix) {
            const [lo, hi] = prix.split('-').map(Number);
            if (p.price < lo || p.price > hi) return false;
        }
        return true;
    });

    // Si recherche active, on garde l'ordre de pertinence Fuse
    // Sinon, on applique le tri demandé
    if (!hasQuery) {
        switch (sort) {
            case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
            case 'price-desc': list.sort((a, b) => b.price - a.price); break;
            case 'trend-desc': list.sort((a, b) => b.trend - a.trend); break;
            case 'trend-asc':  list.sort((a, b) => a.trend - b.trend); break;
            case 'serie':      list.sort((a, b) => {
                const codeA = a.ext.split(' — ')[0];
                const codeB = b.ext.split(' — ')[0];
                return codeA.localeCompare(codeB, 'fr', { numeric: true });
            }); break;
            default:           list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        }
    }

    return list;
}

function render() {
    const list = getFiltered();
    const sort = document.getElementById('sortBy').value;
    const grid = document.getElementById('productsGrid');

    if (viewMode === 'table') {
        grid.innerHTML = `
            ${renderWishlistSection()}
            <div class="table-wrap">
                <table class="products-table">
                    <thead><tr>
                        <th></th><th>Produit</th><th>Type</th><th>Prix</th><th>Tendance</th><th>Min</th><th>Max</th><th>Perf.</th><th>Résultats</th>
                    </tr></thead>
                    <tbody>${list.map(renderTableRow).join('')}</tbody>
                </table>
            </div>`;
    } else if (sort === 'serie') {
        // Grouper par série avec en-têtes
        const groups = [];
        let currentCode = null;
        for (const p of list) {
            const code = p.ext.split(' — ')[0];
            if (code !== currentCode) {
                currentCode = code;
                const serieName = p.ext.split(' — ')[1] || p.serie;
                groups.push({ code, name: serieName, items: [] });
            }
            groups[groups.length - 1].items.push(p);
        }
        grid.innerHTML = renderWishlistSection() + groups.map(g =>
            `<div class="serie-group">
                <div class="serie-header">
                    <span class="serie-code">${g.code}</span>
                    <span class="serie-name">${g.name}</span>
                    ${(() => { const bloc = products.find(p => p.ext.startsWith(g.code))?.serie; const si = SERIES_ICONS[bloc]; return si ? `<span class="series-group-icon" style="color:${si.color}">${si.icon}</span>` : ''; })()}
                </div>
                <div class="serie-items">${g.items.map(renderCard).join('')}</div>
            </div>`
        ).join('');
    } else {
        grid.innerHTML = renderWishlistSection() + `<div class="serie-items flat-grid">${list.map(renderCard).join('')}</div>`;
    }

    document.getElementById('resultsCount').textContent = list.length;

    // Active filter badge
    const badge = document.getElementById('activeFilterBadge');
    if (activeType) {
        badge.innerHTML = `<span class="active-badge">${TYPE_LABELS[activeType] || activeType}</span>`;
    } else {
        badge.innerHTML = '';
    }
}

// ── Tendances ────────────────────────────────────────────────

function computeGreedIndex(priced) {
    if (!priced.length) return 50;

    // Factor 1: Momentum (30%) — % de produits en hausse vs baisse
    const hausse = priced.filter(p => p.trend > 0).length;
    const baisse = priced.filter(p => p.trend < 0).length;
    const momentumScore = priced.length > 0 ? (hausse / priced.length) * 100 : 50;

    // Factor 2: Amplitude des tendances (25%) — moyenne des trends, clampée [-100, +100] → [0, 100]
    const avgTrend = priced.reduce((s, p) => s + p.trend, 0) / priced.length;
    const amplitudeScore = Math.min(100, Math.max(0, (avgTrend + 100) / 2));

    // Factor 3: Position dans le range (25%) — prix actuel vs low/high
    const withRange = priced.filter(p => p.low && p.high && p.high > p.low);
    let positionScore = 50;
    if (withRange.length > 0) {
        const avgPos = withRange.reduce((s, p) => s + (p.price - p.low) / (p.high - p.low), 0) / withRange.length;
        positionScore = avgPos * 100;
    }

    // Factor 4: Volatilité (20%) — spread moyen (high-low)/prix, plus c'est volatile plus c'est "greed"
    let volatilityScore = 50;
    if (withRange.length > 0) {
        const avgVol = withRange.reduce((s, p) => s + (p.high - p.low) / ((p.high + p.low) / 2), 0) / withRange.length;
        volatilityScore = Math.min(100, avgVol * 100);
    }

    const index = Math.round(
        momentumScore * 0.30 +
        amplitudeScore * 0.25 +
        positionScore * 0.25 +
        volatilityScore * 0.20
    );

    return Math.min(100, Math.max(0, index));
}

function getGreedLabel(value) {
    if (value <= 20) return { label: 'Peur extrême', emoji: '😱' };
    if (value <= 40) return { label: 'Peur', emoji: '😰' };
    if (value <= 55) return { label: 'Neutre', emoji: '😐' };
    if (value <= 75) return { label: 'Avidité', emoji: '🤑' };
    return { label: 'Avidité extrême', emoji: '🔥' };
}

function renderGreedIndex(priced) {
    const value = computeGreedIndex(priced);
    const { label, emoji } = getGreedLabel(value);

    // Angle: 0=left (fear), 180=right (greed). Value 0-100 maps to -90° to +90°
    const needleAngle = (value / 100) * 180 - 90;

    // Color based on value
    let gaugeColor;
    if (value <= 20) gaugeColor = '#ef4444';
    else if (value <= 40) gaugeColor = '#f97316';
    else if (value <= 55) gaugeColor = '#eab308';
    else if (value <= 75) gaugeColor = '#84cc16';
    else gaugeColor = '#22c55e';

    const wrap = document.getElementById('greedIndexWrap');
    wrap.innerHTML = `
        <div class="greed-index">
            <div class="greed-index-header">
                <h2 class="greed-index-title">Pokémon Sealed Index</h2>
                <span class="greed-index-subtitle">Indicateur de sentiment du marché scellé</span>
            </div>
            <div class="greed-index-gauge-container">
                <div class="greed-index-gauge">
                    <svg viewBox="0 0 200 120" class="greed-svg">
                        <!-- Arcs de fond -->
                        <path d="M 20 100 A 80 80 0 0 1 56 36" stroke="#ef4444" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.3"/>
                        <path d="M 56 36 A 80 80 0 0 1 100 20" stroke="#f97316" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.3"/>
                        <path d="M 100 20 A 80 80 0 0 1 144 36" stroke="#eab308" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.3"/>
                        <path d="M 144 36 A 80 80 0 0 1 180 100" stroke="#22c55e" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.3"/>

                        <!-- Aiguille -->
                        <g transform="rotate(${needleAngle}, 100, 100)">
                            <line x1="100" y1="100" x2="100" y2="30" stroke="${gaugeColor}" stroke-width="3" stroke-linecap="round"/>
                            <circle cx="100" cy="100" r="6" fill="${gaugeColor}"/>
                            <circle cx="100" cy="100" r="3" fill="var(--bg-card)"/>
                        </g>

                        <!-- Labels -->
                        <text x="15" y="115" fill="#ef4444" font-size="8" font-weight="600">Peur</text>
                        <text x="155" y="115" fill="#22c55e" font-size="8" font-weight="600">Avidité</text>
                    </svg>
                </div>
                <div class="greed-index-value-wrap">
                    <span class="greed-index-emoji">${emoji}</span>
                    <span class="greed-index-value" style="color: ${gaugeColor}">${value}</span>
                    <span class="greed-index-label" style="color: ${gaugeColor}">${label}</span>
                </div>
            </div>
            <div class="greed-index-factors">
                <div class="greed-factor">
                    <span class="greed-factor-label">Momentum</span>
                    <div class="greed-factor-bar"><div class="greed-factor-fill" style="width: ${(priced.filter(p => p.trend > 0).length / priced.length * 100).toFixed(0)}%; background: ${priced.filter(p => p.trend > 0).length / priced.length > 0.5 ? '#22c55e' : '#ef4444'}"></div></div>
                    <span class="greed-factor-val">${(priced.filter(p => p.trend > 0).length / priced.length * 100).toFixed(0)}%</span>
                </div>
                <div class="greed-factor">
                    <span class="greed-factor-label">Tendance moy.</span>
                    <div class="greed-factor-bar"><div class="greed-factor-fill" style="width: ${Math.min(100, Math.max(5, (priced.reduce((s,p) => s+p.trend, 0)/priced.length + 100)/2))}%; background: ${priced.reduce((s,p) => s+p.trend, 0)/priced.length > 0 ? '#22c55e' : '#ef4444'}"></div></div>
                    <span class="greed-factor-val">${priced.reduce((s,p) => s+p.trend, 0)/priced.length > 0 ? '+' : ''}${(priced.reduce((s,p) => s+p.trend, 0)/priced.length).toFixed(1)}%</span>
                </div>
                <div class="greed-factor">
                    <span class="greed-factor-label">Position prix</span>
                    <div class="greed-factor-bar"><div class="greed-factor-fill" style="width: ${(() => { const wr = priced.filter(p => p.low && p.high && p.high > p.low); return wr.length ? (wr.reduce((s,p) => s+(p.price-p.low)/(p.high-p.low), 0)/wr.length*100).toFixed(0) : 50; })()}%; background: #eab308"></div></div>
                    <span class="greed-factor-val">${(() => { const wr = priced.filter(p => p.low && p.high && p.high > p.low); return wr.length ? (wr.reduce((s,p) => s+(p.price-p.low)/(p.high-p.low), 0)/wr.length*100).toFixed(0) : 50; })()}%</span>
                </div>
                <div class="greed-factor">
                    <span class="greed-factor-label">Volatilité</span>
                    <div class="greed-factor-bar"><div class="greed-factor-fill" style="width: ${(() => { const wr = priced.filter(p => p.low && p.high && p.high > p.low); return wr.length ? Math.min(100, (wr.reduce((s,p) => s+(p.high-p.low)/((p.high+p.low)/2), 0)/wr.length*100)).toFixed(0) : 50; })()}%; background: #f97316"></div></div>
                    <span class="greed-factor-val">${(() => { const wr = priced.filter(p => p.low && p.high && p.high > p.low); return wr.length ? Math.min(100, (wr.reduce((s,p) => s+(p.high-p.low)/((p.high+p.low)/2), 0)/wr.length*100)).toFixed(0) : 50; })()}%</span>
                </div>
            </div>
        </div>
    `;
}

let trends7d = {};

async function loadTrends7d() {
    try {
        const res = await fetch('/api/trends-7d');
        trends7d = await res.json();
    } catch {
        trends7d = {};
    }
}

// Calcul du hype score pour une série (réutilisé par Hype Meter et Potentiel)
// 8 facteurs pondérés pour un score complet sur 100
function computeHypeScore(s) {
    const factors = {};

    // ── 1. Performance vs MSRP (15%) ──
    // Combien le prix a monté par rapport au prix de sortie officiel
    let perfSum = 0, perfCount = 0;
    for (const p of s.products) {
        const msrp = MSRP[p.type];
        if (msrp && msrp > 0) {
            perfSum += ((p.price - msrp) / msrp) * 100;
            perfCount++;
        }
    }
    const avgPerf = perfCount > 0 ? perfSum / perfCount : 0;
    factors.perf = { score: Math.min(100, Math.max(0, avgPerf / 2 + 50)), label: 'Performance MSRP', value: `${avgPerf >= 0 ? '+' : ''}${avgPerf.toFixed(0)}%` };

    // ── 2. Tendance 7 jours (15%) ──
    // Variation des prix sur la dernière semaine
    let trend7dSum = 0, trend7dCount = 0;
    for (const p of s.products) {
        const t7 = trends7d[p.name];
        if (t7) { trend7dSum += t7.change; trend7dCount++; }
    }
    const avgTrend7d = trend7dCount > 0 ? trend7dSum / trend7dCount : 0;
    factors.trend7d = { score: Math.min(100, Math.max(0, avgTrend7d * 2 + 50)), label: 'Tendance 7j', value: `${avgTrend7d >= 0 ? '+' : ''}${avgTrend7d.toFixed(1)}%` };

    // ── 3. Volume d'annonces (15%) ──
    // Nombre d'annonces en ligne = activité du marché
    const totalListings = s.products.reduce((sum, p) => sum + (p.sampleSize || 0), 0);
    const avgListings = totalListings / s.products.length;
    factors.listings = { score: Math.min(100, (avgListings / 10) * 100), label: 'Volume annonces', value: `${totalListings} total` };

    // ── 4. Valeur totale du set (10%) ──
    // Somme de tous les produits = demande globale
    const setTotal = s.products.reduce((sum, p) => sum + p.price, 0);
    factors.setValue = { score: Math.min(100, (setTotal / 20)), label: 'Valeur du set', value: fmt(setTotal) };

    // ── 5. Produits au-dessus du MSRP (15%) ──
    // % de produits dont le prix dépasse le prix de sortie = demande large
    let aboveMsrp = 0, msrpTotal = 0;
    for (const p of s.products) {
        const msrp = MSRP[p.type];
        if (msrp && msrp > 0) {
            msrpTotal++;
            if (p.price > msrp * 1.05) aboveMsrp++;
        }
    }
    const abovePct = msrpTotal > 0 ? (aboveMsrp / msrpTotal) * 100 : 0;
    factors.aboveMsrp = { score: abovePct, label: 'Produits > MSRP', value: `${aboveMsrp}/${msrpTotal}` };

    // ── 6. Volatilité (10%) ──
    // Écart moyen entre low et high — marché actif = volatilité haute
    const withRange = s.products.filter(p => p.low && p.high && p.high > p.low);
    let volatility = 0;
    if (withRange.length > 0) {
        volatility = withRange.reduce((sum, p) => sum + (p.high - p.low) / ((p.high + p.low) / 2), 0) / withRange.length;
    }
    factors.volatility = { score: Math.min(100, volatility * 200), label: 'Volatilité', value: `${(volatility * 100).toFixed(0)}%` };

    // ── 7. Position dans le range (10%) ──
    // Prix proche du high = forte demande actuelle
    let avgPos = 0.5;
    if (withRange.length > 0) {
        avgPos = withRange.reduce((sum, p) => sum + (p.price - p.low) / (p.high - p.low), 0) / withRange.length;
    }
    factors.position = { score: avgPos * 100, label: 'Position prix', value: `${(avgPos * 100).toFixed(0)}%` };

    // ── 8. Consistance (10%) ──
    // Est-ce que TOUS les produits montent, ou juste 1-2 ?
    // Plus le % de produits en hausse est élevé, plus la hype est réelle
    const hausse = s.products.filter(p => p.trend > 0).length;
    const consistPct = s.products.length > 0 ? (hausse / s.products.length) * 100 : 0;
    factors.consistency = { score: consistPct, label: 'Consistance', value: `${hausse}/${s.products.length} en hausse` };

    // ── Score final pondéré ──
    let hypeScore = Math.round(
        factors.perf.score * 0.15 +
        factors.trend7d.score * 0.15 +
        factors.listings.score * 0.15 +
        factors.setValue.score * 0.10 +
        factors.aboveMsrp.score * 0.15 +
        factors.volatility.score * 0.10 +
        factors.position.score * 0.10 +
        factors.consistency.score * 0.10
    );
    hypeScore = Math.min(100, Math.max(0, hypeScore));

    const avgPrice = s.products.reduce((sum, p) => sum + p.price, 0) / s.products.length;

    return { hypeScore, avgPerf, avgTrend7d, totalListings, avgListings, avgPrice, setTotal, factors };
}

function renderHypeMeter(priced) {
    // Grouper par série
    const seriesMap = {};
    for (const p of priced) {
        const code = p.ext.split(' — ')[0];
        const name = p.ext.split(' — ')[1] || code;
        if (!seriesMap[code]) seriesMap[code] = { code, name, products: [] };
        seriesMap[code].products.push(p);
    }

    const series = Object.values(seriesMap).map(s => {
        const hype = computeHypeScore(s);

        return { ...s, ...hype };
    });

    series.sort((a, b) => b.hypeScore - a.hypeScore);
    const maxScore = series[0]?.hypeScore || 1;

    const getHypeLabel = (score) => {
        if (score >= 80) return { label: '🔥 Ultra Hype', cls: 'hype-fire' };
        if (score >= 60) return { label: '📈 Hype', cls: 'hype-high' };
        if (score >= 40) return { label: '😐 Neutre', cls: 'hype-mid' };
        if (score >= 20) return { label: '📉 Faible', cls: 'hype-low' };
        return { label: '❄️ Glacial', cls: 'hype-ice' };
    };

    document.getElementById('hypeMeter').innerHTML = `
        <div class="hype-list">
            ${series.map((s, i) => {
                const { label, cls } = getHypeLabel(s.hypeScore);
                const barPct = (s.hypeScore / maxScore * 100).toFixed(0);
                const trend7dStr = s.avgTrend7d !== 0 ? `${s.avgTrend7d >= 0 ? '+' : ''}${s.avgTrend7d.toFixed(1)}%` : '—';
                return `<div class="hype-row ${cls}">
                    <span class="hype-rank">${i + 1}</span>
                    <div class="hype-info">
                        <div class="hype-name-row">
                            <span class="hype-code">${s.code}</span>
                            <span class="hype-name">${s.name}</span>
                        </div>
                        <div class="hype-bar-wrap">
                            <div class="hype-bar ${cls}" style="width: ${barPct}%"></div>
                        </div>
                    </div>
                    <div class="hype-score-wrap">
                        <span class="hype-score ${cls}">${s.hypeScore}</span>
                        <span class="hype-label">${label}</span>
                    </div>
                    <div class="hype-details">
                        <span class="hype-detail" title="Annonces en ligne">📦 ${s.totalListings} <small>annonces</small></span>
                        <span class="hype-detail" title="Tendance 7j">📊 ${trend7dStr} <small>7j</small></span>
                        <span class="hype-detail" title="Valeur du set">💰 ${fmt(s.setTotal)} <small>set</small></span>
                        <span class="hype-detail" title="Produits au-dessus du MSRP">🎯 ${s.factors.aboveMsrp.value} <small>> MSRP</small></span>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;
}

async function renderTrends() {
    const priced = products.filter(p => p.price > 0);

    // Charger les variations 7 jours
    await loadTrends7d();

    // ── Pokémon Greed Index ──
    renderGreedIndex(priced);

    // ── KPIs globaux ──
    const totalProducts = priced.length;
    const avgPrice = priced.length ? priced.reduce((s, p) => s + p.price, 0) / priced.length : 0;
    const hausse = priced.filter(p => p.trend > 0).length;
    const baisse = priced.filter(p => p.trend < 0).length;
    const stable = priced.filter(p => p.trend === 0).length;
    const avgTrend = priced.length ? priced.reduce((s, p) => s + p.trend, 0) / priced.length : 0;
    const trendClass = avgTrend > 0 ? 'positive' : avgTrend < 0 ? 'negative' : '';

    document.getElementById('trendKpis').innerHTML = `
        <div class="trend-kpi">
            <span class="trend-kpi-value">${totalProducts}</span>
            <span class="trend-kpi-label">Produits suivis</span>
        </div>
        <div class="trend-kpi">
            <span class="trend-kpi-value">${fmt(avgPrice)}</span>
            <span class="trend-kpi-label">Prix moyen</span>
        </div>
        <div class="trend-kpi">
            <span class="trend-kpi-value ${trendClass}">${avgTrend >= 0 ? '+' : ''}${avgTrend.toFixed(1)} %</span>
            <span class="trend-kpi-label">Tendance moyenne</span>
        </div>
        <div class="trend-kpi">
            <span class="trend-kpi-value" style="color: var(--green-light)">${hausse}</span>
            <span class="trend-kpi-label">En hausse</span>
        </div>
        <div class="trend-kpi">
            <span class="trend-kpi-value" style="color: var(--red)">${baisse}</span>
            <span class="trend-kpi-label">En baisse</span>
        </div>
        <div class="trend-kpi">
            <span class="trend-kpi-value" style="color: var(--text-muted)">${stable}</span>
            <span class="trend-kpi-label">Stables</span>
        </div>
    `;

    // ── Top 8 mouvements (7 derniers jours) ──
    const with7d = priced.map(p => ({ ...p, change7d: trends7d[p.name]?.change || 0, price7dAgo: trends7d[p.name]?.priceBefore || 0 }));
    const byTrend7d = [...with7d].sort((a, b) => b.change7d - a.change7d);
    const byTrendLow7d = [...with7d].sort((a, b) => a.change7d - b.change7d);
    const byPrice = [...priced].sort((a, b) => b.price - a.price);

    const row7d = (p, cls) => {
        const sign = p.change7d >= 0 ? '+' : '';
        const priceAgo = p.price7dAgo > 0 ? `<span class="t-price-ago">${fmt(p.price7dAgo)} → ${fmt(p.price)}</span>` : '';
        return `<li>
            <div class="t-info">
                <span class="t-name">${p.name}</span>
                <span class="t-serie">${p.ext.split(' — ')[0]}${priceAgo ? ' · ' : ''}${priceAgo ? priceAgo : ''}</span>
            </div>
            <span class="t-value ${cls}">${sign}${p.change7d} %</span>
        </li>`;
    };

    document.getElementById('trendUp').innerHTML =
        byTrend7d.filter(p => p.change7d > 0).slice(0, 8).map(p => row7d(p, 'up')).join('') || '<li class="t-empty">Aucune hausse sur 7 jours</li>';
    document.getElementById('trendDown').innerHTML =
        byTrendLow7d.filter(p => p.change7d < 0).slice(0, 8).map(p => row7d(p, 'down')).join('') || '<li class="t-empty">Aucune baisse sur 7 jours</li>';
    document.getElementById('trendHot').innerHTML =
        byPrice.slice(0, 8).map(p => {
            const last = p.lastPrice || p.old || 0;
            const diff = last > 0 ? ((p.price - last) / last * 100).toFixed(1) : null;
            const diffHtml = diff !== null ? `<span class="t-diff ${parseFloat(diff) >= 0 ? 'up' : 'down'}">${parseFloat(diff) >= 0 ? '+' : ''}${diff}%</span>` : '';
            return `<li>
                <div class="t-info">
                    <span class="t-name">${p.name}</span>
                    <span class="t-serie">${p.ext.split(' — ')[0]}</span>
                </div>
                <div class="t-hot-values">
                    <span class="t-value hot">${fmt(p.price)}</span>
                    ${diffHtml}
                </div>
            </li>`;
        }).join('');

    // ── Hype Meter ──
    renderHypeMeter(priced);

    // ── ADN des séries gagnantes ──
    renderSeriesAnalysis(priced);

    // ── Prix moyen par type ──
    const types = ['etb', 'display', 'display18', 'booster', 'tripack', 'bundle'];
    const typeLabels = { etb: 'ETB', display: 'Display 36', display18: 'Display 18', booster: 'Booster', tripack: 'Tripack', bundle: 'Bundle 6' };
    const typeIcons = { etb: '🎁', display: '📦', display18: '📦', booster: '🃏', tripack: '🃏', bundle: '🎲' };

    document.getElementById('trendAvgByType').innerHTML = types.map(t => {
        const items = priced.filter(p => p.type === t);
        if (!items.length) return '';
        const avg = items.reduce((s, p) => s + p.price, 0) / items.length;
        const min = Math.min(...items.map(p => p.price));
        const max = Math.max(...items.map(p => p.price));
        const avgTrend = items.reduce((s, p) => s + p.trend, 0) / items.length;
        const tc = avgTrend > 0 ? 'positive' : avgTrend < 0 ? 'negative' : '';
        return `<div class="trend-avg-card">
            <div class="trend-avg-header">
                <span class="trend-avg-icon">${typeIcons[t]}</span>
                <span class="trend-avg-type">${typeLabels[t]}</span>
                <span class="trend-avg-count">${items.length} produits</span>
            </div>
            <div class="trend-avg-price">${fmt(avg)}</div>
            <div class="trend-avg-range">
                <span class="trend-avg-min">${fmt(min)}</span>
                <div class="trend-avg-bar"><div class="trend-avg-bar-fill" style="width: ${max > 0 ? ((avg - min) / (max - min) * 100) : 50}%"></div></div>
                <span class="trend-avg-max">${fmt(max)}</span>
            </div>
            <div class="trend-avg-trend ${tc}">${avgTrend >= 0 ? '▲' : '▼'} ${Math.abs(avgTrend).toFixed(1)} % en moyenne</div>
        </div>`;
    }).join('');

    // ── Classement séries par valeur totale ──
    const seriesMap = {};
    for (const p of priced) {
        const code = p.ext.split(' — ')[0];
        const name = p.ext.split(' — ')[1] || code;
        if (!seriesMap[code]) seriesMap[code] = { code, name, total: 0, count: 0, avgTrend: 0 };
        seriesMap[code].total += p.price;
        seriesMap[code].count++;
        seriesMap[code].avgTrend += p.trend;
    }
    const seriesList = Object.values(seriesMap).map(s => ({ ...s, avgTrend: s.avgTrend / s.count }));
    seriesList.sort((a, b) => b.total - a.total);
    const maxTotal = seriesList[0]?.total || 1;

    document.getElementById('trendSeriesRanking').innerHTML = seriesList.map((s, i) => {
        const tc = s.avgTrend > 0 ? 'positive' : s.avgTrend < 0 ? 'negative' : '';
        const pct = (s.total / maxTotal * 100).toFixed(0);
        return `<div class="trend-serie-row">
            <span class="trend-serie-rank">${i + 1}</span>
            <div class="trend-serie-info">
                <div class="trend-serie-name-row">
                    <span class="trend-serie-code">${s.code}</span>
                    <span class="trend-serie-name">${s.name}</span>
                </div>
                <div class="trend-serie-bar-wrap">
                    <div class="trend-serie-bar" style="width: ${pct}%"></div>
                </div>
            </div>
            <div class="trend-serie-stats">
                <span class="trend-serie-total">${fmt(s.total)}</span>
                <span class="trend-serie-trend ${tc}">${s.avgTrend >= 0 ? '+' : ''}${s.avgTrend.toFixed(1)} %</span>
            </div>
        </div>`;
    }).join('');

    // ── Opportunités (prix actuel < dernier prix connu) ──
    const opps = priced.filter(p => {
        const last = p.lastPrice || p.old || 0;
        return last > 0 && p.price < last && p.price > 0;
    }).sort((a, b) => {
        const diffA = (a.lastPrice || a.old) - a.price;
        const diffB = (b.lastPrice || b.old) - b.price;
        return diffB - diffA;
    }).slice(0, 10);

    document.getElementById('trendOpportunities').innerHTML = opps.length ? opps.map(p => {
        const last = p.lastPrice || p.old;
        const diff = last - p.price;
        const diffPct = ((diff / last) * 100).toFixed(1);
        const ratio = p.low && p.high && p.high > p.low ? ((p.price - p.low) / (p.high - p.low) * 100).toFixed(0) : 50;
        return `<div class="trend-opp-card">
            <div class="trend-opp-name">${p.name}</div>
            <div class="trend-opp-serie">${p.ext.split(' — ')[0]}</div>
            <div class="trend-opp-price">${fmt(p.price)}</div>
            <div class="trend-opp-last">Dernier prix : ${fmt(last)}</div>
            ${p.low && p.high && p.high > p.low ? `<div class="trend-opp-range">
                <span>${fmt(p.low)}</span>
                <div class="trend-opp-gauge">
                    <div class="trend-opp-gauge-fill" style="width: ${ratio}%"></div>
                    <div class="trend-opp-gauge-marker" style="left: ${ratio}%"></div>
                </div>
                <span>${fmt(p.high)}</span>
            </div>` : ''}
            <div class="trend-opp-savings">-${diffPct}% vs dernier prix (−${fmt(diff)})</div>
        </div>`;
    }).join('') : '<div class="t-empty-block">Aucune opportunité détectée pour le moment</div>';

    // ── Performance depuis la sortie ──
    renderPerfTable(priced);

    // ── Séries à potentiel ──
    renderPotential(priced);

    // ── Score d'investissement ──
    renderInvestmentScores(priced);

    // ── Détection de bulles ──
    renderBubbleDetection(priced);

    // ── Corrélations ──
    renderCorrelations(priced);

    // ── Prédictions ──
    renderPredictions(priced);

    // ── Heatmap ──
    renderHeatmap(priced);

    // ── ROI Calculator ──
    renderROICalculator();
}

// Prix de sortie officiels par type
const MSRP = {
    etb: 54.99,
    display: 215,
    display18: 107,
    booster: 6.99,
    tripack: 17.99,
    bundle: 35,
    dispbundle: 0,
    coffret: 119.99,
};

function renderSeriesAnalysis(priced) {
    // Grouper par série
    const seriesMap = {};
    for (const p of priced) {
        const code = p.ext.split(' — ')[0];
        const name = p.ext.split(' — ')[1] || code;
        if (!seriesMap[code]) seriesMap[code] = { code, name, products: [] };
        seriesMap[code].products.push(p);
    }

    const series = Object.values(seriesMap).map(s => {
        const hype = computeHypeScore(s);

        // Métriques détaillées par type de produit
        const byType = {};
        for (const p of s.products) {
            const msrp = MSRP[p.type];
            if (!msrp || msrp <= 0) continue;
            byType[p.type] = {
                price: p.price,
                msrp,
                premium: ((p.price - msrp) / msrp * 100),
                trend: p.trend,
            };
        }

        // Premium du Display (indicateur clé : si le display est cher → set demandé)
        const displayPremium = byType.display?.premium || 0;
        // Premium de l'ETB (produit le plus populaire chez les collectionneurs)
        const etbPremium = byType.etb?.premium || 0;
        // Premium du Booster (si le booster est cher → cartes chase recherchées)
        const boosterPremium = byType.booster?.premium || 0;

        // Ratio Display/ETB — si display >> ETB = spéculation, si ETB >> display = collection
        const displayPrice = byType.display?.price || 0;
        const etbPrice = byType.etb?.price || 0;
        const displayEtbRatio = etbPrice > 0 ? displayPrice / etbPrice : 0;

        // Score de "profil gagnant" basé sur les patterns des séries qui marchent
        let winnerScore = 0;
        const winnerTraits = [];

        // Trait 1 : ETB premium élevé = collectionneurs veulent la série
        if (etbPremium > 50) { winnerScore += 25; winnerTraits.push({ trait: 'ETB très demandé', value: `+${etbPremium.toFixed(0)}%`, positive: true }); }
        else if (etbPremium > 20) { winnerScore += 15; winnerTraits.push({ trait: 'ETB au-dessus du MSRP', value: `+${etbPremium.toFixed(0)}%`, positive: true }); }
        else if (etbPremium < -10) { winnerTraits.push({ trait: 'ETB sous le MSRP', value: `${etbPremium.toFixed(0)}%`, positive: false }); }

        // Trait 2 : Display premium = ouverture rentable
        if (displayPremium > 30) { winnerScore += 20; winnerTraits.push({ trait: 'Display premium', value: `+${displayPremium.toFixed(0)}%`, positive: true }); }
        else if (displayPremium > 10) { winnerScore += 10; winnerTraits.push({ trait: 'Display légèrement au-dessus', value: `+${displayPremium.toFixed(0)}%`, positive: true }); }
        else if (displayPremium < -10) { winnerTraits.push({ trait: 'Display sous le MSRP', value: `${displayPremium.toFixed(0)}%`, positive: false }); }

        // Trait 3 : Booster premium = cartes chase très recherchées
        if (boosterPremium > 100) { winnerScore += 20; winnerTraits.push({ trait: 'Boosters très recherchés', value: `+${boosterPremium.toFixed(0)}%`, positive: true }); }
        else if (boosterPremium > 30) { winnerScore += 10; winnerTraits.push({ trait: 'Boosters au-dessus du MSRP', value: `+${boosterPremium.toFixed(0)}%`, positive: true }); }

        // Trait 4 : Hausse consistante sur tous les types
        const typesUp = Object.values(byType).filter(t => t.premium > 5).length;
        const typesTotal = Object.keys(byType).length;
        if (typesTotal > 0 && typesUp === typesTotal) { winnerScore += 20; winnerTraits.push({ trait: 'Tous les produits en hausse', value: `${typesUp}/${typesTotal}`, positive: true }); }
        else if (typesTotal > 0 && typesUp >= typesTotal * 0.5) { winnerScore += 10; winnerTraits.push({ trait: 'Majorité en hausse', value: `${typesUp}/${typesTotal}`, positive: true }); }
        else if (typesTotal > 0 && typesUp === 0) { winnerTraits.push({ trait: 'Aucun produit en hausse', value: `0/${typesTotal}`, positive: false }); }

        // Trait 5 : Volume d'annonces élevé = marché actif
        if (hype.totalListings >= 80) { winnerScore += 15; winnerTraits.push({ trait: 'Marché très actif', value: `${hype.totalListings} annonces`, positive: true }); }
        else if (hype.totalListings >= 40) { winnerScore += 8; winnerTraits.push({ trait: 'Marché actif', value: `${hype.totalListings} annonces`, positive: true }); }
        else { winnerTraits.push({ trait: 'Peu d\'annonces', value: `${hype.totalListings}`, positive: false }); }

        winnerScore = Math.min(100, winnerScore);

        return {
            ...s, ...hype, winnerScore, winnerTraits,
            displayPremium, etbPremium, boosterPremium, displayEtbRatio,
            byType,
        };
    });

    // Séparer top et flop
    series.sort((a, b) => b.winnerScore - a.winnerScore);
    const top5 = series.slice(0, 5);
    const flop5 = [...series].sort((a, b) => a.winnerScore - b.winnerScore).slice(0, 5);

    // Calculer les moyennes des gagnants pour identifier les patterns
    const winners = series.filter(s => s.winnerScore >= 50);
    const losers = series.filter(s => s.winnerScore < 30);

    const avgWinnerETB = winners.length ? winners.reduce((s, w) => s + w.etbPremium, 0) / winners.length : 0;
    const avgWinnerDisplay = winners.length ? winners.reduce((s, w) => s + w.displayPremium, 0) / winners.length : 0;
    const avgWinnerBooster = winners.length ? winners.reduce((s, w) => s + w.boosterPremium, 0) / winners.length : 0;
    const avgLoserETB = losers.length ? losers.reduce((s, w) => s + w.etbPremium, 0) / losers.length : 0;
    const avgLoserDisplay = losers.length ? losers.reduce((s, w) => s + w.displayPremium, 0) / losers.length : 0;

    // Insights globaux
    const insights = [];
    if (avgWinnerETB > 30) insights.push({ icon: '🎁', text: `Les séries qui marchent ont un ETB à +${avgWinnerETB.toFixed(0)}% en moyenne`, color: 'var(--green-light)' });
    if (avgWinnerDisplay > 20) insights.push({ icon: '📦', text: `Les gagnantes ont un Display à +${avgWinnerDisplay.toFixed(0)}% vs MSRP`, color: 'var(--green-light)' });
    if (avgWinnerBooster > 30) insights.push({ icon: '🃏', text: `Les boosters des séries fortes valent +${avgWinnerBooster.toFixed(0)}% vs MSRP`, color: 'var(--green-light)' });
    if (avgLoserETB < 5) insights.push({ icon: '⚠️', text: `Les séries faibles ont un ETB proche du MSRP (${avgLoserETB >= 0 ? '+' : ''}${avgLoserETB.toFixed(0)}%)`, color: 'var(--orange)' });
    if (winners.length > 0) {
        const avgListW = winners.reduce((s, w) => s + w.totalListings, 0) / winners.length;
        const avgListL = losers.length ? losers.reduce((s, w) => s + w.totalListings, 0) / losers.length : 0;
        if (avgListW > avgListL * 1.3) insights.push({ icon: '📊', text: `Les gagnantes ont ${Math.round(avgListW)} annonces en moyenne vs ${Math.round(avgListL)} pour les faibles`, color: 'var(--blue)' });
    }

    const wrap = document.getElementById('seriesAnalysis');
    wrap.innerHTML = `
        <div class="analysis-wrap">
            <!-- Insights clés -->
            <div class="analysis-insights">
                <h3 class="analysis-subtitle">💡 Ce qui fait le succès d'une série</h3>
                <div class="analysis-insights-list">
                    ${insights.map(i => `<div class="analysis-insight">
                        <span class="analysis-insight-icon">${i.icon}</span>
                        <span class="analysis-insight-text" style="color:${i.color}">${i.text}</span>
                    </div>`).join('')}
                </div>
            </div>

            <!-- Comparaison Top vs Flop -->
            <div class="analysis-compare">
                <div class="analysis-column analysis-top">
                    <h3 class="analysis-subtitle">🏆 Top séries</h3>
                    ${top5.map((s, i) => `<div class="analysis-card analysis-winner">
                        <div class="analysis-card-header">
                            <span class="analysis-rank">${i + 1}</span>
                            <div>
                                <span class="analysis-code">${s.code}</span>
                                <span class="analysis-name">${s.name}</span>
                            </div>
                            <span class="analysis-wscore">${s.winnerScore}<small>/100</small></span>
                        </div>
                        <div class="analysis-premiums">
                            ${s.byType.etb ? `<span class="analysis-premium ${s.etbPremium > 10 ? 'ap-up' : s.etbPremium < -5 ? 'ap-down' : ''}">ETB ${s.etbPremium >= 0 ? '+' : ''}${s.etbPremium.toFixed(0)}%</span>` : ''}
                            ${s.byType.display ? `<span class="analysis-premium ${s.displayPremium > 10 ? 'ap-up' : s.displayPremium < -5 ? 'ap-down' : ''}">Display ${s.displayPremium >= 0 ? '+' : ''}${s.displayPremium.toFixed(0)}%</span>` : ''}
                            ${s.byType.booster ? `<span class="analysis-premium ${s.boosterPremium > 10 ? 'ap-up' : s.boosterPremium < -5 ? 'ap-down' : ''}">Booster ${s.boosterPremium >= 0 ? '+' : ''}${s.boosterPremium.toFixed(0)}%</span>` : ''}
                        </div>
                        <div class="analysis-traits">
                            ${s.winnerTraits.filter(t => t.positive).slice(0, 3).map(t => `<span class="analysis-trait trait-pos">✓ ${t.trait}</span>`).join('')}
                        </div>
                    </div>`).join('')}
                </div>
                <div class="analysis-column analysis-flop">
                    <h3 class="analysis-subtitle">📉 Séries en difficulté</h3>
                    ${flop5.map((s, i) => `<div class="analysis-card analysis-loser">
                        <div class="analysis-card-header">
                            <span class="analysis-rank">${series.length - flop5.length + i + 1}</span>
                            <div>
                                <span class="analysis-code">${s.code}</span>
                                <span class="analysis-name">${s.name}</span>
                            </div>
                            <span class="analysis-wscore low">${s.winnerScore}<small>/100</small></span>
                        </div>
                        <div class="analysis-premiums">
                            ${s.byType.etb ? `<span class="analysis-premium ${s.etbPremium > 10 ? 'ap-up' : s.etbPremium < -5 ? 'ap-down' : ''}">ETB ${s.etbPremium >= 0 ? '+' : ''}${s.etbPremium.toFixed(0)}%</span>` : ''}
                            ${s.byType.display ? `<span class="analysis-premium ${s.displayPremium > 10 ? 'ap-up' : s.displayPremium < -5 ? 'ap-down' : ''}">Display ${s.displayPremium >= 0 ? '+' : ''}${s.displayPremium.toFixed(0)}%</span>` : ''}
                            ${s.byType.booster ? `<span class="analysis-premium ${s.boosterPremium > 10 ? 'ap-up' : s.boosterPremium < -5 ? 'ap-down' : ''}">Booster ${s.boosterPremium >= 0 ? '+' : ''}${s.boosterPremium.toFixed(0)}%</span>` : ''}
                        </div>
                        <div class="analysis-traits">
                            ${s.winnerTraits.filter(t => !t.positive).slice(0, 3).map(t => `<span class="analysis-trait trait-neg">✗ ${t.trait}</span>`).join('')}
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </div>
    `;

    // Sauvegarder les winnerScores pour les réutiliser dans le potentiel
    window._seriesWinnerScores = {};
    for (const s of series) {
        window._seriesWinnerScores[s.code] = s.winnerScore;
    }
}

function renderPerfTable(priced) {
    // Grouper par série
    const seriesMap = {};
    for (const p of priced) {
        const code = p.ext.split(' — ')[0];
        const name = p.ext.split(' — ')[1] || code;
        if (!seriesMap[code]) seriesMap[code] = { code, name, products: [] };
        seriesMap[code].products.push(p);
    }

    const series = Object.values(seriesMap);

    // Pour chaque série, calculer la perf moyenne vs MSRP
    const seriesPerf = series.map(s => {
        let totalMsrp = 0, totalCurrent = 0, count = 0;
        const productPerfs = [];

        for (const p of s.products) {
            const msrp = MSRP[p.type];
            if (!msrp || msrp <= 0) continue;
            const perf = ((p.price - msrp) / msrp) * 100;
            productPerfs.push({ name: p.name, type: p.type, price: p.price, msrp, perf });
            totalMsrp += msrp;
            totalCurrent += p.price;
            count++;
        }

        const avgPerf = count > 0 ? ((totalCurrent - totalMsrp) / totalMsrp) * 100 : 0;
        // Meilleur produit de la série
        productPerfs.sort((a, b) => b.perf - a.perf);
        const best = productPerfs[0] || null;
        const worst = productPerfs[productPerfs.length - 1] || null;

        return { ...s, avgPerf, best, worst, productPerfs, totalCurrent, totalMsrp };
    });

    // Trier par perf décroissante
    seriesPerf.sort((a, b) => b.avgPerf - a.avgPerf);

    const typeLabels = { etb: 'ETB', display: 'Display 36', display18: 'Display 18', booster: 'Booster', tripack: 'Tripack', bundle: 'Bundle 6', dispbundle: 'Display Bundle' };

    document.getElementById('trendPerfTable').innerHTML = `
        <div class="perf-table">
            <div class="perf-table-header">
                <span class="perf-col-rank">#</span>
                <span class="perf-col-serie">Série</span>
                <span class="perf-col-msrp">Prix sortie</span>
                <span class="perf-col-now">Prix actuel</span>
                <span class="perf-col-perf">Performance</span>
                <span class="perf-col-best">Meilleur produit</span>
            </div>
            ${seriesPerf.map((s, i) => {
                const perfClass = s.avgPerf > 50 ? 'perf-hot' : s.avgPerf > 10 ? 'perf-up' : s.avgPerf > -10 ? 'perf-neutral' : 'perf-down';
                const perfIcon = s.avgPerf > 50 ? '🔥' : s.avgPerf > 10 ? '📈' : s.avgPerf > -10 ? '➡️' : '📉';
                return `<div class="perf-table-row ${perfClass}">
                    <span class="perf-col-rank">${i + 1}</span>
                    <div class="perf-col-serie">
                        <span class="perf-serie-code">${s.code}</span>
                        <span class="perf-serie-name">${s.name}</span>
                    </div>
                    <span class="perf-col-msrp">${fmt(s.totalMsrp)}</span>
                    <span class="perf-col-now">${fmt(s.totalCurrent)}</span>
                    <span class="perf-col-perf">
                        <span class="perf-badge ${perfClass}">${perfIcon} ${s.avgPerf >= 0 ? '+' : ''}${s.avgPerf.toFixed(1)}%</span>
                    </span>
                    <span class="perf-col-best">${s.best ? `${typeLabels[s.best.type] || s.best.type} <span class="perf-best-val">${s.best.perf >= 0 ? '+' : ''}${s.best.perf.toFixed(0)}%</span>` : '—'}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

function renderPotential(priced) {
    // Grouper par série
    const seriesMap = {};
    for (const p of priced) {
        const code = p.ext.split(' — ')[0];
        const name = p.ext.split(' — ')[1] || code;
        if (!seriesMap[code]) seriesMap[code] = { code, name, products: [] };
        seriesMap[code].products.push(p);
    }

    const series = Object.values(seriesMap);

    // Calculer un score de potentiel basé sur :
    // 1. Prix proches du MSRP (pas encore monté = potentiel)
    // 2. Tendance positive naissante
    // 3. Prix bas dans le range
    // 4. Valeur totale du set
    // 5. Hype de la série (perf, tendance 7j, annonces, prix)
    const potentials = series.map(s => {
        let score = 0;
        let reasons = [];
        let avgPerf = 0, count = 0;

        for (const p of s.products) {
            const msrp = MSRP[p.type];
            if (!msrp || msrp <= 0) continue;
            const perf = ((p.price - msrp) / msrp) * 100;
            avgPerf += perf;
            count++;
        }
        if (count > 0) avgPerf /= count;

        // Prix total du set
        const setTotal = s.products.reduce((sum, p) => sum + p.price, 0);

        // Hype score de la série
        const hype = computeHypeScore(s);

        // Facteur 1 : Proche du MSRP — 20pts max
        if (avgPerf < 20 && avgPerf > -20) {
            score += 20;
            reasons.push('Prix proche du prix de sortie');
        } else if (avgPerf >= 20 && avgPerf < 80) {
            score += 10;
            reasons.push('Hausse modérée depuis la sortie');
        }

        // Facteur 2 : Tendance positive — 15pts max
        const avgTrend = s.products.reduce((sum, p) => sum + p.trend, 0) / s.products.length;
        if (avgTrend > 5) {
            score += 15;
            reasons.push('Tendance haussière (+' + avgTrend.toFixed(0) + '%)');
        } else if (avgTrend > 0) {
            score += 8;
            reasons.push('Légère hausse récente');
        }

        // Facteur 3 : Prix bas dans le range — 15pts max
        const withRange = s.products.filter(p => p.low && p.high && p.high > p.low);
        if (withRange.length > 0) {
            const avgPos = withRange.reduce((sum, p) => sum + (p.price - p.low) / (p.high - p.low), 0) / withRange.length;
            if (avgPos < 0.4) {
                score += 15;
                reasons.push('Prix bas dans la fourchette historique');
            } else if (avgPos < 0.6) {
                score += 8;
                reasons.push('Prix dans la moyenne');
            }
        }

        // Facteur 4 : Valeur totale du set — 25pts max
        if (setTotal >= 1500) {
            score += 25;
            reasons.push(`Set complet à ${fmt(setTotal)} — très forte demande`);
        } else if (setTotal >= 800) {
            score += 20;
            reasons.push(`Set complet à ${fmt(setTotal)} — forte demande`);
        } else if (setTotal >= 500) {
            score += 12;
            reasons.push(`Set complet à ${fmt(setTotal)} — demande correcte`);
        } else if (setTotal >= 300) {
            score += 5;
            reasons.push(`Set complet à ${fmt(setTotal)} — demande modérée`);
        }

        // Facteur 5 : Hype de la série — 15pts max
        const hypeLabel = hype.hypeScore >= 80 ? 'Ultra Hype' : hype.hypeScore >= 60 ? 'Hype' : hype.hypeScore >= 40 ? 'Neutre' : 'Faible';
        if (hype.hypeScore >= 80) {
            score += 15;
            reasons.push(`🔥 Série ${hypeLabel} (${hype.hypeScore}/100)`);
        } else if (hype.hypeScore >= 60) {
            score += 11;
            reasons.push(`📈 Série ${hypeLabel} (${hype.hypeScore}/100)`);
        } else if (hype.hypeScore >= 40) {
            score += 6;
            reasons.push(`😐 Série ${hypeLabel} (${hype.hypeScore}/100)`);
        } else {
            score += 2;
            reasons.push(`📉 Série ${hypeLabel} (${hype.hypeScore}/100)`);
        }

        // Facteur 6 : ADN gagnant (winnerScore) — 10pts max
        const winnerScore = (window._seriesWinnerScores && window._seriesWinnerScores[s.code]) || 0;
        if (winnerScore >= 70) {
            score += 10;
            reasons.push(`🏆 ADN gagnant (${winnerScore}/100)`);
        } else if (winnerScore >= 50) {
            score += 7;
            reasons.push(`✓ Profil de série solide (${winnerScore}/100)`);
        } else if (winnerScore >= 30) {
            score += 3;
            reasons.push(`Profil moyen (${winnerScore}/100)`);
        }

        return { ...s, score, reasons, avgPerf, avgTrend, setTotal, hypeScore: hype.hypeScore, winnerScore };
    });

    // Filtrer celles avec du potentiel, trier par score
    const filtered = potentials.filter(s => s.score >= 30).sort((a, b) => b.score - a.score);

    document.getElementById('trendPotential').innerHTML = filtered.length ? `
        <div class="potential-grid">
            ${filtered.map(s => {
                const stars = s.score >= 70 ? '⭐⭐⭐' : s.score >= 50 ? '⭐⭐' : '⭐';
                const potLabel = s.score >= 70 ? 'Fort potentiel' : s.score >= 50 ? 'Potentiel modéré' : 'À surveiller';
                const potClass = s.score >= 70 ? 'pot-high' : s.score >= 50 ? 'pot-mid' : 'pot-low';
                return `<div class="potential-card ${potClass}">
                    <div class="potential-header">
                        <div>
                            <span class="potential-code">${s.code}</span>
                            <span class="potential-name">${s.name}</span>
                        </div>
                        <span class="potential-stars">${stars}</span>
                    </div>
                    <div class="potential-label">${potLabel}</div>
                    <div class="potential-stats">
                        <div class="potential-stat">
                            <span class="potential-stat-label">Hype</span>
                            <span class="potential-stat-value" style="color:${s.hypeScore >= 60 ? 'var(--green-light)' : s.hypeScore >= 40 ? 'var(--orange)' : 'var(--red)'}">${s.hypeScore}/100</span>
                        </div>
                        <div class="potential-stat">
                            <span class="potential-stat-label">Valeur set</span>
                            <span class="potential-stat-value" style="color:var(--orange)">${fmt(s.setTotal)}</span>
                        </div>
                        <div class="potential-stat">
                            <span class="potential-stat-label">Perf. sortie</span>
                            <span class="potential-stat-value ${s.avgPerf >= 0 ? 'positive' : 'negative'}">${s.avgPerf >= 0 ? '+' : ''}${s.avgPerf.toFixed(1)}%</span>
                        </div>
                        <div class="potential-stat">
                            <span class="potential-stat-label">ADN</span>
                            <span class="potential-stat-value" style="color:${s.winnerScore >= 50 ? 'var(--green-light)' : s.winnerScore >= 30 ? 'var(--orange)' : 'var(--text-muted)'}">${s.winnerScore}/100</span>
                        </div>
                        <div class="potential-stat">
                            <span class="potential-stat-label">Score</span>
                            <span class="potential-stat-value">${s.score}/100</span>
                        </div>
                    </div>
                    <div class="potential-reasons">
                        ${s.reasons.map(r => `<span class="potential-reason">✓ ${r}</span>`).join('')}
                    </div>
                </div>`;
            }).join('')}
        </div>
    ` : '<div class="t-empty-block">Aucune série à potentiel identifiée pour le moment</div>';
}

// ── eBay API Integration ─────────────────────────────────────

let ebayStatus = null;

async function checkEbayStatus() {
    try {
        const res = await fetch('/api/status');
        ebayStatus = await res.json();
        return ebayStatus.hasCredentials;
    } catch {
        ebayStatus = null;
        return false;
    }
}

function applyEbayPrice(ep) {
    const localName = EBAY_PRODUCT_MAP[ep.id];
    if (!localName) return null;
    const product = products.find(p => p.name === localName);
    if (!product || !ep.price) return null;

    product.old = product.price;
    product.price = ep.price;
    product.lastPrice = ep.lastPrice || ep.price;
    product.low = ep.low;
    product.high = ep.high;
    product.lastListing = ep.lastListing || null;
    product.sampleSize = ep.sampleSize || 0;
    product.searchUrl = ep.searchUrl || '';
    product._ebayLoaded = true;

    if (product.old > 0) {
        product.trend = Math.round(((product.price - product.old) / product.old) * 100);
    }
    return localName;
}

// ── Client-side prices cache (localStorage) ─────────────────
// Fait passer le boot de ~15s à instantané + ne refetch que les périmés.
const PRICES_CACHE_KEY = 'pokescelle-prices-cache';
const PRICES_CACHE_TTL_MS = 60 * 60 * 1000;   // 1h, aligné sur le serveur
const PRICES_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // purge entrées > 7j

function loadClientPriceCache() {
    try {
        const raw = localStorage.getItem(PRICES_CACHE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        const now = Date.now();
        const out = {};
        for (const [id, entry] of Object.entries(parsed)) {
            if (!entry || typeof entry.cachedAt !== 'number') continue;
            // On purge les entrées vraiment trop vieilles, mais on garde celles
            // entre 1h et 7j pour affichage instantané (marquées "stale")
            if (now - entry.cachedAt > PRICES_CACHE_MAX_AGE_MS) continue;
            out[id] = entry;
        }
        return out;
    } catch { return {}; }
}

function saveClientPriceCache(cache) {
    try { localStorage.setItem(PRICES_CACHE_KEY, JSON.stringify(cache)); } catch {}
}

function isPriceFresh(entry) {
    return entry && (Date.now() - entry.cachedAt) < PRICES_CACHE_TTL_MS;
}

async function fetchEbayPrices() {
    const banner = document.getElementById('ebayBanner');

    const hasApi = await checkEbayStatus();
    if (!hasApi) {
        if (banner) {
            banner.textContent = 'Prix statiques — Configurez .env pour les prix en direct';
            banner.classList.add('visible');
        }
        return;
    }

    const ids = Object.keys(EBAY_PRODUCT_MAP);
    const total = ids.length;
    const clientCache = loadClientPriceCache();

    // ── Phase 1 : applique IMMÉDIATEMENT le cache localStorage (0 réseau) ──
    let appliedFromCache = 0;
    for (const [id, entry] of Object.entries(clientCache)) {
        const name = applyEbayPrice({ id, ...entry.data });
        if (name) {
            appliedFromCache++;
            updateCard(name);
        }
    }
    if (appliedFromCache > 0) {
        renderTrends();
        updatePortfolioBadge();
    }

    // ── Phase 2 : bulk fetch du cache serveur en 1 seule requête ──
    if (banner) {
        banner.textContent = appliedFromCache > 0 ? 'Actualisation des prix…' : 'Chargement des prix…';
        banner.classList.add('visible');
    }

    let serverCache = {};
    try {
        const res = await fetch('/api/prices-cached');
        if (res.ok) {
            const payload = await res.json();
            serverCache = payload.prices || {};
        }
    } catch {}

    const now = Date.now();
    let updatedFromServer = 0;
    for (const [id, data] of Object.entries(serverCache)) {
        const name = applyEbayPrice({ id, ...data });
        if (name) {
            updatedFromServer++;
            updateCard(name);
        }
        // Met à jour le cache client avec la donnée serveur
        clientCache[id] = {
            cachedAt: data._cachedAt || now,
            data,
        };
    }

    // ── Phase 3 : refresh ciblé des produits non couverts par le cache serveur ──
    // (= cache serveur expiré ou vide pour ce produit)
    const missingIds = ids.filter(id => !serverCache[id]);
    let refreshed = 0;

    if (missingIds.length > 0 && banner) {
        banner.textContent = `Rafraîchissement de ${missingIds.length} prix…`;
    }

    for (let i = 0; i < missingIds.length; i += 3) {
        const batch = missingIds.slice(i, i + 3);
        const results = await Promise.allSettled(
            batch.map(id => fetch(`/api/price/${id}`).then(r => r.json()))
        );
        for (const r of results) {
            if (r.status !== 'fulfilled' || !r.value || r.value.error) continue;
            const data = r.value;
            const name = applyEbayPrice(data);
            if (name) {
                refreshed++;
                updateCard(name);
                clientCache[data.id] = { cachedAt: Date.now(), data };
            }
        }
        if (banner) {
            banner.textContent = `Rafraîchissement ${i + batch.length}/${missingIds.length}…`;
        }
        if (i + 3 < missingIds.length) {
            await new Promise(r => setTimeout(r, 200));
        }
    }

    // Persist le cache client mis à jour
    saveClientPriceCache(clientCache);

    if (banner) {
        banner.textContent = '';
        banner.classList.remove('visible');
    }

    // Toast final : on ne dérange l'utilisateur que si quelque chose a changé
    const updated = updatedFromServer + refreshed;
    if (refreshed > 0) {
        showToast('✅', `${refreshed} prix rafraîchis`, total > refreshed ? `${total - refreshed} déjà à jour` : '');
    } else if (appliedFromCache === 0 && updated > 0) {
        showToast('✅', `${updated} prix chargés`, 'Données eBay');
    }

    renderTrends();
    updatePortfolioBadge();
    checkAlerts();
}

// ── Auth ────────────────────────────────────────────────────

let currentUser = null;
let authToken = null;
let authMode = 'login';

function initAuth() {
    authToken = localStorage.getItem('pokescelle-token');
    const savedUser = localStorage.getItem('pokescelle-user');
    if (authToken && savedUser) {
        currentUser = savedUser;
        fetch('/api/me', { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => {
                currentUser = data.username;
                updateAuthUI();
                // Token valide => on charge le portfolio cote serveur,
                // puis on rafraichit le badge et la vue active.
                loadPortfolio().then(() => {
                    updatePortfolioBadge();
                    if (currentSection === 'dashboard') renderDashboard();
                    else if (currentSection === 'portfolio') renderPortfolio();
                });
            })
            .catch(() => { logout(); });
    } else {
        // Pas de session active : on purge tout residu de portefeuille
        // qu'un precedent utilisateur aurait pu laisser sur ce device.
        localStorage.removeItem('pokescelle-portfolio');
    }
    updateAuthUI();
}

function updateAuthUI() {
    // Topbar
    const area = document.getElementById('authArea');
    if (currentUser) {
        area.innerHTML = `<div class="user-info">
            <span class="user-name">${currentUser}</span>
            <button class="btn-icon-subtle" onclick="openChangePwModal()" title="Changer de mot de passe" aria-label="Changer de mot de passe">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            </button>
            <button class="btn-logout" onclick="logout()">Déco</button>
        </div>`;
    } else {
        area.innerHTML = `<button class="btn-auth" onclick="openAuthModal('login')">Connexion</button>`;
    }

    // Sidebar user
    const avatar = document.querySelector('.sidebar-avatar');
    const username = document.getElementById('sidebarUsername');
    const sub = document.getElementById('sidebarUserSub');

    if (currentUser) {
        avatar.textContent = currentUser.charAt(0).toUpperCase();
        username.textContent = currentUser;
        sub.textContent = `${products.length} items référencés`;
    } else {
        avatar.textContent = '?';
        username.textContent = 'Non connecté';
        sub.textContent = 'Cliquez pour vous connecter';
    }

    // Click sidebar user to open auth
    document.querySelector('.sidebar-user').onclick = () => {
        if (!currentUser) openAuthModal('login');
    };

    // Lien Admin visible uniquement pour l'admin
    updateAdminLinkVisibility();
}

function openAuthModal(mode) {
    authMode = mode || 'login';
    switchAuthTab(authMode);
    document.getElementById('authModal').classList.add('open');
    document.getElementById('authUsername').focus();
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('open');
    document.getElementById('authError').textContent = '';
    document.getElementById('authForm').reset();
}

function switchAuthTab(mode) {
    authMode = mode;
    document.getElementById('tabLogin').classList.toggle('active', mode === 'login');
    document.getElementById('tabRegister').classList.toggle('active', mode === 'register');
    document.getElementById('authSubmit').textContent = mode === 'login' ? 'Se connecter' : 'Créer le compte';
}

async function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('authUsername').value.trim();
    const password = document.getElementById('authPassword').value;
    const errorEl = document.getElementById('authError');
    const submitBtn = document.getElementById('authSubmit');

    errorEl.textContent = '';
    submitBtn.disabled = true;

    try {
        const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (!res.ok) {
            errorEl.textContent = data.error || 'Erreur inconnue';
            submitBtn.disabled = false;
            return;
        }

        authToken = data.token;
        currentUser = data.username;
        localStorage.setItem('pokescelle-token', authToken);
        localStorage.setItem('pokescelle-user', currentUser);

        // Vider le cache portfolio local pour charger celui du serveur
        _portfolioCache = null;
        localStorage.removeItem('pokescelle-portfolio');

        updateAuthUI();
        closeAuthModal();

        if (currentSection === 'portfolio') renderPortfolio();
    } catch {
        errorEl.textContent = 'Erreur de connexion au serveur';
    }
    submitBtn.disabled = false;
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('pokescelle-token');
    localStorage.removeItem('pokescelle-user');
    // Purge tout etat portfolio en memoire ET en localStorage : le portefeuille
    // est strictement lie au compte, rien ne doit subsister apres deconnexion.
    _portfolioCache = null;
    localStorage.removeItem('pokescelle-portfolio');
    updateAuthUI();
    updatePortfolioBadge();
    if (currentSection === 'portfolio') switchSection('catalogue');
    else if (currentSection === 'dashboard') renderDashboard();
}

document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
});

document.getElementById('authForm').addEventListener('submit', handleAuth);

// ── Change password ────────────────────────────────────────

function openChangePwModal() {
    if (!authToken) return;
    document.getElementById('changePwModal').classList.add('open');
    document.getElementById('cpwError').textContent = '';
    document.getElementById('changePwForm').reset();
    document.getElementById('cpwCurrent').focus();
}

function closeChangePwModal() {
    document.getElementById('changePwModal').classList.remove('open');
}

async function handleChangePassword(e) {
    e.preventDefault();
    const currentPw = document.getElementById('cpwCurrent').value;
    const newPw = document.getElementById('cpwNew').value;
    const confirmPw = document.getElementById('cpwConfirm').value;
    const errorEl = document.getElementById('cpwError');
    const submitBtn = document.getElementById('cpwSubmit');

    errorEl.textContent = '';

    if (newPw !== confirmPw) {
        errorEl.textContent = 'Les deux nouveaux mots de passe ne correspondent pas';
        return;
    }
    if (newPw === currentPw) {
        errorEl.textContent = 'Le nouveau mot de passe doit être différent';
        return;
    }

    submitBtn.disabled = true;
    try {
        const res = await fetch('/api/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
        });
        const data = await res.json();
        if (!res.ok) {
            errorEl.textContent = data.error || 'Erreur inconnue';
            submitBtn.disabled = false;
            return;
        }
        closeChangePwModal();
        showToast('🔒', 'Mot de passe modifié');
    } catch {
        errorEl.textContent = 'Erreur de connexion au serveur';
    }
    submitBtn.disabled = false;
}

document.getElementById('changePwModal').addEventListener('click', function(e) {
    if (e.target === this) closeChangePwModal();
});
document.getElementById('changePwForm').addEventListener('submit', handleChangePassword);

// ── Portfolio ────────────────────────────────────────────────

function getDefaultPortfolio() {
    const pf = {};
    for (const p of products) {
        pf[p.name] = { qty: 0, cost: 0 };
    }
    return pf;
}

let _portfolioCache = null;
let _portfolioLoading = null;       // promesse en cours de chargement, pour dédupliquer
let _saveInflight = null;           // promesse du dernier PUT en cours
let _saveDirty = false;             // indique qu'un save est en attente (utile pour beforeunload)

async function loadPortfolio() {
    // Portefeuille strictement lie au compte : serveur seul fait foi.
    // Sans token => portefeuille vide (pas de fallback localStorage qui
    // exposerait les donnees du precedent utilisateur sur le meme device).
    if (!authToken) {
        _portfolioCache = getDefaultPortfolio();
        return _portfolioCache;
    }
    if (_portfolioLoading) return _portfolioLoading;
    _portfolioLoading = (async () => {
        try {
            const res = await fetch('/api/portfolio', {
                headers: { 'Authorization': `Bearer ${authToken}` },
                cache: 'no-store',
            });
            if (res.ok) {
                const data = await res.json();
                _portfolioCache = data || {};
                return _portfolioCache;
            }
            // 401 → token périmé → on logout pour forcer re-login propre
            if (res.status === 401) {
                showToast?.('🔒', 'Session expirée', 'Reconnectez-vous');
                logout();
                return _portfolioCache || {};
            }
            showToast?.('⚠️', 'Erreur serveur', 'Portfolio non chargé');
            return _portfolioCache || {};
        } catch {
            showToast?.('⚠️', 'Hors ligne', 'Affichage du dernier état connu');
            return _portfolioCache || {};
        } finally {
            _portfolioLoading = null;
        }
    })();
    return _portfolioLoading;
}

function loadPortfolioSync() {
    // Sans token => portefeuille vide. Avec token => cache deja charge par loadPortfolio.
    if (!authToken) return getDefaultPortfolio();
    if (_portfolioCache) return _portfolioCache;
    return getDefaultPortfolio();
}

// Save désormais immédiat + awaitable. Retourne true si OK, false sinon.
async function savePortfolio(pf) {
    // Sans compte connecte : on refuse toute modif (pas de portefeuille anonyme).
    if (!authToken) {
        showToast?.('🔒', 'Connexion requise', 'Connectez-vous pour gerer un portefeuille');
        return false;
    }
    _portfolioCache = pf;
    updatePortfolioBadge();

    // Sérialise les saves : si un PUT est en cours, on attend qu'il finisse
    // pour envoyer celui-ci avec l'état le plus récent.
    _saveDirty = true;
    while (_saveInflight) {
        try { await _saveInflight; } catch {}
    }
    if (!_saveDirty) return true;
    _saveDirty = false;

    _saveInflight = (async () => {
        try {
            const res = await fetch('/api/portfolio', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(pf),
            });
            if (!res.ok) {
                if (res.status === 401) {
                    showToast?.('🔒', 'Session expirée', 'Reconnectez-vous');
                    logout();
                } else {
                    showToast?.('⚠️', 'Échec sauvegarde', `HTTP ${res.status}`);
                }
                return false;
            }
            return true;
        } catch {
            showToast?.('⚠️', 'Échec sauvegarde', 'Réessayez dans un instant');
            return false;
        } finally {
            _saveInflight = null;
        }
    })();

    return _saveInflight;
}

// Filet de sécurité : si l'utilisateur ferme la page pendant qu'un PUT est
// en cours ou avec des changements en attente, on tente un beacon final.
window.addEventListener('beforeunload', () => {
    if (!authToken) return;
    if (!_saveInflight && !_saveDirty) return;
    try {
        const pf = _portfolioCache || loadPortfolioSync();
        // sendBeacon = POST. On expose un endpoint qui accepte aussi POST/PUT.
        const blob = new Blob([JSON.stringify(pf)], { type: 'application/json' });
        // Ajoute le token en query car sendBeacon ne supporte pas les headers custom
        navigator.sendBeacon(`/api/portfolio?token=${encodeURIComponent(authToken)}`, blob);
    } catch {}
});

async function refreshPortfolio() {
    // Forcer un snapshot et recharger le graphique
    await fetch('/api/portfolio-snapshot', { method: 'POST', headers: { 'Authorization': `Bearer ${authToken}` } });
    await renderPortfolio();
}

async function resetPortfolio() {
    if (!confirm('Réinitialiser le portfolio avec les données par défaut ?')) return;
    const pf = getDefaultPortfolio();
    const ok = await savePortfolio(pf);
    if (ok) showToast('↺', 'Portfolio réinitialisé');
    renderPortfolio();
}

// ── Pending changes (confirmation flow) ─────────────────────
// Map<name, {qty, cost}> : valeurs saisies non confirmées
const _pfPending = new Map();

function _pfOriginalFor(name) {
    const pf = loadPortfolioSync();
    return pf[name] || { qty: 0, cost: 0 };
}

function _pfIsDirty(name) {
    if (!_pfPending.has(name)) return false;
    const pending = _pfPending.get(name);
    const orig = _pfOriginalFor(name);
    return pending.qty !== orig.qty || pending.cost !== orig.cost;
}

function onPortfolioInput(name, field, value) {
    // 1) Récupère ou crée l'entrée pending depuis la vraie valeur actuelle
    const current = _pfPending.get(name) || { ..._pfOriginalFor(name) };
    const num = parseFloat(value) || 0;
    current[field] = field === 'qty' ? Math.round(num) : Math.round(num * 100) / 100;
    _pfPending.set(name, current);

    // 2) MAJ visuelle de la carte SANS sauvegarder
    const p = products.find(pr => pr.name === name);
    const card = document.querySelector(`.pf-pos-card[data-name="${name.replace(/"/g, '&quot;')}"]`);
    if (p && card) {
        const h = current;
        const totalInvested = h.qty * h.cost;
        const currentVal = h.qty * p.price;
        const pnl = currentVal - totalInvested;
        const pnlPct = totalInvested > 0 ? ((pnl / totalInvested) * 100) : 0;
        const pnlClass = pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : '';
        const pnlSign = pnl >= 0 ? '+' : '';

        // P&L big
        const pnlBig = card.querySelector('.pf-pos-pnl-big');
        if (pnlBig) {
            pnlBig.className = 'pf-pos-pnl-big ' + pnlClass;
            const arrow = pnlBig.querySelector('.pf-pos-pnl-arrow');
            const pct = pnlBig.querySelector('.pf-pos-pnl-pct');
            const abs = pnlBig.querySelector('.pf-pos-pnl-abs');
            if (arrow) arrow.textContent = pnl > 0 ? '▲' : pnl < 0 ? '▼' : '—';
            if (pct) pct.textContent = `${pnlSign}${pnlPct.toFixed(1)}%`;
            if (abs) abs.textContent = `${pnlSign}${fmt(pnl)}`;
        }

        // Footer KPIs
        const kpis = card.querySelectorAll('.pf-pos-kpi strong');
        if (kpis[0]) kpis[0].textContent = fmt(totalInvested);
        if (kpis[1]) kpis[1].textContent = fmt(currentVal);
        if (kpis[2]) {
            kpis[2].textContent = `${pnlSign}${fmt(pnl)}`;
            kpis[2].className = pnlClass;
        }
    }

    // 3) Toggle dirty state + barre de confirmation
    if (card) card.classList.toggle('dirty', _pfIsDirty(name));
    updatePfConfirmBar();
}

// ── Confirm / Discard bar ───────────────────────────────────
function updatePfConfirmBar() {
    const bar = document.getElementById('pfConfirmBar');
    // Ne compter QUE les changements réellement différents de l'original
    let dirtyCount = 0;
    for (const [name] of _pfPending) {
        if (_pfIsDirty(name)) dirtyCount++;
    }
    if (bar) {
        const countEl = document.getElementById('pfConfirmCount');
        if (countEl) countEl.textContent = dirtyCount === 1 ? '1 modification' : `${dirtyCount} modifications`;
        bar.classList.toggle('visible', dirtyCount > 0);
    }
    // Bouton Sauvegarder dans le header du portfolio
    const saveBtn = document.getElementById('pfSaveBtn');
    if (saveBtn) {
        const label = saveBtn.querySelector('.pf-save-label');
        const badge = saveBtn.querySelector('.pf-save-badge');
        const isDirty = dirtyCount > 0;
        saveBtn.classList.toggle('dirty', isDirty);
        saveBtn.disabled = !isDirty;
        if (label) label.textContent = isDirty ? 'Sauvegarder' : 'Sauvegardé';
        if (badge) {
            if (isDirty) {
                badge.textContent = String(dirtyCount);
                badge.hidden = false;
                saveBtn.setAttribute('title', dirtyCount === 1 ? '1 modification à sauvegarder' : `${dirtyCount} modifications à sauvegarder`);
            } else {
                badge.hidden = true;
                saveBtn.setAttribute('title', 'Aucune modification en attente');
            }
        }
    }
}

async function confirmPfChanges() {
    if (_pfPending.size === 0) return;
    const pf = loadPortfolioSync();
    let applied = 0;
    for (const [name, v] of _pfPending) {
        if (!pf[name]) pf[name] = { qty: 0, cost: 0 };
        const orig = pf[name];
        if (orig.qty !== v.qty || orig.cost !== v.cost) applied++;
        pf[name] = { qty: v.qty, cost: v.cost };
    }
    // Indicateur "synchronisation..." pendant l'envoi serveur
    const bar = document.getElementById('pfConfirmBar');
    const saveBtn = document.getElementById('pfSaveBtn');
    bar?.classList.add('syncing');
    saveBtn?.classList.add('syncing');
    const savedLabel = saveBtn?.querySelector('.pf-save-label');
    const previousLabel = savedLabel?.textContent;
    if (savedLabel) savedLabel.textContent = 'Sauvegarde…';
    const ok = await savePortfolio(pf);
    bar?.classList.remove('syncing');
    saveBtn?.classList.remove('syncing');
    if (savedLabel && previousLabel) savedLabel.textContent = previousLabel;
    if (ok) {
        _pfPending.clear();
        updatePfConfirmBar();
        showToast('✅', applied === 1 ? 'Modification enregistrée' : `${applied} modifications enregistrées`);
        renderPortfolio();
    }
    // Si !ok, on garde _pfPending pour permettre une nouvelle tentative
}

function discardPfChanges() {
    if (_pfPending.size === 0) return;
    _pfPending.clear();
    updatePfConfirmBar();
    showToast('↺', 'Modifications annulées');
    renderPortfolio();
}

// ── Portfolio v2 state ──────────────────────────────────────
let _pfTab = 'positions';
let _pfRange = 'all';
let _pfAllocMode = 'type';
let _pfAddTypeFilter = '';
let _pfAllocChart = null;

function switchPfTab(tab) {
    _pfTab = tab;
    document.querySelectorAll('.pf-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.getElementById('pfPanelPositions').style.display = tab === 'positions' ? 'block' : 'none';
    document.getElementById('pfPanelAdd').style.display = tab === 'add' ? 'block' : 'none';
    document.getElementById('pfPanelHistory').style.display = tab === 'history' ? 'block' : 'none';
    if (tab === 'add') renderAddCatalog();
    if (tab === 'history') renderPortfolioHistoryTab();
}

function togglePfMenu(ev) {
    if (ev) ev.stopPropagation();
    const menu = document.getElementById('pfMenu');
    menu?.classList.toggle('open');
}

function closePfMenu() {
    document.getElementById('pfMenu')?.classList.remove('open');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('pfMenu');
    const btn = document.getElementById('pfMenuBtn');
    if (menu && !menu.contains(e.target) && e.target !== btn && !btn?.contains(e.target)) {
        menu.classList.remove('open');
    }
});

function setPfRange(range) {
    _pfRange = range;
    document.querySelectorAll('#pfRange button').forEach(b => b.classList.toggle('active', b.dataset.range === range));
    loadPortfolioChart();
}

function setAllocMode(mode) {
    _pfAllocMode = mode;
    document.querySelectorAll('#pfAllocToggle button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    renderAllocChart();
}

function setAddTypeFilter(t) {
    _pfAddTypeFilter = t;
    document.querySelectorAll('#pfAddFilters .pf-chip').forEach(b => b.classList.toggle('active', b.dataset.type === t));
    renderAddCatalog();
}

// ── Enhanced position card ──────────────────────────────────
function renderPortfolioPositionCard(p, pf) {
    const h = pf[p.name] || { qty: 0, cost: 0 };
    const totalInvested = h.qty * h.cost;
    const currentVal = h.qty * p.price;
    const pnl = currentVal - totalInvested;
    const pnlPct = totalInvested > 0 ? ((pnl / totalInvested) * 100) : 0;
    const pnlClass = pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : '';
    const pnlSign = pnl >= 0 ? '+' : '';
    const arrow = pnl > 0 ? '▲' : pnl < 0 ? '▼' : '—';
    const safe = p.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const img = p.img || `https://placehold.co/200x260/1a2230/525a66?text=${encodeURIComponent(p.type.toUpperCase())}`;

    return `<div class="pf-pos-card" data-name="${p.name.replace(/"/g, '&quot;')}">
        <button class="pf-pos-remove" onclick="pfRemovePosition('${safe}')" title="Retirer du portfolio" aria-label="Retirer">×</button>
        <div class="pf-pos-top" onclick="openDetail('${safe}')">
            <div class="pf-pos-img"><img src="${img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
            <div class="pf-pos-info">
                <div class="pf-pos-meta">
                    <span class="product-type type-${p.type}">${TYPE_LABELS[p.type] || p.type}</span>
                    <span class="pf-pos-serie">${p.serie}</span>
                </div>
                <h3 class="pf-pos-name">${p.name}</h3>
                <div class="pf-pos-pnl-big ${pnlClass}">
                    <span class="pf-pos-pnl-arrow">${arrow}</span>
                    <span class="pf-pos-pnl-pct">${pnlSign}${pnlPct.toFixed(1)}%</span>
                    <span class="pf-pos-pnl-abs">${pnlSign}${fmt(pnl)}</span>
                </div>
            </div>
        </div>
        <div class="pf-pos-inputs">
            <div class="pf-field">
                <label>Qté</label>
                <input type="number" min="0" value="${h.qty}" oninput="onPortfolioInput('${safe}','qty',this.value)" placeholder="0">
            </div>
            <div class="pf-field">
                <label>Prix achat €</label>
                <input type="number" min="0" step="0.01" value="${h.cost || ''}" oninput="onPortfolioInput('${safe}','cost',this.value)" placeholder="0,00">
            </div>
            <div class="pf-field pf-field-readonly">
                <label>Cours actuel</label>
                <div class="pf-field-value">${fmt(p.price)}</div>
            </div>
        </div>
        <div class="pf-pos-footer">
            <div class="pf-pos-kpi"><span>Investi</span><strong>${fmt(totalInvested)}</strong></div>
            <div class="pf-pos-kpi"><span>Valeur</span><strong>${fmt(currentVal)}</strong></div>
            <div class="pf-pos-kpi"><span>Gain/perte</span><strong class="${pnlClass}">${pnlSign}${fmt(pnl)}</strong></div>
        </div>
    </div>`;
}

// Compat — conservé pour les anciens appels
function renderPortfolioCard(p, pf) {
    return renderPortfolioPositionCard(p, pf);
}

// Supprime une position (qty=0, cost=0)
async function pfRemovePosition(name) {
    const p = products.find(pr => pr.name === name);
    const label = p ? p.name : name;
    if (!confirm(`Retirer "${label}" de votre portfolio ?`)) return;
    const pf = loadPortfolioSync();
    if (pf[name]) { pf[name] = { qty: 0, cost: 0 }; }
    const ok = await savePortfolio(pf);
    if (ok) showToast('🗑️', 'Position retirée', label);
    renderPortfolio();
}

// ── Enhanced summary (6 KPIs + variation 24h) ──────────────
function renderPortfolioSummary(pf) {
    let totalInvested = 0, totalCurrent = 0, totalItems = 0, positions = 0;
    let best = null, worst = null;

    for (const p of products) {
        const h = pf[p.name];
        if (!h || h.qty <= 0) continue;
        positions++;
        totalItems += h.qty;
        const inv = h.qty * h.cost;
        const val = h.qty * p.price;
        totalInvested += inv;
        totalCurrent += val;
        const pnl = val - inv;
        const pct = inv > 0 ? (pnl / inv) * 100 : 0;
        if (!best || pct > best.pct) best = { name: p.name, pct, pnl };
        if (!worst || pct < worst.pct) worst = { name: p.name, pct, pnl };
    }

    const totalPnl = totalCurrent - totalInvested;
    const pnlPct = totalInvested > 0 ? ((totalPnl / totalInvested) * 100) : 0;
    const pnlClass = totalPnl > 0 ? 'positive' : totalPnl < 0 ? 'negative' : '';

    // Variation vs snapshot le plus récent
    const history = getPortfolioHistory();
    let variation24 = null;
    if (history.length >= 2) {
        const today = history[history.length - 1];
        const prev = history[history.length - 2];
        if (prev.value > 0) {
            const diff = today.value - prev.value;
            variation24 = { diff, pct: (diff / prev.value) * 100 };
        }
    }

    const varHtml = variation24
        ? `<span class="pf-stat-delta ${variation24.diff >= 0 ? 'positive' : 'negative'}">${variation24.diff >= 0 ? '▲' : '▼'} ${variation24.diff >= 0 ? '+' : ''}${variation24.pct.toFixed(2)}%</span>`
        : '<span class="pf-stat-delta pf-stat-delta-muted">—</span>';

    const bestHtml = best
        ? `<div class="pf-hero-kpi-name">${best.name}</div><div class="pf-hero-kpi-value positive">+${best.pct.toFixed(1)}%</div>`
        : `<div class="pf-hero-kpi-name pf-hero-kpi-empty">Aucune position</div>`;

    const worstHtml = worst && worst.pct < 0
        ? `<div class="pf-hero-kpi-name">${worst.name}</div><div class="pf-hero-kpi-value negative">${worst.pct.toFixed(1)}%</div>`
        : worst
            ? `<div class="pf-hero-kpi-name">${worst.name}</div><div class="pf-hero-kpi-value">${worst.pct >= 0 ? '+' : ''}${worst.pct.toFixed(1)}%</div>`
            : `<div class="pf-hero-kpi-name pf-hero-kpi-empty">Aucune position</div>`;

    document.getElementById('portfolioSummary').innerHTML = `
        <div class="pf-stat pf-stat-primary">
            <span class="pf-stat-label">Valeur du portfolio</span>
            <span class="pf-stat-value">${fmt(totalCurrent)}</span>
            ${varHtml}
        </div>
        <div class="pf-stat">
            <span class="pf-stat-label">P&L total</span>
            <span class="pf-stat-value ${pnlClass}">${totalPnl >= 0 ? '+' : ''}${fmt(totalPnl)}</span>
            <span class="pf-stat-delta ${pnlClass}">${totalPnl >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%</span>
        </div>
        <div class="pf-stat">
            <span class="pf-stat-label">Total investi</span>
            <span class="pf-stat-value">${fmt(totalInvested)}</span>
            <span class="pf-stat-delta pf-stat-delta-muted">${totalItems} articles · ${positions} position${positions > 1 ? 's' : ''}</span>
        </div>
        <div class="pf-stat pf-stat-kpi">
            <span class="pf-stat-label">Meilleure position</span>
            ${bestHtml}
        </div>
        <div class="pf-stat pf-stat-kpi">
            <span class="pf-stat-label">Pire position</span>
            ${worstHtml}
        </div>
    `;

    // Badge onglet
    const tabCount = document.getElementById('pfTabCountPositions');
    if (tabCount) tabCount.textContent = positions;
}

// ── Top positions ──────────────────────────────────────────
function renderTopPositions(pf) {
    const wrap = document.getElementById('pfTopWrap');
    if (!wrap) return;
    const list = [];
    for (const p of products) {
        const h = pf[p.name];
        if (!h || h.qty <= 0) continue;
        const val = h.qty * p.price;
        const inv = h.qty * h.cost;
        const pnl = val - inv;
        const pct = inv > 0 ? (pnl / inv) * 100 : 0;
        list.push({ p, h, val, inv, pnl, pct });
    }
    if (list.length === 0) { wrap.innerHTML = ''; return; }

    const sorted = [...list].sort((a, b) => b.val - a.val);
    const total = sorted.reduce((s, x) => s + x.val, 0);
    const top = sorted.slice(0, 5);

    wrap.innerHTML = `
        <div class="pf-top-card">
            <div class="pf-chart-header">
                <h2 class="portfolio-chart-title">Top 5 positions</h2>
                <span class="pf-top-subtitle">par valeur actuelle</span>
            </div>
            <div class="pf-top-bars">
                ${top.map(x => {
                    const w = total > 0 ? (x.val / total * 100) : 0;
                    const pnlClass = x.pnl > 0 ? 'positive' : x.pnl < 0 ? 'negative' : '';
                    return `<div class="pf-top-row" onclick="openDetail('${x.p.name.replace(/'/g, "\\'")}')">
                        <div class="pf-top-name">
                            <span class="product-type type-${x.p.type}">${TYPE_LABELS[x.p.type] || x.p.type}</span>
                            <span>${x.p.name}</span>
                        </div>
                        <div class="pf-top-bar-wrap"><div class="pf-top-bar" style="width:${w.toFixed(1)}%"></div></div>
                        <div class="pf-top-value">${fmt(x.val)}</div>
                        <div class="pf-top-pnl ${pnlClass}">${x.pnl >= 0 ? '+' : ''}${x.pct.toFixed(1)}%</div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;
}

// ── Allocation chart ───────────────────────────────────────
const ALLOC_COLORS = [
    '#22c55e', '#22d3ee', '#a78bfa', '#f59e0b', '#ef4444',
    '#3b82f6', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6',
    '#84cc16', '#06b6d4', '#d946ef', '#f43f5e', '#0ea5e9',
];

function renderAllocChart() {
    const canvas = document.getElementById('pfAllocChart');
    const legend = document.getElementById('pfAllocLegend');
    if (!canvas || !legend) return;

    const pf = loadPortfolioSync();
    const buckets = new Map();
    let total = 0;
    for (const p of products) {
        const h = pf[p.name];
        if (!h || h.qty <= 0) continue;
        const val = h.qty * p.price;
        const key = _pfAllocMode === 'type' ? (TYPE_LABELS[p.type] || p.type) : p.serie;
        buckets.set(key, (buckets.get(key) || 0) + val);
        total += val;
    }

    if (total === 0) {
        if (_pfAllocChart) { _pfAllocChart.destroy(); _pfAllocChart = null; }
        legend.innerHTML = '<div class="pf-alloc-empty">Ajoutez des positions pour voir l\'allocation</div>';
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const entries = [...buckets.entries()].sort((a, b) => b[1] - a[1]);
    const labels = entries.map(e => e[0]);
    const data = entries.map(e => e[1]);
    const colors = entries.map((_, i) => ALLOC_COLORS[i % ALLOC_COLORS.length]);

    if (_pfAllocChart) _pfAllocChart.destroy();
    const ctx = canvas.getContext('2d');
    _pfAllocChart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: 'rgba(0,0,0,0.35)', borderWidth: 2, hoverOffset: 6 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: c => `${c.label}: ${fmt(c.parsed)} (${(c.parsed / total * 100).toFixed(1)}%)`,
                    },
                },
            },
        },
    });

    legend.innerHTML = entries.map(([k, v], i) => {
        const pct = (v / total * 100).toFixed(1);
        return `<div class="pf-alloc-legend-item">
            <span class="pf-alloc-dot" style="background:${colors[i]}"></span>
            <span class="pf-alloc-legend-label">${k}</span>
            <span class="pf-alloc-legend-pct">${pct}%</span>
        </div>`;
    }).join('');
}

// ── Add Catalog (tab) ──────────────────────────────────────
function renderAddCatalog() {
    const grid = document.getElementById('pfAddGrid');
    if (!grid) return;
    const search = (document.getElementById('pfAddSearch')?.value || '').toLowerCase().trim();
    const pf = loadPortfolioSync();

    let list = [...products];
    if (_pfAddTypeFilter) list = list.filter(p => p.type === _pfAddTypeFilter);
    if (search) {
        // Recherche floue via Fuse si dispo
        if (typeof Fuse !== 'undefined') {
            const f = new Fuse(list, {
                keys: ['name', 'serie', 'ext'],
                threshold: 0.35,
                ignoreLocation: true,
                minMatchCharLength: 2,
            });
            list = f.search(search).map(r => r.item);
        } else {
            list = list.filter(p => p.name.toLowerCase().includes(search) || (p.serie || '').toLowerCase().includes(search) || (p.ext || '').toLowerCase().includes(search));
        }
    } else {
        list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    }

    if (list.length === 0) {
        grid.innerHTML = '<div class="pf-add-empty">Aucun produit ne correspond à votre recherche.</div>';
        return;
    }

    grid.innerHTML = list.map(p => {
        const owned = (pf[p.name]?.qty || 0) > 0;
        const safe = p.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const img = p.img || `https://placehold.co/100x130/1a2230/525a66?text=${encodeURIComponent(p.type.toUpperCase())}`;
        return `<div class="pf-add-item ${owned ? 'owned' : ''}">
            <div class="pf-add-img"><img src="${img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
            <div class="pf-add-info">
                <div class="pf-add-meta">
                    <span class="product-type type-${p.type}">${TYPE_LABELS[p.type] || p.type}</span>
                    <span class="pf-add-serie">${p.serie}</span>
                </div>
                <h4 class="pf-add-name">${p.name}</h4>
                <div class="pf-add-price">${fmt(p.price)}</div>
            </div>
            <button class="pf-add-btn ${owned ? 'owned' : ''}" onclick="openPfAddModal('${safe}')">
                ${owned ? '✓ Ajouté' : '+ Ajouter'}
            </button>
        </div>`;
    }).join('');
}

// ── Quick Add Modal ────────────────────────────────────────
function openPfAddModal(name) {
    const p = products.find(pr => pr.name === name);
    if (!p) return;
    const pf = loadPortfolioSync();
    const h = pf[p.name] || { qty: 0, cost: 0 };
    const modal = document.getElementById('pfAddModal');
    const body = document.getElementById('pfAddModalBody');
    const safe = p.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const img = p.img || `https://placehold.co/120x160/1a2230/525a66?text=${encodeURIComponent(p.type.toUpperCase())}`;

    body.innerHTML = `
        <div class="pf-add-modal-top">
            <div class="pf-add-modal-img"><img src="${img}" alt="${p.name}" onerror="this.style.display='none'"></div>
            <div class="pf-add-modal-info">
                <div class="pf-pos-meta"><span class="product-type type-${p.type}">${TYPE_LABELS[p.type] || p.type}</span><span class="pf-pos-serie">${p.serie}</span></div>
                <h3>${p.name}</h3>
                <div class="pf-add-modal-price">Cours actuel · <strong>${fmt(p.price)}</strong></div>
            </div>
        </div>
        <div class="pf-add-modal-form">
            <div class="pf-field">
                <label>Quantité</label>
                <input type="number" id="pfAddQty" min="1" value="${h.qty || 1}" inputmode="numeric">
            </div>
            <div class="pf-field">
                <label>Prix d'achat unitaire (€)</label>
                <input type="number" id="pfAddCost" min="0" step="0.01" value="${h.cost || p.price.toFixed(2)}" inputmode="decimal">
            </div>
        </div>
        <div class="pf-add-modal-actions">
            <button class="pf-btn-ghost" onclick="closePfAddModal()">Annuler</button>
            <button class="pf-btn-primary" onclick="confirmPfAdd('${safe}')">Ajouter au portfolio</button>
        </div>
    `;
    modal.classList.add('open');
    setTimeout(() => document.getElementById('pfAddQty')?.focus(), 50);
}

function closePfAddModal() {
    document.getElementById('pfAddModal')?.classList.remove('open');
}

async function confirmPfAdd(name) {
    const qty = parseFloat(document.getElementById('pfAddQty')?.value) || 0;
    const cost = parseFloat(document.getElementById('pfAddCost')?.value) || 0;
    if (qty <= 0) { showToast('⚠️', 'Quantité invalide', 'Entrez un nombre positif'); return; }
    const pf = loadPortfolioSync();
    pf[name] = { qty, cost };
    const ok = await savePortfolio(pf);
    closePfAddModal();
    if (ok) showToast('✅', 'Position ajoutée', `${qty}× ${name}`);
    switchPfTab('positions');
    renderPortfolio();
}

let portfolioChartInstance = null;

function _filterPfHistoryByRange(history, range) {
    if (!history || history.length === 0) return [];
    if (range === 'all') return history;
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const cutoff = Date.now() - days * 86400000;
    return history.filter(h => {
        const t = new Date(h.date).getTime();
        return !isNaN(t) && t >= cutoff;
    });
}

async function loadPortfolioChart() {
    const wrap = document.getElementById('portfolioChartWrap');
    if (!wrap) return;
    try {
        // 1) Essayer la source distante si auth, sinon fallback local
        let history = null;
        if (authToken) {
            try {
                const res = await fetch('/api/portfolio-history', { headers: { 'Authorization': `Bearer ${authToken}` } });
                if (res.ok) history = await res.json();
            } catch {}
        }
        if (!history || history.length === 0) history = getPortfolioHistory();

        const filtered = _filterPfHistoryByRange(history, _pfRange);
        if (!filtered || filtered.length === 0) {
            wrap.style.display = 'block';
            const ctx = document.getElementById('portfolioChart').getContext('2d');
            if (portfolioChartInstance) { portfolioChartInstance.destroy(); portfolioChartInstance = null; }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            return;
        }

        wrap.style.display = 'block';
        const labels = filtered.map(h => h.date);
        const investedData = filtered.map(h => h.invested);
        const valueData = filtered.map(h => h.value);
        const pnlData = filtered.map(h => h.pnl);

        if (portfolioChartInstance) portfolioChartInstance.destroy();

        const ctx = document.getElementById('portfolioChart').getContext('2d');
        // Gradient fill pour Valeur
        const grad = ctx.createLinearGradient(0, 0, 0, 260);
        grad.addColorStop(0, 'rgba(34,197,94,0.35)');
        grad.addColorStop(1, 'rgba(34,197,94,0.02)');

        portfolioChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Valeur', data: valueData, borderColor: '#22c55e', backgroundColor: grad, borderWidth: 2.4, pointRadius: 0, pointHoverRadius: 5, tension: 0.35, fill: true },
                    { label: 'Investi', data: investedData, borderColor: 'rgba(148,163,184,0.8)', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 0, pointHoverRadius: 4, tension: 0.3, fill: false },
                    { label: 'P&L', data: pnlData, borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.08)', borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.3, fill: false },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, boxHeight: 12, usePointStyle: true, pointStyle: 'circle' } },
                    tooltip: {
                        backgroundColor: 'rgba(15,19,25,0.95)',
                        borderColor: 'rgba(34,197,94,0.3)',
                        borderWidth: 1,
                        padding: 10,
                        titleColor: '#f0f6fc',
                        bodyColor: '#9ba4b0',
                        callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.parsed.y)}` },
                    },
                },
                scales: {
                    x: { ticks: { color: '#64748b', maxRotation: 0, autoSkip: true, maxTicksLimit: 8, font: { size: 10 } }, grid: { color: 'rgba(148,163,184,0.06)' } },
                    y: { ticks: { color: '#64748b', callback: v => fmt(v), font: { size: 10 } }, grid: { color: 'rgba(148,163,184,0.06)' } },
                },
            },
        });
    } catch {
        if (wrap) wrap.style.display = 'none';
    }
}

// Historique local du portfolio (sans authentification)
function saveLocalPortfolioSnapshot(pf) {
    let totalInvested = 0, totalValue = 0, totalItems = 0;
    for (const p of products) {
        const h = pf[p.name];
        if (!h || h.qty <= 0) continue;
        totalItems += h.qty;
        totalInvested += h.qty * h.cost;
        totalValue += h.qty * p.price;
    }
    if (totalItems === 0) return;

    const today = new Date().toISOString().slice(0, 10);
    const entry = {
        date: today,
        invested: Math.round(totalInvested * 100) / 100,
        value: Math.round(totalValue * 100) / 100,
        pnl: Math.round((totalValue - totalInvested) * 100) / 100,
        items: totalItems,
    };

    let history = [];
    try { history = JSON.parse(localStorage.getItem('pokescelle-pf-history') || '[]'); } catch {}
    const idx = history.findIndex(h => h.date === today);
    if (idx >= 0) history[idx] = entry;
    else history.push(entry);
    if (history.length > 365) history.splice(0, history.length - 365);
    localStorage.setItem('pokescelle-pf-history', JSON.stringify(history));
}

function getPortfolioHistory() {
    try { return JSON.parse(localStorage.getItem('pokescelle-pf-history') || '[]'); } catch { return []; }
}

function renderPortfolioHistory(remoteHistory) {
    const local = getPortfolioHistory();
    const history = (remoteHistory && remoteHistory.length > 0) ? remoteHistory : local;
    const wrap = document.getElementById('portfolioHistoryWrap');
    const table = document.getElementById('portfolioHistoryTable');
    if (!wrap || !table) return;

    wrap.style.display = 'block';

    if (!history || history.length === 0) {
        table.innerHTML = `<div class="pf-add-empty">Aucun historique disponible. L'historique s'accumule à chaque visite quand vous avez des positions.</div>`;
        return;
    }

    const reversed = [...history].reverse();

    table.innerHTML = `
        <div class="pfh-table">
            <div class="pfh-header">
                <span class="pfh-col-date">Date</span>
                <span class="pfh-col">Investi</span>
                <span class="pfh-col">Valeur</span>
                <span class="pfh-col">P&L</span>
                <span class="pfh-col">Évolution</span>
            </div>
            ${reversed.map((h, i) => {
                const prev = reversed[i + 1];
                const evolution = prev ? ((h.value - prev.value) / prev.value * 100) : 0;
                const evoClass = evolution > 0 ? 'positive' : evolution < 0 ? 'negative' : '';
                const pnlClass = h.pnl > 0 ? 'positive' : h.pnl < 0 ? 'negative' : '';
                return `<div class="pfh-row">
                    <span class="pfh-col-date">${h.date}</span>
                    <span class="pfh-col">${fmt(h.invested)}</span>
                    <span class="pfh-col" style="font-weight:600">${fmt(h.value)}</span>
                    <span class="pfh-col ${pnlClass}">${h.pnl >= 0 ? '+' : ''}${fmt(h.pnl)}</span>
                    <span class="pfh-col ${evoClass}">${prev ? (evolution >= 0 ? '+' : '') + evolution.toFixed(1) + '%' : '—'}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

async function renderPortfolio() {
    const pf = await loadPortfolio();

    // Sauvegarder un snapshot local
    saveLocalPortfolioSnapshot(pf);

    // 1) Uniquement les produits détenus
    const search = (document.getElementById('pfPositionSearch')?.value || '').toLowerCase().trim();
    const sortMode = document.getElementById('pfSortSelect')?.value || 'pnl-desc';

    let positions = products
        .filter(p => (pf[p.name]?.qty || 0) > 0)
        .map(p => {
            const h = pf[p.name];
            const inv = h.qty * h.cost;
            const val = h.qty * p.price;
            const pnl = val - inv;
            const pct = inv > 0 ? (pnl / inv) * 100 : 0;
            return { p, h, inv, val, pnl, pct };
        });

    if (search) {
        // Recherche floue sur les positions (via Fuse si dispo)
        if (typeof Fuse !== 'undefined') {
            const posFuse = new Fuse(positions, {
                keys: ['p.name', 'p.serie', 'p.ext'],
                threshold: 0.35,
                ignoreLocation: true,
                minMatchCharLength: 2,
            });
            positions = posFuse.search(search).map(r => r.item);
        } else {
            const s = search.toLowerCase();
            positions = positions.filter(x =>
                x.p.name.toLowerCase().includes(s) ||
                (x.p.serie || '').toLowerCase().includes(s) ||
                (x.p.ext || '').toLowerCase().includes(s)
            );
        }
    }

    const sortFns = {
        'pnl-desc': (a, b) => b.pnl - a.pnl,
        'pnl-asc': (a, b) => a.pnl - b.pnl,
        'pnlpct-desc': (a, b) => b.pct - a.pct,
        'value-desc': (a, b) => b.val - a.val,
        'name': (a, b) => a.p.name.localeCompare(b.p.name, 'fr'),
        'serie': (a, b) => (a.p.serie || '').localeCompare(b.p.serie || '', 'fr'),
    };
    positions.sort(sortFns[sortMode] || sortFns['pnl-desc']);

    // 2) Rendu
    const grid = document.getElementById('portfolioGrid');
    const empty = document.getElementById('pfEmpty');
    const hasPositions = Object.values(pf).some(h => h.qty > 0);

    if (!hasPositions) {
        grid.innerHTML = '';
        if (empty) empty.style.display = 'flex';
        document.getElementById('pfAnalytics').style.display = 'none';
        document.getElementById('pfTopWrap').innerHTML = '';
        document.querySelector('.pf-positions-header').style.display = 'none';
    } else {
        if (empty) empty.style.display = 'none';
        document.getElementById('pfAnalytics').style.display = '';
        document.querySelector('.pf-positions-header').style.display = '';
        grid.innerHTML = positions.length > 0
            ? positions.map(x => renderPortfolioPositionCard(x.p, pf)).join('')
            : '<div class="pf-add-empty">Aucune position ne correspond à votre recherche.</div>';
    }

    renderPortfolioSummary(pf);
    renderTopPositions(pf);
    loadPortfolioChart();
    renderAllocChart();

    // Réappliquer l'état dirty sur les cartes qui ont des modifs pendantes
    if (_pfPending.size > 0) {
        for (const [name] of _pfPending) {
            if (!_pfIsDirty(name)) continue;
            const card = document.querySelector(`.pf-pos-card[data-name="${name.replace(/"/g, '&quot;')}"]`);
            if (card) {
                card.classList.add('dirty');
                // Réappliquer les valeurs pendantes dans les inputs
                const pending = _pfPending.get(name);
                const inputs = card.querySelectorAll('.pf-pos-inputs input');
                if (inputs[0]) inputs[0].value = pending.qty;
                if (inputs[1]) inputs[1].value = pending.cost || '';
            }
        }
    }
    updatePfConfirmBar();
}

// Historique dans son propre onglet
async function renderPortfolioHistoryTab() {
    if (authToken) {
        try {
            const res = await fetch('/api/portfolio-history', { headers: { 'Authorization': `Bearer ${authToken}` } });
            const remote = await res.json();
            renderPortfolioHistory(remote);
            return;
        } catch {}
    }
    renderPortfolioHistory(null);
}

// ── Toast Notifications ─────────────────────────────────────

function showToast(icon, message, sub = '') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-text">${message}${sub ? `<small>${sub}</small>` : ''}</div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ── Scroll to Top ───────────────────────────────────────────

function scrollToTop() {
    const section = document.querySelector('.section-catalogue:not([style*="none"]), .section-portfolio:not([style*="none"]), .section-tendances:not([style*="none"]), .section-simulation:not([style*="none"])');
    if (section) section.scrollTo({ top: 0, behavior: 'smooth' });
}

function initScrollTopBtn() {
    const btn = document.getElementById('scrollTopBtn');
    ['sectionDashboard', 'sectionCatalogue', 'sectionPortfolio', 'sectionTendances', 'sectionSimulation'].forEach(id => {
        document.getElementById(id).addEventListener('scroll', function() {
            btn.classList.toggle('visible', this.scrollTop > 300);
        });
    });
}

// ── Portfolio Badge ─────────────────────────────────────────

function updatePortfolioBadge() {
    const pf = loadPortfolioSync();
    const count = Object.values(pf).filter(h => h.qty > 0).length;
    const text = count > 0 ? count : '';
    const badge = document.getElementById('portfolioBadge');
    if (badge) badge.textContent = text;
    const bnBadge = document.getElementById('bottomNavPfBadge');
    if (bnBadge) {
        bnBadge.textContent = text;
        bnBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
}

// ── Favoris ────────────────────────────────────────────────────

function getFavorites() {
    try { return JSON.parse(localStorage.getItem('pokescelle-favorites') || '[]'); } catch { return []; }
}

function toggleFavorite(name, e) {
    if (e) e.stopPropagation();
    const favs = getFavorites();
    const idx = favs.indexOf(name);
    if (idx >= 0) { favs.splice(idx, 1); showToast('💔', 'Retiré des favoris', name); }
    else { favs.push(name); showToast('⭐', 'Ajouté aux favoris', name); }
    localStorage.setItem('pokescelle-favorites', JSON.stringify(favs));
    // Update star icons
    document.querySelectorAll('.product-fav-btn').forEach(btn => {
        btn.classList.toggle('fav-active', favs.includes(btn.dataset.name));
    });
    updateFavBadge();
}

let showFavOnly = false;

function toggleFavFilter() {
    showFavOnly = !showFavOnly;
    document.getElementById('favFilterBtn')?.classList.toggle('active', showFavOnly);
    render();
}

function updateFavBadge() {
    const el = document.getElementById('favCount');
    if (el) el.textContent = getFavorites().length || '';
}

// ── Alertes de prix ────────────────────────────────────────────

function getAlerts() {
    try { return JSON.parse(localStorage.getItem('pokescelle-alerts') || '{}'); } catch { return {}; }
}

function setAlert(name) {
    const current = getAlerts()[name]?.threshold || '';
    const val = prompt(`Alerte quand "${name}" passe sous quel prix (€) ?\n(Vide pour supprimer l'alerte)`, current);
    if (val === null) return;
    const alerts = getAlerts();
    if (val.trim() === '') { delete alerts[name]; showToast('🔕', 'Alerte supprimée', name); }
    else { alerts[name] = { threshold: parseFloat(val), notified: false }; showToast('🔔', `Alerte à ${val} €`, name); }
    localStorage.setItem('pokescelle-alerts', JSON.stringify(alerts));
}

function checkAlerts() {
    const alerts = getAlerts();
    for (const [name, alert] of Object.entries(alerts)) {
        if (alert.notified) continue;
        const p = products.find(pr => pr.name === name);
        if (p && p._ebayLoaded && p.price > 0 && p.price <= alert.threshold) {
            showToast('🔔', `${name} est à ${fmt(p.price)} !`, `Sous votre seuil de ${alert.threshold} €`);
            sendNotification('PokéScellé — Alerte prix', `${name} est à ${fmt(p.price)} (seuil: ${alert.threshold} €)`);
            alerts[name].notified = true;
        }
    }
    localStorage.setItem('pokescelle-alerts', JSON.stringify(alerts));
}

// ── Comparateur ────────────────────────────────────────────────

let compareList = [];

function toggleCompare(name, e) {
    if (e) e.stopPropagation();
    const idx = compareList.indexOf(name);
    if (idx >= 0) { compareList.splice(idx, 1); }
    else { if (compareList.length >= 3) { showToast('⚠️', 'Maximum 3 produits'); return; } compareList.push(name); }
    updateCompareBar();
}

function updateCompareBar() {
    let bar = document.getElementById('compareBar');
    if (compareList.length === 0) { if (bar) bar.remove(); return; }
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'compareBar';
        bar.className = 'compare-bar';
        document.body.appendChild(bar);
    }
    bar.innerHTML = `
        <div class="compare-bar-content">
            <span class="compare-bar-label">${compareList.length} produit${compareList.length > 1 ? 's' : ''} sélectionné${compareList.length > 1 ? 's' : ''}</span>
            <div class="compare-bar-items">${compareList.map(n => `<span class="compare-bar-item">${n} <button onclick="toggleCompare('${n.replace(/'/g, "\\'")}')">×</button></span>`).join('')}</div>
            <button class="compare-bar-btn" onclick="openComparator()" ${compareList.length < 2 ? 'disabled' : ''}>Comparer</button>
        </div>
    `;
}

function openComparator() {
    if (compareList.length < 2) return;
    const prods = compareList.map(n => products.find(p => p.name === n)).filter(Boolean);
    const existing = document.getElementById('comparatorOverlay');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = 'comparatorOverlay';
    div.className = 'detail-overlay open';
    div.innerHTML = `
        <div class="detail-modal" style="max-width:1000px">
            <div class="detail-banner" style="height:60px">
                <h2 style="color:#fff;font-size:16px;margin:auto 0">Comparateur de produits</h2>
                <button class="detail-banner-close" onclick="document.getElementById('comparatorOverlay').remove();compareList=[];updateCompareBar()">&times;</button>
            </div>
            <div style="padding:24px;overflow-x:auto">
                <table class="compare-table">
                    <thead>
                        <tr>
                            <th></th>
                            ${prods.map(p => `<th>${p.name}<br><small style="color:var(--text-muted);font-weight:400">${p.ext}</small></th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Type</td>${prods.map(p => `<td><span class="product-type type-${p.type}">${TYPE_LABELS[p.type]}</span></td>`).join('')}</tr>
                        <tr><td>Prix actuel</td>${prods.map(p => `<td style="font-weight:700;font-size:16px">${fmt(p.price)}</td>`).join('')}</tr>
                        <tr><td>Dernier prix</td>${prods.map(p => `<td>${fmt(p.lastPrice || p.lastListing?.price || p.price)}</td>`).join('')}</tr>
                        <tr><td>Prix minimum</td>${prods.map(p => `<td style="color:var(--green-light)">${fmt(p.low)}</td>`).join('')}</tr>
                        <tr><td>Prix maximum</td>${prods.map(p => `<td style="color:var(--red)">${fmt(p.high)}</td>`).join('')}</tr>
                        <tr><td>Tendance</td>${prods.map(p => `<td class="${p.trend > 0 ? 'positive' : p.trend < 0 ? 'negative' : ''}">${trendLabel(p.trend)}</td>`).join('')}</tr>
                        <tr><td>Prix sortie</td>${prods.map(p => `<td>${fmt(MSRP[p.type] || 0)}</td>`).join('')}</tr>
                        <tr><td>Performance</td>${prods.map(p => { const msrp = MSRP[p.type] || 0; const perf = msrp > 0 ? ((p.price - msrp) / msrp * 100) : 0; return `<td class="${perf > 0 ? 'positive' : 'negative'}">${perf >= 0 ? '+' : ''}${perf.toFixed(1)}%</td>`; }).join('')}</tr>
                        <tr><td>Résultats eBay</td>${prods.map(p => `<td>${p.sampleSize || '—'}</td>`).join('')}</tr>
                        <tr><td>Série</td>${prods.map(p => `<td>${p.serie}</td>`).join('')}</tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    div.addEventListener('click', e => { if (e.target === div) { div.remove(); compareList = []; updateCompareBar(); } });
    document.body.appendChild(div);
}

// ── Export CSV Portfolio ────────────────────────────────────────

function exportPortfolioCSV() {
    const pf = loadPortfolioSync();
    const rows = [['Produit', 'Type', 'Série', 'Quantité', 'Prix achat', 'Prix actuel', 'Investi', 'Valeur', 'P&L']];
    for (const p of products) {
        const h = pf[p.name] || { qty: 0, cost: 0 };
        if (h.qty <= 0) continue;
        const inv = h.qty * h.cost;
        const val = h.qty * p.price;
        rows.push([p.name, TYPE_LABELS[p.type] || p.type, p.serie, h.qty, h.cost.toFixed(2), p.price.toFixed(2), inv.toFixed(2), val.toFixed(2), (val - inv).toFixed(2)]);
    }
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pokescelle-portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('📥', 'Portfolio exporté', 'Fichier CSV téléchargé');
}

// ── Simulation ──────────────────────────────────────────────

let simScenario = 'moderate';
let simFilterType = '';
let simFilterSeries = '';
let simSort = 'mult20';
let simYears = 10;          // Horizon dynamique (1 a 30 ans)
let simInflation = false;   // Mode rendement reel (deduit ~3%/an d'inflation)

const SIM_INFLATION_RATE = 0.03; // 3 %/an, moyenne historique zone euro

function setSimScenario(scenario) {
    simScenario = scenario;
    document.querySelectorAll('.sim-scenario-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.scenario === scenario);
    });
    renderSimulation();
}

function setSimYears(years) {
    simYears = Math.max(1, Math.min(30, parseInt(years) || 10));
    const lbl = document.getElementById('simYearsLabel');
    if (lbl) lbl.textContent = `${simYears} an${simYears > 1 ? 's' : ''}`;
    renderSimulation();
}

function toggleSimInflation() {
    simInflation = !simInflation;
    const btn = document.getElementById('simInflationBtn');
    if (btn) btn.classList.toggle('active', simInflation);
    renderSimulation();
}

function setSimFilterType(type) {
    simFilterType = simFilterType === type ? '' : type;
    renderSimProductTable();
}

function setSimFilterSeries(code) {
    simFilterSeries = code;
    renderSimProductTable();
}

function setSimSort(sort) {
    simSort = sort;
    renderSimProductTable();
}

// Taux de croissance annuel estimé selon le scénario et le type de produit
function getGrowthRate(type, scenario, seriesAge) {
    // Base rates par type (les ETB et displays prennent plus de valeur).
    // Pessimistic = correction de marche / saturation (croissance faible voire negative).
    const baseRates = {
        pessimistic:  { etb: -0.02, display: -0.01, display18: -0.03, booster: 0.00, tripack: -0.04, bundle: -0.03, dispbundle: 0.00 },
        conservative: { etb: 0.06, display: 0.08, display18: 0.05, booster: 0.10, tripack: 0.04, bundle: 0.05, dispbundle: 0.07 },
        moderate:     { etb: 0.10, display: 0.12, display18: 0.08, booster: 0.15, tripack: 0.06, bundle: 0.08, dispbundle: 0.10 },
        optimistic:   { etb: 0.15, display: 0.18, display18: 0.12, booster: 0.22, tripack: 0.10, bundle: 0.12, dispbundle: 0.15 },
    };
    let rate = baseRates[scenario]?.[type];
    if (rate === undefined) rate = baseRates[scenario]?.etb ?? 0.08;

    // Bonus d'age : les series plus anciennes ont prouve leur valeur.
    // Ne s'applique qu'aux scenarios positifs (sinon on accelere une chute).
    if (rate > 0) {
        if (seriesAge >= 5) rate *= 1.15;
        if (seriesAge >= 10) rate *= 1.10;
    }

    // Mode rendement reel : on deduit l'inflation
    if (simInflation) rate -= SIM_INFLATION_RATE;

    return rate;
}

// Estimation de l'âge de la série basée sur le code
function getSeriesAge(code) {
    // EB01-EB03 : 2020
    if (['EB01', 'EB02', 'EB03'].includes(code)) return 6;
    if (code === 'EB03.5') return 6;
    // EB04-EB06 : 2020-2021
    if (['EB04', 'EB04.5', 'EB05', 'EB06'].includes(code)) return 5;
    // EB07-EB10 : 2021-2022
    if (['EB07', 'EB08', 'EB09', 'EB10', 'EB10.5'].includes(code)) return 4;
    // Épée et Bouclier : 2022-2023
    if (code.startsWith('EB') || code.startsWith('SWSH')) return 3;
    // EV01-EV03 : 2023
    if (['EV01', 'EV02', 'EV03'].includes(code)) return 3;
    // EV3.5 (151) : 2023
    if (code === 'EV3.5') return 3;
    // EV04-EV06 : 2024
    if (['EV04', 'EV4.5', 'EV05', 'EV06', 'EV6.5'].includes(code)) return 2;
    // EV07+ : 2024-2025
    if (code.startsWith('EV')) return 1;
    // ME : 2025-2026
    if (code.startsWith('ME')) return 0.5;
    return 1;
}

function projectPrice(currentPrice, type, years, scenario, seriesAge) {
    const rate = getGrowthRate(type, scenario, seriesAge);
    // Croissance composée avec légère décélération sur le long terme
    const deceleration = years > 10 ? 0.85 : years > 5 ? 0.92 : 1;
    return currentPrice * Math.pow(1 + rate * deceleration, years);
}

function renderSimulation() {
    const scenarioMeta = {
        pessimistic:  { label: 'Pessimiste',   icon: '📉', color: '#ef4444', desc: 'Correction du marche : saturation de l\'offre, baisse de la demande. Hypothese : crash partiel.' },
        conservative: { label: 'Conservateur', icon: '🐢', color: '#38bdf8', desc: 'Croissance lente et stable, similaire aux placements classiques. Hypothese : le marche continue mais ralentit.' },
        moderate:     { label: 'Modéré',       icon: '📊', color: '#f59e0b', desc: 'Croissance soutenue basee sur les tendances actuelles du marche scelle. Hypothese : la demande reste forte.' },
        optimistic:   { label: 'Optimiste',    icon: '🚀', color: '#22c55e', desc: 'Forte croissance portee par la nostalgie et la rarefaction. Hypothese : boom du marche.' },
    };

    // Source des donnees : portefeuille de l'utilisateur si non-vide, sinon catalogue complet
    const pf = loadPortfolioSync();
    const pfMap = {};
    let pfPositions = 0;
    for (const [name, data] of Object.entries(pf || {})) {
        if (data && data.qty > 0) {
            pfMap[name] = data.qty;
            pfPositions++;
        }
    }
    const usePortfolio = pfPositions > 0;
    const sourceLabel = usePortfolio
        ? `<span class="sim-info-pill sim-info-pill-pf">📦 ${pfPositions} position${pfPositions > 1 ? 's' : ''} de votre portefeuille</span>`
        : `<span class="sim-info-pill sim-info-pill-muted">📚 Catalogue complet (1 ex de chaque)</span>`;

    const info = scenarioMeta[simScenario];
    document.getElementById('simInfoBar').innerHTML = `
        <span class="sim-info-label" style="color:${info.color}">${info.icon} ${info.label}</span>
        <span class="sim-info-desc">${info.desc}</span>
        ${sourceLabel}
        ${simInflation ? '<span class="sim-info-pill">Réel (−3 %/an inflation)</span>' : '<span class="sim-info-pill sim-info-pill-muted">Nominal</span>'}
    `;

    // Grouper par serie. Si on simule le portefeuille, on ne garde QUE les produits possedes.
    const seriesMap = {};
    for (const p of products) {
        if (!p._ebayLoaded && p.price <= 0) continue;
        if (usePortfolio && !pfMap[p.name]) continue; // skip non-possedes en mode portfolio
        const code = p.ext?.split(' — ')[0] || '';
        const name = p.ext?.split(' — ')[1] || '';
        if (!code) continue;
        if (!seriesMap[code]) seriesMap[code] = { code, name, products: [] };
        seriesMap[code].products.push(p);
    }
    const series = Object.values(seriesMap);

    // Calcul des projections (multiplications par qty si mode portefeuille)
    const Y = simYears;
    let totalNow = 0, totalEnd = 0;
    let totalMid = 0;
    const midY = Math.max(1, Math.round(Y / 2));
    const seriesProjections = series.map(s => {
        const age = getSeriesAge(s.code);
        let setNow = 0, setMid = 0, setEnd = 0;
        const prodProj = s.products.map(p => {
            const msrp = MSRP[p.type] || 0;
            const unitPrice = p.price > 0 ? p.price : msrp;
            if (unitPrice <= 0) return null;
            const qty = usePortfolio ? (pfMap[p.name] || 0) : 1;
            if (qty <= 0) return null;
            const priceTotal = unitPrice * qty;
            const projMid = projectPrice(unitPrice, p.type, midY, simScenario, age) * qty;
            const projEnd = projectPrice(unitPrice, p.type, Y, simScenario, age) * qty;
            const proj5 = projectPrice(unitPrice, p.type, 5, simScenario, age) * qty;
            const proj10 = projectPrice(unitPrice, p.type, 10, simScenario, age) * qty;
            const proj20 = projectPrice(unitPrice, p.type, 20, simScenario, age) * qty;
            setNow += priceTotal; setMid += projMid; setEnd += projEnd;
            return {
                ...p,
                msrp,
                qty,
                unitPrice,
                price: priceTotal, // affichee dans la table = total qty x unit
                projectedMid: projMid,
                projectedEnd: projEnd,
                projected5: proj5,
                projected10: proj10,
                projected20: proj20,
            };
        }).filter(Boolean);

        totalNow += setNow; totalMid += setMid; totalEnd += setEnd;
        return { ...s, setNow, setMid, setEnd, prodProj, age };
    });

    // KPIs globaux : actuel, mid, end + CAGR
    const multEnd = totalNow > 0 ? totalEnd / totalNow : 0;
    const multMid = totalNow > 0 ? totalMid / totalNow : 0;
    // CAGR = (Vend / Vnow)^(1/Y) - 1 -- en %
    const cagr = totalNow > 0 ? (Math.pow(multEnd, 1 / Y) - 1) * 100 : 0;
    const cagrCls = cagr >= 5 ? 'positive' : cagr <= 0 ? 'negative' : '';
    const cagrSign = cagr >= 0 ? '+' : '';

    document.getElementById('simGlobal').innerHTML = `
        <div class="sim-kpi-grid sim-kpi-grid-4">
            <div class="sim-kpi sim-kpi-now">
                <div class="sim-kpi-label">Valeur actuelle</div>
                <div class="sim-kpi-value">${fmt(totalNow)}</div>
                <div class="sim-kpi-sub">Tous les sets combinés</div>
            </div>
            <div class="sim-kpi sim-kpi-mid">
                <div class="sim-kpi-label">Dans ${midY} an${midY > 1 ? 's' : ''}</div>
                <div class="sim-kpi-value">${fmt(Math.round(totalMid))}</div>
                <div class="sim-kpi-sub">×${multMid.toFixed(2)} · ${multMid >= 1 ? '+' : ''}${((multMid - 1) * 100).toFixed(0)} %</div>
            </div>
            <div class="sim-kpi sim-kpi-end" style="border-color:${info.color}55">
                <div class="sim-kpi-label">Dans ${Y} an${Y > 1 ? 's' : ''}</div>
                <div class="sim-kpi-value" style="color:${info.color}">${fmt(Math.round(totalEnd))}</div>
                <div class="sim-kpi-sub">×${multEnd.toFixed(2)} · ${multEnd >= 1 ? '+' : ''}${((multEnd - 1) * 100).toFixed(0)} %</div>
            </div>
            <div class="sim-kpi sim-kpi-cagr">
                <div class="sim-kpi-label">Rendement annualisé (CAGR)</div>
                <div class="sim-kpi-value ${cagrCls}">${cagrSign}${cagr.toFixed(2)} %</div>
                <div class="sim-kpi-sub">Sur ${Y} an${Y > 1 ? 's' : ''} ${simInflation ? '(reel)' : '(nominal)'}</div>
            </div>
        </div>
    `;

    // Chart de comparaison des 4 scenarios (Chart.js, line) — meme source de donnees
    renderSimGrowthChart(seriesMap, usePortfolio ? pfMap : null);

    // Render series projections (utilise l'horizon dynamique simYears)
    seriesProjections.sort((a, b) => b.setEnd - a.setEnd);
    document.getElementById('simSeriesGrid').innerHTML = `
        <div class="sim-series-grid">
            ${seriesProjections.map(s => {
                const mMid = s.setNow > 0 ? s.setMid / s.setNow : 0;
                const mEnd = s.setNow > 0 ? s.setEnd / s.setNow : 0;
                const heatClass = mEnd >= 8 ? 'sim-heat-fire' : mEnd >= 4 ? 'sim-heat-hot' : mEnd >= 2.5 ? 'sim-heat-warm' : mEnd >= 1.2 ? 'sim-heat-cool' : 'sim-heat-cold';
                return `<div class="sim-series-card ${heatClass}">
                    <div class="sim-series-header">
                        <span class="sim-series-code">${s.code}</span>
                        <span class="sim-series-name">${s.name}</span>
                    </div>
                    <div class="sim-series-bar">
                        <div class="sim-bar-segment sim-bar-now" style="flex:1">
                            <span class="sim-bar-label">Actuel</span>
                            <span class="sim-bar-value">${fmt(Math.round(s.setNow))}</span>
                        </div>
                        <div class="sim-bar-segment sim-bar-5" style="flex:${Math.max(0.5, mMid).toFixed(1)}">
                            <span class="sim-bar-label">${midY} an${midY > 1 ? 's' : ''}</span>
                            <span class="sim-bar-value">${fmt(Math.round(s.setMid))}</span>
                        </div>
                        <div class="sim-bar-segment sim-bar-20" style="flex:${Math.max(0.5, Math.min(mEnd, 10)).toFixed(1)}">
                            <span class="sim-bar-label">${Y} ans</span>
                            <span class="sim-bar-value">${fmt(Math.round(s.setEnd))}</span>
                        </div>
                    </div>
                    <div class="sim-series-mults">
                        <span>×${mMid.toFixed(2)} à ${midY} an${midY > 1 ? 's' : ''}</span>
                        <span class="sim-mult-main">×${mEnd.toFixed(2)} à ${Y} ans</span>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;

    // Store all products globally for filtering / calculator
    window._simAllProds = seriesProjections.flatMap(s => s.prodProj.map(p => ({ ...p, seriesCode: s.code, seriesName: s.name })));
    window._simSeriesList = seriesProjections.map(s => ({ code: s.code, name: s.name }));

    renderSimProductTable();
    renderSimInvestCalc();
}

function renderSimProductTable() {
    const allProds = window._simAllProds || [];
    const seriesList = window._simSeriesList || [];
    if (!allProds.length) return;

    // All product types (always show all chips)
    const types = ['etb', 'display', 'display18', 'tripack', 'bundle', 'booster', 'dispbundle'];
    const typeLabels = { etb: 'ETB', display: 'Display 36', display18: 'Display 18', tripack: 'Tripack', bundle: 'Bundle 6', booster: 'Booster', dispbundle: 'Disp. Bundle' };

    // Filter
    let filtered = allProds;
    if (simFilterType) filtered = filtered.filter(p => p.type === simFilterType);
    if (simFilterSeries) filtered = filtered.filter(p => p.seriesCode === simFilterSeries);

    // Sort
    const sortFns = {
        mult20: (a, b) => (b.projected20 / b.price) - (a.projected20 / a.price),
        mult5: (a, b) => (b.projected5 / b.price) - (a.projected5 / a.price),
        price_asc: (a, b) => a.price - b.price,
        price_desc: (a, b) => b.price - a.price,
        val20_desc: (a, b) => b.projected20 - a.projected20,
        name: (a, b) => a.name.localeCompare(b.name),
    };
    filtered.sort(sortFns[simSort] || sortFns.mult20);

    const wrap = document.getElementById('simProductTable');
    wrap.innerHTML = `
        <div class="sim-filters">
            <div class="sim-filter-row">
                <div class="sim-filter-group">
                    <span class="sim-filter-label">Type</span>
                    <div class="sim-filter-chips">
                        <button class="sim-chip ${simFilterType === '' ? 'active' : ''}" onclick="setSimFilterType('')">Tous</button>
                        ${types.map(t => `<button class="sim-chip ${simFilterType === t ? 'active' : ''}" onclick="setSimFilterType('${t}')">${typeLabels[t] || t}</button>`).join('')}
                    </div>
                </div>
                <div class="sim-filter-group">
                    <span class="sim-filter-label">Série</span>
                    <select class="sim-filter-select" onchange="setSimFilterSeries(this.value)">
                        <option value="" ${simFilterSeries === '' ? 'selected' : ''}>Toutes les séries</option>
                        ${seriesList.map(s => `<option value="${s.code}" ${simFilterSeries === s.code ? 'selected' : ''}>${s.code} — ${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="sim-filter-group">
                    <span class="sim-filter-label">Trier par</span>
                    <select class="sim-filter-select" onchange="setSimSort(this.value)">
                        <option value="mult20" ${simSort === 'mult20' ? 'selected' : ''}>×Multi 20 ans ↓</option>
                        <option value="mult5" ${simSort === 'mult5' ? 'selected' : ''}>×Multi 5 ans ↓</option>
                        <option value="val20_desc" ${simSort === 'val20_desc' ? 'selected' : ''}>Valeur 20 ans ↓</option>
                        <option value="price_desc" ${simSort === 'price_desc' ? 'selected' : ''}>Prix actuel ↓</option>
                        <option value="price_asc" ${simSort === 'price_asc' ? 'selected' : ''}>Prix actuel ↑</option>
                        <option value="name" ${simSort === 'name' ? 'selected' : ''}>Nom A→Z</option>
                    </select>
                </div>
            </div>
            <div class="sim-filter-count">${filtered.length} produit${filtered.length > 1 ? 's' : ''}</div>
        </div>
        <div class="sim-prod-table">
            <div class="sim-prod-header">
                <span class="sim-col-rank">#</span>
                <span class="sim-col-name">Produit</span>
                <span class="sim-col-now">Prix actuel</span>
                <span class="sim-col-5">5 ans</span>
                <span class="sim-col-10">10 ans</span>
                <span class="sim-col-20">20 ans</span>
                <span class="sim-col-mult">×Multi 20 ans</span>
            </div>
            ${filtered.map((p, i) => {
                const mult = p.price > 0 ? p.projected20 / p.price : 0;
                const multClass = mult >= 10 ? 'sim-mult-fire' : mult >= 5 ? 'sim-mult-hot' : mult >= 3 ? 'sim-mult-warm' : mult < 1 ? 'sim-mult-cold' : '';
                return `<div class="sim-prod-row">
                    <span class="sim-col-rank">${i + 1}</span>
                    <div class="sim-col-name">
                        <span class="sim-prod-name">${p.name}</span>
                        <span class="sim-prod-series">${p.seriesCode}</span>
                    </div>
                    <span class="sim-col-now">${fmt(p.price)}</span>
                    <span class="sim-col-5">${fmt(Math.round(p.projected5))}</span>
                    <span class="sim-col-10">${fmt(Math.round(p.projected10))}</span>
                    <span class="sim-col-20">${fmt(Math.round(p.projected20))}</span>
                    <span class="sim-col-mult ${multClass}">×${mult.toFixed(2)}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

// ── Chart de comparaison des 4 scenarios sur l'horizon simYears ──
let _simGrowthChartInstance = null;

function renderSimGrowthChart(seriesMap, pfMap) {
    const canvas = document.getElementById('simGrowthChart');
    if (!canvas) return;
    const Y = simYears;
    const scenarios = ['pessimistic', 'conservative', 'moderate', 'optimistic'];
    const meta = {
        pessimistic:  { color: '#ef4444', label: 'Pessimiste' },
        conservative: { color: '#38bdf8', label: 'Conservateur' },
        moderate:     { color: '#f59e0b', label: 'Modéré' },
        optimistic:   { color: '#22c55e', label: 'Optimiste' },
    };

    // Pour chaque scenario, calcule la valeur totale (portefeuille si pfMap, sinon catalogue)
    // pour chaque annee de 0 a Y.
    const labels = Array.from({ length: Y + 1 }, (_, i) => `An ${i}`);
    const datasets = scenarios.map(scenario => {
        const data = [];
        for (let year = 0; year <= Y; year++) {
            let sum = 0;
            for (const s of Object.values(seriesMap)) {
                const age = getSeriesAge(s.code);
                for (const p of s.products) {
                    const unitPrice = p.price > 0 ? p.price : (MSRP[p.type] || 0);
                    if (unitPrice <= 0) continue;
                    const qty = pfMap ? (pfMap[p.name] || 0) : 1;
                    if (qty <= 0) continue;
                    sum += projectPrice(unitPrice, p.type, year, scenario, age) * qty;
                }
            }
            data.push(Math.round(sum));
        }
        const isActive = scenario === simScenario;
        return {
            label: meta[scenario].label,
            data,
            borderColor: meta[scenario].color,
            backgroundColor: isActive ? meta[scenario].color + '22' : 'transparent',
            borderWidth: isActive ? 3 : 1.5,
            borderDash: isActive ? [] : [4, 4],
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.3,
            fill: isActive,
        };
    });

    if (_simGrowthChartInstance) _simGrowthChartInstance.destroy();
    const ctx = canvas.getContext('2d');
    _simGrowthChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { color: 'rgba(226,232,240,0.85)', font: { size: 11 }, boxWidth: 14, boxHeight: 2, padding: 14, usePointStyle: false },
                },
                tooltip: {
                    callbacks: {
                        title: (items) => `Année ${items[0].dataIndex} (${new Date().getFullYear() + items[0].dataIndex})`,
                        label: (c) => `${c.dataset.label} : ${fmt(c.parsed.y)}`,
                    },
                },
            },
            scales: {
                x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8, color: 'rgba(148,163,184,0.7)', font: { size: 10 } }, grid: { display: false } },
                y: {
                    ticks: { color: 'rgba(148,163,184,0.7)', font: { size: 10 }, callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k €` : `${v} €` },
                    grid: { color: 'rgba(148,163,184,0.08)' },
                },
            },
        },
    });
}

// ── Calculateur d'investissement personnel ─────────────────
function renderSimInvestCalc() {
    const wrap = document.getElementById('simInvestCalc');
    if (!wrap) return;
    const allProds = window._simAllProds || [];
    if (!allProds.length) {
        wrap.innerHTML = '<p class="sim-info-desc" style="text-align:center;padding:20px">Chargement des produits…</p>';
        return;
    }

    // Garde le state via dataset, ou defaults
    const amount = parseFloat(wrap.dataset.amount) || 1000;
    const productName = wrap.dataset.product || allProds[0].name;
    const product = allProds.find(p => p.name === productName) || allProds[0];

    const qty = product.price > 0 ? Math.floor(amount / product.price) : 0;
    const realInvested = qty * product.price;
    const reste = amount - realInvested;

    // Projection sur tous les scenarios pour Y annees
    const Y = simYears;
    const scenarios = [
        { id: 'pessimistic', label: 'Pessimiste', icon: '📉', color: '#ef4444' },
        { id: 'conservative', label: 'Conservateur', icon: '🐢', color: '#38bdf8' },
        { id: 'moderate', label: 'Modéré', icon: '📊', color: '#f59e0b' },
        { id: 'optimistic', label: 'Optimiste', icon: '🚀', color: '#22c55e' },
    ];
    const projs = scenarios.map(s => {
        const futureUnit = projectPrice(product.price, product.type, Y, s.id, getSeriesAge(product.seriesCode));
        const futureTotal = futureUnit * qty;
        const pnl = futureTotal - realInvested;
        const cagr = realInvested > 0 ? (Math.pow(futureTotal / realInvested, 1 / Y) - 1) * 100 : 0;
        return { ...s, futureUnit, futureTotal, pnl, cagr };
    });

    wrap.innerHTML = `
        <div class="sim-calc-form">
            <div class="sim-calc-field">
                <label class="sim-calc-label">Montant à investir</label>
                <div class="sim-calc-input-wrap">
                    <input type="number" class="sim-calc-input" id="simCalcAmount" value="${amount}" min="10" step="50" oninput="updateSimInvestCalc()">
                    <span class="sim-calc-input-suffix">€</span>
                </div>
            </div>
            <div class="sim-calc-field">
                <label class="sim-calc-label">Produit</label>
                <select class="sim-calc-input" id="simCalcProduct" onchange="updateSimInvestCalc()">
                    ${allProds
                        .filter(p => p.price > 0)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(p => `<option value="${p.name.replace(/"/g, '&quot;')}" ${p.name === product.name ? 'selected' : ''}>${p.name} — ${fmt(p.price)}</option>`)
                        .join('')}
                </select>
            </div>
            <div class="sim-calc-field">
                <label class="sim-calc-label">Horizon</label>
                <div class="sim-calc-input sim-calc-input-readonly">${Y} an${Y > 1 ? 's' : ''}</div>
            </div>
        </div>

        <div class="sim-calc-summary">
            <div class="sim-calc-summary-row">
                <span class="sim-calc-summary-label">Quantité achetable</span>
                <span class="sim-calc-summary-val"><strong>${qty}</strong> exemplaire${qty > 1 ? 's' : ''}</span>
            </div>
            <div class="sim-calc-summary-row">
                <span class="sim-calc-summary-label">Investi réellement</span>
                <span class="sim-calc-summary-val">${fmt(realInvested)} ${reste > 0.01 ? `<span class="sim-calc-rest">+ ${fmt(Math.round(reste * 100) / 100)} restants</span>` : ''}</span>
            </div>
        </div>

        <div class="sim-calc-grid">
            ${projs.map(s => {
                const cls = s.pnl >= 0 ? 'positive' : 'negative';
                const sign = s.pnl >= 0 ? '+' : '';
                return `<div class="sim-calc-scenario" style="border-color:${s.color}55">
                    <div class="sim-calc-scenario-head">
                        <span class="sim-calc-scenario-icon">${s.icon}</span>
                        <span class="sim-calc-scenario-label" style="color:${s.color}">${s.label}</span>
                    </div>
                    <div class="sim-calc-scenario-val">${qty > 0 ? fmt(Math.round(s.futureTotal)) : '—'}</div>
                    <div class="sim-calc-scenario-pnl ${cls}">${qty > 0 ? `${sign}${fmt(Math.round(s.pnl))} (${sign}${s.cagr.toFixed(2)} %/an)` : ''}</div>
                </div>`;
            }).join('')}
        </div>
    `;
}

function updateSimInvestCalc() {
    const wrap = document.getElementById('simInvestCalc');
    if (!wrap) return;
    const amount = document.getElementById('simCalcAmount')?.value;
    const product = document.getElementById('simCalcProduct')?.value;
    if (amount) wrap.dataset.amount = amount;
    if (product) wrap.dataset.product = product;
    renderSimInvestCalc();
}

// ── Score d'investissement ─────────────────────────────────

function computeInvestmentScore(p) {
    const msrp = MSRP[p.type] || 0;
    let score = 0;
    const factors = [];

    // 1. Proximité au MSRP (25pts) — plus c'est proche, plus c'est une opportunité
    if (msrp > 0) {
        const premium = ((p.price - msrp) / msrp) * 100;
        if (premium < 5) { score += 25; factors.push({ label: 'Prix proche du MSRP', value: `${premium >= 0 ? '+' : ''}${premium.toFixed(0)}%`, positive: true }); }
        else if (premium < 30) { score += 18; factors.push({ label: 'Premium modéré', value: `+${premium.toFixed(0)}%`, positive: true }); }
        else if (premium < 100) { score += 10; factors.push({ label: 'Premium élevé', value: `+${premium.toFixed(0)}%`, positive: false }); }
        else { score += 3; factors.push({ label: 'Prix très élevé', value: `+${premium.toFixed(0)}%`, positive: false }); }
    }

    // 2. Position dans le range (20pts) — bas = bonne entrée
    if (p.low && p.high && p.high > p.low) {
        const pos = (p.price - p.low) / (p.high - p.low);
        if (pos < 0.3) { score += 20; factors.push({ label: 'Prix bas dans le range', value: `${(pos * 100).toFixed(0)}%`, positive: true }); }
        else if (pos < 0.5) { score += 14; factors.push({ label: 'Prix médian', value: `${(pos * 100).toFixed(0)}%`, positive: true }); }
        else if (pos < 0.7) { score += 7; factors.push({ label: 'Prix haut', value: `${(pos * 100).toFixed(0)}%`, positive: false }); }
        else { score += 2; factors.push({ label: 'Prix très haut', value: `${(pos * 100).toFixed(0)}%`, positive: false }); }
    }

    // 3. Tendance (20pts) — hausse = momentum positif
    const t = p.trend || 0;
    if (t > 10) { score += 20; factors.push({ label: 'Forte hausse', value: `+${t}%`, positive: true }); }
    else if (t > 3) { score += 15; factors.push({ label: 'Hausse', value: `+${t}%`, positive: true }); }
    else if (t >= -3) { score += 10; factors.push({ label: 'Stable', value: `${t}%`, positive: true }); }
    else if (t >= -10) { score += 5; factors.push({ label: 'Baisse', value: `${t}%`, positive: false }); }
    else { score += 0; factors.push({ label: 'Forte baisse', value: `${t}%`, positive: false }); }

    // 4. Liquidité (15pts) — beaucoup d'annonces = facile à revendre
    const samples = p.sampleSize || 0;
    if (samples >= 15) { score += 15; factors.push({ label: 'Très liquide', value: `${samples} résultats`, positive: true }); }
    else if (samples >= 8) { score += 11; factors.push({ label: 'Liquide', value: `${samples} résultats`, positive: true }); }
    else if (samples >= 3) { score += 6; factors.push({ label: 'Peu liquide', value: `${samples} résultats`, positive: false }); }
    else { score += 1; factors.push({ label: 'Illiquide', value: `${samples} résultats`, positive: false }); }

    // 5. Risque / Volatilité (20pts inversé) — faible spread = moins risqué
    if (p.low && p.high && p.high > p.low) {
        const spread = (p.high - p.low) / ((p.high + p.low) / 2);
        if (spread < 0.15) { score += 20; factors.push({ label: 'Très stable', value: `${(spread * 100).toFixed(0)}%`, positive: true }); }
        else if (spread < 0.3) { score += 14; factors.push({ label: 'Stable', value: `${(spread * 100).toFixed(0)}%`, positive: true }); }
        else if (spread < 0.5) { score += 8; factors.push({ label: 'Volatile', value: `${(spread * 100).toFixed(0)}%`, positive: false }); }
        else { score += 3; factors.push({ label: 'Très volatile', value: `${(spread * 100).toFixed(0)}%`, positive: false }); }
    }

    return { score: Math.min(100, score), factors };
}

function renderInvestmentScores(priced) {
    const scored = priced.map(p => {
        const inv = computeInvestmentScore(p);
        return { ...p, investScore: inv.score, investFactors: inv.factors };
    }).sort((a, b) => b.investScore - a.investScore);

    const getScoreLabel = (s) => {
        if (s >= 80) return { label: 'Excellent', cls: 'inv-excellent', icon: '🟢' };
        if (s >= 60) return { label: 'Bon', cls: 'inv-bon', icon: '🔵' };
        if (s >= 40) return { label: 'Moyen', cls: 'inv-moyen', icon: '🟡' };
        if (s >= 20) return { label: 'Faible', cls: 'inv-faible', icon: '🟠' };
        return { label: 'Risqué', cls: 'inv-risque', icon: '🔴' };
    };

    document.getElementById('investmentScores').innerHTML = `
        <div class="inv-grid">
            ${scored.slice(0, 20).map((p, i) => {
                const { label, cls, icon } = getScoreLabel(p.investScore);
                return `<div class="inv-card ${cls}">
                    <div class="inv-card-header">
                        <span class="inv-rank">${i + 1}</span>
                        <div class="inv-name-wrap">
                            <span class="inv-name">${p.name}</span>
                            <span class="inv-ext">${p.ext.split(' — ')[0]}</span>
                        </div>
                        <div class="inv-score-wrap">
                            <span class="inv-score">${p.investScore}</span>
                            <span class="inv-score-label">${icon} ${label}</span>
                        </div>
                    </div>
                    <div class="inv-price">${fmt(p.price)}</div>
                    <div class="inv-factors">
                        ${p.investFactors.map(f => `<span class="inv-factor ${f.positive ? 'inv-pos' : 'inv-neg'}">
                            ${f.positive ? '✓' : '✗'} ${f.label} <small>${f.value}</small>
                        </span>`).join('')}
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;
}

// ── Détection de bulles ────────────────────────────────────

function renderBubbleDetection(priced) {
    // Détecter les produits avec hausse anormale
    const withTrend = priced.filter(p => p.trend !== 0 && p.price > 0);
    const avgTrend = withTrend.length > 0 ? withTrend.reduce((s, p) => s + Math.abs(p.trend), 0) / withTrend.length : 0;
    const stdDev = withTrend.length > 0 ? Math.sqrt(withTrend.reduce((s, p) => s + Math.pow(Math.abs(p.trend) - avgTrend, 2), 0) / withTrend.length) : 0;

    const bubbles = priced.map(p => {
        const msrp = MSRP[p.type] || 0;
        const premium = msrp > 0 ? ((p.price - msrp) / msrp) * 100 : 0;
        const spread = (p.low && p.high && p.high > p.low) ? (p.high - p.low) / ((p.high + p.low) / 2) : 0;
        const trendDeviation = stdDev > 0 ? (Math.abs(p.trend) - avgTrend) / stdDev : 0;

        let risk = 0;
        const signals = [];

        // Signal 1: Hausse très au-dessus de la moyenne
        if (p.trend > avgTrend + stdDev * 1.5) { risk += 30; signals.push(`Hausse anormale (+${p.trend}% vs moy. ${avgTrend.toFixed(0)}%)`); }
        else if (p.trend > avgTrend + stdDev) { risk += 15; signals.push(`Hausse élevée (+${p.trend}%)`); }

        // Signal 2: Premium excessif par rapport au MSRP
        if (premium > 300) { risk += 25; signals.push(`Premium excessif (+${premium.toFixed(0)}% vs MSRP)`); }
        else if (premium > 150) { risk += 15; signals.push(`Premium très élevé (+${premium.toFixed(0)}%)`); }

        // Signal 3: Spread très large = prix instable
        if (spread > 0.5) { risk += 20; signals.push(`Forte volatilité (${(spread * 100).toFixed(0)}% de spread)`); }
        else if (spread > 0.35) { risk += 10; signals.push(`Volatilité élevée (${(spread * 100).toFixed(0)}%)`); }

        // Signal 4: Prix proche du max historique
        if (p.high > 0 && p.price > 0) {
            const posInRange = p.high > p.low ? (p.price - p.low) / (p.high - p.low) : 0.5;
            if (posInRange > 0.9) { risk += 20; signals.push('Prix au sommet du range'); }
            else if (posInRange > 0.75) { risk += 10; signals.push('Prix dans le haut du range'); }
        }

        // Signal 5: Peu de liquidité malgré prix élevé
        if (premium > 50 && (p.sampleSize || 0) < 5) { risk += 15; signals.push(`Prix élevé mais peu liquide (${p.sampleSize || 0} résultats)`); }

        return { ...p, bubbleRisk: Math.min(100, risk), signals, premium };
    }).filter(b => b.bubbleRisk >= 25).sort((a, b) => b.bubbleRisk - a.bubbleRisk);

    const getRiskLabel = (r) => {
        if (r >= 70) return { label: 'Risque critique', cls: 'bubble-critical', icon: '🔴' };
        if (r >= 50) return { label: 'Risque élevé', cls: 'bubble-high', icon: '🟠' };
        if (r >= 25) return { label: 'À surveiller', cls: 'bubble-watch', icon: '🟡' };
        return { label: 'OK', cls: '', icon: '🟢' };
    };

    document.getElementById('bubbleDetection').innerHTML = bubbles.length ? `
        <div class="bubble-grid">
            ${bubbles.slice(0, 15).map(b => {
                const { label, cls, icon } = getRiskLabel(b.bubbleRisk);
                return `<div class="bubble-card ${cls}">
                    <div class="bubble-header">
                        <div>
                            <span class="bubble-name">${b.name}</span>
                            <span class="bubble-ext">${b.ext.split(' — ')[0]}</span>
                        </div>
                        <div class="bubble-risk-wrap">
                            <span class="bubble-risk">${icon} ${b.bubbleRisk}</span>
                            <span class="bubble-risk-label">${label}</span>
                        </div>
                    </div>
                    <div class="bubble-price">${fmt(b.price)} <span class="bubble-trend ${b.trend > 0 ? 'positive' : 'negative'}">${b.trend > 0 ? '+' : ''}${b.trend}%</span></div>
                    <div class="bubble-signals">
                        ${b.signals.map(s => `<span class="bubble-signal">⚠ ${s}</span>`).join('')}
                    </div>
                </div>`;
            }).join('')}
        </div>
    ` : '<div class="t-empty-block">Aucun risque de bulle détecté actuellement</div>';
}

// ── Corrélation entre séries ───────────────────────────────

function renderCorrelations(priced) {
    // Grouper par série
    const seriesMap = {};
    for (const p of priced) {
        const code = p.ext.split(' — ')[0];
        const name = p.ext.split(' — ')[1] || code;
        if (!seriesMap[code]) seriesMap[code] = { code, name, products: [], avgTrend: 0, avgPerf: 0, setTotal: 0 };
        seriesMap[code].products.push(p);
    }
    const series = Object.values(seriesMap);

    // Calculer des métriques pour chaque série
    for (const s of series) {
        s.avgTrend = s.products.reduce((sum, p) => sum + p.trend, 0) / s.products.length;
        s.setTotal = s.products.reduce((sum, p) => sum + p.price, 0);
        let perfSum = 0, perfCount = 0;
        for (const p of s.products) {
            const msrp = MSRP[p.type];
            if (msrp && msrp > 0) { perfSum += ((p.price - msrp) / msrp) * 100; perfCount++; }
        }
        s.avgPerf = perfCount > 0 ? perfSum / perfCount : 0;
    }

    // Trouver des corrélations (séries qui ont des profils similaires)
    const correlations = [];
    for (let i = 0; i < series.length; i++) {
        for (let j = i + 1; j < series.length; j++) {
            const a = series[i], b = series[j];
            // Score de similarité basé sur tendance et perf
            const trendDiff = Math.abs(a.avgTrend - b.avgTrend);
            const perfDiff = Math.abs(a.avgPerf - b.avgPerf);
            const trendSame = a.avgTrend > 0 === b.avgTrend > 0; // même direction
            const similarity = Math.max(0, 100 - trendDiff * 2 - perfDiff * 0.5);
            if (similarity > 40 && trendSame) {
                correlations.push({ a, b, similarity: Math.round(similarity), trendDiff, perfDiff });
            }
        }
    }
    correlations.sort((a, b) => b.similarity - a.similarity);

    // Identifier les leaders (séries qui bougent en premier et influencent les autres)
    const leaders = series.filter(s => s.avgTrend > 5 && s.setTotal > 500).sort((a, b) => b.avgTrend - a.avgTrend).slice(0, 5);
    const followers = series.filter(s => s.avgTrend > 0 && s.avgTrend <= 5 && s.setTotal > 200).sort((a, b) => b.setTotal - a.setTotal).slice(0, 5);

    document.getElementById('correlations').innerHTML = `
        <div class="corr-wrap">
            <div class="corr-section">
                <h4 class="corr-subtitle">🔗 Séries corrélées</h4>
                <p class="corr-desc">Séries qui évoluent dans la même direction avec des profils similaires</p>
                <div class="corr-pairs">
                    ${correlations.slice(0, 8).map(c => `<div class="corr-pair">
                        <div class="corr-pair-series">
                            <span class="corr-pair-name">${c.a.code} ${c.a.name}</span>
                            <span class="corr-pair-arrow">↔</span>
                            <span class="corr-pair-name">${c.b.code} ${c.b.name}</span>
                        </div>
                        <div class="corr-pair-score">
                            <div class="corr-bar"><div class="corr-bar-fill" style="width:${c.similarity}%"></div></div>
                            <span class="corr-pct">${c.similarity}%</span>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
            ${leaders.length > 0 ? `<div class="corr-section">
                <h4 class="corr-subtitle">🚀 Séries leaders</h4>
                <p class="corr-desc">Séries en forte hausse qui pourraient entraîner d'autres séries</p>
                <div class="corr-leaders">
                    ${leaders.map(s => `<div class="corr-leader">
                        <span class="corr-leader-code">${s.code}</span>
                        <span class="corr-leader-name">${s.name}</span>
                        <span class="corr-leader-trend positive">+${s.avgTrend.toFixed(1)}%</span>
                        <span class="corr-leader-total">${fmt(s.setTotal)}</span>
                    </div>`).join('')}
                </div>
            </div>` : ''}
            ${followers.length > 0 ? `<div class="corr-section">
                <h4 class="corr-subtitle">📊 Séries à suivre</h4>
                <p class="corr-desc">Séries en légère hausse qui pourraient accélérer</p>
                <div class="corr-leaders">
                    ${followers.map(s => `<div class="corr-leader">
                        <span class="corr-leader-code">${s.code}</span>
                        <span class="corr-leader-name">${s.name}</span>
                        <span class="corr-leader-trend" style="color:var(--orange)">+${s.avgTrend.toFixed(1)}%</span>
                        <span class="corr-leader-total">${fmt(s.setTotal)}</span>
                    </div>`).join('')}
                </div>
            </div>` : ''}
        </div>
    `;
}

// ── Prédiction de prix ─────────────────────────────────────

function renderPredictions(priced) {
    // Prédiction simple basée sur la tendance actuelle et l'historique
    const predictions = priced.filter(p => p._ebayLoaded && p.price > 0).map(p => {
        const dailyRate = (p.trend || 0) / 30; // trend est sur ~30 jours
        const msrp = MSRP[p.type] || 0;
        const premium = msrp > 0 ? ((p.price - msrp) / msrp) * 100 : 0;

        // Ajustement : les produits à premium élevé ralentissent, les bas accélèrent
        const decel = premium > 100 ? 0.7 : premium > 50 ? 0.85 : premium < 10 ? 1.15 : 1;

        const p30 = p.price * (1 + dailyRate * 30 * decel / 100);
        const p60 = p.price * (1 + dailyRate * 60 * decel * 0.95 / 100);
        const p90 = p.price * (1 + dailyRate * 90 * decel * 0.9 / 100);

        const change30 = ((p30 - p.price) / p.price * 100);
        const change90 = ((p90 - p.price) / p.price * 100);

        // Confiance basée sur la liquidité et la stabilité
        const liquidity = Math.min(1, (p.sampleSize || 0) / 15);
        const stability = (p.low && p.high && p.high > p.low) ? 1 - Math.min(1, (p.high - p.low) / ((p.high + p.low) / 2)) : 0.5;
        const confidence = Math.round((liquidity * 0.5 + stability * 0.5) * 100);

        return { ...p, p30, p60, p90, change30, change90, confidence, dailyRate };
    });

    // Top hausse prévue
    const topUp = [...predictions].sort((a, b) => b.change90 - a.change90).slice(0, 10);
    // Top baisse prévue
    const topDown = [...predictions].sort((a, b) => a.change90 - b.change90).filter(p => p.change90 < 0).slice(0, 10);

    document.getElementById('predictions').innerHTML = `
        <div class="pred-wrap">
            <div class="pred-section">
                <h4 class="pred-subtitle">📈 Hausses prévues (90 jours)</h4>
                <div class="pred-table">
                    <div class="pred-header">
                        <span class="pred-col-name">Produit</span>
                        <span class="pred-col">Actuel</span>
                        <span class="pred-col">30j</span>
                        <span class="pred-col">60j</span>
                        <span class="pred-col">90j</span>
                        <span class="pred-col">Confiance</span>
                    </div>
                    ${topUp.map(p => `<div class="pred-row">
                        <div class="pred-col-name">
                            <span class="pred-name">${p.name}</span>
                            <span class="pred-ext">${p.ext.split(' — ')[0]}</span>
                        </div>
                        <span class="pred-col">${fmt(p.price)}</span>
                        <span class="pred-col positive">${fmt(Math.round(p.p30))}</span>
                        <span class="pred-col positive">${fmt(Math.round(p.p60))}</span>
                        <span class="pred-col positive" style="font-weight:700">${fmt(Math.round(p.p90))} <small>(+${p.change90.toFixed(1)}%)</small></span>
                        <span class="pred-col"><span class="pred-conf" style="--conf:${p.confidence}%">${p.confidence}%</span></span>
                    </div>`).join('')}
                </div>
            </div>
            ${topDown.length > 0 ? `<div class="pred-section">
                <h4 class="pred-subtitle">📉 Baisses prévues (90 jours)</h4>
                <div class="pred-table">
                    <div class="pred-header">
                        <span class="pred-col-name">Produit</span>
                        <span class="pred-col">Actuel</span>
                        <span class="pred-col">30j</span>
                        <span class="pred-col">60j</span>
                        <span class="pred-col">90j</span>
                        <span class="pred-col">Confiance</span>
                    </div>
                    ${topDown.map(p => `<div class="pred-row">
                        <div class="pred-col-name">
                            <span class="pred-name">${p.name}</span>
                            <span class="pred-ext">${p.ext.split(' — ')[0]}</span>
                        </div>
                        <span class="pred-col">${fmt(p.price)}</span>
                        <span class="pred-col negative">${fmt(Math.round(p.p30))}</span>
                        <span class="pred-col negative">${fmt(Math.round(p.p60))}</span>
                        <span class="pred-col negative" style="font-weight:700">${fmt(Math.round(p.p90))} <small>(${p.change90.toFixed(1)}%)</small></span>
                        <span class="pred-col"><span class="pred-conf" style="--conf:${p.confidence}%">${p.confidence}%</span></span>
                    </div>`).join('')}
                </div>
            </div>` : ''}
            <div class="pred-disclaimer">⚠️ Prédictions basées sur les tendances actuelles. Elles ne constituent pas un conseil d'investissement.</div>
        </div>
    `;
}

// ── View Mode (Grid / Table) ────────────────────────────────

let viewMode = localStorage.getItem('pokescelle-viewmode') || 'grid';

function setViewMode(mode) {
    viewMode = mode;
    localStorage.setItem('pokescelle-viewmode', mode);
    document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    render();
}

function renderTableRow(p) {
    const tVal = p.trend || 0;
    const tCls = tVal > 5 ? 'positive' : tVal < -5 ? 'negative' : '';
    const msrp = MSRP[p.type] || 0;
    const perf = msrp > 0 ? ((p.price - msrp) / msrp * 100) : 0;
    const perfCls = perf > 0 ? 'positive' : perf < 0 ? 'negative' : '';
    const favs = getFavorites();
    const isFav = favs.includes(p.name);
    return `<tr class="table-row" onclick="openDetail('${p.name.replace(/'/g, "\\'")}')">
        <td class="table-fav"><button class="product-fav-btn ${isFav ? 'fav-active' : ''}" data-name="${p.name.replace(/"/g, '&quot;')}" onclick="toggleFavorite('${p.name.replace(/'/g, "\\'")}', event)">${isFav ? '★' : '☆'}</button></td>
        <td class="table-name"><span>${p.name}</span><small>${p.ext.split(' — ')[0]}</small></td>
        <td><span class="product-type type-${p.type}">${TYPE_LABELS[p.type] || p.type}</span></td>
        <td class="table-price">${fmt(p.lastPrice || p.price)}</td>
        <td class="${tCls}">${trendLabel(tVal)}</td>
        <td>${fmt(p.low)}</td>
        <td>${fmt(p.high)}</td>
        <td class="${perfCls}">${perf >= 0 ? '+' : ''}${perf.toFixed(0)}%</td>
        <td>${p.sampleSize || '—'}</td>
    </tr>`;
}

// ── Wishlist ────────────────────────────────────────────────

function getWishlist() {
    try { return JSON.parse(localStorage.getItem('pokescelle-wishlist') || '[]'); } catch { return []; }
}

function toggleWishlist(name, e) {
    if (e) e.stopPropagation();
    const wl = getWishlist();
    const idx = wl.indexOf(name);
    if (idx >= 0) { wl.splice(idx, 1); showToast('❌', 'Retiré de la wishlist', name); }
    else { wl.push(name); showToast('🛒', 'Ajouté à la wishlist', name); }
    localStorage.setItem('pokescelle-wishlist', JSON.stringify(wl));
    render();
}

function renderWishlistSection() {
    const wl = getWishlist();
    if (wl.length === 0) return '';
    const items = wl.map(n => products.find(p => p.name === n)).filter(Boolean);
    const total = items.reduce((s, p) => s + (p.lastPrice || p.price), 0);
    return `<div class="wishlist-section" id="wishlistSection">
        <div class="wishlist-header">
            <h3>🛒 Ma Wishlist (${items.length} items — ${fmt(total)})</h3>
        </div>
        <div class="wishlist-items">
            ${items.map(p => `<div class="wishlist-item">
                <span class="wishlist-item-name">${p.name}</span>
                <span class="wishlist-item-ext">${p.ext.split(' — ')[0]}</span>
                <span class="wishlist-item-price">${fmt(p.lastPrice || p.price)}</span>
                <button class="wishlist-item-remove" onclick="toggleWishlist('${p.name.replace(/'/g, "\\'")}', event)">×</button>
            </div>`).join('')}
        </div>
    </div>`;
}

// ── Notes personnelles ──────────────────────────────────────

function getNotes() {
    try { return JSON.parse(localStorage.getItem('pokescelle-notes') || '{}'); } catch { return {}; }
}

function saveNote(name) {
    const notes = getNotes();
    const current = notes[name] || '';
    const val = prompt(`Note pour "${name}" :`, current);
    if (val === null) return;
    if (val.trim() === '') { delete notes[name]; showToast('📝', 'Note supprimée', name); }
    else { notes[name] = val.trim(); showToast('📝', 'Note enregistrée', name); }
    localStorage.setItem('pokescelle-notes', JSON.stringify(notes));
}

// ── Heatmap (carte thermique) ───────────────────────────────

function renderHeatmap(priced) {
    const seriesMap = {};
    for (const p of priced) {
        const code = p.ext?.split(' — ')[0] || '';
        if (!code) continue;
        if (!seriesMap[code]) seriesMap[code] = [];
        seriesMap[code].push(p);
    }

    const types = ['etb', 'display', 'display18', 'tripack', 'bundle', 'booster'];
    const seriesCodes = Object.keys(seriesMap).sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

    // Find global min/max for color scale
    const allPrices = priced.map(p => p.lastPrice || p.price).filter(v => v > 0);
    const maxPrice = Math.max(...allPrices);

    function heatColor(price) {
        if (!price || price <= 0) return 'transparent';
        const ratio = Math.min(price / Math.min(maxPrice, 500), 1);
        if (ratio < 0.2) return 'rgba(46, 160, 67, 0.3)';
        if (ratio < 0.4) return 'rgba(46, 160, 67, 0.5)';
        if (ratio < 0.6) return 'rgba(210, 153, 34, 0.5)';
        if (ratio < 0.8) return 'rgba(248, 81, 73, 0.4)';
        return 'rgba(248, 81, 73, 0.7)';
    }

    const container = document.getElementById('heatmapWrap');
    container.innerHTML = `
        <div class="heatmap-scroll">
            <table class="heatmap-table">
                <thead>
                    <tr>
                        <th class="heatmap-corner">Série</th>
                        ${types.map(t => `<th>${TYPE_LABELS[t] || t}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${seriesCodes.slice(0, 30).map(code => {
                        const items = seriesMap[code];
                        return `<tr>
                            <td class="heatmap-serie">${code}</td>
                            ${types.map(t => {
                                const p = items.find(i => i.type === t);
                                const price = p ? (p.lastPrice || p.price) : 0;
                                return `<td class="heatmap-cell" style="background:${heatColor(price)}" title="${p ? p.name + ': ' + fmt(price) : '—'}">${price > 0 ? fmt(price) : '—'}</td>`;
                            }).join('')}
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        <div class="heatmap-legend">
            <span>Bas</span>
            <div class="heatmap-legend-bar"></div>
            <span>Élevé</span>
        </div>
    `;
}

// ── Calculateur ROI ─────────────────────────────────────────

function renderROICalculator() {
    const container = document.getElementById('roiCalculator');
    const priced = products.filter(p => p.price > 0);

    container.innerHTML = `
        <div class="roi-wrap">
            <div class="roi-controls">
                <div class="roi-field">
                    <label>Produit</label>
                    <select id="roiProduct">
                        ${priced.map(p => `<option value="${p.name.replace(/"/g, '&quot;')}">${p.name} (${p.ext.split(' — ')[0]})</option>`).join('')}
                    </select>
                </div>
                <div class="roi-field">
                    <label>Budget investi (€)</label>
                    <input type="number" id="roiBudget" value="100" min="1">
                </div>
                <div class="roi-field">
                    <label>Date d'achat estimée</label>
                    <select id="roiYearsAgo">
                        <option value="1">Il y a 1 an</option>
                        <option value="2">Il y a 2 ans</option>
                        <option value="3" selected>Il y a 3 ans</option>
                        <option value="5">Il y a 5 ans</option>
                        <option value="10">Il y a 10 ans</option>
                    </select>
                </div>
                <button class="btn-roi" onclick="calculateROI()">Calculer</button>
            </div>
            <div id="roiResult"></div>
        </div>
    `;
}

function calculateROI() {
    const name = document.getElementById('roiProduct').value;
    const budget = parseFloat(document.getElementById('roiBudget').value) || 100;
    const yearsAgo = parseInt(document.getElementById('roiYearsAgo').value) || 3;
    const p = products.find(pr => pr.name === name);
    if (!p) return;

    const currentPrice = p.lastPrice || p.price;
    const msrp = MSRP[p.type] || p.old || currentPrice;
    // Estimate past price using reverse projection
    const code = p.ext?.split(' — ')[0] || '';
    const age = getSeriesAge(code);
    const rate = getGrowthRate(p.type, 'moderate', age);
    const pastPrice = currentPrice / Math.pow(1 + rate, yearsAgo);
    const buyPrice = Math.max(pastPrice, msrp * 0.8);
    const qtyBought = Math.floor(budget / buyPrice);
    const totalInvested = qtyBought * buyPrice;
    const currentValue = qtyBought * currentPrice;
    const profit = currentValue - totalInvested;
    const roi = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested * 100) : 0;
    const annualROI = totalInvested > 0 ? ((Math.pow(currentValue / totalInvested, 1 / yearsAgo) - 1) * 100) : 0;

    document.getElementById('roiResult').innerHTML = `
        <div class="roi-result-card">
            <h4>${p.name}</h4>
            <p class="roi-result-sub">${p.ext}</p>
            <div class="roi-result-grid">
                <div class="roi-stat">
                    <span class="roi-stat-label">Prix d'achat estimé</span>
                    <span class="roi-stat-value">${fmt(Math.round(buyPrice))}</span>
                </div>
                <div class="roi-stat">
                    <span class="roi-stat-label">Quantité achetée</span>
                    <span class="roi-stat-value">${qtyBought}</span>
                </div>
                <div class="roi-stat">
                    <span class="roi-stat-label">Total investi</span>
                    <span class="roi-stat-value">${fmt(Math.round(totalInvested))}</span>
                </div>
                <div class="roi-stat">
                    <span class="roi-stat-label">Prix actuel</span>
                    <span class="roi-stat-value">${fmt(currentPrice)}</span>
                </div>
                <div class="roi-stat">
                    <span class="roi-stat-label">Valeur actuelle</span>
                    <span class="roi-stat-value" style="color:var(--green-light);font-size:20px">${fmt(Math.round(currentValue))}</span>
                </div>
                <div class="roi-stat">
                    <span class="roi-stat-label">Profit</span>
                    <span class="roi-stat-value ${profit >= 0 ? 'positive' : 'negative'}">${profit >= 0 ? '+' : ''}${fmt(Math.round(profit))}</span>
                </div>
                <div class="roi-stat">
                    <span class="roi-stat-label">ROI total</span>
                    <span class="roi-stat-value ${roi >= 0 ? 'positive' : 'negative'}">${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%</span>
                </div>
                <div class="roi-stat">
                    <span class="roi-stat-label">ROI annualisé</span>
                    <span class="roi-stat-value ${annualROI >= 0 ? 'positive' : 'negative'}">${annualROI >= 0 ? '+' : ''}${annualROI.toFixed(1)}%/an</span>
                </div>
            </div>
        </div>
    `;
}

// ── Notifications Push ──────────────────────────────────────

async function requestNotifications() {
    if (!('Notification' in window)) { showToast('⚠️', 'Notifications non supportées'); return; }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
        localStorage.setItem('pokescelle-notif', 'on');
        showToast('🔔', 'Notifications activées');
    } else {
        showToast('🔕', 'Notifications refusées');
    }
}

function sendNotification(title, body) {
    if (Notification.permission === 'granted' && localStorage.getItem('pokescelle-notif') === 'on') {
        new Notification(title, { body, icon: '📦' });
    }
}

// ── Partage portfolio ───────────────────────────────────────

function sharePortfolio() {
    const pf = loadPortfolioSync();
    const items = Object.entries(pf).filter(([,v]) => v.qty > 0);
    if (items.length === 0) { showToast('⚠️', 'Portfolio vide'); return; }

    const data = items.map(([name, h]) => {
        const p = products.find(pr => pr.name === name);
        return { name, qty: h.qty, cost: h.cost, price: p ? (p.lastPrice || p.price) : 0 };
    });

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const url = `${window.location.origin}${window.location.pathname}?portfolio=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
        showToast('📋', 'Lien copié !', 'Partagez votre portfolio');
    }).catch(() => {
        prompt('Copiez ce lien :', url);
    });
}

function loadSharedPortfolio() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('portfolio');
    if (!data) return;

    try {
        const items = JSON.parse(decodeURIComponent(escape(atob(data))));
        const container = document.getElementById('sharedPortfolioWrap');
        if (!container) return;

        let totalVal = 0, totalInv = 0;
        const rows = items.map(item => {
            const p = products.find(pr => pr.name === item.name);
            const currentPrice = p ? (p.lastPrice || p.price) : item.price;
            const val = currentPrice * item.qty;
            const inv = item.cost * item.qty;
            totalVal += val;
            totalInv += inv;
            return `<div class="shared-pf-row">
                <span class="shared-pf-name">${item.name}</span>
                <span class="shared-pf-qty">×${item.qty}</span>
                <span class="shared-pf-val">${fmt(val)}</span>
            </div>`;
        });

        const pnl = totalVal - totalInv;
        container.innerHTML = `
            <div class="shared-pf-card">
                <h3>📊 Portfolio partagé</h3>
                <div class="shared-pf-summary">
                    <span>Valeur : <strong>${fmt(totalVal)}</strong></span>
                    <span>P&L : <strong class="${pnl >= 0 ? 'positive' : 'negative'}">${pnl >= 0 ? '+' : ''}${fmt(Math.round(pnl))}</strong></span>
                </div>
                ${rows.join('')}
            </div>
        `;
        container.style.display = 'block';
    } catch { /* invalid data */ }
}

// ── Skeleton Loading ─────────────────────────────────────────

function renderSkeletonCards(count = 6) {
    return Array.from({length: count}, () => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-line long"></div>
            <div class="skeleton skeleton-line short"></div>
            <div class="skeleton skeleton-line medium"></div>
        </div>
    `).join('');
}

function renderSkeletonTrend() {
    return `<div class="skeleton-trend-block">
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-line long"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line long"></div>
        <div class="skeleton skeleton-line medium"></div>
    </div>`;
}

// ── Theme ────────────────────────────────────────────────────

function getTheme() { return localStorage.getItem('pokescelle-theme') || 'dark'; }
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pokescelle-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}
function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

// ── Dashboard ────────────────────────────────────────────────

function renderDashboard() {
    const container = document.getElementById('dashboardContent');
    const priced = products.filter(p => p.price > 0);
    const favs = getFavorites();
    const alertsObj = getAlerts();
    const alertsList = Object.entries(alertsObj);
    // Portfolio strictement lie au compte : passe par loadPortfolioSync (vide si non-connecte).
    const pf = loadPortfolioSync();
    const pfItems = Object.entries(pf).filter(([,v]) => v && v.qty > 0);

    // ── Portfolio P&L ─────────────────────────────────────────
    let pfTotal = 0, pfInvested = 0;
    pfItems.forEach(([name, data]) => {
        const p = products.find(pr => pr.name === name);
        if (!p) return;
        pfTotal += (p.lastPrice || p.price) * data.qty;
        pfInvested += (data.cost || 0) * data.qty;
    });
    const pfPnl = pfTotal - pfInvested;
    const pfPnlPct = pfInvested > 0 ? (pfPnl / pfInvested) * 100 : 0;
    const pnlClass = pfPnl >= 0 ? 'positive' : 'negative';
    const pnlSign = pfPnl >= 0 ? '+' : '';

    // ── Hausses / baisses du jour (basees sur trend du produit) ──
    const upCount = priced.filter(p => (p.trend || 0) > 0).length;
    const downCount = priced.filter(p => (p.trend || 0) < 0).length;
    const flatCount = priced.length - upCount - downCount;

    // ── Top 3 investments (existant) ──────────────────────────
    const scored = priced.map(p => ({ ...p, inv: computeInvestmentScore(p) }))
        .sort((a, b) => b.inv.score - a.inv.score).slice(0, 3);

    // ── Favoris (existant) ────────────────────────────────────
    const favProducts = priced.filter(p => favs.includes(p.name)).slice(0, 6);

    // ── Allocation catalogue par bloc (par valeur mediane totale) ──
    const blocStats = {};
    for (const p of priced) {
        const bloc = p.serie || 'Autre';
        const value = p.lastPrice || p.price || 0;
        if (!blocStats[bloc]) blocStats[bloc] = { count: 0, totalValue: 0, avgPrice: 0 };
        blocStats[bloc].count += 1;
        blocStats[bloc].totalValue += value;
    }
    Object.values(blocStats).forEach(b => { b.avgPrice = b.count ? b.totalValue / b.count : 0; });
    const blocsSorted = Object.entries(blocStats).sort((a, b) => b[1].totalValue - a[1].totalValue);
    const blocTotalValue = blocsSorted.reduce((s, [, v]) => s + v.totalValue, 0) || 1;

    container.innerHTML = `
        <!-- ═══ KPI HERO STRIP (6 cards) ═══ -->
        <div class="dash-kpis dash-kpis-6">
            <div class="dash-kpi">
                <span class="dash-kpi-icon">📦</span>
                <div>
                    <span class="dash-kpi-value">${priced.length}</span>
                    <span class="dash-kpi-label">Produits suivis</span>
                    <span class="dash-kpi-sub">
                        <span class="kpi-chip up">↑ ${upCount}</span>
                        <span class="kpi-chip down">↓ ${downCount}</span>
                        <span class="kpi-chip flat">→ ${flatCount}</span>
                    </span>
                </div>
            </div>
            <div class="dash-kpi" id="kpiMarketIndex">
                <span class="dash-kpi-icon">📊</span>
                <div>
                    <span class="dash-kpi-value" id="kpiMarketValue">…</span>
                    <span class="dash-kpi-label">Indice marché</span>
                    <span class="dash-kpi-sub" id="kpiMarketDelta"></span>
                </div>
            </div>
            <div class="dash-kpi">
                <span class="dash-kpi-icon">💼</span>
                <div>
                    <span class="dash-kpi-value">${pfInvested > 0 ? fmt(pfInvested) : '—'}</span>
                    <span class="dash-kpi-label">Capital investi</span>
                    <span class="dash-kpi-sub">${pfItems.length} position${pfItems.length > 1 ? 's' : ''}</span>
                </div>
            </div>
            <div class="dash-kpi">
                <span class="dash-kpi-icon">💰</span>
                <div>
                    <span class="dash-kpi-value">${pfItems.length > 0 ? fmt(pfTotal) : '—'}</span>
                    <span class="dash-kpi-label">Valeur portfolio</span>
                    <span class="dash-kpi-sub">${pfItems.length === 0 ? 'Aucune position' : 'Au cours actuel'}</span>
                </div>
            </div>
            <div class="dash-kpi kpi-pnl-${pfPnl >= 0 ? 'pos' : 'neg'}">
                <span class="dash-kpi-icon">${pfPnl >= 0 ? '🟢' : '🔴'}</span>
                <div>
                    <span class="dash-kpi-value ${pnlClass}">${pfInvested > 0 ? `${pnlSign}${fmt(pfPnl)}` : '—'}</span>
                    <span class="dash-kpi-label">Plus-value latente</span>
                    <span class="dash-kpi-sub ${pnlClass}">${pfInvested > 0 ? `${pnlSign}${pfPnlPct.toFixed(1)} %` : ''}</span>
                </div>
            </div>
            <div class="dash-kpi">
                <span class="dash-kpi-icon">🔔</span>
                <div>
                    <span class="dash-kpi-value">${alertsList.length}</span>
                    <span class="dash-kpi-label">Alertes actives</span>
                    <span class="dash-kpi-sub">${favs.length} favori${favs.length > 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>

        <!-- ═══ INDICE MARCHE ═══ -->
        <div class="dash-section dash-market-index" id="dashMarketIndex">
            <div class="dmi-head">
                <div>
                    <h3 class="dash-section-title">📊 Indice marché scellé</h3>
                    <p class="dmi-subtitle">Base 100 au 1ᵉʳ jour de tracking — moyenne géométrique pondérée des prix médians</p>
                </div>
                <div class="dmi-current">
                    <span class="dmi-value" id="dmiValue">…</span>
                    <span class="dmi-date" id="dmiDate"></span>
                </div>
            </div>
            <div class="dmi-variations" id="dmiVariations"></div>
            <div class="dmi-chart-wrap"><canvas id="marketIndexChart" height="180"></canvas></div>
        </div>

        ${pfItems.length > 0 ? `
        <!-- ═══ PERFORMANCE PORTFOLIO VS MARCHE (si connecte avec positions) ═══ -->
        <div class="dash-section dash-pf-perf">
            <div class="dmi-head">
                <div>
                    <h3 class="dash-section-title">📈 Mon portfolio vs marché</h3>
                    <p class="dmi-subtitle">Comparaison normalisée base 100 — ta performance face à l'indice global</p>
                </div>
                <div class="dpp-summary" id="dppSummary"></div>
            </div>
            <div class="dmi-chart-wrap"><canvas id="pfPerfChart" height="200"></canvas></div>
        </div>` : ''}

        <!-- ═══ TOP MOUVEMENTS 7 JOURS ═══ -->
        <div class="dash-section">
            <h3 class="dash-section-title">⚡ Mouvements 7 jours</h3>
            <div class="dash-movers" id="dashMovers">
                <div class="dash-movers-col">
                    <h4 class="dash-movers-title up">📈 Top hausses</h4>
                    <div class="dash-movers-list" id="dashMoversUp"><div class="dash-movers-empty">Chargement…</div></div>
                </div>
                <div class="dash-movers-col">
                    <h4 class="dash-movers-title down">📉 Top baisses</h4>
                    <div class="dash-movers-list" id="dashMoversDown"><div class="dash-movers-empty">Chargement…</div></div>
                </div>
            </div>
        </div>

        <!-- ═══ ALLOCATION CATALOGUE PAR BLOC ═══ -->
        <div class="dash-section">
            <h3 class="dash-section-title">🗂️ Catalogue par bloc</h3>
            <p class="dmi-subtitle" style="margin-bottom:14px">Répartition des produits suivis et valeur médiane totale par bloc</p>
            <div class="dash-blocs">
                ${blocsSorted.map(([bloc, stats]) => {
                    const pct = (stats.totalValue / blocTotalValue) * 100;
                    return `<div class="dash-bloc-row">
                        <div class="dash-bloc-info">
                            <span class="dash-bloc-name">${bloc}</span>
                            <span class="dash-bloc-meta">${stats.count} produits · ${fmt(Math.round(stats.avgPrice))} moy</span>
                        </div>
                        <div class="dash-bloc-bar"><div class="dash-bloc-bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
                        <div class="dash-bloc-val">
                            <span class="dash-bloc-pct">${pct.toFixed(1)} %</span>
                            <span class="dash-bloc-total">${fmt(Math.round(stats.totalValue))}</span>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>

        <!-- ═══ TOP 3 INVESTISSEMENTS ═══ -->
        <div class="dash-section">
            <h3 class="dash-section-title">🏆 Top 3 investissements</h3>
            <div class="dash-top3">
                ${scored.map((p, i) => `
                    <div class="dash-top3-card" onclick="openDetail('${p.name.replace(/'/g, "\\'")}')">
                        <span class="dash-top3-rank">#${i + 1}</span>
                        <div class="dash-top3-info">
                            <span class="dash-top3-name">${p.name}</span>
                            <span class="dash-top3-ext">${p.ext.split(' — ')[0]}</span>
                        </div>
                        <div class="dash-top3-score">
                            <span class="dash-top3-score-value">${p.inv.score}/100</span>
                            <div class="dash-top3-bar"><div class="dash-top3-bar-fill" style="width:${p.inv.score}%"></div></div>
                        </div>
                        <span class="dash-top3-price">${fmt(p.lastPrice || p.price)}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        ${favProducts.length > 0 ? `
        <!-- ═══ MES FAVORIS ═══ -->
        <div class="dash-section">
            <h3 class="dash-section-title">⭐ Mes favoris</h3>
            <div class="dash-favs-grid">
                ${favProducts.map(p => `
                    <div class="dash-fav-card" onclick="openDetail('${p.name.replace(/'/g, "\\'")}')">
                        ${p.lastListing?.image ? `<img src="${p.lastListing.image}" alt="${p.name}" class="dash-fav-img">` : '<div class="dash-fav-img-placeholder">📦</div>'}
                        <div class="dash-fav-info">
                            <span class="dash-fav-name">${p.name}</span>
                            <span class="dash-fav-price">${fmt(p.lastPrice || p.price)}</span>
                            <span class="dash-fav-trend ${trendClass(p.trend)}">${trendLabel(p.trend)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>` : ''}

        ${alertsList.length > 0 ? `
        <!-- ═══ ALERTES ═══ -->
        <div class="dash-section">
            <h3 class="dash-section-title">🔔 Alertes configurées</h3>
            <div class="dash-alerts">
                ${alertsList.slice(0, 5).map(([name, a]) => `
                    <div class="dash-alert-row">
                        <span class="dash-alert-name">${name}</span>
                        <span class="dash-alert-type">< ${fmt(a.threshold)}</span>
                    </div>
                `).join('')}
            </div>
        </div>` : ''}

        ${pfItems.length > 0 ? `
        <!-- ═══ DETAIL PORTFOLIO ═══ -->
        <div class="dash-section">
            <h3 class="dash-section-title">📦 Détail positions (${pfItems.length})</h3>
            <div class="dash-pf-grid">
                ${pfItems.slice(0, 9).map(([name, data]) => {
                    const p = products.find(pr => pr.name === name);
                    if (!p) return '';
                    const cur = p.lastPrice || p.price || 0;
                    const val = cur * data.qty;
                    const inv = (data.cost || 0) * data.qty;
                    const pnl = val - inv;
                    const pnlPct = inv > 0 ? (pnl / inv) * 100 : 0;
                    const cls = pnl >= 0 ? 'positive' : 'negative';
                    const sign = pnl >= 0 ? '+' : '';
                    return `<div class="dash-pf-item" onclick="openDetail('${p.name.replace(/'/g, "\\'")}')">
                        <span class="dash-pf-name">${name}</span>
                        <div class="dash-pf-row">
                            <span class="dash-pf-qty">×${data.qty}</span>
                            <span class="dash-pf-val">${fmt(val)}</span>
                        </div>
                        ${inv > 0 ? `<span class="dash-pf-pnl ${cls}">${sign}${fmt(pnl)} (${sign}${pnlPct.toFixed(1)} %)</span>` : '<span class="dash-pf-pnl-none">PRU non renseigné</span>'}
                    </div>`;
                }).join('')}
            </div>
        </div>` : ''}

        <!-- ═══ QUICK LINKS ═══ -->
        <div class="dash-quick-links">
            <button class="dash-link" onclick="switchSection('catalogue')">📋 Catalogue</button>
            <button class="dash-link" onclick="switchSection('tendances')">📊 Tendances</button>
            <button class="dash-link" onclick="switchSection('simulation')">🔮 Simulation</button>
            ${currentUser ? '<button class="dash-link" onclick="switchSection(\'portfolio\')">💼 Portfolio</button>' : ''}
        </div>
    `;

    // L'innerHTML est en place : on peut maintenant peupler les charts et les sections async.
    loadMarketIndexChart();
    loadDashTopMovers();
    if (pfItems.length > 0) loadPfPerformanceChart(pfItems);
}

// ── Top mouvements 7 jours ──────────────────────────────────
async function loadDashTopMovers() {
    const upEl = document.getElementById('dashMoversUp');
    const downEl = document.getElementById('dashMoversDown');
    if (!upEl || !downEl) return;

    try {
        const res = await fetch('/api/trends-7d', { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const arr = Object.entries(data).map(([name, d]) => ({ name, ...d }));
        if (arr.length === 0) {
            upEl.innerHTML = '<div class="dash-movers-empty">Pas encore d\'historique</div>';
            downEl.innerHTML = '<div class="dash-movers-empty">Pas encore d\'historique</div>';
            return;
        }
        const ups = arr.filter(d => d.change > 0).sort((a, b) => b.change - a.change).slice(0, 5);
        const downs = arr.filter(d => d.change < 0).sort((a, b) => a.change - b.change).slice(0, 5);

        const renderRow = (m, klass) => {
            const safeName = m.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const sign = m.change >= 0 ? '+' : '';
            // Largeur de la barre : on cap a 25 % pour rester lisible
            const barPct = Math.min(Math.abs(m.change) * 4, 100);
            return `<div class="dash-mover-row" onclick="openDetail('${safeName}')">
                <div class="dash-mover-info">
                    <span class="dash-mover-name">${m.name}</span>
                    <span class="dash-mover-prices">${fmt(m.priceBefore)} → <strong>${fmt(m.priceNow)}</strong></span>
                </div>
                <div class="dash-mover-bar-wrap">
                    <div class="dash-mover-bar ${klass}" style="width:${barPct}%"></div>
                </div>
                <span class="dash-mover-pct ${klass}">${sign}${m.change.toFixed(1)} %</span>
            </div>`;
        };

        upEl.innerHTML = ups.length > 0
            ? ups.map(m => renderRow(m, 'up')).join('')
            : '<div class="dash-movers-empty">Aucune hausse cette semaine</div>';
        downEl.innerHTML = downs.length > 0
            ? downs.map(m => renderRow(m, 'down')).join('')
            : '<div class="dash-movers-empty">Aucune baisse cette semaine</div>';
    } catch {
        upEl.innerHTML = '<div class="dash-movers-empty">Indisponible</div>';
        downEl.innerHTML = '<div class="dash-movers-empty">Indisponible</div>';
    }
}

// ── Performance portfolio vs marche ─────────────────────────
let _pfPerfChartInstance = null;

async function loadPfPerformanceChart(pfItems) {
    const canvas = document.getElementById('pfPerfChart');
    const summaryEl = document.getElementById('dppSummary');
    if (!canvas) return;
    try {
        // 1) Recupere les 2 series : portfolio history + market index
        const [pfRes, miRes] = await Promise.all([
            authToken
                ? fetch('/api/portfolio-history', { headers: { 'Authorization': `Bearer ${authToken}` } }).catch(() => null)
                : Promise.resolve(null),
            fetch('/api/market-index', { cache: 'no-store' }).catch(() => null),
        ]);
        const pfHist = pfRes && pfRes.ok ? await pfRes.json() : [];
        const mi = miRes && miRes.ok ? await miRes.json() : { points: [] };

        if (!pfHist.length || !mi.points?.length) {
            if (summaryEl) summaryEl.innerHTML = '<span class="dpp-muted">Pas encore d\'historique portfolio</span>';
            return;
        }

        // 2) Normalise les deux series base 100 a la 1ere date commune
        const pfMap = new Map(pfHist.map(h => [h.date, h.value]));
        const miMap = new Map(mi.points.map(p => [p.date, p.value]));
        const commonDates = [...pfMap.keys()].filter(d => miMap.has(d)).sort();
        if (commonDates.length === 0) {
            if (summaryEl) summaryEl.innerHTML = '<span class="dpp-muted">Pas encore d\'overlap historique</span>';
            return;
        }
        const baselineDate = commonDates[0];
        const pfBase = pfMap.get(baselineDate) || 1;
        const miBase = miMap.get(baselineDate) || 100;
        const pfNorm = commonDates.map(d => (pfMap.get(d) / pfBase) * 100);
        const miNorm = commonDates.map(d => (miMap.get(d) / miBase) * 100);

        // 3) Stats pour le header
        const pfLast = pfNorm[pfNorm.length - 1];
        const miLast = miNorm[miNorm.length - 1];
        const delta = pfLast - miLast;
        const cls = delta >= 0 ? 'positive' : 'negative';
        const sign = delta >= 0 ? '+' : '';
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div class="dpp-stat">
                    <span class="dpp-stat-label">Portfolio</span>
                    <span class="dpp-stat-val">${pfLast.toFixed(2)}</span>
                </div>
                <div class="dpp-stat">
                    <span class="dpp-stat-label">Marché</span>
                    <span class="dpp-stat-val">${miLast.toFixed(2)}</span>
                </div>
                <div class="dpp-stat dpp-stat-hero">
                    <span class="dpp-stat-label">Écart</span>
                    <span class="dpp-stat-val ${cls}">${sign}${delta.toFixed(2)} pts</span>
                </div>
            `;
        }

        // 4) Chart
        if (_pfPerfChartInstance) _pfPerfChartInstance.destroy();
        const ctx = canvas.getContext('2d');
        const gradPf = ctx.createLinearGradient(0, 0, 0, 200);
        gradPf.addColorStop(0, 'rgba(34,197,94,0.30)');
        gradPf.addColorStop(1, 'rgba(34,197,94,0.02)');
        _pfPerfChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: commonDates,
                datasets: [
                    { label: 'Mon portfolio', data: pfNorm, borderColor: '#22c55e', backgroundColor: gradPf, borderWidth: 2.4, pointRadius: 0, pointHoverRadius: 4, tension: 0.3, fill: true },
                    { label: 'Indice marché', data: miNorm, borderColor: '#38bdf8', borderWidth: 2, borderDash: [5, 4], pointRadius: 0, pointHoverRadius: 4, tension: 0.3, fill: false },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: true, position: 'bottom', labels: { color: 'rgba(226,232,240,0.85)', font: { size: 11 }, boxWidth: 14, boxHeight: 2, padding: 14 } },
                    tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y.toFixed(2)}` } },
                },
                scales: {
                    x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6, color: 'rgba(148,163,184,0.7)', font: { size: 10 } }, grid: { display: false } },
                    y: { ticks: { color: 'rgba(148,163,184,0.7)', font: { size: 10 }, callback: (v) => v.toFixed(0) }, grid: { color: 'rgba(148,163,184,0.08)' } },
                },
            },
        });
    } catch {
        if (summaryEl) summaryEl.innerHTML = '<span class="dpp-muted">Erreur chargement</span>';
    }
}

// ── Page Admin ──────────────────────────────────────────────
async function loadAdminPage() {
    const container = document.getElementById('adminContent');
    if (!container) return;
    if (!isAdminUser()) {
        container.innerHTML = '<div class="admin-empty">Accès refusé.</div>';
        return;
    }
    container.innerHTML = '<div class="admin-loading">Chargement…</div>';

    try {
        const headers = { 'Authorization': `Bearer ${authToken}` };
        const [statsRes, usersRes] = await Promise.all([
            fetch('/api/admin/stats', { headers, cache: 'no-store' }),
            fetch('/api/admin/users', { headers, cache: 'no-store' }),
        ]);
        if (!statsRes.ok || !usersRes.ok) throw new Error('HTTP error');
        const stats = await statsRes.json();
        const usersData = await usersRes.json();

        container.innerHTML = renderAdminPage(stats, usersData);
    } catch (e) {
        container.innerHTML = `<div class="admin-empty">Erreur de chargement (${e.message || 'inconnue'}).</div>`;
    }
}

function renderAdminPage(stats, usersData) {
    const fmtDate = (iso) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    const daysAgo = (iso) => {
        if (!iso) return '—';
        const ms = Date.now() - new Date(iso).getTime();
        const d = Math.floor(ms / (1000 * 60 * 60 * 24));
        if (d === 0) return 'aujourd\'hui';
        if (d === 1) return 'hier';
        return `il y a ${d} j`;
    };

    return `
        <!-- Stats globales -->
        <div class="admin-stats">
            <div class="admin-stat">
                <span class="admin-stat-label">Comptes</span>
                <span class="admin-stat-value">${stats.totalUsers}</span>
                <span class="admin-stat-sub">${stats.newUsersLast7d} sur 7 j</span>
            </div>
            <div class="admin-stat">
                <span class="admin-stat-label">Actifs</span>
                <span class="admin-stat-value">${stats.activeUsers}</span>
                <span class="admin-stat-sub">${stats.inactiveUsers} sans portfolio</span>
            </div>
            <div class="admin-stat">
                <span class="admin-stat-label">Produits suivis</span>
                <span class="admin-stat-value">${stats.trackedProducts}</span>
                <span class="admin-stat-sub">catalogue serveur</span>
            </div>
            <div class="admin-stat">
                <span class="admin-stat-label">Lignes prix</span>
                <span class="admin-stat-value">${stats.priceHistoryRows.toLocaleString('fr-FR')}</span>
                <span class="admin-stat-sub">historique snapshots</span>
            </div>
        </div>

        <!-- Top produits possedes -->
        ${stats.topProducts && stats.topProducts.length > 0 ? `
        <div class="admin-card">
            <h3 class="admin-card-title">🏅 Top produits dans les portfolios</h3>
            <div class="admin-top-products">
                ${stats.topProducts.map((p, i) => `
                    <div class="admin-top-product-row">
                        <span class="admin-top-rank">#${i + 1}</span>
                        <span class="admin-top-name">${p.name}</span>
                        <span class="admin-top-stat"><strong>${p.totalQty}</strong> exemplaires</span>
                        <span class="admin-top-stat">${p.holders} possesseur${p.holders > 1 ? 's' : ''}</span>
                    </div>
                `).join('')}
            </div>
        </div>` : ''}

        <!-- Liste des comptes -->
        <div class="admin-card">
            <h3 class="admin-card-title">👥 Comptes utilisateurs (${usersData.count})</h3>
            <p class="admin-card-sub">Admin actuel : <code>${usersData.adminUsername}</code></p>
            <div class="admin-users-table">
                <div class="admin-users-head">
                    <span>Nom</span>
                    <span>Créé</span>
                    <span>Positions</span>
                    <span>Actions</span>
                </div>
                ${usersData.users.map(u => {
                    const safeName = u.username.replace(/'/g, "\\'");
                    return `<div class="admin-user-row${u.isAdmin ? ' is-admin' : ''}">
                        <div class="admin-user-name">
                            ${u.username}
                            ${u.isAdmin ? '<span class="admin-user-badge">ADMIN</span>' : ''}
                        </div>
                        <div class="admin-user-date">
                            ${fmtDate(u.createdAt)}
                            <span class="admin-user-ago">${daysAgo(u.createdAt)}</span>
                        </div>
                        <div class="admin-user-pos">
                            ${u.positionCount > 0 ? `<span class="admin-user-pos-pill">${u.positionCount}</span>` : '<span class="admin-user-pos-empty">—</span>'}
                        </div>
                        <div class="admin-user-actions">
                            <button class="admin-btn admin-btn-secondary" onclick="adminResetPassword('${u.id}', '${safeName}')" title="Générer un mot de passe temporaire">
                                🔑 Reset mdp
                            </button>
                            ${u.isAdmin
                                ? '<button class="admin-btn admin-btn-disabled" disabled title="Impossible de supprimer l\'admin">🚫 Protégé</button>'
                                : `<button class="admin-btn admin-btn-danger" onclick="adminDeleteUser('${u.id}', '${safeName}')" title="Supprimer ce compte">🗑 Supprimer</button>`
                            }
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;
}

async function adminDeleteUser(userId, username) {
    if (!isAdminUser()) return;
    const ok = confirm(`Supprimer définitivement le compte "${username}" ?\n\nCette action supprimera son portfolio et son historique. Irréversible.`);
    if (!ok) return;
    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            showToast('⚠️', 'Erreur', data.error || `HTTP ${res.status}`);
            return;
        }
        showToast('✅', 'Compte supprimé', `${username} retiré`);
        loadAdminPage();
    } catch {
        showToast('⚠️', 'Erreur réseau', 'Suppression échouée');
    }
}

async function adminResetPassword(userId, username) {
    if (!isAdminUser()) return;
    const ok = confirm(`Générer un nouveau mot de passe temporaire pour "${username}" ?\n\nL'ancien mot de passe sera invalidé immédiatement.`);
    if (!ok) return;
    try {
        const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            showToast('⚠️', 'Erreur', data.error || `HTTP ${res.status}`);
            return;
        }
        // Affiche le mdp temporaire dans une modal copiable (1 fois seulement)
        showAdminTempPasswordModal(username, data.tempPassword);
        loadAdminPage();
    } catch {
        showToast('⚠️', 'Erreur réseau', 'Reset échoué');
    }
}

function showAdminTempPasswordModal(username, tempPassword) {
    // Modal simple injectee dans le body, supprimee a la fermeture
    const overlay = document.createElement('div');
    overlay.className = 'admin-modal-overlay';
    overlay.innerHTML = `
        <div class="admin-modal">
            <h3>🔑 Mot de passe temporaire</h3>
            <p>Compte <strong>${username}</strong> · à transmettre au user via un canal sécurisé.</p>
            <p class="admin-modal-warn">⚠️ Ne sera affiché qu'une seule fois.</p>
            <div class="admin-modal-pw">
                <code id="adminTempPwCode">${tempPassword}</code>
                <button class="admin-btn admin-btn-secondary" onclick="
                    navigator.clipboard.writeText('${tempPassword}').then(() => {
                        this.textContent = '✓ Copié';
                        setTimeout(() => { this.textContent = '📋 Copier'; }, 1500);
                    });
                ">📋 Copier</button>
            </div>
            <p class="admin-modal-hint">Le user pourra le changer via l'icône 🔑 dans la topbar.</p>
            <button class="admin-btn admin-btn-primary" onclick="this.closest('.admin-modal-overlay').remove()">Fermer</button>
        </div>
    `;
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
}

// ── Page Transactions ──────────────────────────────────────
let _txCurrentType = 'buy';   // type courant dans la modal
let _txList = [];              // cache local
let _txProductFilter = '';     // filtre courant
let _txTypeFilter = '';        // 'buy', 'sell' ou ''

async function loadTransactionsPage() {
    const container = document.getElementById('transactionsContent');
    if (!container) return;
    if (!authToken) {
        container.innerHTML = '<div class="tx-empty">Connectez-vous pour gerer vos transactions.</div>';
        return;
    }
    container.innerHTML = '<div class="tx-loading">Chargement…</div>';
    try {
        const headers = { 'Authorization': `Bearer ${authToken}` };
        const [txRes, statsRes] = await Promise.all([
            fetch('/api/transactions', { headers, cache: 'no-store' }),
            fetch('/api/transactions/stats', { headers, cache: 'no-store' }),
        ]);
        if (!txRes.ok || !statsRes.ok) throw new Error('HTTP error');
        _txList = await txRes.json();
        const stats = await statsRes.json();
        renderTransactionsPage(_txList, stats);
    } catch (e) {
        container.innerHTML = `<div class="tx-empty">Erreur de chargement (${e.message || 'inconnue'}).</div>`;
    }
}

function renderTransactionsPage(txs, stats) {
    const container = document.getElementById('transactionsContent');
    const fmtDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

    const t = stats.totals || {};
    const pnlCls = (t.realizedPnl || 0) >= 0 ? 'positive' : 'negative';
    const pnlSign = (t.realizedPnl || 0) >= 0 ? '+' : '';

    // Liste filtree
    let filtered = txs;
    if (_txProductFilter) filtered = filtered.filter(tx => tx.productName === _txProductFilter);
    if (_txTypeFilter) filtered = filtered.filter(tx => tx.type === _txTypeFilter);

    // Liste des produits uniques pour le filtre
    const uniqueProducts = [...new Set(txs.map(tx => tx.productName))].sort();

    container.innerHTML = `
        <!-- Stats globales -->
        <div class="tx-stats">
            <div class="tx-stat">
                <span class="tx-stat-label">Transactions</span>
                <span class="tx-stat-value">${t.txCount || 0}</span>
            </div>
            <div class="tx-stat">
                <span class="tx-stat-label">Total acheté</span>
                <span class="tx-stat-value">${fmt(t.totalBought || 0)}</span>
                <span class="tx-stat-sub">incl. frais</span>
            </div>
            <div class="tx-stat">
                <span class="tx-stat-label">Total vendu</span>
                <span class="tx-stat-value">${fmt(t.totalSold || 0)}</span>
                <span class="tx-stat-sub">net frais</span>
            </div>
            <div class="tx-stat tx-stat-pnl">
                <span class="tx-stat-label">P&L réalisée (FIFO)</span>
                <span class="tx-stat-value ${pnlCls}">${pnlSign}${fmt(t.realizedPnl || 0)}</span>
                <span class="tx-stat-sub">sur ventes effectuées</span>
            </div>
        </div>

        ${stats.products && stats.products.length > 0 ? `
        <!-- Stats par produit -->
        <div class="tx-card">
            <h3 class="tx-card-title">📊 Par produit</h3>
            <div class="tx-products-table">
                <div class="tx-products-head">
                    <span>Produit</span>
                    <span>Acheté</span>
                    <span>Vendu</span>
                    <span>Restant</span>
                    <span>PRU FIFO</span>
                    <span>P&L réalisée</span>
                </div>
                ${stats.products.map(p => {
                    const cls = p.realizedPnl >= 0 ? 'positive' : 'negative';
                    const sign = p.realizedPnl >= 0 ? '+' : '';
                    return `<div class="tx-product-row" onclick="filterTxByProduct('${p.productName.replace(/'/g, "\\'")}')">
                        <span class="tx-product-name">${p.productName}</span>
                        <span class="tx-product-qty">${p.boughtQty}</span>
                        <span class="tx-product-qty">${p.soldQty}</span>
                        <span class="tx-product-qty"><strong>${p.remainingQty}</strong></span>
                        <span class="tx-product-cost">${p.remainingQty > 0 ? fmt(p.avgCost) : '—'}</span>
                        <span class="tx-product-pnl ${cls}">${p.soldQty > 0 ? `${sign}${fmt(p.realizedPnl)}` : '—'}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>` : ''}

        <!-- Filtres -->
        <div class="tx-filters">
            <div class="tx-filter-group">
                <span class="tx-filter-label">Type</span>
                <button class="tx-chip ${_txTypeFilter === '' ? 'active' : ''}" onclick="filterTxByType('')">Tous</button>
                <button class="tx-chip ${_txTypeFilter === 'buy' ? 'active tx-chip-buy' : ''}" onclick="filterTxByType('buy')">📥 Achats</button>
                <button class="tx-chip ${_txTypeFilter === 'sell' ? 'active tx-chip-sell' : ''}" onclick="filterTxByType('sell')">📤 Ventes</button>
            </div>
            <div class="tx-filter-group">
                <span class="tx-filter-label">Produit</span>
                <select class="tx-filter-select" onchange="filterTxByProduct(this.value)">
                    <option value="" ${_txProductFilter === '' ? 'selected' : ''}>Tous les produits</option>
                    ${uniqueProducts.map(name => `<option value="${name.replace(/"/g, '&quot;')}" ${_txProductFilter === name ? 'selected' : ''}>${name}</option>`).join('')}
                </select>
            </div>
            <div class="tx-filter-count">${filtered.length} ligne${filtered.length > 1 ? 's' : ''}</div>
        </div>

        <!-- Liste transactions -->
        <div class="tx-card">
            <h3 class="tx-card-title">📒 Liste des transactions</h3>
            ${filtered.length === 0 ? `
                <div class="tx-empty-list">
                    ${txs.length === 0
                        ? 'Aucune transaction. Cliquez sur <strong>Ajouter une transaction</strong> pour commencer.'
                        : 'Aucune transaction correspondant aux filtres.'}
                </div>
            ` : `
                <div class="tx-table">
                    <div class="tx-table-head">
                        <span>Date</span>
                        <span>Type</span>
                        <span>Produit</span>
                        <span>Qté</span>
                        <span>Prix u.</span>
                        <span>Frais</span>
                        <span>Total</span>
                        <span></span>
                    </div>
                    ${filtered.map(tx => {
                        const total = tx.qty * tx.unitPrice + (tx.type === 'buy' ? tx.fees : -tx.fees);
                        const isBuy = tx.type === 'buy';
                        return `<div class="tx-row tx-row-${tx.type}">
                            <span class="tx-cell-date">${fmtDate(tx.date)}</span>
                            <span class="tx-cell-type ${isBuy ? 'tx-buy' : 'tx-sell'}">${isBuy ? '📥 Achat' : '📤 Vente'}</span>
                            <span class="tx-cell-product" title="${tx.productName}">${tx.productName}</span>
                            <span class="tx-cell-qty">${tx.qty}</span>
                            <span class="tx-cell-price">${fmt(tx.unitPrice)}</span>
                            <span class="tx-cell-fees">${tx.fees > 0 ? fmt(tx.fees) : '—'}</span>
                            <span class="tx-cell-total ${isBuy ? '' : 'positive'}">${isBuy ? '−' : '+'}${fmt(Math.abs(total))}</span>
                            <button class="tx-cell-delete" onclick="deleteTx('${tx.id}', '${tx.productName.replace(/'/g, "\\'")}')" title="Supprimer">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                            </button>
                            ${tx.notes ? `<div class="tx-cell-notes" title="${tx.notes}">📝 ${tx.notes}</div>` : ''}
                        </div>`;
                    }).join('')}
                </div>
            `}
        </div>
    `;
}

function filterTxByType(type) {
    _txTypeFilter = _txTypeFilter === type ? '' : type;
    loadTransactionsPage();
}

function filterTxByProduct(name) {
    _txProductFilter = name === _txProductFilter ? '' : name;
    loadTransactionsPage();
}

async function deleteTx(id, productName) {
    if (!confirm(`Supprimer cette transaction ?\n\nProduit : ${productName}`)) return;
    try {
        const res = await fetch(`/api/transactions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            showToast('⚠️', 'Erreur', data.error || `HTTP ${res.status}`);
            return;
        }
        showToast('✅', 'Transaction supprimée', '');
        loadTransactionsPage();
    } catch {
        showToast('⚠️', 'Erreur réseau', '');
    }
}

// ── Modal d'ajout de transaction ──────────────────────────
function openTxModal() {
    if (!authToken) {
        openAuthModal('login');
        return;
    }
    const modal = document.getElementById('txModal');
    if (!modal) return;

    // Peupler le select produits
    const select = document.getElementById('txProduct');
    if (select) {
        const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
        select.innerHTML = '<option value="">Choisir un produit…</option>' +
            sortedProducts.map(p => `<option value="${p.name.replace(/"/g, '&quot;')}">${p.name}</option>`).join('');
    }

    // Date par defaut = aujourd'hui
    const dateInput = document.getElementById('txDate');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);

    // Reset form
    document.getElementById('txQty').value = '1';
    document.getElementById('txPrice').value = '';
    document.getElementById('txFees').value = '0';
    document.getElementById('txNotes').value = '';
    document.getElementById('txFormError').textContent = '';
    setTxType('buy');

    // Listeners pour le recap dynamique
    ['txQty', 'txPrice', 'txFees'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.oninput = updateTxRecap;
    });
    updateTxRecap();

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('open'));
}

function closeTxModal() {
    const modal = document.getElementById('txModal');
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(() => { modal.hidden = true; }, 200);
}

function setTxType(type) {
    _txCurrentType = type;
    document.querySelectorAll('.tx-type-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.type === type);
    });
    updateTxRecap();
}

function updateTxRecap() {
    const qty = parseInt(document.getElementById('txQty')?.value) || 0;
    const price = parseFloat(document.getElementById('txPrice')?.value) || 0;
    const fees = parseFloat(document.getElementById('txFees')?.value) || 0;
    const recap = document.getElementById('txFormRecap');
    if (!recap) return;
    if (qty <= 0 || price < 0) {
        recap.innerHTML = '';
        return;
    }
    const total = qty * price + (_txCurrentType === 'buy' ? fees : -fees);
    const sign = _txCurrentType === 'buy' ? '−' : '+';
    const word = _txCurrentType === 'buy' ? 'Coût total' : 'Recette nette';
    recap.innerHTML = `
        <span class="tx-form-recap-label">${word}</span>
        <span class="tx-form-recap-val">${sign} ${fmt(Math.abs(total))}</span>
        <span class="tx-form-recap-detail">${qty} × ${fmt(price)} ${fees > 0 ? `${_txCurrentType === 'buy' ? '+' : '−'} ${fmt(fees)} frais` : ''}</span>
    `;
}

async function submitTxForm(event) {
    event.preventDefault();
    const errEl = document.getElementById('txFormError');
    const submitBtn = document.getElementById('txSubmitBtn');
    errEl.textContent = '';

    const productName = document.getElementById('txProduct').value;
    const date = document.getElementById('txDate').value;
    const qty = parseInt(document.getElementById('txQty').value);
    const unitPrice = parseFloat(document.getElementById('txPrice').value);
    const fees = parseFloat(document.getElementById('txFees').value) || 0;
    const notes = document.getElementById('txNotes').value.trim();

    if (!productName) { errEl.textContent = 'Sélectionnez un produit.'; return; }
    if (!date) { errEl.textContent = 'Date requise.'; return; }
    if (!qty || qty < 1) { errEl.textContent = 'Quantité invalide.'; return; }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) { errEl.textContent = 'Prix unitaire invalide.'; return; }

    submitBtn.disabled = true;
    try {
        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ productName, type: _txCurrentType, qty, unitPrice, fees, date, notes }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            errEl.textContent = data.error || `HTTP ${res.status}`;
            submitBtn.disabled = false;
            return;
        }
        showToast('✅', 'Transaction enregistrée', `${_txCurrentType === 'buy' ? 'Achat' : 'Vente'} de ${qty}× ${productName}`);
        closeTxModal();
        loadTransactionsPage();
    } catch {
        errEl.textContent = 'Erreur réseau.';
        submitBtn.disabled = false;
    }
}

// Permettre escape pour fermer la modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('txModal');
        if (modal && !modal.hidden) closeTxModal();
    }
});

// ── Indice marche scelle ────────────────────────────────────
let _marketIndexChartInstance = null;

async function loadMarketIndexChart() {
    const wrap = document.getElementById('dashMarketIndex');
    if (!wrap) return;
    const valueEl = document.getElementById('dmiValue');
    const dateEl = document.getElementById('dmiDate');
    const variationsEl = document.getElementById('dmiVariations');
    const canvas = document.getElementById('marketIndexChart');
    if (!canvas) return;

    try {
        const res = await fetch('/api/market-index', { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        if (!data.points || data.points.length === 0) {
            valueEl.textContent = '—';
            dateEl.textContent = 'Pas encore de donnees historiques';
            variationsEl.innerHTML = '';
            return;
        }

        // Header : valeur courante + date
        valueEl.textContent = data.currentValue != null ? data.currentValue.toFixed(2) : '—';
        const baselineLabel = data.baseline ? new Date(data.baseline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        dateEl.textContent = data.currentDate ? `Au ${new Date(data.currentDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · base ${baselineLabel}` : '';

        // Hero KPI (en haut du dashboard) : valeur + delta 24h
        const kpiVal = document.getElementById('kpiMarketValue');
        const kpiDelta = document.getElementById('kpiMarketDelta');
        if (kpiVal) kpiVal.textContent = data.currentValue != null ? data.currentValue.toFixed(1) : '—';
        if (kpiDelta && data.variations) {
            const d24 = data.variations.d1;
            const d7 = data.variations.d7;
            const cls24 = d24 > 0.5 ? 'up' : d24 < -0.5 ? 'down' : 'flat';
            const cls7 = d7 > 0.5 ? 'up' : d7 < -0.5 ? 'down' : 'flat';
            const sign = (v) => v >= 0 ? '+' : '';
            kpiDelta.innerHTML = `
                <span class="kpi-chip ${cls24}">24h ${sign(d24)}${d24.toFixed(1)}%</span>
                <span class="kpi-chip ${cls7}">7j ${sign(d7)}${d7.toFixed(1)}%</span>
            `;
        }

        // Variations : mini-pills
        const v = data.variations || {};
        const fmtVar = (val) => {
            if (val == null || !isFinite(val)) return '—';
            const sign = val >= 0 ? '+' : '';
            return `${sign}${val.toFixed(2)} %`;
        };
        const varClass = (val) => {
            if (val == null || !isFinite(val)) return 'dmi-var-flat';
            return val > 0.5 ? 'dmi-var-up' : val < -0.5 ? 'dmi-var-down' : 'dmi-var-flat';
        };
        variationsEl.innerHTML = `
            <div class="dmi-var ${varClass(v.d1)}"><span class="dmi-var-label">24 h</span><span class="dmi-var-val">${fmtVar(v.d1)}</span></div>
            <div class="dmi-var ${varClass(v.d7)}"><span class="dmi-var-label">7 j</span><span class="dmi-var-val">${fmtVar(v.d7)}</span></div>
            <div class="dmi-var ${varClass(v.d30)}"><span class="dmi-var-label">30 j</span><span class="dmi-var-val">${fmtVar(v.d30)}</span></div>
            <div class="dmi-var ${varClass(v.allTime)}"><span class="dmi-var-label">Depuis base</span><span class="dmi-var-val">${fmtVar(v.allTime)}</span></div>
        `;

        // Chart
        const labels = data.points.map(p => p.date);
        const values = data.points.map(p => p.value);
        if (_marketIndexChartInstance) _marketIndexChartInstance.destroy();
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 0, 200);
        grad.addColorStop(0, 'rgba(56,189,248,0.32)');
        grad.addColorStop(1, 'rgba(56,189,248,0.02)');
        _marketIndexChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Indice (base 100)',
                    data: values,
                    borderColor: '#38bdf8',
                    backgroundColor: grad,
                    borderWidth: 2.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (c) => `Indice ${c.parsed.y.toFixed(2)}`,
                            title: (items) => new Date(items[0].label).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6, color: 'rgba(148,163,184,0.7)', font: { size: 10 } },
                        grid: { display: false },
                    },
                    y: {
                        ticks: { color: 'rgba(148,163,184,0.7)', font: { size: 10 }, callback: (v) => v.toFixed(0) },
                        grid: { color: 'rgba(148,163,184,0.08)' },
                    },
                },
            },
        });
    } catch (e) {
        if (valueEl) valueEl.textContent = '—';
        if (dateEl) dateEl.textContent = 'Indice indisponible';
        if (variationsEl) variationsEl.innerHTML = '';
    }
}

// ── Events ───────────────────────────────────────────────────

document.getElementById('searchInput').addEventListener('input', render);
document.getElementById('filterPrix').addEventListener('change', render);
document.getElementById('sortBy').addEventListener('change', render);

// ── Mobile sort bottom sheet ─────────────────────────────────
function openMobileSortSheet() {
    const sheet = document.getElementById('mobileSortSheet');
    if (!sheet) return;
    // Sync active from sortBy value
    const current = document.getElementById('sortBy').value;
    sheet.querySelectorAll('.mobile-sheet-opt').forEach(b => {
        b.classList.toggle('active', b.dataset.sort === current);
    });
    sheet.classList.add('open');
    // Close when clicking overlay (not the sheet itself)
    sheet.onclick = (e) => { if (e.target === sheet) closeMobileSortSheet(); };
}
function closeMobileSortSheet() {
    const sheet = document.getElementById('mobileSortSheet');
    if (sheet) sheet.classList.remove('open');
}
function applyMobileSort(value) {
    const select = document.getElementById('sortBy');
    if (select) {
        select.value = value;
        select.dispatchEvent(new Event('change'));
    }
    closeMobileSortSheet();
}
// Show/hide mobile sort FAB based on viewport and current section
function updateMobileSortFab() {
    const fab = document.getElementById('mobileSortFab');
    if (!fab) return;
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const onCatalogue = currentSection === 'catalogue';
    fab.classList.toggle('visible', isMobile && onCatalogue);
}
window.addEventListener('resize', updateMobileSortFab);
// Hook into section switching by wrapping switchSection
const _origSwitchSection = window.switchSection;
window.switchSection = function(name, ev) {
    const r = _origSwitchSection.apply(this, arguments);
    updateMobileSortFab();
    return r;
};
// Close sheet on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileSortSheet();
        closePfAddModal();
        closePfMenu();
    }
});
// Initial call
setTimeout(updateMobileSortFab, 100);

// ═══════════════════════════════════════════════════════════════
//  Command Palette (Cmd/Ctrl+K) + raccourcis clavier
// ═══════════════════════════════════════════════════════════════

const _cmdk = {
    open: false,
    selectedIndex: 0,
    items: [],
    query: '',
};

// Actions "globales" — toujours dans la palette, même sans recherche
function _cmdkActions() {
    return [
        { type: 'action', icon: '🏠', label: 'Aller au Dashboard',      hint: 'g d', run: () => switchSection('dashboard') },
        { type: 'action', icon: '📋', label: 'Aller au Catalogue',      hint: 'g c', run: () => switchSection('catalogue') },
        { type: 'action', icon: '💼', label: 'Aller au Portfolio',      hint: 'g p', run: () => switchSection('portfolio'), requiresAuth: true },
        { type: 'action', icon: '📊', label: 'Aller aux Tendances',     hint: 'g t', run: () => switchSection('tendances') },
        { type: 'action', icon: '🔮', label: 'Aller à la Simulation',   hint: 'g s', run: () => switchSection('simulation') },
        { type: 'action', icon: '🎨', label: 'Basculer thème clair/sombre', hint: 't', run: () => toggleTheme?.() },
        { type: 'action', icon: '⬆️', label: 'Remonter en haut',        hint: 'h', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { type: 'action', icon: '⌨️', label: 'Afficher les raccourcis clavier', hint: '?', run: () => openKbdHelp() },
        ...(currentUser ? [{ type: 'action', icon: '📤', label: 'Exporter portfolio (CSV)', run: () => typeof exportPortfolioCSV === 'function' ? exportPortfolioCSV() : null }] : []),
    ].filter(a => !a.requiresAuth || !!currentUser);
}

function openCmdk() {
    const el = document.getElementById('cmdk');
    const input = document.getElementById('cmdkInput');
    if (!el || !input) return;
    _cmdk.open = true;
    _cmdk.query = '';
    _cmdk.selectedIndex = 0;
    input.value = '';
    el.hidden = false;
    requestAnimationFrame(() => {
        el.classList.add('open');
        input.focus();
    });
    renderCmdkResults();
}

function closeCmdk() {
    const el = document.getElementById('cmdk');
    if (!el) return;
    _cmdk.open = false;
    el.classList.remove('open');
    setTimeout(() => { el.hidden = true; }, 180);
}

function renderCmdkResults() {
    const container = document.getElementById('cmdkResults');
    if (!container) return;

    const q = (_cmdk.query || '').trim();
    let items = [];

    // Actions d'abord (toujours visibles, filtrées par Fuse si q)
    const actions = _cmdkActions();
    if (q) {
        if (typeof Fuse !== 'undefined') {
            const af = new Fuse(actions, { keys: ['label'], threshold: 0.4, ignoreLocation: true });
            items.push(...af.search(q).map(r => r.item));
        } else {
            const lq = q.toLowerCase();
            items.push(...actions.filter(a => a.label.toLowerCase().includes(lq)));
        }
    } else {
        items.push(...actions.slice(0, 6));
    }

    // Produits (max 8 pour garder la palette lisible)
    if (q) {
        const prodMatches = fuzzyMatchProducts(q) || [];
        for (const p of prodMatches.slice(0, 8)) {
            items.push({
                type: 'product',
                icon: _productTypeIcon(p.type),
                label: p.name,
                sub: p.ext,
                priceLabel: p.price ? fmt(p.price) : '—',
                run: () => {
                    // Naviguer au catalogue + filtrer par ce produit
                    switchSection('catalogue');
                    const input = document.getElementById('searchInput');
                    if (input) { input.value = p.name; input.dispatchEvent(new Event('input')); }
                    // Scroll to the product card
                    setTimeout(() => {
                        const card = document.querySelector(`[data-product-name="${CSS.escape(p.name)}"]`);
                        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 200);
                },
            });
        }
    }

    _cmdk.items = items;
    if (_cmdk.selectedIndex >= items.length) _cmdk.selectedIndex = Math.max(0, items.length - 1);

    if (items.length === 0) {
        container.innerHTML = `<div class="cmdk-empty">Aucun résultat pour "<strong>${_escapeHtml(q)}</strong>"</div>`;
        return;
    }

    container.innerHTML = items.map((it, i) => {
        const active = i === _cmdk.selectedIndex ? ' active' : '';
        if (it.type === 'product') {
            return `<div class="cmdk-item${active}" role="option" data-idx="${i}" onclick="cmdkExecuteIndex(${i})" onmouseenter="cmdkSelect(${i})">
                <span class="cmdk-item-icon">${it.icon}</span>
                <div class="cmdk-item-main">
                    <div class="cmdk-item-label">${_escapeHtml(it.label)}</div>
                    <div class="cmdk-item-sub">${_escapeHtml(it.sub || '')}</div>
                </div>
                <span class="cmdk-item-price">${it.priceLabel}</span>
            </div>`;
        }
        return `<div class="cmdk-item${active}" role="option" data-idx="${i}" onclick="cmdkExecuteIndex(${i})" onmouseenter="cmdkSelect(${i})">
            <span class="cmdk-item-icon">${it.icon || '•'}</span>
            <div class="cmdk-item-main">
                <div class="cmdk-item-label">${_escapeHtml(it.label)}</div>
            </div>
            ${it.hint ? `<span class="cmdk-item-hint">${it.hint.split(' ').map(k => `<kbd>${k}</kbd>`).join('')}</span>` : ''}
        </div>`;
    }).join('');

    // Scroll l'item actif dans la vue
    const activeEl = container.querySelector('.cmdk-item.active');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
}

function cmdkSelect(idx) {
    _cmdk.selectedIndex = idx;
    const container = document.getElementById('cmdkResults');
    if (!container) return;
    container.querySelectorAll('.cmdk-item').forEach((el, i) => el.classList.toggle('active', i === idx));
}

function cmdkExecuteIndex(idx) {
    const it = _cmdk.items[idx];
    if (!it) return;
    closeCmdk();
    setTimeout(() => { try { it.run(); } catch (err) { console.error(err); } }, 100);
}

function _productTypeIcon(type) {
    const map = { etb: '📦', display: '🎴', display18: '🎴', tripack: '🃏', bundle: '🎁', booster: '✨' };
    return map[type] || '🔹';
}

function _escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Listen input changes
const _cmdkInput = document.getElementById('cmdkInput');
if (_cmdkInput) {
    _cmdkInput.addEventListener('input', (e) => {
        _cmdk.query = e.target.value;
        _cmdk.selectedIndex = 0;
        renderCmdkResults();
    });
    _cmdkInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            _cmdk.selectedIndex = Math.min(_cmdk.items.length - 1, _cmdk.selectedIndex + 1);
            renderCmdkResults();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            _cmdk.selectedIndex = Math.max(0, _cmdk.selectedIndex - 1);
            renderCmdkResults();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            cmdkExecuteIndex(_cmdk.selectedIndex);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeCmdk();
        }
    });
}

// ── Help Overlay ────────────────────────────────────────────

function openKbdHelp() {
    const el = document.getElementById('kbdHelp');
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('open'));
}

function closeKbdHelp() {
    const el = document.getElementById('kbdHelp');
    if (!el) return;
    el.classList.remove('open');
    setTimeout(() => { el.hidden = true; }, 180);
}

window.openCmdk = openCmdk;
window.closeCmdk = closeCmdk;
window.openKbdHelp = openKbdHelp;
window.closeKbdHelp = closeKbdHelp;
window.cmdkSelect = cmdkSelect;
window.cmdkExecuteIndex = cmdkExecuteIndex;

// ── Global keyboard shortcuts ────────────────────────────────

// Buffer pour la séquence "g X"
let _gSequenceTimer = null;
let _gSequenceActive = false;

function _isTypingInField(target) {
    if (!target) return false;
    const tag = (target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (target.isContentEditable) return true;
    return false;
}

document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K : ouvre la palette (fonctionne même dans un input)
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (_cmdk.open) closeCmdk(); else openCmdk();
        return;
    }

    // Esc : ferme cmdk + help
    if (e.key === 'Escape') {
        if (_cmdk.open) closeCmdk();
        closeKbdHelp();
        // (les autres close sont déjà gérés dans l'autre handler)
        return;
    }

    // Les raccourcis suivants sont ignorés si on tape dans un champ
    if (_isTypingInField(e.target)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // ? : ouvre l'aide (Shift+/ sur AZERTY = ?, mais on gère aussi Shift+?)
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        openKbdHelp();
        return;
    }

    // / : focus le champ de recherche
    if (e.key === '/') {
        const input = document.getElementById('searchInput');
        if (input) {
            e.preventDefault();
            switchSection('catalogue');
            setTimeout(() => input.focus(), 50);
        }
        return;
    }

    // t : bascule thème
    if (e.key === 't' && !_gSequenceActive) {
        if (typeof toggleTheme === 'function') {
            e.preventDefault();
            toggleTheme();
        }
        return;
    }

    // h : remonte en haut
    if (e.key === 'h' && !_gSequenceActive) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Séquence "g X" : navigation
    if (e.key === 'g' && !_gSequenceActive) {
        _gSequenceActive = true;
        clearTimeout(_gSequenceTimer);
        _gSequenceTimer = setTimeout(() => { _gSequenceActive = false; }, 1200);
        return;
    }

    if (_gSequenceActive) {
        clearTimeout(_gSequenceTimer);
        _gSequenceActive = false;
        const map = { d: 'dashboard', c: 'catalogue', p: 'portfolio', t: 'tendances', s: 'simulation' };
        const target = map[e.key.toLowerCase()];
        if (target) {
            e.preventDefault();
            // switchSection gère déjà le cas "portfolio + non-auth" via le modal de login
            switchSection(target);
        }
    }
});

// ── PWA Install Prompt ───────────────────────────────────────
// Capture l'event beforeinstallprompt (Chrome/Edge) pour afficher notre
// propre bouton d'installation au lieu de l'invitation par defaut du
// navigateur. iOS Safari ne supporte pas cet event => on detecte iOS et
// on suggere "Partager > Sur l'ecran d'accueil" via une variante du toast.
let _deferredInstallPrompt = null;
const INSTALL_DISMISS_KEY = 'pokescelle-install-dismissed';

function shouldShowInstallPrompt() {
    // Deja installe en standalone ? on cache.
    if (window.matchMedia('(display-mode: standalone)').matches) return false;
    if (window.navigator.standalone === true) return false; // iOS standalone
    // Dismissed il y a moins de 14 jours ? on cache.
    const dismissedAt = parseInt(localStorage.getItem(INSTALL_DISMISS_KEY) || '0', 10);
    if (dismissedAt && (Date.now() - dismissedAt) < 14 * 24 * 60 * 60 * 1000) return false;
    return true;
}

function showInstallPrompt() {
    const el = document.getElementById('installPrompt');
    if (!el || !shouldShowInstallPrompt()) return;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('visible'));
}

function hideInstallPrompt(remember = true) {
    const el = document.getElementById('installPrompt');
    if (!el) return;
    el.classList.remove('visible');
    setTimeout(() => { el.hidden = true; }, 250);
    if (remember) localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    _deferredInstallPrompt = e;
    // Petit delai pour ne pas matraquer l'utilisateur des l'arrivee
    setTimeout(showInstallPrompt, 4000);
});

window.addEventListener('appinstalled', () => {
    hideInstallPrompt(false);
    _deferredInstallPrompt = null;
    showToast?.('🎉', 'App installée', 'Retrouvez PokéScellé sur votre écran d\'accueil');
});

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('installPromptBtn');
    const close = document.getElementById('installPromptClose');
    if (btn) {
        btn.addEventListener('click', async () => {
            if (!_deferredInstallPrompt) return;
            _deferredInstallPrompt.prompt();
            const { outcome } = await _deferredInstallPrompt.userChoice;
            if (outcome === 'accepted') {
                hideInstallPrompt(false);
            } else {
                hideInstallPrompt(true);
            }
            _deferredInstallPrompt = null;
        });
    }
    if (close) {
        close.addEventListener('click', () => hideInstallPrompt(true));
    }

    // iOS : pas de beforeinstallprompt. On affiche un message d'aide custom
    // au bout de 6s si on est en mobile Safari et pas en standalone.
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isIOS && isSafari && !isStandalone && shouldShowInstallPrompt()) {
        const el = document.getElementById('installPrompt');
        if (el) {
            const text = el.querySelector('.install-prompt-text');
            const installBtn = el.querySelector('.install-prompt-btn');
            if (text) text.innerHTML = '<strong>Installer sur iPhone</strong><span>Touchez ⎙ puis "Sur l\'écran d\'accueil"</span>';
            if (installBtn) installBtn.style.display = 'none';
            setTimeout(showInstallPrompt, 6000);
        }
    }
});

// ── Page Mouvements de prix ──────────────────────────────
let _moversPeriod = 1;       // jours (1, 7, 30)
let _moversFilter = 'all';   // 'all' | 'up' | 'down' | 'pf'
let _moversSort = 'pct_desc';// 'pct_desc' | 'pct_asc' | 'eur_desc' | 'eur_asc'
let _moversCache = null;

async function loadMoversPage() {
    const container = document.getElementById('moversContent');
    if (!container) return;
    container.innerHTML = '<div class="movers-loading">Chargement…</div>';
    try {
        const res = await fetch(`/api/movers?days=${_moversPeriod}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        _moversCache = await res.json();
        renderMoversPage();
    } catch (e) {
        container.innerHTML = `<div class="movers-empty">Erreur de chargement (${e.message || 'inconnue'}).</div>`;
    }
}

function renderMoversPage() {
    if (!_moversCache) return;
    const container = document.getElementById('moversContent');
    let items = [..._moversCache.items];

    // Filtrage portfolio (si filtre actif et user connecte)
    let pfNames = null;
    if (_moversFilter === 'pf' && currentUser) {
        const pf = loadPortfolioSync();
        pfNames = new Set(Object.entries(pf).filter(([, v]) => v && v.qty > 0).map(([k]) => k));
        items = items.filter(it => pfNames.has(it.name));
    }

    // Filtrage hausse/baisse
    if (_moversFilter === 'up') items = items.filter(it => it.deltaPct > 0);
    if (_moversFilter === 'down') items = items.filter(it => it.deltaPct < 0);

    // Tri
    const sortFns = {
        pct_desc: (a, b) => b.deltaPct - a.deltaPct,
        pct_asc: (a, b) => a.deltaPct - b.deltaPct,
        eur_desc: (a, b) => b.deltaEur - a.deltaEur,
        eur_asc: (a, b) => a.deltaEur - b.deltaEur,
    };
    items.sort(sortFns[_moversSort] || sortFns.pct_desc);

    // Stats globales
    const allUp = _moversCache.items.filter(it => it.deltaPct > 0);
    const allDown = _moversCache.items.filter(it => it.deltaPct < 0);
    const allFlat = _moversCache.items.filter(it => it.deltaPct === 0);
    const avgPct = _moversCache.items.length > 0
        ? _moversCache.items.reduce((s, it) => s + it.deltaPct, 0) / _moversCache.items.length
        : 0;
    const avgClass = avgPct > 0.3 ? 'positive' : avgPct < -0.3 ? 'negative' : '';
    const avgSign = avgPct >= 0 ? '+' : '';

    const periodLabel = _moversPeriod === 1 ? '24 heures'
        : _moversPeriod === 7 ? '7 jours'
        : _moversPeriod === 30 ? '30 jours' : `${_moversPeriod} jours`;

    container.innerHTML = `
        <!-- Stats globales sur la periode -->
        <div class="movers-stats">
            <div class="movers-stat movers-stat-up">
                <div class="movers-stat-icon">📈</div>
                <div>
                    <div class="movers-stat-value">${allUp.length}</div>
                    <div class="movers-stat-label">en hausse</div>
                </div>
            </div>
            <div class="movers-stat movers-stat-down">
                <div class="movers-stat-icon">📉</div>
                <div>
                    <div class="movers-stat-value">${allDown.length}</div>
                    <div class="movers-stat-label">en baisse</div>
                </div>
            </div>
            <div class="movers-stat movers-stat-flat">
                <div class="movers-stat-icon">➖</div>
                <div>
                    <div class="movers-stat-value">${allFlat.length}</div>
                    <div class="movers-stat-label">stables</div>
                </div>
            </div>
            <div class="movers-stat movers-stat-avg">
                <div class="movers-stat-icon">📊</div>
                <div>
                    <div class="movers-stat-value ${avgClass}">${avgSign}${avgPct.toFixed(2)} %</div>
                    <div class="movers-stat-label">variation moyenne</div>
                </div>
            </div>
        </div>

        <!-- Sélecteurs période -->
        <div class="movers-controls">
            <div class="movers-period-bar">
                <button class="movers-period-btn ${_moversPeriod === 1 ? 'active' : ''}" onclick="setMoversPeriod(1)">24h</button>
                <button class="movers-period-btn ${_moversPeriod === 7 ? 'active' : ''}" onclick="setMoversPeriod(7)">7j</button>
                <button class="movers-period-btn ${_moversPeriod === 30 ? 'active' : ''}" onclick="setMoversPeriod(30)">30j</button>
            </div>
            <div class="movers-filter-bar">
                <button class="movers-chip ${_moversFilter === 'all' ? 'active' : ''}" onclick="setMoversFilter('all')">Tous</button>
                <button class="movers-chip ${_moversFilter === 'up' ? 'active up' : ''}" onclick="setMoversFilter('up')">📈 Hausses</button>
                <button class="movers-chip ${_moversFilter === 'down' ? 'active down' : ''}" onclick="setMoversFilter('down')">📉 Baisses</button>
                ${currentUser ? `<button class="movers-chip ${_moversFilter === 'pf' ? 'active pf' : ''}" onclick="setMoversFilter('pf')">💼 Mon portfolio</button>` : ''}
            </div>
            <div class="movers-sort-wrap">
                <select class="movers-sort" onchange="setMoversSort(this.value)">
                    <option value="pct_desc" ${_moversSort === 'pct_desc' ? 'selected' : ''}>% Variation ↓</option>
                    <option value="pct_asc" ${_moversSort === 'pct_asc' ? 'selected' : ''}>% Variation ↑</option>
                    <option value="eur_desc" ${_moversSort === 'eur_desc' ? 'selected' : ''}>€ Variation ↓</option>
                    <option value="eur_asc" ${_moversSort === 'eur_asc' ? 'selected' : ''}>€ Variation ↑</option>
                </select>
            </div>
        </div>

        <!-- Compteur -->
        <div class="movers-count">${items.length} item${items.length > 1 ? 's' : ''} sur la période <strong>${periodLabel}</strong></div>

        <!-- Liste -->
        <div class="movers-list">
            ${items.length === 0 ? `
                <div class="movers-empty">
                    ${_moversFilter === 'pf'
                        ? 'Aucun item de votre portfolio n\'a bougé sur cette période.'
                        : 'Aucun item ne correspond aux filtres.'}
                </div>
            ` : items.map(it => {
                const pctCls = it.deltaPct > 0.3 ? 'up' : it.deltaPct < -0.3 ? 'down' : 'flat';
                const sign = it.deltaPct >= 0 ? '+' : '';
                const eurSign = it.deltaEur >= 0 ? '+' : '';
                // Bar width : on cap a 30% pour rester lisible
                const barPct = Math.min(Math.abs(it.deltaPct) * 3, 100);
                const inPf = pfNames && pfNames.has(it.name);
                const safeName = it.name.replace(/'/g, "\\'");
                return `<div class="mover-row mover-row-${pctCls}" onclick="openDetail('${safeName}')">
                    <div class="mover-info">
                        <div class="mover-name">
                            ${it.name}
                            ${inPf ? '<span class="mover-pf-badge">💼</span>' : ''}
                        </div>
                        <div class="mover-prices">
                            <span class="mover-price-before">${fmt(it.priceBefore)}</span>
                            <span class="mover-arrow">→</span>
                            <span class="mover-price-now"><strong>${fmt(it.priceNow)}</strong></span>
                        </div>
                    </div>
                    <div class="mover-bar-wrap">
                        <div class="mover-bar mover-bar-${pctCls}" style="width:${barPct}%"></div>
                    </div>
                    <div class="mover-deltas">
                        <span class="mover-delta-pct mover-delta-${pctCls}">${sign}${it.deltaPct.toFixed(2)} %</span>
                        <span class="mover-delta-eur mover-delta-${pctCls}">${eurSign}${fmt(it.deltaEur)}</span>
                    </div>
                </div>`;
            }).join('')}
        </div>

        <!-- Footer info -->
        <div class="movers-footer">
            Comparé du <strong>${new Date(_moversCache.targetDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</strong> à aujourd'hui · ${_moversCache.count} items avec historique
        </div>
    `;
}

function setMoversPeriod(days) {
    _moversPeriod = days;
    loadMoversPage();
}

function setMoversFilter(filter) {
    _moversFilter = filter;
    renderMoversPage();
}

function setMoversSort(sort) {
    _moversSort = sort;
    renderMoversPage();
}

// ── Chart.js : permet le scroll vertical sur mobile ──────────
// Par defaut Chart.js attache des listeners 'touchmove' qui peuvent
// bloquer le scroll natif de la page. En supprimant 'touchmove' de la
// liste d'events, on garde le tap (touchstart/touchend pour les tooltips)
// mais on laisse le browser gerer le scroll vertical.
if (typeof Chart !== 'undefined' && Chart.defaults) {
    Chart.defaults.events = ['mousemove', 'mouseout', 'click', 'touchstart', 'touchend'];
}

// ── Init ─────────────────────────────────────────────────────

setTheme(getTheme());
initAuth();
renderBlocsAccordion();
render();
renderTrends();
initScrollTopBtn();
updatePortfolioBadge();
loadSharedPortfolio();

// Lecture du parametre ?section= pour les app shortcuts du manifest
(function handleSectionParam() {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section && ['dashboard', 'catalogue', 'portfolio', 'tendances', 'simulation'].includes(section)) {
        // Differe pour laisser l'auth s'initialiser
        setTimeout(() => switchSection(section), 100);
    }
})();

fetchEbayPrices().then(() => {
    if (currentSection === 'portfolio') renderPortfolio();
    // Send push notifications for triggered alerts
    const alerts = getAlerts();
    for (const [name, alert] of Object.entries(alerts)) {
        if (alert.notified) continue;
        const p = products.find(pr => pr.name === name);
        if (p && p._ebayLoaded && p.price > 0 && p.price <= alert.threshold) {
            sendNotification('PokéScellé — Alerte prix', `${name} est à ${fmt(p.price)} (seuil: ${alert.threshold} €)`);
        }
    }
    // Cache prices for offline
    try { localStorage.setItem('pokescelle-cache', JSON.stringify({ ts: Date.now(), products: products.map(p => ({ name: p.name, price: p.price, lastPrice: p.lastPrice, trend: p.trend, low: p.low, high: p.high, sampleSize: p.sampleSize })) })); } catch {}
});
