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

// const notifBtn = document.getElementById('notifBtn');
const msgBtn = document.getElementById('msgBtn');
const perBtn = document.getElementById('perBtn');

// set Button
if (permissionStatus === 'default') {
  perBtn.disabled = false;
} else {
  perBtn.disabled = true;
}

perBtn.addEventListener('click', async () => {
  const permission = await Notification.requestPermission();

  if (Notification.permission === 'denied') {
    showMsg('Opss look likes you have block permission notification', true);
  }
});

function showMsg(str, isError = false) {
  if (isError) {
    msgBtn.classList.add('has-text-danger');
  } else {
    msgBtn.classList.add('has-text-info');
  }
  msgBtn.innerHTML = `${str}`;
}

// showMsg('this is massage');

// notifBtn.addEventListener('click', async (arg) => {
//   const { textContent } = arg.srcElement;

//   if (textContent === 'Enable Notification') {
//     const sub = await subscribeUser();
//     if (sub.succes) {
//       await getToken();
//       notifBtn.innerHTML = `<span id="text">Disable Notification</span>`;
//     } else {
//       showMsg('Opss unable to enable notification', true);
//     }
//   } else {
//     // unsubscribeUser
//     try {
//       const reg = await navigator.serviceWorker.ready;
//       const sub = await reg.pushManager.getSubscription();

//       if (sub === null) {
//         showMsg('Opss unable to disable notification', true);
//       } else {
//         await sub.unsubscribe();
//         notifBtn.innerHTML = `<span id="text">Enable Notification</span>`;
//       }
//     } catch (e) {
//       showMsg('Opss unable to disable notification', true);
//     }
//   }
// });

// async function subscribeUser() {
//   try {
//     console.log('subscribeUser invoked');
//     if ('serviceWorker' in navigator) {
//       const reg = await navigator.serviceWorker.ready;

//       const sub = await reg.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey:
//           'BHjTpZ46dh2MzTWuO_XQgzz-fX2HTpAUsKryznWcpVi8juqcilFRoHgeJYrZgCSaiNt-_2W0JzOKz7EIpHeWuYg',
//       });

//       console.log('Subscribed ', sub.endpoint);

//       return {
//         succes: true,
//         results: sub,
//         msg: '',
//         raw: '',
//         subscription: sub,
//       };
//     }
//   } catch (e) {
//     if (Notification.permission === 'denied') {
//       console.warn('Permission for notifications was denied');

//       return {
//         succes: false,
//         results: null,
//         msg: 'Permission for notifications was denied',
//         raw: e,
//         subscription: null,
//       };
//     } else {
//       console.error('Unable to subscribe to push', e);

//       return {
//         succes: false,
//         results: null,
//         msg: 'Unable to subscribe to push',
//         raw: e,
//         subscription: null,
//       };
//     }
//   }
// }

// async function getSubscription() {
//   try {
//     if ('serviceWorker' in navigator) {
//       const reg = await navigator.serviceWorker.register(
//         './firebase-messaging-sw.js'
//       );

//       const sub = await reg.pushManager.getSubscription();
//       if (sub === null) {
//         // notifBtn.innerHTML = `<span id="text">Enable Notification</span>`;
//         // Update UI to ask user to register for Push
//         console.log('Not subscribed to push service!');
//       } else {
//         // notifBtn.innerHTML = `<span id="text">Disable Notification</span>`;
//         // We have a subscription, update the database
//         console.log('Subscription object: ', sub);
//       }

//       console.log('Registration successful, scope is:', reg.scope);
//     }
//   } catch (e) {
//     console.log('Service worker registration failed, error:', e);
//   }
// }
// getSubscription();

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
