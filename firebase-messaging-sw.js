self.addEventListener('notificationclick', function (e) {
  const notification = e.notification;
  // const primaryKey = notification.data.primaryKey;
  const action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('https://gempa.yapie.me');
    notification.close();
  }
});

self.addEventListener('notificationclose', function (e) {
  const notification = e.notification;
  // const primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ');
});

self.addEventListener('push', function (event) {
  console.log('Received a push message', event);
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const { notification } = event.data.json();

  const title = notification.title || 'Yay a message.';
  const body = notification.body || 'We have received a push message.';
  const icon = '/icon.png';
  const tag = 'simple-push-demo-notification-tag';

  if (Notification.permission === 'granted') {
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: tag,
      })
    );
  }
});
