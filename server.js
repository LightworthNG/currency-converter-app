var http = require('http') ;
var port = 8080 ;

http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'}) ;
	res.end('Hello') ;
}).listen(port) ; 
console.log('Server is running on port 3000') ;