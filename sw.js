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

self.addEventListener('notificationclick', function (e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('http://www.example.com');
    notification.close();
  }
});

self.addEventListener('notificationclose', function (e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('push', function (event) {
  console.log('Received a push message', event);

  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/icon.png';
  var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag,
    })
  );
});
