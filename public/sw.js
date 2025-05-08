const CACHE_NAME = 'anvaya-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/favicon-96x96.png',
  '/icons/web-app-manifest-192x192.png',
  '/icons/web-app-manifest-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Periodic sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Push notification
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/icons/web-app-manifest-192x192.png',
    badge: '/icons/favicon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/favicon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/favicon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('The Anvaya Beach Resort', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Cache new responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// Function to handle background sync
async function syncData() {
  try {
    // Get any pending data from IndexedDB
    const pendingData = await getPendingData();
    
    // Process each pending item
    for (const item of pendingData) {
      try {
        // Attempt to sync the data
        await syncItem(item);
        // If successful, remove from pending
        await removePendingData(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
        // Keep the item in pending for next sync
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Function to handle periodic sync
async function updateContent() {
  try {
    // Fetch latest content
    const response = await fetch('/api/latest-content');
    const data = await response.json();
    
    // Update cache with new content
    const cache = await caches.open(CACHE_NAME);
    await cache.put('/api/latest-content', new Response(JSON.stringify(data)));
    
    // Show notification if there's new content
    if (data.hasNewContent) {
      await self.registration.showNotification('New Content Available', {
        body: 'Check out the latest updates from The Anvaya Beach Resort',
        icon: '/icons/web-app-manifest-192x192.png'
      });
    }
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

// Helper function to get pending data from IndexedDB
async function getPendingData() {
  // Implement your IndexedDB logic here
  return [];
}

// Helper function to sync a single item
async function syncItem(item) {
  // Implement your sync logic here
  return Promise.resolve();
}

// Helper function to remove synced data from pending
async function removePendingData(id) {
  // Implement your IndexedDB cleanup logic here
  return Promise.resolve();
} 