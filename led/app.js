console.log('test');
var http = require('http');
var firmata = require('firmata');

http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('Hello World\n');
	console.log('test');
}).listen(1337,'127.0.0.1');
console.log('server running at http://127.0.0.1:1337:/');

var path = '/dev/tty.usbmodemfa131';
var board = new firmata.Board(path,function(err){
	if(err){
		console.log(err);
		return;
	} else {
		console.log('connected');
		board.pinMode(13,board.MODES.OUTPUT);

		var ledOn = true;
		setInterval(function(){
			if(ledOn){
				board.digitalWrite(13, board.HIGH);
			} else {
				board.digitalWrite(13, board.LOW);
			}
			ledOn = !ledOn;
		},500);
	}
});

