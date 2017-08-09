var VERSION = '1.0.16';

this.addEventListener('install', function (e) {
    e.waitUntil(caches.open(VERSION).then(cache => {
        return cache.addAll([
            '/',
            '/index.html',
            '/sw.js',
            '/css/bootstrap.css',
            '/css/bootstrap.min.css',
            '/css/simple-sidebar.css',
            '/js/bootstrap.js',
            '/js/bootstrap.min.js',
            '/js/jquery.js',
            '/fonts/glyphicons-halflings-regular.eot',
            '/fonts/glyphicons-halflings-regular.svg',
            '/fonts/glyphicons-halflings-regular.ttf',
            '/fonts/glyphicons-halflings-regular.woff',
            '/fonts/glyphicons-halflings-regular.woff2',
        ]);
    }))
});


this.addEventListener('fetch', function (e) {
    console.log(e.request.url);
    if (e.request.url.indexOf('lorempixel') === -1) {
        var tryInCachesFirst = caches.open(VERSION).then(cache => {
            return cache.match(e.request).then(response => {
                if (!response) {
                    return handleNoCacheMatch(e);
                }
                // Update cache record in the background
                fetchFromNetworkAndCache(e);
                // Reply with stale data
                return response
            });
        });
        e.respondWith(tryInCachesFirst);
    }
});

this.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(keys => {
        return Promise.all(keys.map(key => {
            if (key !== VERSION)
                return caches.delete(key);
        }));
    }));
});

function fetchFromNetworkAndCache(e) {
    return fetch(e.request).then(res => {
        // foreign requests may be res.type === 'opaque' and missing a url
        if (!res.url) return res;
        // regardless, we don't want to cache other origin's assets
        if (new URL(res.url).origin !== location.origin) return res;

        return caches.open(VERSION).then(cache => {
            // TODO: figure out if the content is new and therefore the page needs a reload.
            cache.put(e.request, res.clone());
            return res;
        });
    }).catch(err => console.error(e.request.url, err));
}

function handleNoCacheMatch(e) {
    return fetchFromNetworkAndCache(e);
}