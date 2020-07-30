if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('../firebase-messaging-sw.js')
    .then(function (registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function (err) {
      console.log('Service worker registration failed, error:', err);
    });
}

self.addEventListener('notificationclick', function (e) {
  var notification = e.notification;
  // var primaryKey = notification.data.primaryKey;
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
  // var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ');
});

self.addEventListener('push', function (event) {
  console.log('Received a push message', event);
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const { notification } = event.data.json();

  var title = notification.title || 'Yay a message.';
  var body = notification.body || 'We have received a push message.';
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
