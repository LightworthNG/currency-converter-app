//ref: http://www.onlywebpro.com/2012/12/23/html5-storage-indexeddb/
const allCurrency = [
	{ currency : 'PHP'} ,
	{ currency : 'USD'}
	
];

if (!window.indexedDB) {
	alert('Your Browser doesnt support indexedDB') ;
}

const DB_NAME = "ALC7" ;
const DB_VERSION = 3 ;
var db  ;

//open a database => request
var request = window.indexedDB.open(DB_NAME, DB_VERSION) ;

request.onupgradeneeded = function(e){
	db = this.result ; // OR request.result
	currencyStore = db.createObjectStore('currencies', {keyPath: 'currency' }) ;
	//index = objectStore.createIndex('name' , 'name' , {unique : false }) ;

	lookUpStore = db.createObjectStore('lookUpTable', {keyPath: 'from' }) ;
};

request.onerror = function(e){
	console.log('Ooops! Request to indexedDB Failed') ;
};

request.onsuccess = function(e){
	db = this.result ;
	tx = db.transaction(['currencies', 'lookUpTable'], 'readwrite') ;
	store = tx.objectStore('currencies') ;
 	
};

function addCurrencytoDB(unit_data){
		//data = unit
		//console.log('Adding... ', unit_data , 'to the database', db) ;
		db.transaction(['currencies'], 'readwrite')
			.objectStore('currencies')
				.add({currency : unit_data}) ;
	
}
// data = {to : , from : , amt : , result : }
function logConversionToDB(data){
		//data = unit
		//console.log('LoggingUp.. ', data , 'in the database', db) ;
		db.transaction(['lookUpTable'], 'readwrite')
			.objectStore('lookUpTable')
				.add(data) ;
	
}
function listAllCurrency(){
	
	var objectStore = db.transaction(['currencies'])
		.objectStore('currencies') ;
	objectStore.openCursor().onsuccess = function(e){
		var cursor = e.target.result ;
		var br = "<br />" ;
		var output = "" ;
		if(cursor){
			//output = `id => ${cursor.key} ; name => ${cursor.value.currency}`  ;
			text = document.createTextNode(cursor.value.currency) ;
			option = document.createElement('option') ;
			 output  = option.appendChild(text) ;
			//output += option ;
			//console.log(option) ;
			cursor.continue() ;
		}

		//console.log(option) ;
		
		document.querySelector('#from').appendChild(option)  ;
		document.querySelector('#to').appendChild(option)  ;
		//var select0 = document.querySelector('#from').appendChild(option)  ;
		//var select1 = document.querySelector('#to').appendChild(option)  ;
		
		
		
	}

	var select = document.getElementsByClassName('all_currencies')

	for (var ii of select) {
		console.log(ii) ;
		ii.appendChild(option)
	}
}


