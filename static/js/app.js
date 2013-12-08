$( document ).ready(function() 
{
	init();
  $('#startInstellingen form').submit(startInstellingenGekozen);
});

//server - moet misschien nog naar server.js verplaatst worden, maar eerst hier testen.
var http = require('http');
var firmata = require('firmata');


http.createServer(function(req,res){
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end('ARDUINO BUTTON\n');
  console.log('test');
}).listen(1337,'127.0.0.1');
console.log('server running at http://127.0.0.1:1337:/');


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
  else if(data==board.LOW){
    //console.log("DO NOTMOVE LEFT "+data+" WITH COUNTER "+counter);
  }
}


function showValues6(data){

  if(data==board.HIGH){
    console.log("MOVE UP "+data);
  }
  else if(data==board.LOW){
    //console.log("DO NOTMOVE UP "+data+" WITH COUNTER "+counter);
  }
}

function showValues5(data){

  if(data==board.HIGH){
    console.log("MOVE DOWN "+data);
  }
  else if(data==board.LOW){
    //console.log("DO NOTMOVE RIGHT "+data+" WITH COUNTER "+counter);
  }
}

function showValues4(data){

  if(data==board.HIGH){
    console.log("MOVE RIGHT "+data);
  }
  else if(data==board.LOW){
    //console.log("DO NOTMOVE DOWN "+data+" WITH COUNTER "+counter);
  }
}


var selfid, 
    otherid, 
    toestel, 
    stage, 
    width, 
    height, 
    ticker, 
    keys, 
    spaceShip,
    boxes, 
    landingZone;

    //velx en vely ++ en -- gebruiken om te bewegen

function startInstellingenGekozen(e)
{  
  e.preventDefault();
  toestel = $('input[name=radio_toestel]:checked', '#startInstellingen form').val();
  $('#toestel h1').html(toestel);

  boxes = [];
  buildBounds();

  setToestel();

  $('#startInstellingen').hide();

  easyRTC.setLoggedInListener(loggedInListener);
  easyRTC.initManaged("voip exd_landing", "eigenWebcamBeeld", ["andereWebcamBeeld"], loginSuccess);

  ticker = createjs.Ticker;
  ticker.setFPS(60);
  ticker.addEventListener("tick",update);

  window.onkeyup = keyup;
  window.onkeydown = keydown;
}

function listenToPositionChanged(from,data)
{
  spaceShip.x = data.x;
  spaceShip.y = data.y;
}

function setToestel()
{
  if(toestel == "RuimteStation")
  {
    spaceShip = new SpaceShip(50,50,10,10);
    landingZone = new LandingZone(width-150,height-10,150,10);
    stage.addChild(spaceShip.shape);
    stage.addChild(landingZone.shape);
    easyRTC.setDataListener(listenToPositionChanged);
  }
  else
  {
    spaceShip = new SpaceShip(50,50,10,10);
    landingZone = new LandingZone(width-150,height-10,150,10);
    stage.addChild(landingZone.shape);
    stage.addChild(spaceShip.shape);
    boxes.push(new Bound(landingZone.x,landingZone.y,landingZone.width,landingZone.height,"landing"));
  }
}

function keyup(e)
{
  keys[e.keyCode] = false;
}

function keydown(e)
{
  keys[e.keyCode] = true;
}

function update()
{

  for(var i = 0; i < boxes.length; i++)
  {
    switch(CollisionDetection.checkCollision(spaceShip,boxes[i],true))
    {
      case "l":
      case "r":
          spaceShip.velX *= -1;
          console.log();
          checkIfLanded(boxes[i].objName);
          break;
        case "t":
        case "b":
        spaceShip.velY *= -1;
        checkIfLanded(boxes[i].objName);
        break;
    }
  }

  spaceShip.update();
  stage.update();

  if(toestel == "RuimteSchip")
  {
    if(otherid != null)
    {
      console.log(otherid);
       //easyRTC.sendDataWS(otherid, "Hallo lelijke wereld");
       easyRTC.sendDataWS(otherid, {x: spaceShip.x, y:spaceShip.y});
    }
  }
}

function checkIfLanded(boundName)
{
  if(boundName == "bottom")
  {
    console.log("kaboom crash vuurwerk pewpew");
  }  
  if(boundName == "landing")
  {
    console.log("zotjes mooi geland!");
  }
}

function loginSuccess(easyRTCId) 
{
  selfid = easyRTCId;
  console.log("my id =" + selfid);  
}

function init() 
{
    keys = [];
    stage = new  createjs.Stage("cnvs");
    width = stage.canvas.width;
    height = stage.canvas.height;
 }

function clearConnectList() 
{
  otherClientDiv = document.getElementById('lijstMetClients');
  while (otherClientDiv.hasChildNodes()) 
  {
      otherClientDiv.removeChild(otherClientDiv.lastChild);
  }
}


function loggedInListener(data) 
{
  clearConnectList();
  otherClientDiv = document.getElementById('lijstMetClients');
  for(var i in data) 
  {
      otherid = i;
      var button = document.createElement('button');
      button.onclick = function(easyrtcid) 
      {
          return function() 
          {
              performCall(easyrtcid);
              otherid = easyrtcid;
              //easyRTC.sendDataWS(easyrtcid, "Hallo lelijke wereld");
          }
      }(i);

      label = document.createTextNode(easyRTC.idToName(i));
      button.appendChild(label);
      otherClientDiv.appendChild(button);
  }
}

function buildBounds()
{
  boxes.push(new Bound(0,height-1,width,1,"bottom"));
  boxes.push(new Bound(0,0,width,1,"top"));
  boxes.push(new Bound(0,0,1,height,"left"));
  boxes.push(new Bound(width-1,0,1,height,"right"));
}

function performCall(otherEasyrtcid) 
{
  easyRTC.hangupAll();
  var acceptedCB = function(accepted, caller) {
      if( !accepted ) {
          easyRTC.showError("CALL-REJECTED", "Sorry, your call to " + easyRTC.idToName(caller) + " was rejected");
      }
  }
  var successCB = function() {};
  var failureCB = function() {};
  easyRTC.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
}

easyRTC.setAcceptChecker(function(caller, cb) 
{
  cb(true);
});