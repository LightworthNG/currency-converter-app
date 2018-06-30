

const URLs = [
	'https://free.currencyconverterapi.com/api/v5/currencies' ,
	
	'./',
	'./index.html',
	'./style.css',
	'./idb.js',
	'./currency-converter-app.js' ] ;

	
const VERSION = 'V1' ;
const CACHE_NAME = `CONVERTER-${VERSION}`;

self.addEventListener('install', function(e){
 	console.log('[SW-converter] installing ... ') ;

	 e.waitUntil(

	 	caches.open(CACHE_NAME)
		 	.then( cache => {

		 		return cache.addAll(URLs) ;

		 	}) 

	)

}) ;

self.addEventListener('activate', function(e){
	console.log('[SW-converter] activating...') ;

	 e.waitUntil(
	 	caches.keys().then(function(allCacheNames){
	 		return Promise.all(
	 			allCacheNames.map(function(thisCache){
	 				if (thisCache != CACHE_NAME) {
	 					console.log('[SW-converter] deleting cache...', thisCache) ;
	 					return caches.delete(thisCache) ;
	 				}
	 			})
	 		)
	 	})
	 );
});


self.addEventListener('fetch', function(e){
	
	
		e.respondWith(

			caches.open(CACHE_NAME)
			.then(function(cache){
				return cache.match(e.request).then(function(res){
					if (res) {
						console.log('[SW-converter] found a response in cache...', res)
						return res ;
					}

				console.log('[SW-converter] fetching from the network ...') ;
				//fetch from the network
				return fetch(e.request).then(function(response){
					console.log('found response  from network') ;

						//put req-res in cache
						caches.open(CACHE_NAME).then(function(cache){
							//console.log('[SW-converter] caching req-res', response.clone()) ;
							cache.put(e.request, response.clone()) ;
						})
						
				return response ;
				}
			).catch(function(e){
				//cant find from network, serve a custom offline page
				console.log('serving custom offline page') ;
				console.log(new Response('./offline.html', {headers : {'Content-Type': 'text/html'}})) ;
				return new Response('./offline.html', {headers : {'Content-Type': 'text/html'}}) ;
			})
					
				})
			})

		)
	
});