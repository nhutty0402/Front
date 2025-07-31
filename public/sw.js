const CACHE_NAME = "nha-tro-v1"
const urlsToCache = [
  "/",
  "/rooms",
  "/tenants",
  "/finance",
  "/requests",
  "/settings",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Bạn có thông báo mới",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Xem chi tiết",
        icon: "/icon-192.png",
      },
      {
        action: "close",
        title: "Đóng",
        icon: "/icon-192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("Quản lý Nhà trọ", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})
