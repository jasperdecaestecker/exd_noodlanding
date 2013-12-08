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

var httpApp = express();
httpApp.configure(function() 
{
    httpApp.use(express.static(__dirname + '/static/'));

    // Provide easyRTC API files
    httpApp.get("/easyrtc/easyrtc.js",      function(req, res) {res.sendfile('api/easyrtc.js',      {root:__dirname});});
    httpApp.get("/easyrtc/easyrtc.css",     function(req, res) {res.sendfile('api/easyrtc.css',     {root:__dirname});});
    httpApp.get("/easyrtc/img/powered_by_easyrtc.png",  function(req, res) {res.sendfile('api/img/powered_by_easyrtc.png',{root:__dirname});});
});

//bewegen
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
    console.log("MOVE LEFT "+data);
  }
}


function showValues6(data){

  if(data==board.HIGH){
    console.log("MOVE UP "+data);
  }
}

function showValues5(data){

  if(data==board.HIGH){
    console.log("MOVE DOWN "+data);
  }
}

function showValues4(data){

  if(data==board.HIGH){
    console.log("MOVE RIGHT "+data);
  }
}
//sluit bewegen

//server 
var server = http.createServer(httpApp).listen(easyrtcCfg.httpPort);

// Start socket server
var io = sio.listen(server, {
        /*'logger': {
            debug: function(message){ logSocketIo.debug(message, { label: 'socket.io'}); },
            info:  function(message){ logSocketIo.info( message, { label: 'socket.io'}); },
            warn:  function(message){ logSocketIo.warn( message, { label: 'socket.io'}); },
            error: function(message){ logSocketIo.error(message, { label: 'socket.io'}); }
        },*/
        'browser client minification': easyrtcCfg.socketIoClientMinifyEnabled,
        'browser client etag': easyrtcCfg.socketIoClientEtagEnabled,
        'browser client gzip': easyrtcCfg.socketIoClientGzipEnabled   // true is faster but causes crashes on some windows boxes
});
//logServer.info('Socket Server started', { label: 'easyrtcServer'});


// Start experimental STUN server (if enabled)
/*if (easyrtcCfg.experimentalStunServerEnable) {
    g.experimentalStunServer();
}*/


// Shared variable to hold server and socket information.
easyrtc = {
    serverStartTime: Date.now(),
    connections: {}
};


// Upon a socket connection, a socket is created for the life of the connection
io.sockets.on('connection', function (socket) 
{
    // Eigen Code
    console.log("nieuwe client");

    socket.on('send', function(msg)
    {

        console.log(msg);
    });

   // logServer.debug('easyRTC: Socket [' + socket.id + '] connected with application: [' + easyrtcCfg.defaultApplicationName + ']', { label: 'easyrtc', easyrtcid:connectionEasyRtcId, applicationName:easyrtcCfg.defaultApplicationName});
    var connectionEasyRtcId = socket.id;
    c.onSocketConnection(io, socket, connectionEasyRtcId);

    // Incoming messages: Custom message. Allows applications to send socket messages to other connected users.
    socket.on('message', function(msg) 
    {
        console.log("[message]");
        console.log(msg);
        //msg ="trol";
       // logServer.debug('easyRTC: Socket [' + socket.id + '] message received', { label: 'easyrtc', easyrtcid:connectionEasyRtcId, applicationName: easyrtc.connections[connectionEasyRtcId].applicationName, data:msg});
        c.onSocketMessage(io, socket, connectionEasyRtcId, msg);
    });

    // Incoming easyRTC commands: Used to forward webRTC negotiation details and manage server settings.
    var easyrtccmdHandler = function(msg) {
        //logServer.debug('easyRTC: Socket [' + socket.id + '] command received', { label: 'easyrtc', easyrtcid:connectionEasyRtcId, data:msg});
        c.onEasyRtcCmd(io, socket, connectionEasyRtcId, msg);
    };
    socket.on('easyrtcCmd', easyrtccmdHandler);
    socket.on('easyRTCcmd', easyrtccmdHandler);
    
    // Upon a socket disconnecting (either directed or via time-out)
    socket.on('disconnect', function(data) {
        //logServer.debug('easyRTC: Socket [' + socket.id + '] disconnected', { label: 'easyrtc', easyrtcid:connectionEasyRtcId});
        c.onSocketDisconnect(io, socket, connectionEasyRtcId);
    });
});


