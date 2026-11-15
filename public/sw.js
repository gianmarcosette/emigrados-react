// Deja el juego guardado en el celular para que abra sin conexión una vez instalado.
// Al compilar, vite.config.js completa la versión y la lista de archivos del juego.
const VERSION = '__VERSION__'
const CACHE = `emigrados-${VERSION}`
const ASSETS = [
  /* __ASSETS__ */
]
const SHELL = ['/', '/manifest.webmanifest', '/icon-192.png', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([...SHELL, ...ASSETS]))
      .then(() => self.skipWaiting()),
  )
})

// Una versión nueva del juego reemplaza a la guardada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  // Lo de otros sitios y las estadísticas de Vercel no se guardan
  if (url.origin !== self.location.origin || url.pathname.startsWith('/_vercel/')) return

  // Las pantallas: primero la red (para tener la última versión); sin conexión, la guardada
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put('/', copy))
          }
          return response
        })
        .catch(() => caches.match('/', { ignoreVary: true })),
    )
    return
  }

  // Los archivos del juego llevan su versión en el nombre: si están guardados, no cambian
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        }),
    ),
  )
})
