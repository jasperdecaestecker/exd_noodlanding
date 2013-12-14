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
    blueScreenOfDeath,
    delayBlueScreenOfDeath,
    blueScreenOfDeathToggle,
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
  var astroide1 = new Asteroid(60,500,100,100,1);
  stage.addChild(astroide1.container);
  boxes.push(new Bound(astroide1.container.x - 50, astroide1.container.y - 50,100,100,"astroide"));

  var astroide2 = new Asteroid(530,200,100,100,2);
  stage.addChild(astroide2.container);
  boxes.push(new Bound(astroide2.container.x - 50, astroide2.container.y - 50,100,100,"astroide"));

  var astroide3 = new Asteroid(320,700,100,100,3);
  stage.addChild(astroide3.container);
  boxes.push(new Bound(astroide3.container.x - 50, astroide3.container.y - 50,100,100,"astroide"));

    var astroide4 = new Asteroid(450,329,100,100,4);
  stage.addChild(astroide4.container);
  boxes.push(new Bound(astroide4.container.x - 50, astroide4.container.y - 50,100,100,"astroide"));
}

function startSpel()
{
  console.log("zotjes");
  if(!joystickGestart)
  {
    //stage.removeChild(startText);
    /*$("#startScherm").html(
        '<video width="1280" height="720" autoplay>' +
            '<source src="startClip.mp4" type="video/mp4">' +
        '</video>');*/


  }
  joystickGestart = true;
}

function listenToDataFromServer(from,data)
{
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
    console.log(data);
  }
}

function setToestel()
{

  spaceShip = new SpaceShip(50,50,10,10);
    landingZone = new LandingZone(0,this.height-255,944,255);

   
  stage.addChild(landingZone.container);
  stage.addChild(spaceShip.container);
//  stage.addChild(landingZone.shape);
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
     
     


     //$('#startScherm').show();
    // stage.alpha = 0;
     //stage.alpha = 0;
  }
  /*if(toestel == "RuimteStation")
  {
    spaceShip = new SpaceShip(50,50,10,10);
    landingZone = new LandingZone(width-150,height-10,150,10);
    stage.addChild(spaceShip.container);
   // stage.addChild(spaceShip.shape);
    stage.addChild(landingZone.shape);
    easyRTC.setDataListener(listenToDataFromServer);

    startText = new createjs.Text("Het scherm van het RuimteSchip is stuk, geef instructies om te landen", "20px Arial", "#ff7700"); startText.x = 100; startText.y = 50; startText.textBaseline = "alphabetic";

  }
  else
  {
    spaceShip = new SpaceShip(50,50,10,10);
    landingZone = new LandingZone(width-150,height-10,150,10);
    stage.addChild(landingZone.container);
        stage.addChild(landingZone.shape);
    //stage.addChild(spaceShip.bitmap);
   // stage.addChild(spaceShip.shape);
    boxes.push(new Bound(landingZone.x,landingZone.y,landingZone.width,landingZone.height,"landing"));
    easyRTC.setDataListener(listenToDataFromServer);

    this.blueScreenOfDeath = new createjs.Shape();
    this.blueScreenOfDeath.graphics.c();
    this.blueScreenOfDeath.graphics.f("000000");
    this.blueScreenOfDeath.graphics.drawRect(0,0,800,600);
    this.blueScreenOfDeath.graphics.ef();

  //  stage.addChild(this.blueScreenOfDeath);

    delayBlueScreenOfDeath = 20;
    blueScreenOfDeathToggle = true;

    startText = new createjs.Text("Luister naar je mede astronaut om succesvol te landen.", "20px Arial", "#ff7700"); startText.x = 100; startText.y = 50; startText.textBaseline = "alphabetic";
  }*/

  joystickGestart = false;
  //stage.addChild(startText);
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

  if(this.direction == "")
  {
   // this.direction = "b";
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
      moveShip();

      for(var i = 0; i < boxes.length; i++)
      {
         var direction = "";
        switch(CollisionDetection.checkCollision(spaceShip,boxes[i]))
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
       // console.log(direction);
  
      }


      spaceShip.update();
      stage.update();
     

     // console.log("xamountOfTicks"+ ticker.getTicks());
     /*if(toestel == "RuimteSchip")
      {
        if(ticker.getTicks() % delayBlueScreenOfDeath == 0)
        {
          console.log("updateThatSCreen");
          revealTheScreen();
        
          stage.update();
        }
      }
      else
      {
        stage.update();
      }*/

       //console.log(this.direction);

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

function revealTheScreen()
{
    blueScreenOfDeathToggle = !blueScreenOfDeathToggle;
    if(blueScreenOfDeathToggle)
    {
      delayBlueScreenOfDeath = 200;
      this.blueScreenOfDeath.alpha = 1;
    }
    else
    {
        delayBlueScreenOfDeath = 20;
      this.blueScreenOfDeath.alpha = 0;
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
    console.log("zotjes mooi geland!");
    showEndScreen();
  }
  if(boundName == "astroide")
  {

  }
}

function showEndScreen()
{
  if(toestel == "RuimteSchip")
  {
     var text = new createjs.Text("Proficiat je hebt mooi kunnen landen op het platform!", "20px Arial", "#ffffff"); text.x = 100; text.textBaseline = "alphabetic";
  }
  else
  {
     var text = new createjs.Text("Dankzij je hulp is de astronaut goed kunnen landen!", "20px Arial", "#ffffff"); text.x = 100; text.textBaseline = "alphabetic";
  }

  text.y = 100;

  stage.addChild(text);
  stage.update();

  canControl = false;
 
  ticker.setPaused(true);
  //ticker.reset();



  setTimeout(function() 
  {
    canControl = true;
     stage.removeChild(text);

    console.log("timeout complete");

      spaceShip.x = 50;

    spaceShip.y = 50;
    spaceShip.velX = 0;
    spaceShip.velY = 0;
    keys[37] = keys[38] = keys[39] = keys[40] = false;
    stage.update();
    ticker.setPaused(false);

    if(toestel == "RuimteSchip")
    {
      startText = new createjs.Text("Luister naar je mede astronaut om succesvol te landen.", "20px Arial", "#ff7700"); startText.x = 100; startText.y = 50; startText.textBaseline = "alphabetic";
    }
    else
    {
      startText = new createjs.Text("Het scherm van het RuimteSchip is stuk, geef instructies om te landen", "20px Arial", "#ff7700"); startText.x = 100; startText.y = 50; startText.textBaseline = "alphabetic";
    }

    stage.addChild(startText);
    joystickGestart = false;



  }, 2000);
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