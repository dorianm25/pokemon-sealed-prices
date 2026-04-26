const CACHE_NAME = 'pokescelle-v19';
// Assets a pre-cacher au moment de l'install (necessaires au demarrage offline)
const STATIC_ASSETS = [
    '/',
    '/app.js',
    '/style.css',
    '/index.html',
    '/manifest.json',
    '/icons/icon.svg',
    '/icons/icon-maskable.svg',
];

// Assets pour lesquels on veut TOUJOURS la derniere version (network-first)
const NETWORK_FIRST = ['/app.js', '/style.css', '/index.html', '/'];

self.addEventListener('install', e => {
    // addAll() est atomique : si UN asset echoue, tout est annule. On fait du
    // best-effort en chargeant les assets un par un pour eviter qu'un 404
    // sur un asset secondaire bloque l'install entiere.
    e.waitUntil(caches.open(CACHE_NAME).then(cache =>
        Promise.all(STATIC_ASSETS.map(url => cache.add(url).catch(err => {
            console.warn('[sw] precache failed for', url, err);
        })))
    ));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // On ignore les requetes non-GET (POST/PUT vers /api ne doivent pas etre cachees)
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);
    // Ignore les requetes cross-origin (fonts Google, eBay images, etc) - laisse le browser gerer
    if (url.origin !== self.location.origin) return;

    const isApi = url.pathname.startsWith('/api/');
    const isCore = NETWORK_FIRST.some(p => url.pathname === p || url.pathname.endsWith(p));

    // Network-first pour API + assets critiques (app.js, style.css, index.html)
    if (isApi || isCore) {
        e.respondWith(
            fetch(e.request).then(res => {
                // On met a jour le cache en arriere-plan pour le fallback offline
                if (!isApi && res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                }
                return res;
            }).catch(() => caches.match(e.request).then(cached => {
                // Si pas de cache et offline : retourne une 503 propre pour les API,
                // ou la page index pour les routes app (SPA fallback).
                if (cached) return cached;
                if (isApi) return new Response(JSON.stringify({ error: 'Hors ligne' }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' },
                });
                return caches.match('/index.html');
            }))
        );
        return;
    }

    // Cache-first pour le reste (images, icons, manifest, etc.)
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
            if (res && res.status === 200) {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
            }
            return res;
        }).catch(() => {
            // Image ratee + pas de cache : 1x1 transparent (evite les icones cassees)
            if (e.request.destination === 'image') {
                return new Response('', { status: 204 });
            }
            return new Response('Hors ligne', { status: 503 });
        }))
    );
});
