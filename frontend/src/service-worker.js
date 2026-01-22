self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

const CACHE = "lava-static-v1";
const ASSETS = ["/", "/index.html"];

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const res = await fetch(event.request);
        if (res.status === 200) cache.put(event.request, res.clone());
        return res;
      } catch {
        return cached || Response.error();
      }
    })
  );
});
