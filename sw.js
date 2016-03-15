self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('pizzaagregator').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/pizzas.json',
       '/Content/scripts',
       '/Content/styles/site.css',
       '/Content/styles/load-cube.css',
       '/Content/styles/material.brown-blue.min.css',
       '/scripts/main.min.js'
     ]);
   })
 );
});