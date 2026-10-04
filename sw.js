// Retire the old cache-first worker so returning visitors receive the redesign.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('tgdoc-')).map(name => caches.delete(name)));
    await self.registration.unregister();
    await self.clients.claim();
  })());
});
