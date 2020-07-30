// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyB87a__SwKxBMlbXg0ffHFQO5gr74D0KOc',
  authDomain: 'gempa-9a1be.firebaseapp.com',
  databaseURL: 'https://gempa-9a1be.firebaseio.com',
  projectId: 'gempa-9a1be',
  storageBucket: 'gempa-9a1be.appspot.com',
  messagingSenderId: '150875428113',
  appId: '1:150875428113:web:2528ac967d2c6a636668b0',
  measurementId: 'G-ZFFX66BJQ4',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
// Add the public key generated from the console here.
messaging.usePublicVapidKey(
  'BHjTpZ46dh2MzTWuO_XQgzz-fX2HTpAUsKryznWcpVi8juqcilFRoHgeJYrZgCSaiNt-_2W0JzOKz7EIpHeWuYg'
);

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging
  .getToken()
  .then((currentToken) => {
    if (currentToken) {
      console.log('currentToken', currentToken);
      // sendTokenToServer(currentToken);
      // updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log(
        'No Instance ID token available. Request permission to generate one.'
      );
      // Show permission UI.
      // updateUIForPushPermissionRequired();
      // setTokenSentToServer(false);
    }
  })
  .catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // showToken('Error retrieving Instance ID token. ', err);
    // setTokenSentToServer(false);
  });

const notifBtn = document.getElementById('notifBtn');

notifBtn.addEventListener('click', displayNotification);

function displayNotification() {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function (reg) {
      var options = {
        body: 'Here is a notification body!',
        icon: 'icon.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      };
      reg.showNotification('Hello world!', options);
    });
  }
}
