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
        'http://brest.pizza-italiana.by/images/pizza/4myasa.jpg'
      ]).then(function() {
        return self.skipWaiting();
      });
    })
  );
});


self.addEventListener('activate', function(event) {
  //event.waitUntil(self.clients.claim());
  event.waitUntil();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200) {
              return response;
            }
            var responseToCache = response.clone();

            caches.open('pizzaagregator')
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
