const STATIC_CACHE = "lava-static-v3";

self.addEventListener("install", (event) => {
  // Activate updated SW ASAP.
  self.skipWaiting();

  const precache = async () => {
    const cache = await caches.open(STATIC_CACHE);
    // Keep this list small; hashed assets under `/assets/` are cached on-demand.
    await cache.addAll(["/", "/index.html", "/manifest.webmanifest", "/favicon.ico", "/logo.PNG"]);
  };

  event.waitUntil(precache().catch(() => {}));
});

self.addEventListener("activate", (event) => {
  const cleanup = async () => {
    const keep = new Set([STATIC_CACHE]);
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith("lava-") && !keep.has(k))
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  };

  event.waitUntil(cleanup().catch(() => {}));
});

function isCacheableStaticRequest(requestUrl, request) {
  if (request.method !== "GET") return false;
  if (requestUrl.origin !== self.location.origin) return false;

  // Never cache dynamic APIs / user-specific content.
  if (
    requestUrl.pathname.startsWith("/api/") ||
    requestUrl.pathname.startsWith("/admin/") ||
    requestUrl.pathname.startsWith("/ws/") ||
    requestUrl.pathname.startsWith("/media/") ||
    requestUrl.pathname.startsWith("/static/")
  ) {
    return false;
  }

  // Only cache Vite build assets + navigations.
  if (request.mode === "navigate") return true;
  if (requestUrl.pathname.startsWith("/assets/")) return true;

  return false;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (!isCacheableStaticRequest(url, request)) return;

  const respond = async () => {
    const cache = await caches.open(STATIC_CACHE);

    // Network-first for HTML to avoid serving a stale `index.html` after deploy.
    if (request.mode === "navigate") {
      try {
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      } catch {
        const cached = await cache.match(request);
        return cached || Response.error();
      }
    }

    // Cache-first for hashed build assets.
    const cached = await cache.match(request);
    if (cached) return cached;

    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  };

  event.respondWith(respond());
});
