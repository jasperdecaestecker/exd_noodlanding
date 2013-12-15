easyrtcCfg  = require('./config');          // All server configuration (global)
var g       = require('./lib/general');     // General helper functions
var c       = require('./lib/connection');  // easyRTC connection functions

// Module dependencies
var fs      = require('fs');                // file system core module
var http    = require('http');              // http server core module
var express = require('express');           // web framework external module
var sio     = require('socket.io');         // web socket external module
var winston = require('winston');           // logging module
var firmata = require('firmata');           // firmata

var directionJoystick = [];

var httpApp = express();
httpApp.configure(function() 
{
    httpApp.use(express.static(__dirname + '/static/'));

    // Provide easyRTC API files
    httpApp.get("/easyrtc/easyrtc.js",      function(req, res) {res.sendfile('api/easyrtc.js',      {root:__dirname});});
    httpApp.get("/easyrtc/easyrtc.css",     function(req, res) {res.sendfile('api/easyrtc.css',     {root:__dirname});});
    httpApp.get("/easyrtc/img/powered_by_easyrtc.png",  function(req, res) {res.sendfile('api/img/powered_by_easyrtc.png',{root:__dirname});});
});

var path = '/dev/tty.usbmodemfa131';
var board = new firmata.Board(path,function(err)
{
  if(err)
  {
    console.log(err);
    return;
  } 
  else 
  {
    console.log('Arduino connected');
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

// NORMAL MOVEMENT
function showValues7(data)
{
  directionJoystick["left"] = (data == 1) ? true : false;
  move();
}

function showValues6(data)
{
  directionJoystick["up"] = (data == 1) ? true : false;
}

function showValues5(data){
  directionJoystick["down"] = (data == 1) ? true : false;

}

function showValues4(data){
  directionJoystick["right"] = (data == 1) ? true : false;
}

function move()
{
  var msgData = {msgType:"joystickAangesproken", left:directionJoystick.left, up:directionJoystick.up,right:directionJoystick.right,down:directionJoystick.down}

  for (var key in easyrtc.connections) 
  {
    msg = {senderId: easyrtc.connections[key].easyrtcid,
          targetId: easyrtc.connections[key].easyrtcid,
          msgData: msgData};

        c.onSocketMessage(io, easyrtc.connections[key], easyrtc.connections[key].easyrtcid, msg);
  };
} 



//server 
var server = http.createServer(httpApp).listen(easyrtcCfg.httpPort);

// Start socket server
var io = sio.listen(server, 
{
        'browser client minification': easyrtcCfg.socketIoClientMinifyEnabled,
        'browser client etag': easyrtcCfg.socketIoClientEtagEnabled,
        'browser client gzip': easyrtcCfg.socketIoClientGzipEnabled   // true is faster but causes crashes on some windows boxes
});

// Shared variable to hold server and socket information.
easyrtc = {
    serverStartTime: Date.now(),
    connections: {}
};

// Upon a socket connection, a socket is created for the life of the connection
io.sockets.on('connection', function (socket) 
{
    console.log("nieuwe client: " + socket.id);

    var connectionEasyRtcId = socket.id;
    c.onSocketConnection(io, socket, connectionEasyRtcId);

    // Incoming messages: Custom message. Allows applications to send socket messages to other connected users.
    socket.on('message', function(msg) 
    {
        //console.log("[message]");
        //console.log(msg);
        /*if(msg.msgType == "setToestelId")
        {
            if(msg.msgData.typeToestel == "RuimteSchip")
            {
                dataRuimteSchip = {io: io, socket: socket, id: msg.msgData.id};
               //idRuimteSchip = msg.msgData.id;
            }
            else
            {
              dataRuimteStation = {io: io, socket: socket, id: msg.msgData.id};
            }
            //console.log(dataRuimteSchip);
        }
        if(msg.msgType == "stuurCoordinaten")
        {

        }*/
        c.onSocketMessage(io, socket, connectionEasyRtcId, msg); 
    });

    // Incoming easyRTC commands: Used to forward webRTC negotiation details and manage server settings.
    var easyrtccmdHandler = function(msg) 
    {
        c.onEasyRtcCmd(io, socket, connectionEasyRtcId, msg);
    };
    socket.on('easyrtcCmd', easyrtccmdHandler);
    socket.on('easyRTCcmd', easyrtccmdHandler);
    
    // Upon a socket disconnecting (either directed or via time-out)
    socket.on('disconnect', function(data) 
    {
        c.onSocketDisconnect(io, socket, connectionEasyRtcId);
    });
});




