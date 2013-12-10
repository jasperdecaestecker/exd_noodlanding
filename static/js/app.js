$( document ).ready(function() 
{
	init();
  $('#startInstellingen form').submit(startInstellingenGekozen);
});

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

var prevX, prevY;    

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

function listenToDataFromServer(from,data)
{

  console.log(data);

  if(toestel == "RuimteSchip")
  {
    if(data.msgType == "joystickAangesproken")
    {
      console.log("check");
      keys[37] = (data.left) ? true : false;
      keys[38] = (data.up) ? true : false;
      keys[39] = (data.right) ? true : false;
      keys[40] = (data.down) ? true : false;
    }
  }
  if(data.msgType == "stuurCoordinaten")
  {
    spaceShip.x = data.x;
    spaceShip.y = data.y;
  } 
}

function setToestel()
{
  if(toestel == "RuimteStation")
  {
    spaceShip = new SpaceShip(50,50,10,10);
    landingZone = new LandingZone(width-150,height-10,150,10);
    stage.addChild(spaceShip.shape);
    stage.addChild(landingZone.shape);
    easyRTC.setDataListener(listenToDataFromServer);
  }
  else
  {
    spaceShip = new SpaceShip(50,50,10,10);
    landingZone = new LandingZone(width-150,height-10,150,10);
    stage.addChild(landingZone.shape);
    stage.addChild(spaceShip.shape);
    boxes.push(new Bound(landingZone.x,landingZone.y,landingZone.width,landingZone.height,"landing"));
     easyRTC.setDataListener(listenToDataFromServer);
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

function moveShip()
{
  if(toestel == "RuimteSchip")
  {
    if(keys[37])
    {
      if(spaceShip.velX > - spaceShip.speed)
      {
        spaceShip.velX --;
      }
    }
    if(keys[39])
    {
      if(spaceShip.velX < spaceShip.speed)
      {
        spaceShip.velX ++;
      }
    }
    if(keys[38])
    {
      if(spaceShip.velY >- spaceShip.speed)
      {
        spaceShip.velY --;      
      }
    }    
    if(keys[40])
    {
      if(spaceShip.velY < spaceShip.speed)
      {
        spaceShip.velY ++;
      }
    }
  }
}

function update()
{
  moveShip();

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
      //easyRTC.sendDataWS(otherid, "Hallo lelijke wereld");
      if(prevY != spaceShip.y || prevX != spaceShip.x)
      {
        easyRTC.sendDataWS(otherid, {msgType:"stuurCoordinaten", x: spaceShip.x, y:spaceShip.y});
      }
    }
  }

  prevX = spaceShip.x;
  prevY = spaceShip.y;
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

  // stuur type toestel naar server
  //easyRTC.sendServerMessage("setToestelId", {id: easyRTCId, typeToestel:toestel});
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
  /*console.log("[loggedInListener");
  console.log($.isEmptyObject(data));
  if(!$.isEmptyObject(data))
  {
    console.log("call ma die bitch");
    for(var i in data) 
    {
      console.log(i);
      otherid = i;
      performCall(i);
    } 
   // otherid = dat
     //otherid = easyrtcid;
  }*/
  //console.log(selfid);


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
              //$('#lijstMetClients').hide();
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