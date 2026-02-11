
// sw.js - Service Worker for Latest Khabar

const CACHE_NAME = 'latest-khabar-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/firebase-config.js',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@700&family=Mukta:wght@400;600&display=swap',
  'https://fonts.gstatic.com/s/notoserifdevanagari/v23/AlZS_y11-tY2e0I3I8gI2AAmgd7g1rvo1M0.woff2'
];

// 1. Installation: Cache the core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache opened
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        // Cache open failed
      })
  );
});

// 2. Fetch: Implement Stale-While-Revalidate strategy
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        // Fetch from network in the background to update the cache.
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If we get a valid response, update the cache.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
            // Network fetch failed, which is expected when offline.
            // console.warn('Network request failed, serving from cache if available.', err);
        });

        // Return the cached response immediately if it exists,
        // otherwise, wait for the network response.
        return response || fetchPromise;
      });
    })
  );
});

// 3. Activation: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
