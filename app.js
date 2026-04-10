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
    ...serie('ME03', 'Équilibre Parfait', 'ME'),
    // Épée et Bouclier
    ...serie('EB11', 'Origine Perdue', 'EB', { etb: { price: 350, old: 54.99, low: 280, high: 400 }, display: { price: 550, old: 215, low: 250, high: 850 }, tripack: { price: 40, old: 17.99, low: 35, high: 80 }, bundle: { price: 90, old: 35, low: 70, high: 120 }, booster: { price: 15, old: 6.99, low: 10, high: 40 } }),
    ...serie('EB12', 'Tempête Argentée', 'EB', { etb: { price: 310, old: 54.99, low: 200, high: 400 }, display: { price: 400, old: 215, low: 330, high: 470 }, tripack: { price: 44, old: 17.99, low: 40, high: 50 }, bundle: { price: 75, old: 35, low: 60, high: 100 }, booster: { price: 15, old: 6.99, low: 10, high: 40 } }),
    ...serie('EB12.5', 'Zénith Suprême', 'EB', { etb: { price: 320, old: 54.99, low: 299, high: 500 }, display: { price: 500, old: 215, low: 400, high: 700 }, tripack: { price: 60, old: 17.99, low: 50, high: 80 }, booster: { price: 25, old: 6.99, low: 19, high: 40 } }),
];

// ── Helpers ──────────────────────────────────────────────────

function fmt(price) {
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

const TYPE_LABELS = { etb: 'ETB', display: 'DISPLAY 36', display18: 'DISPLAY 18', tripack: 'TRIPACK', bundle: 'BUNDLE', booster: 'BOOSTER', dispbundle: 'DISPLAY BUNDLE' };

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
    return map;
}

const EBAY_PRODUCT_MAP = buildEbayMap();

// ── Render Cards ────────────────────────────────────────────

function renderCard(p, i) {
    const ebayId = getEbayId(p.name);
    const editBtn = ebayId ? `<button class="btn-ebay-edit" onclick="event.stopPropagation();openQueryEditor('${ebayId}','${p.name.replace(/'/g, "\\'")}')" title="Modifier la source">⚙</button>` : '';

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
                    </div>
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
                        <h4 style="font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:12px">Évolution des prix</h4>
                        <div style="background:var(--bg-card);border-radius:12px;padding:16px;border:1px solid var(--border)">
                            <canvas id="priceChart" height="200"></canvas>
                            <p id="priceChartEmpty" style="color:var(--text-muted);font-size:13px;text-align:center;display:none;margin:20px 0">
                                Les données s'accumulent jour après jour. Revenez demain pour voir l'évolution !
                            </p>
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

async function loadPriceChart(productId) {
    try {
        const res = await fetch(`/api/history/${productId}`);
        const history = await res.json();

        const canvas = document.getElementById('priceChart');
        const emptyMsg = document.getElementById('priceChartEmpty');
        if (!canvas) return;

        if (history.length < 1) {
            canvas.style.display = 'none';
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
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
    } catch (err) {
        console.error('Erreur chargement historique:', err);
    }
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
            const priceRes = await fetch(`/api/price/${ebayId}`);
            const priceData = await priceRes.json();
            if (priceData.price) {
                applyEbayPrice(priceData);
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

    currentSection = section;

    // Fermer sidebar sur mobile
    if (window.innerWidth <= 640) {
        document.querySelector('.sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('open');
    }

    // Update nav
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === section);
    });

    // Show/hide sections
    document.getElementById('sectionCatalogue').style.display = section === 'catalogue' ? 'block' : 'none';
    document.getElementById('sectionPortfolio').style.display = section === 'portfolio' ? 'block' : 'none';
    document.getElementById('sectionTendances').style.display = section === 'tendances' ? 'block' : 'none';
    document.getElementById('sectionSimulation').style.display = section === 'simulation' ? 'block' : 'none';

    // Show/hide sidebar filters
    document.getElementById('sidebarFilters').style.display = section === 'catalogue' ? 'block' : 'none';

    if (section === 'portfolio') renderPortfolio();
    if (section === 'tendances') renderTrends();
    if (section === 'simulation') renderSimulation();
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

function getFiltered() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const prix = document.getElementById('filterPrix').value;
    const sort = document.getElementById('sortBy').value;

    let list = products.filter(p => {
        if (q && !p.name.toLowerCase().includes(q) && !p.ext.toLowerCase().includes(q)) return false;
        if (activeType && p.type !== activeType) return false;
        if (activeBlocs.size > 0 && !activeBlocs.has(p.serie)) return false;
        if (activeSerie && !p.ext?.includes(activeSerie)) return false;
        if (prix) {
            const [lo, hi] = prix.split('-').map(Number);
            if (p.price < lo || p.price > hi) return false;
        }
        return true;
    });

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

    return list;
}

function render() {
    const list = getFiltered();
    const sort = document.getElementById('sortBy').value;
    const grid = document.getElementById('productsGrid');

    if (sort === 'serie') {
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
        grid.innerHTML = groups.map(g =>
            `<div class="serie-group">
                <div class="serie-header">
                    <span class="serie-code">${g.code}</span>
                    <span class="serie-name">${g.name}</span>
                </div>
                <div class="serie-items">${g.items.map(renderCard).join('')}</div>
            </div>`
        ).join('');
    } else {
        grid.innerHTML = `<div class="serie-items flat-grid">${list.map(renderCard).join('')}</div>`;
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

    if (banner) {
        banner.textContent = 'Chargement des prix…';
        banner.classList.add('visible');
    }

    const ids = Object.keys(EBAY_PRODUCT_MAP);
    let updated = 0;
    const total = ids.length;

    // Chargement progressif : chaque prix arrive et s'affiche en direct
    for (let i = 0; i < ids.length; i += 3) {
        const batch = ids.slice(i, i + 3);
        const results = await Promise.allSettled(
            batch.map(id => fetch(`/api/price/${id}`).then(r => r.json()))
        );

        for (const result of results) {
            if (result.status === 'fulfilled') {
                const name = applyEbayPrice(result.value);
                if (name) {
                    updated++;
                    updateCard(name);
                }
            }
        }

        if (banner) {
            banner.textContent = `${updated}/${total} prix chargés…`;
        }

        if (i + 3 < ids.length) {
            await new Promise(r => setTimeout(r, 200));
        }
    }

    if (banner) {
        banner.textContent = '';
        banner.classList.remove('visible');
    }

    showToast('✅', `${updated} prix mis à jour`, 'Données eBay actualisées');

    renderTrends();
    updatePortfolioBadge();
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
            .then(data => { currentUser = data.username; updateAuthUI(); })
            .catch(() => { logout(); });
    }
    updateAuthUI();
}

function updateAuthUI() {
    // Topbar
    const area = document.getElementById('authArea');
    if (currentUser) {
        area.innerHTML = `<div class="user-info">
            <span class="user-name">${currentUser}</span>
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
    updateAuthUI();
    if (currentSection === 'portfolio') switchSection('catalogue');
}

document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
});

document.getElementById('authForm').addEventListener('submit', handleAuth);

// ── Portfolio ────────────────────────────────────────────────

function getDefaultPortfolio() {
    const pf = {};
    for (const p of products) {
        pf[p.name] = { qty: 0, cost: 0 };
    }
    return pf;
}

let _portfolioCache = null;

async function loadPortfolio() {
    if (authToken) {
        try {
            const res = await fetch('/api/portfolio', { headers: { 'Authorization': `Bearer ${authToken}` } });
            if (res.ok) {
                const data = await res.json();
                if (Object.keys(data).length > 0) { _portfolioCache = data; return data; }
            }
        } catch {}
    }
    const saved = localStorage.getItem('pokescelle-portfolio');
    if (saved) return JSON.parse(saved);
    return getDefaultPortfolio();
}

function loadPortfolioSync() {
    if (_portfolioCache) return _portfolioCache;
    const saved = localStorage.getItem('pokescelle-portfolio');
    if (saved) return JSON.parse(saved);
    return getDefaultPortfolio();
}

let _saveTimer = null;

function savePortfolio(pf) {
    _portfolioCache = pf;
    localStorage.setItem('pokescelle-portfolio', JSON.stringify(pf));
    updatePortfolioBadge();
    if (authToken) {
        clearTimeout(_saveTimer);
        _saveTimer = setTimeout(() => {
            fetch('/api/portfolio', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(pf),
            }).catch(() => {});
        }, 500);
    }
}

async function refreshPortfolio() {
    // Forcer un snapshot et recharger le graphique
    await fetch('/api/portfolio-snapshot', { method: 'POST', headers: { 'Authorization': `Bearer ${authToken}` } });
    await renderPortfolio();
}

function resetPortfolio() {
    if (!confirm('Réinitialiser le portfolio avec les données par défaut ?')) return;
    const pf = getDefaultPortfolio();
    savePortfolio(pf);
    renderPortfolio();
}

function onPortfolioInput(name, field, value) {
    const pf = loadPortfolioSync();
    if (!pf[name]) pf[name] = { qty: 0, cost: 0 };
    pf[name][field] = parseFloat(value) || 0;
    savePortfolio(pf);
    renderPortfolioSummary(pf);

    // Mettre à jour la carte en direct
    const p = products.find(pr => pr.name === name);
    if (p) {
        const h = pf[name];
        const totalInvested = h.qty * h.cost;
        const currentVal = h.qty * p.price;
        const pnl = currentVal - totalInvested;
        const card = document.querySelector(`.pf-card[data-name="${name.replace(/"/g, '\\"')}"]`);
        if (card) {
            const results = card.querySelectorAll('.pf-result-value');
            if (results[0]) results[0].textContent = h.qty > 0 ? fmt(totalInvested) : '—';
            if (results[1]) results[1].textContent = h.qty > 0 ? fmt(currentVal) : '—';
            if (results[2]) {
                results[2].textContent = h.qty > 0 ? (pnl >= 0 ? '+' : '') + fmt(pnl) : '—';
                results[2].className = 'pf-result-value ' + (pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : '');
            }
        }
    }
}

function renderPortfolioCard(p, pf) {
    const h = pf[p.name] || { qty: 0, cost: 0 };
    const totalInvested = h.qty * h.cost;
    const currentVal = h.qty * p.price;
    const pnl = currentVal - totalInvested;
    const pnlPct = totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(1) : '0';
    const pnlClass = pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : '';

    return `<div class="pf-card" data-name="${p.name}">
    <div class="pf-card-header">
        <span class="product-type type-${p.type}">${TYPE_LABELS[p.type]}</span>
        <span style="font-size:11px;color:var(--text-muted)">${p.serie}</span>
    </div>
    <h3 class="product-name">${p.name}</h3>
    <p class="pf-card-ext">${p.ext}</p>
    <div class="pf-inputs">
        <div class="pf-field">
            <label>Quantité</label>
            <input type="number" min="0" value="${h.qty}" oninput="onPortfolioInput('${p.name.replace(/'/g, "\\'")}','qty',this.value)" placeholder="0">
        </div>
        <div class="pf-field">
            <label>Prix d'achat (€)</label>
            <input type="number" min="0" step="0.01" value="${h.cost || ''}" oninput="onPortfolioInput('${p.name.replace(/'/g, "\\'")}','cost',this.value)" placeholder="0,00">
        </div>
    </div>
    <div class="pf-result">
        <div class="pf-result-item">
            <span class="pf-result-label">Investi</span>
            <span class="pf-result-value">${h.qty > 0 ? fmt(totalInvested) : '—'}</span>
        </div>
        <div class="pf-result-item">
            <span class="pf-result-label">Valeur</span>
            <span class="pf-result-value">${h.qty > 0 ? fmt(currentVal) : '—'}</span>
        </div>
        <div class="pf-result-item">
            <span class="pf-result-label">P&L</span>
            <span class="pf-result-value ${pnlClass}">${h.qty > 0 ? (pnl >= 0 ? '+' : '') + fmt(pnl) : '—'}</span>
        </div>
    </div>
</div>`;
}

function renderPortfolioSummary(pf) {
    let totalInvested = 0, totalCurrent = 0, totalItems = 0;
    for (const p of products) {
        const h = pf[p.name];
        if (!h || h.qty <= 0) continue;
        totalItems += h.qty;
        totalInvested += h.qty * h.cost;
        totalCurrent += h.qty * p.price;
    }
    const totalPnl = totalCurrent - totalInvested;
    const pnlPct = totalInvested > 0 ? ((totalPnl / totalInvested) * 100).toFixed(1) : '0';
    const pnlClass = totalPnl > 0 ? 'positive' : totalPnl < 0 ? 'negative' : '';

    document.getElementById('portfolioSummary').innerHTML = `
        <div class="pf-stat"><span class="pf-stat-label">Produits en stock</span><span class="pf-stat-value">${totalItems}</span></div>
        <div class="pf-stat"><span class="pf-stat-label">Total investi</span><span class="pf-stat-value">${fmt(totalInvested)}</span></div>
        <div class="pf-stat"><span class="pf-stat-label">Valeur actuelle</span><span class="pf-stat-value">${fmt(totalCurrent)}</span></div>
        <div class="pf-stat"><span class="pf-stat-label">P&L Total</span><span class="pf-stat-value ${pnlClass}">${totalPnl >= 0 ? '+' : ''}${fmt(totalPnl)} (${pnlPct} %)</span></div>
    `;
}

let portfolioChartInstance = null;

async function loadPortfolioChart() {
    const wrap = document.getElementById('portfolioChartWrap');
    try {
        if (!authToken) { wrap.style.display = 'none'; return; }
        const res = await fetch('/api/portfolio-history', { headers: { 'Authorization': `Bearer ${authToken}` } });
        const history = await res.json();
        if (!history || history.length === 0) { wrap.style.display = 'none'; return; }

        wrap.style.display = 'block';
        const labels = history.map(h => h.date);
        const investedData = history.map(h => h.invested);
        const valueData = history.map(h => h.value);
        const pnlData = history.map(h => h.pnl);

        if (portfolioChartInstance) portfolioChartInstance.destroy();

        const ctx = document.getElementById('portfolioChart').getContext('2d');
        portfolioChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Investi', data: investedData, borderColor: '#94a3b8', backgroundColor: 'rgba(148,163,184,0.08)', borderWidth: 2, pointRadius: 3, tension: 0.3, fill: false },
                    { label: 'Valeur', data: valueData, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.10)', borderWidth: 2, pointRadius: 3, tension: 0.3, fill: true },
                    { label: 'P&L', data: pnlData, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', borderWidth: 2, pointRadius: 3, tension: 0.3, borderDash: [5, 3], fill: false },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)} €`,
                        },
                    },
                },
                scales: {
                    x: { ticks: { color: '#64748b', maxRotation: 45 }, grid: { color: 'rgba(148,163,184,0.1)' } },
                    y: { ticks: { color: '#64748b', callback: v => v + ' €' }, grid: { color: 'rgba(148,163,184,0.1)' } },
                },
            },
        });
    } catch {
        wrap.style.display = 'none';
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

    if (!history || history.length === 0) {
        wrap.style.display = 'none';
        return;
    }

    wrap.style.display = 'block';
    const reversed = [...history].reverse();

    document.getElementById('portfolioHistoryTable').innerHTML = `
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

    const sorted = [...products].sort((a, b) => {
        const aQty = (pf[a.name]?.qty || 0);
        const bQty = (pf[b.name]?.qty || 0);
        if (aQty > 0 && bQty === 0) return -1;
        if (aQty === 0 && bQty > 0) return 1;
        return a.name.localeCompare(b.name, 'fr');
    });
    document.getElementById('portfolioGrid').innerHTML = sorted.map(p => renderPortfolioCard(p, pf)).join('');
    renderPortfolioSummary(pf);
    loadPortfolioChart();

    // Charger l'historique (remote si connecté, sinon local)
    if (authToken) {
        try {
            const res = await fetch('/api/portfolio-history', { headers: { 'Authorization': `Bearer ${authToken}` } });
            const remote = await res.json();
            renderPortfolioHistory(remote);
        } catch { renderPortfolioHistory(null); }
    } else {
        renderPortfolioHistory(null);
    }
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
    ['sectionCatalogue', 'sectionPortfolio', 'sectionTendances', 'sectionSimulation'].forEach(id => {
        document.getElementById(id).addEventListener('scroll', function() {
            btn.classList.toggle('visible', this.scrollTop > 300);
        });
    });
}

// ── Portfolio Badge ─────────────────────────────────────────

function updatePortfolioBadge() {
    const badge = document.getElementById('portfolioBadge');
    if (!badge) return;
    const pf = loadPortfolioSync();
    const count = Object.values(pf).filter(h => h.qty > 0).length;
    badge.textContent = count > 0 ? count : '';
}

// ── Simulation ──────────────────────────────────────────────

let simScenario = 'moderate';
let simFilterType = '';
let simFilterSeries = '';
let simSort = 'mult20';

function setSimScenario(scenario) {
    simScenario = scenario;
    document.querySelectorAll('.sim-scenario-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.scenario === scenario);
    });
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
    // Base rates par type (les ETB et displays prennent plus de valeur)
    const baseRates = {
        conservative: { etb: 0.06, display: 0.08, display18: 0.05, booster: 0.10, tripack: 0.04, bundle: 0.05, dispbundle: 0.07 },
        moderate:     { etb: 0.10, display: 0.12, display18: 0.08, booster: 0.15, tripack: 0.06, bundle: 0.08, dispbundle: 0.10 },
        optimistic:   { etb: 0.15, display: 0.18, display18: 0.12, booster: 0.22, tripack: 0.10, bundle: 0.12, dispbundle: 0.15 },
    };
    let rate = baseRates[scenario]?.[type] || baseRates[scenario]?.etb || 0.08;

    // Bonus d'âge : les séries plus anciennes ont prouvé leur valeur
    if (seriesAge >= 5) rate *= 1.15;
    if (seriesAge >= 10) rate *= 1.10;

    return rate;
}

// Estimation de l'âge de la série basée sur le code
function getSeriesAge(code) {
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
    const scenarioLabels = {
        conservative: { label: 'Conservateur', desc: 'Croissance lente et stable, similaire aux placements classiques. Hypothèse : le marché Pokémon continue mais ralentit.', color: 'var(--blue)' },
        moderate:     { label: 'Modéré', desc: 'Croissance soutenue basée sur les tendances actuelles du marché scellé Pokémon. Hypothèse : la demande reste forte.', color: 'var(--orange)' },
        optimistic:   { label: 'Optimiste', desc: 'Forte croissance portée par la nostalgie grandissante et la raréfaction des produits scellés. Hypothèse : boom du marché.', color: 'var(--green-light)' },
    };

    const info = scenarioLabels[simScenario];
    document.getElementById('simInfoBar').innerHTML = `
        <span class="sim-info-label" style="color:${info.color}">📋 ${info.label}</span>
        <span class="sim-info-desc">${info.desc}</span>
    `;

    // Grouper par série
    const seriesMap = {};
    for (const p of products) {
        if (!p._ebayLoaded && p.price <= 0) continue;
        const code = p.ext?.split(' — ')[0] || '';
        const name = p.ext?.split(' — ')[1] || '';
        if (!code) continue;
        if (!seriesMap[code]) seriesMap[code] = { code, name, products: [] };
        seriesMap[code].products.push(p);
    }
    const series = Object.values(seriesMap);

    // Calcul des projections globales
    let totalNow = 0, total5 = 0, total10 = 0, total20 = 0;
    const seriesProjections = series.map(s => {
        const age = getSeriesAge(s.code);
        let setNow = 0, set5 = 0, set10 = 0, set20 = 0;
        const prodProj = s.products.map(p => {
            const msrp = MSRP[p.type] || 0;
            const price = p.price > 0 ? p.price : msrp;
            if (price <= 0) return null;
            const p5 = projectPrice(price, p.type, 5, simScenario, age);
            const p10 = projectPrice(price, p.type, 10, simScenario, age);
            const p20 = projectPrice(price, p.type, 20, simScenario, age);
            setNow += price; set5 += p5; set10 += p10; set20 += p20;
            return { ...p, msrp, projected5: p5, projected10: p10, projected20: p20 };
        }).filter(Boolean);

        totalNow += setNow; total5 += set5; total10 += set10; total20 += set20;
        return { ...s, setNow, set5, set10, set20, prodProj, age };
    });

    // Render global KPIs
    const mult5 = totalNow > 0 ? total5 / totalNow : 0;
    const mult10 = totalNow > 0 ? total10 / totalNow : 0;
    const mult20 = totalNow > 0 ? total20 / totalNow : 0;

    document.getElementById('simGlobal').innerHTML = `
        <div class="sim-kpi-grid">
            <div class="sim-kpi sim-kpi-now">
                <div class="sim-kpi-label">Valeur actuelle</div>
                <div class="sim-kpi-value">${fmt(totalNow)}</div>
                <div class="sim-kpi-sub">Tous les sets combinés</div>
            </div>
            <div class="sim-kpi sim-kpi-5">
                <div class="sim-kpi-label">Dans 5 ans</div>
                <div class="sim-kpi-value">${fmt(Math.round(total5))}</div>
                <div class="sim-kpi-sub">×${mult5.toFixed(1)} · +${((mult5 - 1) * 100).toFixed(0)}%</div>
            </div>
            <div class="sim-kpi sim-kpi-10">
                <div class="sim-kpi-label">Dans 10 ans</div>
                <div class="sim-kpi-value">${fmt(Math.round(total10))}</div>
                <div class="sim-kpi-sub">×${mult10.toFixed(1)} · +${((mult10 - 1) * 100).toFixed(0)}%</div>
            </div>
            <div class="sim-kpi sim-kpi-20">
                <div class="sim-kpi-label">Dans 20 ans</div>
                <div class="sim-kpi-value">${fmt(Math.round(total20))}</div>
                <div class="sim-kpi-sub">×${mult20.toFixed(1)} · +${((mult20 - 1) * 100).toFixed(0)}%</div>
            </div>
        </div>
    `;

    // Render series projections
    seriesProjections.sort((a, b) => b.set20 - a.set20);
    document.getElementById('simSeriesGrid').innerHTML = `
        <div class="sim-series-grid">
            ${seriesProjections.map(s => {
                const m5 = s.setNow > 0 ? s.set5 / s.setNow : 0;
                const m10 = s.setNow > 0 ? s.set10 / s.setNow : 0;
                const m20 = s.setNow > 0 ? s.set20 / s.setNow : 0;
                const heatClass = m20 >= 8 ? 'sim-heat-fire' : m20 >= 4 ? 'sim-heat-hot' : m20 >= 2.5 ? 'sim-heat-warm' : 'sim-heat-cool';
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
                        <div class="sim-bar-segment sim-bar-5" style="flex:${m5.toFixed(1)}">
                            <span class="sim-bar-label">5 ans</span>
                            <span class="sim-bar-value">${fmt(Math.round(s.set5))}</span>
                        </div>
                        <div class="sim-bar-segment sim-bar-10" style="flex:${Math.min(m10, 6).toFixed(1)}">
                            <span class="sim-bar-label">10 ans</span>
                            <span class="sim-bar-value">${fmt(Math.round(s.set10))}</span>
                        </div>
                        <div class="sim-bar-segment sim-bar-20" style="flex:${Math.min(m20, 10).toFixed(1)}">
                            <span class="sim-bar-label">20 ans</span>
                            <span class="sim-bar-value">${fmt(Math.round(s.set20))}</span>
                        </div>
                    </div>
                    <div class="sim-series-mults">
                        <span>×${m5.toFixed(1)} à 5 ans</span>
                        <span>×${m10.toFixed(1)} à 10 ans</span>
                        <span class="sim-mult-main">×${m20.toFixed(1)} à 20 ans</span>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;

    // Store all products globally for filtering
    window._simAllProds = seriesProjections.flatMap(s => s.prodProj.map(p => ({ ...p, seriesCode: s.code, seriesName: s.name })));
    window._simSeriesList = seriesProjections.map(s => ({ code: s.code, name: s.name }));

    renderSimProductTable();
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
                <span class="sim-col-mult">×Multi</span>
            </div>
            ${filtered.map((p, i) => {
                const mult = p.price > 0 ? p.projected20 / p.price : 0;
                const multClass = mult >= 10 ? 'sim-mult-fire' : mult >= 5 ? 'sim-mult-hot' : mult >= 3 ? 'sim-mult-warm' : '';
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
                    <span class="sim-col-mult ${multClass}">×${mult.toFixed(1)}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

// ── Events ───────────────────────────────────────────────────

document.getElementById('searchInput').addEventListener('input', render);
document.getElementById('filterPrix').addEventListener('change', render);
document.getElementById('sortBy').addEventListener('change', render);

// ── Init ─────────────────────────────────────────────────────

initAuth();
renderBlocsAccordion();
render();
renderTrends();
initScrollTopBtn();
updatePortfolioBadge();

fetchEbayPrices().then(() => {
    if (currentSection === 'portfolio') renderPortfolio();
});
