/* -------------------------------------------------------------
   Lake Almanor Country Club PWA Service Worker (Phase 2)
   -------------------------------------------------------------
   • Cache‑first for static assets (HTML / CSS / JS / fonts)
   • Network‑first for API / PDF fetches so docs stay current
   • Offline fallback to /offline.html (optional)
---------------------------------------------------------------- */

const VERSION = 'v2';
const CORE_CACHE   = `core-${VERSION}`;
const PDF_CACHE    = `pdf-${VERSION}`;

// URLs essential for the shell to load offline
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/images/hero-poster.jpg',
  '/manifest.webmanifest'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CORE_CACHE).then(async cache => {
      const results = await Promise.allSettled(CORE_ASSETS.map(u => cache.add(u)));
      results.forEach(r => {
        if (r.status === 'rejected') console.warn('SW cache miss:', r.reason?.message || r);
      });
    })
  );
  self.skipWaiting();
});


self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !k.includes(VERSION)).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  const { request } = evt;
  const url = new URL(request.url);

  // PDFs (governing docs) – network‑first, fallback to cache
  if (url.pathname.endsWith('.pdf')) {
    evt.respondWith(networkFirst(request, PDF_CACHE));
    return;
  }

  // CORE – cache‑first
  if (CORE_ASSETS.includes(url.pathname) || request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    evt.respondWith(cacheFirst(request, CORE_CACHE));
    return;
  }
});

/* Helpers */
function cacheFirst(req, cacheName) {
  return caches.match(req).then(cached => cached || fetch(req).then(res => {
    caches.open(cacheName).then(c => c.put(req, res.clone()));
    return res;
  }));
}

function networkFirst(req, cacheName) {
  return fetch(req).then(res => {
    caches.open(cacheName).then(c => c.put(req, res.clone()));
    return res;
  }).catch(() => caches.match(req));
}
