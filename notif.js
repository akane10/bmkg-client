let SUB_BTN = document.getElementById("sub");
let MODAL = document.getElementsByClassName("modal")[0];
let MODAL_TITLE = document.getElementById("modal_title");
let MODAL_MSG = document.getElementById("modal_msg");
let MODAL_DELETE_BTN = document.getElementById("modal_delete_btn");
// const url = "http://localhost:8000/api/gempa";
const url = "https://gempa.yapie.me/api/gempa";

MODAL_DELETE_BTN.addEventListener("click", closeModal);

function showModal(suc, msg) {
  closeModal();
  if (suc) {
    MODAL_TITLE.classList.add("has-text-success");
    MODAL_TITLE.innerHTML = "SUCCESS";
    MODAL_MSG.innerText = msg;
  } else {
    MODAL_TITLE.classList.add("has-text-danger");
    MODAL_TITLE.innerHTML = "ERROR";
    MODAL_MSG.innerText = msg;
  }
  MODAL.classList.add("is-active");
}

function closeModal() {
  MODAL.classList.remove("is-active");
  MODAL_TITLE.classList.remove("has-text-danger");
  MODAL_TITLE.innerHTML = "";
  MODAL_MSG.innerHTML = "";
}

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

    const { res } = await axios.post(`${url}/notif`, JSON.stringify(data));
    // console.log("Data Sub: ", data);
  } catch (e) {
    console.log("err sendSub", e.message);
    throw new Error(e);
  }
}

async function subscribeUser() {
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      const { data } = await axios.get(`${url}/pub_key`);
      const convertedVapidKey = urlBase64ToUint8Array(data.key);
      // console.log(data.key);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      await sendSub(sub);
      SUB_BTN.innerHTML = "Unsubscribed";
      showModal(true, "you have been subscribed");
    }
  } catch (e) {
    if (Notification.permission === "denied") {
      showModal(
        false,
        "Unable to subscribe. Please change notification permission"
      );
      console.warn(
        "Unable to subscribe. Please change notification permission"
      );
    } else {
      console.error("Unable to subscribe to push", e);
      showModal(false, "Unable to subscribe to push.\n" + (e.response || e));
    }
  }
}

async function unsubscribeUser() {
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;

      const sub = await reg.pushManager.getSubscription();
      const auth = sub.getKey("auth");
      const authString = btoa(String.fromCharCode(...new Uint8Array(auth)));
      sub.unsubscribe();
      await axios({
        method: "DELETE",
        url: `${url}/notif/${authString}`,
      }).catch((e) => {
        console.log("err when send to api", e.response || e);
        // showModal(false, "error when sending to api.\n" + (e.response || e));
      });
      SUB_BTN.innerHTML = "Subscribe";
      showModal(true, "Success to unsubscribe");
    }
  } catch (e) {
    console.error("Unable to unsubscribe to push", e);
    showModal(false, "Unable to unsubscribe.\n" + (e.response || e));
  }
}
