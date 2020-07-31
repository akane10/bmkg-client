const firebaseConfig = {
  apiKey: 'AIzaSyB87a__SwKxBMlbXg0ffHFQO5gr74D0KOc',
  authDomain: 'gempa-9a1be.firebaseapp.com',
  databaseURL: 'https://gempa-9a1be.firebaseio.com',
  projectId: 'gempa-9a1be',
  storageBucket: 'gempa-9a1be.appspot.com',
  messagingSenderId: '150875428113',
  appId: '1:150875428113:web:2528ac967d2c6a636668b0',
  measurementId: 'G-ZFFX66BJQ4',
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const permissionStatus = Notification.permission;

const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  'BHjTpZ46dh2MzTWuO_XQgzz-fX2HTpAUsKryznWcpVi8juqcilFRoHgeJYrZgCSaiNt-_2W0JzOKz7EIpHeWuYg'
);

const msgBtn = document.getElementById('msgBtn');

async function getToken() {
  try {
    const currentToken = await messaging.getToken();

    if (currentToken) {
      console.log('currentToken', currentToken);
      return currentToken;

      // sendTokenToServer(currentToken);
      // updateUIForPushEnabled(currentToken);
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        getToken();
      }
    }
  } catch (e) {
    console.error('An error occurred while retrieving token. ', err);
  }
}
