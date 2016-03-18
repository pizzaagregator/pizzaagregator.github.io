importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('pizzaagregator').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/index.html?homescreen=1',
        '/?homescreen=1',
        '/Content/styles/Site.css',
        '/Content/styles/load-cube.css',
        '/Content/styles/material.brown-blue.min.css',
        'https://fonts.googleapis.com/css?family=Abel',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        '/pizzas.json',
        changeImageUrl('http://www.nasha-pizza.by/components/com_jshopping/files/img_products/flor.jpg')
      ]).then(function() {
        return self.skipWaiting();
      });
    })
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(changeImageUrl(event.request.url));
      }
    )
  );
});


function changeImageUrl(url)
{
    var newUrl = url.replace(new RegExp("/",'g'),"-").replace(new RegExp("http:--",'g'),"/Images/");
    console.log(newUrl);
    return newUrl;
}
