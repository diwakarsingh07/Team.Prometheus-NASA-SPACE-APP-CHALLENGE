/* ============================================================
   TEAM PROMETHEUS — SERVICE WORKER (prometheus-v5-gemini)
   Offline & repeat-visitor asset caching layer
   - Precaches app shell (HTML, CSS, JS)
   - Network-first for frames and navigation to prevent stale video caches
   - Auto-purges old astronaut caches on activate
   ============================================================ */

const CACHE_NAME = 'prometheus-v5-gemini';

const PRECACHE_URLS = [
  '/',
  '/landing.html',
  '/index.html',
  '/comare.html',
  '/scientist.html',
  '/landing.css',
  '/compare.css',
  '/styles.css',
  '/landing.js',
  '/app.js',
  '/citizen_engine.js',
  '/citizen_agent.js'
];

// Install: precache app shell and skip waiting immediately
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (err) {
        await Promise.all(
          PRECACHE_URLS.map(async url => {
            try {
              const res = await fetch(url);
              if (res.ok) await cache.put(url, res);
            } catch (e) {
              console.warn('[SW] Precache item failed:', url, e);
            }
          })
        );
      }
    })
  );
});

// Activate: clean up obsolete caches (especially v1, v2, v3, v4) and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Purging old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: route-specific caching strategies
self.addEventListener('fetch', event => {
  // Only process standard GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignore non-http/https requests (e.g. chrome-extension://)
  if (!url.protocol.startsWith('http')) return;

  const isHTML = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  const isFrame = url.pathname.includes('/frames_loader/') || url.pathname.includes('/frames_v2/');

  // Strategy 1: HTML Requests -> Network-First with Cache Fallback
  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const urlPath = new URL(event.request.url).pathname;
          if (urlPath === '/scientist') {
            const sc = await caches.match('/scientist.html');
            if (sc) return sc;
          }
          if (urlPath === '/citizen' || urlPath === '/explorer') {
            const cm = await caches.match('/comare.html');
            if (cm) return cm;
          }
          const fallback = (await caches.match('/index.html')) ||
                           (await caches.match('/landing.html')) ||
                           (await caches.match('/'));
          if (fallback) return fallback;
          return new Response('Offline - Application Shell Unavailable', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        })
    );
    return;
  }

  // Strategy 2: Image Frames (frames_loader/ & frames_v2/) -> Network-First (fetches latest video frames, caches for offline)
  if (isFrame) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return new Response('Frame Unavailable Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // Strategy 3: Scripts, Styles, Fonts, Other Images -> Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Background revalidation
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);

      if (cachedResponse) {
        return cachedResponse;
      }

      // If cache miss, wait for network response with resilient offline fallback
      return fetchPromise.then(async netRes => {
        if (netRes) return netRes;
        const retryCache = await caches.match(event.request);
        if (retryCache) return retryCache;
        return new Response('Offline Resource Unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});
