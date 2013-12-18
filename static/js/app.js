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
    landingZone,
    delayPilkes,
    currentAnimationPilke,
    delayRuis,
    toggleRuis,
    endTicker,
    canControl,
    joystickGestart = false,
    startText,
    arrAsteroiden,
    direction;

var prevX, prevY;    

function startInstellingenGekozen(e)
{  
  e.preventDefault();
  toestel = $('input[name=radio_toestel]:checked', '#startInstellingen form').val();
  $('#toestel h1').html(toestel);

  boxes = [];
  arrAsteroiden = [];
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

function voegAstroidenToe()
{
  var astroide1 = new Asteroid(60,300,100,100,1);
  stage.addChild(astroide1.container);
  boxes.push(new Bound(astroide1.container.x - 50, astroide1.container.y - 50,100,100,"astroide"));

  var astroide2 = new Asteroid(730,150,100,100,2);
  stage.addChild(astroide2.container);
  boxes.push(new Bound(astroide2.container.x - 50, astroide2.container.y - 50,100,100,"astroide"));

  var astroide3 = new Asteroid(320,700,100,100,2);
  stage.addChild(astroide3.container);
  boxes.push(new Bound(astroide3.container.x - 50, astroide3.container.y - 50,100,100,"astroide"));

  var astroide4 = new Asteroid(450,329,100,100,4);
  stage.addChild(astroide4.container);
  boxes.push(new Bound(astroide4.container.x - 50, astroide4.container.y - 50,100,100,"astroide"));

  var astroide5 = new Asteroid(650,630,100,100,3);
  stage.addChild(astroide5.container);
  boxes.push(new Bound(astroide5.container.x - 50, astroide5.container.y - 50,100,100,"astroide"));

  var astroide1 = new Asteroid(830,500,100,100,1);
  stage.addChild(astroide1.container);
  boxes.push(new Bound(astroide1.container.x - 50, astroide1.container.y - 50,100,100,"astroide"));
}

function startSpel()
{
  if(!joystickGestart && toestel == "RuimteSchip")
  {
    setTimeout(function() 
    {
        console.log("crashScreen");


        document.getElementById('alarm').play();
       document.getElementById('alarm').volume=.1;

        canControl = false;
            keys[37] = keys[38] = keys[39] = keys[40] = false;
         $("#startScherm").html(
        '<video width="100%" height="auto" id="startVideo" autoplay>' +
            '<source src="startRuimteSChip.mp4" type="video/mp4">' +
        '</video>');

        document.getElementById('startVideo').addEventListener('ended',myHandler,false);
        function myHandler(e) 
        {

            if(!e) { e = window.event; }

            $("#startVideo").hide();
            $("#ruisScherm").html(
            '<video width="100%" height="auto" id="ruisVideo" autoplay loop>' +
                '<source src="ruis.mp4" type="video/mp4">' +
            '</video>');

            canControl = true;
        }

    }, 1200);

    joystickGestart = true;
  }
}

function listenToDataFromServer(from,data)
{
  if(data.msgType == "voipConnected")
  {
    clearConnectList();
  }

   if(data.msgType == "joystickAangesproken" && !joystickGestart) 
   {
      startSpel();
      console.log("startSpel");
   }

  if(toestel == "RuimteSchip")
  {
    if(data.msgType == "joystickAangesproken")
    {
      console.log("check");
      if(canControl)
      {
        keys[37] = (data.left) ? true : false;
        keys[38] = (data.up) ? true : false;
        keys[39] = (data.right) ? true : false;
        keys[40] = (data.down) ? true : false;
      }
    }
  }
  if(data.msgType == "stuurCoordinaten")
  {
    if(canControl)
    {
      spaceShip.x = data.x;
      spaceShip.y = data.y;
      console.log(data.direction);
      showDirectionSpaceship(data.direction);
    }
  } 
  if(data.msgType == "succesvolGeland")
  {
    showEndScreen();
  }
}

function setToestel()
{

  delayRuis = 200;
  delayPilkes = 25;
  toggleRuis = true;
  currentAnimationPilke = 0;

  spaceShip = new SpaceShip(50,50,10,10);
  landingZone = new LandingZone(0,this.height-255,944,255);

  stage.addChild(landingZone.container);
  stage.addChild(spaceShip.container);
  easyRTC.setDataListener(listenToDataFromServer);

  boxes.push(new Bound(landingZone.shape.x + landingZone.container.x,landingZone.shape.y + landingZone.container.y,150,50,"landing"));
  console.log(landingZone.shape.x, landingZone.shape.y, 150, 50, "landing");

   voegAstroidenToe();

  canControl = true;

  if(toestel == "RuimteStation")
  {
    document.title = "RuimteStation";
  }
  else
  {
     document.title = "RuimteSchip";
  }

  joystickGestart = false;
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
  this.direction = "";
  if(toestel == "RuimteSchip")
  {
    if(keys[37]) // links
    {
      this.direction += "l";
      if(spaceShip.velX >- spaceShip.speed)
      {
        spaceShip.velX --;
       
      }
    }
    if(keys[39]) // rechts
    {
      this.direction += "r";
      if(spaceShip.velX < spaceShip.speed)
      {
        spaceShip.velX ++;
        
      }
    }
    if(keys[38]) // boven
    {
       this.direction += "t"; 
      if(spaceShip.velY >- spaceShip.speed)
      {
        spaceShip.velY --;  
          
      }
    }    
    if(keys[40]) // onder
    {
       this.direction += "b";
      if(spaceShip.velY < spaceShip.speed)
      {
        spaceShip.velY ++;
       
      }
    }
  }

  if(this.direction != "" && !joystickGestart)
  {
    startSpel();

  }

  showDirectionSpaceship(this.direction);
}

function showDirectionSpaceship(direction)
{
  switch(direction)
  {
    case "t":
      spaceShip.animation.gotoAndStop(0);
      break;
     case "rt":
        spaceShip.animation.gotoAndStop(1);
     break;
     case "r":
        spaceShip.animation.gotoAndStop(2);
     break;
     case "rb":
        spaceShip.animation.gotoAndStop(3);
     break;
     case "b":
        spaceShip.animation.gotoAndStop(4);
     break;
     case "lb":
        spaceShip.animation.gotoAndStop(5);
     break;
     case "l":
        spaceShip.animation.gotoAndStop(6);
     break;
     case "lt":
        spaceShip.animation.gotoAndStop(7);
     break;
  }
}

function update()
{

  if(!ticker.getPaused())
  {
      if(canControl)
      {
        moveShip();
      }

      for(var i = 0; i < boxes.length; i++)
      {
         var direction = "";
        switch(CollisionDetection.checkCollision(spaceShip ,boxes[i]))
        {
          case "l":
          case "r":
             direction = "horizontal";
                   determineCollisionType(boxes[i].objName, direction);
              break;
            case "t":
            case "b":
              direction = "vertical";
                    determineCollisionType(boxes[i].objName, direction);
            break;
        }  
      }

      spaceShip.update();
      stage.update();

      if(ticker.getTicks() % delayPilkes == 0)
      {
        landingZone.pilke.gotoAndStop(currentAnimationPilke);
        currentAnimationPilke++;

        if(currentAnimationPilke == 4)
        {
          currentAnimationPilke = 0;
        }
      }
     
     if(ticker.getTicks() % delayRuis == 0)
     {
       toggleRuis = !toggleRuis;
        if(toggleRuis)
        {
          delayRuis = 200;
          $("#ruisVideo").show();
        }
        else
        {
          delayRuis = 10;
          $("#ruisVideo").hide();
        }
     }

      if(toestel == "RuimteSchip")
      {
        if(otherid != null)
        {
          //easyRTC.sendDataWS(otherid, "Hallo lelijke wereld");
          if(prevY != spaceShip.y || prevX != spaceShip.x)
          {
            easyRTC.sendDataWS(otherid, {msgType:"stuurCoordinaten", x: spaceShip.x, y:spaceShip.y, direction:this.direction});
          }
        }
      }

      prevX = spaceShip.x;
      prevY = spaceShip.y;
   }
}

function determineCollisionType(boundName, direction)
{

  if(boundName == "astroide")
  {
    if(direction == "horizontal")
    {
        spaceShip.velX *= -8;
    }
    else
    {
        spaceShip.velY *= -8;
    }
  
  }
  else
  {
    if(direction == "horizontal")
    {
        spaceShip.velX *= -1;
    }
    else
    {
        spaceShip.velY *= -1;
    }
  }


  if(boundName == "bottom")
  {
    console.log("kaboom crash vuurwerk pewpew");
  }  
  if(boundName == "landing")
  {
    easyRTC.sendDataWS(otherid, {msgType:"succesvolGeland"});
    showEndScreen();
  }
}

function showEndScreen()
{
  canControl = false;
  ticker.setPaused(true);
  $("#cnvs").hide();

  $("#startScherm").empty();
  $("#ruisScherm").empty();
  $('#eindScherm').show();

    document.getElementById('alarm').pause();
    document.getElementById('alarm').currentTime = 0;

  setTimeout(function() 
  {
    canControl = true;
       $("#cnvs").show();

      $('#eindScherm').hide();
    console.log("timeout complete");

    spaceShip.x = 50;
    spaceShip.y = 50;
    spaceShip.velX = 0;
    spaceShip.velY = 0;
    keys[37] = keys[38] = keys[39] = keys[40] = false;
    stage.update();
    ticker.setPaused(false);
    joystickGestart = false;
  }, 3000);
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

    console.log("width:" + width);
    console.log("height:" + height);

    $('#eindScherm').hide();


    //$('#startScherm').hide();
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
              easyRTC.sendDataWS(otherid, {msgType:"voipConnected"});
              clearConnectList();
          }
      }(i);

      label = document.createTextNode(easyRTC.idToName(i));
      button.appendChild(label);
      otherClientDiv.appendChild(button);
  }
}

function buildBounds()
{
  //boxes.push(new Bound(0,height-1,width,1,"bottom"));
  boxes.push(new Bound(0,height-25,width,1,"bottom"));
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