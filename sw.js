const CACHE_NAME = 'pokescelle-v12';
const STATIC_ASSETS = ['/', '/app.js', '/style.css', '/index.html'];

// Assets pour lesquels on veut TOUJOURS la dernière version (network-first)
const NETWORK_FIRST = ['/app.js', '/style.css', '/index.html', '/'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    const isApi = url.pathname.startsWith('/api/');
    const isCore = NETWORK_FIRST.some(p => url.pathname === p || url.pathname.endsWith(p));

    // Network-first pour API + assets critiques (app.js, style.css, index.html)
    if (isApi || isCore) {
        e.respondWith(
            fetch(e.request).then(res => {
                // On met à jour le cache en arrière-plan pour le fallback offline
                if (!isApi && res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                }
                return res;
            }).catch(() => caches.match(e.request))
        );
        return;
    }

    // Cache-first pour le reste (images, icons, etc.)
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
            if (res && res.status === 200) {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
            }
            return res;
        }))
    );
});
