import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// Меняй версию, если хочешь сбросить runtime-кеши у всех пользователей
const VERSION = "v1";
const CACHES = {
  api: `cafes-api-${VERSION}`,
  static: `cafes-static-${VERSION}`,
};

// INSTALL: Workbox кладёт в precache оболочку приложения (JS, CSS, HTML, иконки).
// skipWaiting() здесь НЕ вызываем: новая версия ждёт, пока пользователь нажмёт "Update".
self.addEventListener("install", () => {});
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches(); // удаляет старые precache-кеши предыдущих версий
clientsClaim();

// ACTIVATE: удаляем наши runtime-кеши старых версий
self.addEventListener("activate", (event) => {
  const keep = new Set(Object.values(CACHES));
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k.startsWith("cafes-") && !keep.has(k)).map((k) => caches.delete(k))
      )
    )
  );
});

// Кнопка "Update" в приложении присылает это сообщение
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

// Любая навигация отдаёт закешированный index.html (в том числе офлайн),
// а страницы /offline, /profile и т.д. рисует React Router
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), {
    denylist: [/^\/api\//],
  })
);

// Помечаем ответы, которые пришли из кеша, заголовком x-from-cache.
// Приложение по нему показывает "Showing cached data".
const markFromCache = {
  cachedResponseWillBeUsed: async ({ cachedResponse }) => {
    if (!cachedResponse) return cachedResponse;
    const headers = new Headers(cachedResponse.headers);
    headers.set("x-from-cache", "1");
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers,
    });
  },
};

// Стратегия 1, NETWORK-FIRST: публичный API (список и детали кафе).
// Сначала сеть (3 сек), при ошибке или таймауте отдаём кеш.
registerRoute(
  ({ url, request }) =>
    request.method === "GET" &&
    url.origin === self.location.origin &&
    url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: CACHES.api,
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 7 * 24 * 60 * 60 }),
      markFromCache,
    ],
  })
);

// Стратегия 2, CACHE-FIRST: статика (картинки, шрифты).
// Сначала кеш, в сеть идём только если там нет. Размер ограничен.
registerRoute(
  ({ request }) => request.destination === "image" || request.destination === "font",
  new CacheFirst({
    cacheName: CACHES.static,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// Запросы Firebase Auth (googleapis.com и т.д.) ни под один route не попадают,
// значит токены и данные пользователя в кеш не попадают.