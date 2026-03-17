const CACHE = "subscribers-v1";

// All assets to cache on install so the app works fully offline
const PRECACHE = [
  "/",
  "/manifest.json",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Remove old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never intercept non-GET or chrome-extension requests
  if (request.method !== "GET" || !request.url.startsWith("http")) return;

  // For CDN requests (SheetJS), network-first with cache fallback
  if (request.url.includes("cdn.sheetjs.com") || request.url.includes("fonts.googleapis.com") || request.url.includes("fonts.gstatic.com")) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            cache.put(request, response.clone());
            return response;
          })
          .catch(() => cache.match(request))
      )
    );
    return;
  }

  // For everything else (app shell): cache-first, fall back to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache successful same-origin responses
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
        }
        return response;
      });
    })
  );
});
