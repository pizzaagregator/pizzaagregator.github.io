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
        '/pizzas.json'
      ]).then(function() {  addImages(); return self.skipWaiting()});
    })
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil
  (      
      self.clients.claim()
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

function addImages()
{
    var urls = [];
    caches.match('/pizzas.json').then(function(responce)
        {           
            responce.json().then(function(json)
                {
                    for(var i = 0; i < json.length; i++)
                        {
                            urls.push(json[i].ImageUrl);
                        }
                });
        });        
    caches.open('pizzaagregator').then(function(cache) {
      return cache.addAll(urls).then(function() 
      {
           //self.clients.matchAll().then(all => all.map(client => client.postMessage("Application ready to work offline")));
           return self.skipWaiting()
      });
    })
        
}


