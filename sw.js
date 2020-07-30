var CACHE_NAME = 'pwgen-cache-v1';
var urlsToCache = [
  './?v3',
  'icon.png',
  'index.html',
  'main.js',
  'manifest.json',
  'sw.js',
  'https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css',
  'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
];
console.log('loading sw');

self.addEventListener('install', function (event) {
  // Perform install steps
  console.log('installing sw');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Opened cache');
      var x = cache.addAll(urlsToCache);
      console.log('cache added');
      return x;
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// self.addEventListener('notificationclick', function (e) {
//   var notification = e.notification;
//   var primaryKey = notification.data.primaryKey;
//   var action = e.action;

//   if (action === 'close') {
//     notification.close();
//   } else {
//     clients.openWindow('http://www.example.com');
//     notification.close();
//   }
// });

// self.addEventListener('notificationclose', function (e) {
//   var notification = e.notification;
//   var primaryKey = notification.data.primaryKey;

//   console.log('Closed notification: ' + primaryKey);
// });

// self.addEventListener('push', function (e) {
//   var options = {
//     body: 'This notification was generated from a push!',
//     icon: 'icon.png',
//     vibrate: [100, 50, 100],
//     data: {
//       dateOfArrival: Date.now(),
//       primaryKey: '2',
//     },
//     actions: [
//       {
//         action: 'explore',
//         title: 'Explore this new world',
//         icon: 'icon.png',
//       },
//       { action: 'close', title: 'Close', icon: 'icon.png' },
//     ],
//   };
//   e.waitUntil(self.registration.showNotification('Hello world!', options));
// });
