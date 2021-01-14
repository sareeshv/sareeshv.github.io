var staticAssetsCacheName = 'todo-assets-v6';
var dynamicCacheName = 'todo-dynamic-v6';

self.addEventListener('install', function (event) {
    self.skipWaiting();
    event.waitUntil(
      caches.open(staticAssetsCacheName).then(function (cache) {
        cache.addAll([
            '/',
            "about.18154585d6713f2bdc5b.css","assets/logo-grey.png","chunks/about.7ac3402668185e253734.js","chunks/codehelp.f0b242d776860e29ccc1.js","chunks/contact.d41d8cd98f00b204e980.js","chunks/home.213318741d4042c93aa0.js","chunks/resume.67518a1367904c6084e4.js","home.5203231bb098ea5dc981.css","index.html","main.87ea3666b26d0bec9b31.css","main.aaa17d339d371efbda93.js","resume.0e4338761429b4eb16ac.css"
        ]
        );
      }).catch((error) => {
        console.log('Error caching static assets:', error);
      })
    );
  });

  self.addEventListener('activate', function (event) {
    if (self.clients && clients.claim) {
      clients.claim();
    }
    event.waitUntil(
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.filter(function (cacheName) {
            return (cacheName.startsWith('todo-')) && cacheName !== staticAssetsCacheName;
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
        ).catch((error) => {
            console.log('Some error occurred while removing existing cache:', error);
        });
      }).catch((error) => {
        console.log('Some error occurred while removing existing cache:', error);
    }));
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
          .then((fetchResponse) => {
              return cacheDynamicRequestData(dynamicCacheName, event.request.url, fetchResponse.clone());
          }).catch((error) => {
            console.log(error);
          });
      }).catch((error) => {
        console.log(error);
      })
    );
  });

  function cacheDynamicRequestData(dynamicCacheName, url, fetchResponse) {
    return caches.open(dynamicCacheName)
      .then((cache) => {
        cache.put(url, fetchResponse.clone());
        return fetchResponse;
      }).catch((error) => {
        console.log(error);
      });
  }
