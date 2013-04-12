// static file server
var express = require('express');
var app = express();

var config = {
	port: '3000',
	dir: '/public'
}

app.configure(function(){
	app.use(express.static(__dirname + config.dir));
});

app.listen(config.port);

console.log('> static files in "' + config.dir + '" being served on port ' + config.port);
