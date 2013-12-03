$( document ).ready(function() 
{
	init();
	
  $('#startInstellingen form').submit(startInstellingenGekozen);
});

//var socket = io.connect(':8080');
var selfid;
var otherid;

var toestel;

  var stage, width, height, ticker, keys, spaceShip;


function startInstellingenGekozen(e)
{  
    e.preventDefault();
    toestel = $('input[name=radio_toestel]:checked', '#startInstellingen form').val();
    $('#toestel h1').html(toestel);

   

    console.log(toestel);
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
  console.log("from: "+ from);
  console.log("data: "+ data.x);
  spaceShip.x = data.x;
  spaceShip.y = data.y;
}

function setToestel()
{
  if(toestel == "RuimteStation")
  {
    console.log("test");
    spaceShip = new SpaceShip(50,50,10,10);
    stage.addChild(spaceShip.shape);
    easyRTC.setDataListener(listenToPositionChanged);
  }
  else
  {
    spaceShip = new SpaceShip(50,50,10,10);
    stage.addChild(spaceShip.shape);
  }
}

function keyup(e)
{
  keys[e.keyCode] = false;
}

function keydown(e)
{
  keys[e.keyCode] = true;
  console.log(e.keyCode);
}

function update()
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
 



    //console.log("update");
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
    
    /*if(otherid != "")
    {
      easyRTC.sendDataWS(otherid, "Hallo lelijke wereld");
    }*/
     //easyRTC.sendDataWS(otherid, "test");
  }
  else
  {
    
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
     /*easyRTC.setLoggedInListener( loggedInListener);
     easyRTC.initManaged("Company Chat Line", "self", ["caller"],
         function(myId) {
            console.log("My easyrtcid is " + myId);
            selfid = myId;
         }
     );*/
 }

 function clearConnectList() {
    otherClientDiv = document.getElementById('lijstMetClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}


    function loggedInListener(data) 
    {
      clearConnectList();
      otherClientDiv = document.getElementById('lijstMetClients');
      for(var i in data) {
          otherid = i;
          var button = document.createElement('button');
          button.onclick = function(easyrtcid) {
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

    easyRTC.setAcceptChecker(function(caller, cb) {
    cb(true);
} );