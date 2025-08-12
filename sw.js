// Tiny cache-first service worker for GitHub Pages
const CACHE = 'tgdoc-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/logo1024.png',
  '/favicon.png'
];
self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});
self.addEventListener('fetch', evt => {
  const req = evt.request;
  if (req.method !== 'GET') return;
  evt.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(req, copy));
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
