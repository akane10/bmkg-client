var CACHE_NAME = "pwgen-cache-v1";
var urlsToCache = [
  "./?v3",
  "icon.png",
  "index.html",
  "main.js",
  "manifest.json",
  "sw.js",
  "https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css",
  "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
];
console.log("loading sw");

self.addEventListener("install", function(event) {
  // Perform install steps
  console.log("installing sw");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      var x = cache.addAll(urlsToCache);
      console.log("cache added");
      return x;
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("push", function(e) {
  const { data } = e;

  const options = {
    title: 'Gempa!!!',
    body: data ? data.text() : "Gempa!!!",
    icon: "icon.png",
    image: "icon.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  e.waitUntil(self.registration.showNotification("Gempa!!!", options));
});
