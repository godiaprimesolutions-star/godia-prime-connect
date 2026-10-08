const CACHE_NAME = "godia-prime-connect-v4";
const APP_SHELL = "./index.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((response) => {
          if (!response || !response.ok) return response;

          const copy = response.clone();

          if (new URL(event.request.url).origin === self.location.origin) {
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy))
              .catch(() => {});
          }

          return response;
        })
        .catch(() => caches.match(APP_SHELL));
    })
  );
});
