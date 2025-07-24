/* -------------------------------------------------------------
   LACC Service Worker – safer caching (v2.1)
   • cacheFirst() and networkFirst() now clone responses before use
   • addAll replaced with individual add() wrapped in try/catch
   ------------------------------------------------------------- */

const VERSION      = 'v2.2';
const CORE_CACHE   = `core-${VERSION}`;
const PDF_CACHE    = `pdf-${VERSION}`;

const CORE_ASSETS = [
  '/',
  '/lacc-dev/',
  '/index.html',
  '/lacc-dev/index.html',
  '/lacc-dev/css/style.css',
  '/lacc-dev/js/main.js',
  '/lacc-dev/js/events-carousel.js',
  '/lacc-dev/js/amenity-map.js',
  '/lacc-dev/js/alert-toast.js',
  '/lacc-dev/js/gate-alert.js',
  '/lacc-dev/manifest.webmanifest'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CORE_CACHE).then(async cache => {
      for (const url of CORE_ASSETS) {
        try { await cache.add(url); }
        catch (e) { console.warn('SW cache miss:', url); }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !k.includes(VERSION)).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  const { request } = evt;
  const url = new URL(request.url);

  // PDFs – network first
  if (url.pathname.endsWith('.pdf')) {
    evt.respondWith(networkFirst(request, PDF_CACHE));
    return;
  }

  // Core assets – cache first
  if (CORE_ASSETS.includes(url.pathname) || ['style','script','image'].includes(request.destination)) {
    evt.respondWith(cacheFirst(request, CORE_CACHE));
    return;
   }

   // HTML pages – network first with offline fallback
   if (request.mode === 'navigate') {
    evt.respondWith(networkFirst(request, CORE_CACHE, '/index.html'));
  }
});

/* ---------- Strategies ---------- */
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function networkFirst(req, cacheName, fallbackPath) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    if (fallbackPath) {
       const fallback = await cache.match(fallbackPath);
       if (fallback) return fallback;
     }
    return new Response('Service unavailable', { status: 503 });
  }
}
