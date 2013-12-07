console.log('test');
var http = require('http');
var firmata = require('firmata');
var counter = 0;

http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('ARDUINO BUTTON\n');
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
		board.pinMode(7,board.MODES.INPUT);
		board.pinMode(6,board.MODES.INPUT);
		board.pinMode(5,board.MODES.INPUT);
		board.pinMode(4,board.MODES.INPUT);

		board.digitalRead(7,showValues7);
		board.digitalRead(6,showValues6);
		board.digitalRead(5,showValues5);
		board.digitalRead(4,showValues4);

	}
});


function showValues7(data){
	var doContinue;
	if(data==board.HIGH){
		counter++;
		console.log("MOVE LEFT "+data+" WITH COUNTER "+counter);
	}
	else if(data==board.LOW){
		console.log("DO NOTMOVE LEFT "+data+" WITH COUNTER "+counter);
	}
}


function showValues6(data){

	if(data==board.HIGH){
		console.log("MOVE UP "+data);
	}
	else if(data==board.LOW){
		console.log("DO NOTMOVE UP "+data+" WITH COUNTER "+counter);
	}
}

function showValues5(data){

	if(data==board.HIGH){
		console.log("MOVE RIGHT "+data);
	}
	else if(data==board.LOW){
		console.log("DO NOTMOVE RIGHT "+data+" WITH COUNTER "+counter);
	}
}

function showValues4(data){

	if(data==board.HIGH){
		console.log("MOVE DOWN "+data);
	}
	else if(data==board.LOW){
		console.log("DO NOTMOVE DOWN "+data+" WITH COUNTER "+counter);
	}
}
