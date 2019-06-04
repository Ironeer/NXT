ws = null;
turng = 0;
speedg = 0;
gamepad=null;

function init_gamepad() {
window.addEventListener("gamepadconnected", function(e) {
  gamepad = navigator.getGamepads()[e.gamepad.index];
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});

/*document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) {
            turng = -1;
        }
        else if(event.keyCode == 38) {
            speedg = -1;
        }
        else if(event.keyCode == 39) {
            turng = 1;
        }
        else if(event.keyCode == 40) {
            speedg = 1;
        }
    });
       document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37) {
            turng = 0;
        }
        else if(event.keyCode == 38) {
            speedg = 0;
        }
        else if(event.keyCode == 39) {
            turng = 0;
        }
        else if(event.keyCode == 40) {
            speedg = 0;
        }
    });
*/
}

function destroy_gamepad() {
   // document.removeEventListener("keydown")
    //document.removeEventListener("keydown")
}

function create_ws() {


  // Let us open a web socket
  var ws_url = $("#el_ws_url").val();

  ws = new WebSocket(ws_url);
  alert("WebSocket created");

  ws.onopen = function() {
    alert("WS opened");
    $("#ws_online").show();
    $("#ws_offline").hide();
  };

  ws.onmessage = function (evt) {
    var received_msg = evt.data;
    console.log(received_msg);
  };

  ws.onclose = function() {
    ws = null;
    $("#ws_online").hide();
    $("#ws_offline").show();
  };

  setInterval(ws_send_gamepad, 500);
}

function ws_send_gamepad() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (!gamepads) {
    return;
  }

  var gp = gamepads[0];

  var turn = gp.axes[2];
  var forward = gp.axes[1];

  var pressed = gp.buttons[0];

  console.log("Cal p: "+pressed)
  if(pressed==1){
    ws.send(JSON.stringify({
      calibrate:true,
      time: Date.now(),
      sid: "{{sessionID}}"
    }));
  }


  console.log(turn);
  console.log(forward);

  if ( !ws ) {
    console.log("no websocket! aborting");
    return;
  }

  ws.send(JSON.stringify({
    turn: turn,
    forward: forward,
    tower: "0",
    time: Date.now(),
    sid: "{{sessionID}}"
  }));

}

function disconnect_ws() {
  if ( !ws ) {
    console.log("no websocket! aborting");
    return;
  }
  $("#ws_online").hide();
  $("#ws_offline").show();
  ws.close();
}

$(document).ready(function() {
  if ( !("WebSocket" in window) ) {
    alert("WebSocket NOT supported by your Browser!");
  }
});
