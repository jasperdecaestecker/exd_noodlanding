$( document ).ready(function() 
{
	init();
	$('#test').click(clickHandler);
});

//var socket = io.connect(':8080');
var selfid;
var otherid;

function clickHandler()
{
	console.log("test");
	//socket.emit('send','hello world');
	 easyRTC.sendDataWS(otherid, "Hallo lelijke wereld");
}

function init() 
{
     easyRTC.setLoggedInListener( loggedInListener);
     easyRTC.initManaged("Company Chat Line", "self", ["caller"],
         function(myId) {
            console.log("My easyrtcid is " + myId);
            selfid = myId;
         }
     );
 }


    function loggedInListener(connected) {
        var otherClientDiv = document.getElementById('otherClients');
        while (otherClientDiv.hasChildNodes()) {
            otherClientDiv.removeChild(otherClientDiv.lastChild);
        }
        for(var i in connected) {
            var button = document.createElement('button');
            button.onclick = function(easyrtcid) {
                return function() {
                    performCall(easyrtcid);
                    otherid = easyrtcid;
                }
            }(i);

            label = document.createTextNode(i);
            button.appendChild(label);
            otherClientDiv.appendChild(button);
            console.log("addButton");
        }
    }


    function performCall(easyrtcid) {
        easyRTC.call(
           easyrtcid, 
           function(easyrtcid) { console.log("completed call to " + easyrtcid);},
           function(errorMessage) { console.log("err:" + errorMessage);},
           function(accepted, bywho) {
              console.log((accepted?"accepted":"rejected")+ " by " + bywho);
           }
       );
    }