// ============================================================
//  PokéScellé — Données & logique
//  Prix indicatifs marché FR — Avril 2026
// ============================================================

// Helper : génère les 6 produits pour une série
function serie(code, nom, bloc, overrides = {}) {
    const b = bloc === 'EV' ? 'Écarlate et Violet' : 'Méga-Évolution';
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
    ...serie('EV3.5', 'Pokémon 151', 'EV', { display: { price: 1200, old: 575, low: 900, high: 1400 } }),
    ...serie('EV04', 'Faille Paradoxe', 'EV'),
    ...serie('EV4.5', 'Destinées de Paldea', 'EV', { etb: { price: 130, old: 80, low: 100, high: 150 } }),
    ...serie('EV05', 'Forces Temporelles', 'EV'),
    ...serie('EV06', 'Mascarade Crépusculaire', 'EV'),
    ...serie('EV6.5', 'Fable Nébuleuse', 'EV'),
    ...serie('EV07', 'Couronne Stellaire', 'EV'),
    ...serie('EV08', 'Étincelles Déferlantes', 'EV'),
    ...serie('EV8.5', 'Évolutions Prismatiques', 'EV', { etb: { price: 100, old: 54.99, low: 80, high: 120 }, display: { price: 500, old: 520, low: 450, high: 550 } }),
    ...serie('EV09', 'Aventures Ensemble', 'EV', { display: { price: 200, old: 190, low: 180, high: 220 } }),
    ...serie('EV10', 'Rivalités Destinées', 'EV', { etb: { price: 130, old: 54.99, low: 100, high: 160 }, display: { price: 350, old: 215, low: 300, high: 400 }, display18: { price: 170, old: 107, low: 140, high: 200 } }),
    ...serie('EV10.S2', 'Foudre Noire (EV10.5)', 'EV', { etb: { price: 80, old: 54.99, low: 65, high: 95 } }),
    ...serie('EV10.5f', 'Flamme Blanche (EV10.5)', 'EV', { etb: { price: 80, old: 54.99, low: 65, high: 95 } }),
    ...serie('ME01', 'Méga-Évolution', 'ME', { etb: { price: 85, old: 54.99, low: 70, high: 100 }, display: { price: 280, old: 215, low: 250, high: 310 }, display18: { price: 65, old: 107, low: 55, high: 75 } }),
    ...serie('ME02', 'Flammes Fantasmagoriques', 'ME', { etb: { price: 80, old: 54.99, low: 65, high: 95 }, display: { price: 250, old: 215, low: 220, high: 280 }, display18: { price: 35, old: 107, low: 30, high: 45 } }),
    ...serie('ME2.5', 'Héros Transcendants', 'ME', { etb: { price: 80, old: 54.99, low: 65, high: 95 } }),
    ...serie('ME03', 'Équilibre Parfait', 'ME'),
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

const TYPE_LABELS = { etb: 'ETB', display: 'DISPLAY 36', display18: 'DISPLAY 18', tripack: 'TRIPACK', bundle: 'BUNDLE', booster: 'BOOSTER' };

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
        ['ev09', 'Aventures Ensemble'], ['ev10', 'Rivalités Destinées'], ['ev10s2', 'Foudre Noire (EV10.5)'],
        ['ev105f', 'Flamme Blanche (EV10.5)'], ['me01', 'Méga-Évolution'], ['me02', 'Flammes Fantasmagoriques'],
        ['me25', 'Héros Transcendants'], ['me03', 'Équilibre Parfait'],
    ];
    const types = [['etb', 'ETB'], ['display', 'Display 36'], ['display18', 'Display 18'], ['tripack', 'Tripack'], ['bundle', 'Bundle 6'], ['booster', 'Booster']];
    const map = {};
    for (const [sid, sname] of series) {
        for (const [tid, tprefix] of types) {
            map[`${sid}-${tid}`] = `${tprefix} ${sname}`;
        }
    }
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

    const lastDate = p.lastListing?.url ? new Date().toISOString().slice(0, 10) : '';

    return `<article class="product" data-product-name="${p.name.replace(/"/g, '&quot;')}" style="--i:${i}" onclick="openDetail('${p.name.replace(/'/g, "\\'")}')">
    <div class="product-img">
        ${imgHtml}
        ${editBtn}
    </div>
    <div class="product-info">
        <div class="product-name-row">
            <span class="product-name">${p.name}</span>
            <span class="product-type type-${p.type}">${TYPE_LABELS[p.type] || p.type}</span>
        </div>
        <div class="product-prices">
            <div class="product-price-col">
                <span class="product-price-label">Prix moyen</span>
                <span class="product-price-value">${fmt(p.price)}</span>
            </div>
            <div class="product-price-col" style="text-align:right">
                <span class="product-price-label">résultats</span>
                <span class="product-price-sub">${p.sampleSize || '—'}</span>
            </div>
        </div>
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

    if (priceEl) priceEl.textContent = fmt(p.price);
    if (subEl) subEl.textContent = p.sampleSize || '—';

    // Update image if available
    if (p.lastListing?.image) {
        const imgArea = card.querySelector('.product-img');
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

    // Update nav
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === section);
    });

    // Show/hide sections
    document.getElementById('sectionCatalogue').style.display = section === 'catalogue' ? 'block' : 'none';
    document.getElementById('sectionPortfolio').style.display = section === 'portfolio' ? 'block' : 'none';
    document.getElementById('sectionTendances').style.display = section === 'tendances' ? 'block' : 'none';

    // Show/hide sidebar filters
    document.getElementById('sidebarFilters').style.display = section === 'catalogue' ? 'block' : 'none';

    if (section === 'portfolio') renderPortfolio();
    if (section === 'tendances') renderTrends();
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

function getCheckedSeries() {
    const checks = document.querySelectorAll('#filterBlocs input[type="checkbox"]');
    const labels = ['Écarlate et Violet', 'Méga-Évolution'];
    const result = [];
    checks.forEach((cb, i) => { if (cb.checked) result.push(labels[i]); });
    return result;
}

function getFiltered() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const prix = document.getElementById('filterPrix').value;
    const sort = document.getElementById('sortBy').value;
    const checkedSeries = getCheckedSeries();

    let list = products.filter(p => {
        if (q && !p.name.toLowerCase().includes(q) && !p.ext.toLowerCase().includes(q)) return false;
        if (activeType && p.type !== activeType) return false;
        if (checkedSeries.length > 0 && !checkedSeries.includes(p.serie)) return false;
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
        default:           list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    }

    return list;
}

function render() {
    const list = getFiltered();
    document.getElementById('productsGrid').innerHTML = list.map(renderCard).join('');
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

function renderTrends() {
    const byTrend = [...products].sort((a, b) => b.trend - a.trend);
    const byPrice = [...products].sort((a, b) => b.price - a.price);
    const low = [...products].sort((a, b) => a.trend - b.trend);

    const row = (p, cls, val) =>
        `<li><span class="t-name">${p.name}</span><span class="t-value ${cls}">${val}</span></li>`;

    document.getElementById('trendUp').innerHTML =
        byTrend.slice(0, 5).map(p => row(p, 'up', `+${p.trend} %`)).join('');
    document.getElementById('trendMid').innerHTML =
        low.slice(0, 5).map(p => row(p, 'down', `${p.trend} %`)).join('');
    document.getElementById('trendHot').innerHTML =
        byPrice.slice(0, 5).map(p => row(p, 'hot', fmt(p.price))).join('');
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
            banner.textContent = `Chargement… ${updated}/${ids.length} prix`;
        }

        // Pause entre les batchs pour ne pas surcharger l'API
        if (i + 3 < ids.length) {
            await new Promise(r => setTimeout(r, 500));
        }
    }

    if (banner) {
        banner.textContent = `${updated} prix via eBay`;
        banner.classList.add('visible');
    }

    renderTrends();
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

const DEFAULT_HOLDINGS = {
    'ETB Pokémon 151': { qty: 0, cost: 54.99 },
    'Display 36 Pokémon 151': { qty: 1, cost: 575 },
    'ETB Destinées de Paldea': { qty: 1, cost: 80 },
    'ETB Évolutions Prismatiques': { qty: 1, cost: 54.99 },
    'Display 36 Évolutions Prismatiques': { qty: 2, cost: 520 },
    'Display 36 Aventures Ensemble': { qty: 2, cost: 190 },
    'ETB Rivalités Destinées': { qty: 1, cost: 54.99 },
    'Display 36 Rivalités Destinées': { qty: 1, cost: 215 },
    'Display 18 Rivalités Destinées': { qty: 2, cost: 107 },
    'ETB Foudre Noire (EV10.5)': { qty: 1, cost: 54.99 },
    'ETB Flamme Blanche (EV10.5)': { qty: 1, cost: 54.99 },
    'ETB Méga-Évolution': { qty: 2, cost: 54.99 },
    'Display 36 Méga-Évolution': { qty: 1, cost: 215 },
    'ETB Flammes Fantasmagoriques': { qty: 2, cost: 54.99 },
    'Display 36 Flammes Fantasmagoriques': { qty: 1, cost: 215 },
    'ETB Héros Transcendants': { qty: 7, cost: 54.99 },
};

function getDefaultPortfolio() {
    const pf = {};
    for (const p of products) {
        const def = DEFAULT_HOLDINGS[p.name];
        pf[p.name] = def ? { qty: def.qty, cost: def.cost } : { qty: 0, cost: 0 };
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
}

function renderPortfolioCard(p, pf) {
    const h = pf[p.name] || { qty: 0, cost: 0 };
    const totalInvested = h.qty * h.cost;
    const currentVal = h.qty * p.price;
    const pnl = currentVal - totalInvested;
    const pnlPct = totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(1) : '0';
    const pnlClass = pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : '';

    return `<div class="pf-card">
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

async function renderPortfolio() {
    const pf = await loadPortfolio();
    const sorted = [...products].sort((a, b) => {
        const aQty = (pf[a.name]?.qty || 0);
        const bQty = (pf[b.name]?.qty || 0);
        if (aQty > 0 && bQty === 0) return -1;
        if (aQty === 0 && bQty > 0) return 1;
        return a.name.localeCompare(b.name, 'fr');
    });
    document.getElementById('portfolioGrid').innerHTML = sorted.map(p => renderPortfolioCard(p, pf)).join('');
    renderPortfolioSummary(pf);
}

// ── Events ───────────────────────────────────────────────────

document.getElementById('searchInput').addEventListener('input', render);
document.getElementById('filterPrix').addEventListener('change', render);
document.getElementById('sortBy').addEventListener('change', render);

// ── Init ─────────────────────────────────────────────────────

initAuth();
render();
renderTrends();

fetchEbayPrices().then(() => {
    if (currentSection === 'portfolio') renderPortfolio();
});
