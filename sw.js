const CACHE_NAME = 'zi-portal-v3'; // Ganti v3, v4 dst jika ada update besar
const ASSETS_TO_CACHE = [
  '/',                     // Halaman Root
  '/index.html',           // File HTML Utama
  '/manifest.json',        // File Manifest
  '/img/gedung-bps.jpg',   // Foto Gedung (Wajib Cache biar loading cepat)
  '/2025/icon.png',        // Icon Aplikasi (Pinjam dari folder 2025)
  '/2025/index.html'       // Pre-cache Dashboard 2025 biar transisi mulus
];

// 1. INSTALL: Simpan file penting ke dalam memori HP
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. ACTIVATE: Hapus cache versi lama agar memori tidak penuh
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. FETCH: Cek cache dulu, kalau tidak ada baru ambil dari internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, pakai itu. Jika tidak, request ke internet.
      return response || fetch(event.request);
    })
  );
});
