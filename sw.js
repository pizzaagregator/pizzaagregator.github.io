importScripts('/cache-polyfill.js');

self.addEventListener('install', (e) => 
{
  e.waitUntil(
            caches.open('pizzaagregator').then((cache) => 
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

            getUrls()
            .then((data) =>
            {
                caches.open('images')
                .then((cache) => 
                    {
                        return cache.addAll(data);    
                    })
                .then(() =>
                {
                    self.clients.matchAll()
                    .then(all => all.map(client => client.postMessage("Application ready to work offline")));
                });    
            })
});

function getUrls()
{            
    return fetch('/pizzas.json')
    .then((responce) =>
    {
        return  responce.json()
    })
    .then((json) =>
    {
        return json.map((data) => 
        {
            return data.ImageUrl
        })
    });
}


self.addEventListener('activate', (event) => 
{ 
  console.log("activate event");
  event.waitUntil
  (
    self.clients.claim()  
  );
});

self.addEventListener('fetch', (event) => 
{
    event.respondWith(helper(event.request));
});

function helper(request)
{
    if(request.url.indexOf('/pizzas.json') + 1)
    {
        return UpdatePizzas()
    }
    else
    {
        return standartFetchFunction(request)
    }
}

function standartFetchFunction(request)
{
    return  caches.match(request)
            .then((response) =>
            {
                if (response) 
                {
                    return response;
                }
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                .then((response) =>
                {
                    if(!response || response.status !== 200) 
                    {
                        return response;
                    }
                    var responseToCache = response.clone();

                    caches.open('pizzaagregator')
                    .then((cache) => 
                    {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                }
                );
            })
}


function UpdatePizzas()
{
    let oldresponce;
    let newresponce;
    return  caches.match('/pizzas.json')
            .then((resp) =>
            {
                oldresponce = resp.clone();
                return fetch('/pizzas.json')
                .then((response) =>
                {
                    newresponce = response.clone();
                    if(response.status === 200 && newresponce.headers.get('Last-Modified') != oldresponce.headers.get('Last-Modified'))
                    {
                        var responseToCache = response.clone();
                        return UpdateCache(responseToCache);
                    }
                    else
                    {
                        return standartFetchFunction('/pizzas.json');
                    }
                })
            })
}

function UpdateCache(responseToCache)
{
    let oldPizzas = [];
    let newPizzas = [];
    var temp = responseToCache.clone();
    return  temp.json()
            .then((json) =>
            {
                newPizzas = json.map((data) => 
                            {
                                return data.ImageUrl
                            });
                return caches.match('/pizzas.json')
            })
            .then((response) =>
            {
                return  response.json()
                        .then((json) =>
                        {
                            oldPizzas = json.map((data) => 
                            {
                                return data.ImageUrl
                            });
                        return  caches.open('pizzaagregator')
                        })
            })
            .then((cache) =>
            {
                return  cache.delete('/pizzas.json')
                        .then((result) =>
                        {
                            if(result === true)
                            {
                                return cache.put('/pizzas.json', responseToCache.clone());
                            } 
                        });
            })          
            .then(() =>
            {
                return UpdateImagesCache(oldPizzas,newPizzas)
            })
            .then(() =>
            {
                self.clients.matchAll()
                .then(all => all.map(client => {client.postMessage("Application was updated")} ));
                return responseToCache;
            })     
}


function UpdateImagesCache(oldPizzas,newPizzas)
{
    let pizzasToDelete = GetImagesToDelete(oldPizzas,newPizzas);
    let pizzasToAdd = GetImagesToAdd(oldPizzas,newPizzas);
    return  caches.open('images')
            .then((cache) =>
            {
                let deletePromises = pizzasToDelete.map((image) =>
                                     {
                                        return cache.delete(image)
                                     });
                return Promise.all(deletePromises)
                       .then(() =>
                       {
                        return cache.addAll(pizzasToAdd)
                       })               
            })
}



function GetImagesToDelete(oldPizzas, newPizzas)
{
    let pizzasToDelete = oldPizzas.filter((item) =>
    {
        return !(newPizzas.indexOf(item) >= 0);
    });
    return pizzasToDelete;
}

function GetImagesToAdd(oldPizzas,newPizzas)
{
     let pizzasToAdd = newPizzas.filter((item) =>
    {
        return !(oldPizzas.indexOf(item) >= 0);
    });
    return pizzasToAdd;
}
