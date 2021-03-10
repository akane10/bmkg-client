let SUB_BTN = document.getElementById("sub");
const url = "http://localhost:8000/api/gempa/notif";

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

(async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");
      console.log("Service Worker Registered!", reg);

      const sub = await reg.pushManager.getSubscription();
      if (sub === null) {
        console.log("Not subscribed to push service!");
      } else {
        await sendSub(sub);
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
  try {
    const p256dh = sub.getKey("p256dh");
    const auth = sub.getKey("auth");
    const p256dhString = btoa(String.fromCharCode(...new Uint8Array(p256dh)));
    const authString = btoa(String.fromCharCode(...new Uint8Array(auth)));

    const data = {
      p256dh: p256dhString,
      auth: authString,
      endpoint: sub.endpoint,
    };

    const { res } = await axios.post(url, JSON.stringify(data));
    console.log("Data Sub: ", data);
  } catch (e) {
    console.log("err sendSub", e.message);
    throw new Error(e);
  }
}

async function subscribeUser() {
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      const { data } = await axios.get(url);
      const convertedVapidKey = urlBase64ToUint8Array(data.key);
      console.log(data.key);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      await sendSub(sub);
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
