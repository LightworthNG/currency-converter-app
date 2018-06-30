if ('serviceWorker' in navigator) {
	  
	  navigator.serviceWorker.register('./sw-converter.js', {scope : './'})
	  	.then(function(registration) {
	    console.log('[SW-converter] => registration successful:');
	  	})
	  	.catch(function(error) {
	    console.log('[SW-converter] registration failed:', error);
	  	});
	} else {
	  console.log('Service workers are not supported.');
	}



	window.onload = get_all_currencies ;

	selectFrom = document.querySelector('#from') ;
	selectTo = document.querySelector('#to') ;

	var url = 'https://free.currencyconverterapi.com/api/v5/currencies' ;

	//const button = document.querySelector('#convert_btn') ;
	//button.addEventListener('click', convert );

	// fetching conversionFactors
	function convert(){
		const amt = document.querySelector('#amt').value ;
		const from = selectFrom.value;
		const to = selectTo.value ;

		var query =  `${from}_${to}` ;

		 query_url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;

		fetch(query_url)
			.then(function(networkResponse){
				console.log('found networkResponse => conFactor') ;
				return networkResponse.json() ;
			}).then(function(data){
				console.log('data=> conFactor', Object.keys(data).sort()) ;
				var conFactor = data[query] ;
				var conResult = (amt * conFactor).toFixed(3) ;
				document.querySelector('#result').innerText = `RESULT : ${conResult}` ;

				//log conversion to DB
				let conData = {to : to, from : from , amt : amt , result : conResult } ;

				logConversionToDB(conData) ;

				})

			.catch(function(e){
				console.log('error fetching from network', e) ;
			}) ;
	}// convert

	function get_all_currencies(){
		
/*
		const VERSION = 'V1' ;
		const CACHE_NAME = `CONVERTER-${VERSION}`;

		// check in caches
		caches.open(CACHE_NAME)
			.then(function(cache){
				return caches.matchAll(e.request)
				.then(function(res){
					if (res) {
						console.log('[SW-converter] found a response in cache...')
						return res ;
					}
				})
			})
				.catch(function(e){
					// fetch from network
					console.log('[SW-converter] fetching Response from network => all_currencies ') ;
*/
					fetch(url)
					.then( networkResponse => {
						console.log('found networkResponse => all_currencies ') ;
						return networkResponse.json() 
						
						.then(function(data){
							//console.log('data => ', data ) ;
							//console.log('data.results => ', data.results ) ;
							for ( let unit of Object.keys(data.results)) {
								//console.log('unit = >', unit) ;

								// add currencies to DB
								addCurrencytoDB(unit) ;

								//populate from option
								let from = document.createElement('option') ;
								from.innerText = unit ;
								selectFrom.appendChild(from) ;

								//populate to option
								let to = document.createElement('option') ;
								to.innerText = unit ;
								selectTo.appendChild(to) ;

								//Activate button for conversion
								const button = document.querySelector('#convert_btn') ;
								button.addEventListener('click', convert );


							}
							
							
						})
					})

/*
					.catch(function(e){
						console.log('error fetching currencies from network => all_currencies', e) ;
					}) ;
				})
*/

	}