let SUB_BTN = document.getElementById("sub");

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const vapidPublicKey =
  "BHkmEVA9XT1gsi-bryQoOrVU1Zi9yzvOw7pX7nXwUUNbZ7WjjFHG1BR0otCvsF1_6V5SoTixFmUwAPwwFG1BqK4";
const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

(async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");
      console.log("Service Worker Registered!", reg);

      const sub = await reg.pushManager.getSubscription();
      if (sub === null) {
        console.log("Not subscribed to push service!");
      } else {
        await sendSub();
        SUB_BTN.innerHTML = "Unsubscribe";
      }
    } catch (err) {
      console.error("Opppsss", err);
    }
  }
})();

SUB_BTN.addEventListener("click", (e) => {
  if (e.target.textContent == "Subscribe") {
    subscribeUser();
  } else {
    unsubscribeUser();
  }
});

async function sendSub(sub) {
  const p256dh = sub.getKey("p256dh");
  const auth = sub.getKey("auth");
  const p256dhString = btoa(String.fromCharCode(...new Uint8Array(p256dh)));
  const authString = btoa(String.fromCharCode(...new Uint8Array(auth)));

  const data = {
    p256dh: p256dhString,
    auth: authString,
    endpoint: sub.endpoint,
  };

  // TODO: send to API
  console.log("Data Sub: ", data);
}

async function subscribeUser() {
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      await sendSub();
      SUB_BTN.innerHTML = "Unsubscribed";
    }
  } catch (e) {
    if (Notification.permission === "denied") {
      console.warn(
        "Unable to subscribe. Please change permission for notification"
      );
    } else {
      console.error("Unable to subscribe to push", e);
    }
  }
}

async function unsubscribeUser() {
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;

      // TODO: Delete database
      sub.unsubscribe();
      SUB_BTN.innerHTML = "Subscribe";
    }
  } catch (e) {
    console.error("Unable to unsubscribe to push", e);
  }
}
