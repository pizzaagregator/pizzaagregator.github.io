importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) 
{
  e.waitUntil(
            caches.open('pizzaagregator').then(function(cache) 
            {
                return cache.addAll
                ([
                    '/',
                    '/index.html',
                    '/index.html?homescreen=1',
                    '/?homescreen=1',
                    '/Content/styles/Site.css',
                    '/Content/styles/load-cube.css',
                    '/Content/styles/material.brown-blue.min.css',
                    '/Content/scripts/material.min.js',
                    '/Content/scripts/jquery-2.1.4.min.js',
                    '/Content/scripts/jquery.tmpl.min.js',
                    '/Content/scripts/jquery.twbsPagination.min.js',
                    '/Content/scripts/index.js',
                    'https://fonts.googleapis.com/css?family=Abel',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://fonts.gstatic.com/s/abel/v6/brdGGFwqYJxjg2CD1E9o7g.woff2',
                    '/pizzas.json'
                ])
            }));

            getUrls().then(function(data)
            {
                caches.open('pizzaagregator')
                .then(function(cache) 
                    {
                        return cache.addAll(data);    
                    })
                    .then(function(){self.clients.matchAll().then(all => all.map(client => client.postMessage("Application ready to work offline")));});    
                    })

});


self.addEventListener('activate', function(event) { 
  console.log("activate event");
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


function getUrls()
{            
    return fetch('/pizzas.json').then(function(responce)
    {
        return  responce.json()
    }).then(function(json)
    {
        return json.map(function(data) 
        {
            return data.ImageUrl
        })
    });
}