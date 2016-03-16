importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('pizzaagregator').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/index.html?homescreen=1',
        '/?homescreen=1',
        '/styles/Site.css',
        '/styles/load-cube.css',
        '/styles/material.brown-blue.min.css',
        'https://fonts.googleapis.com/css?family=Abel',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        '/scripts/',
        '/pizzas.json'
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
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
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
