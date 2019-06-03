
ws = null;
turng = 0;
speedg = 0;

function init_gamepad() {
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) {
            turng = -1;
            alert('Left was pressed');
        }
        else if(event.keyCode == 38) {
            speedg = 1;
            alert('Up was pressed');
        }
        else if(event.keyCode == 39) {
            turng = 1;
            alert('Right was pressed');
        }
        else if(event.keyCode == 40) {
            speedg = -1;
            alert('Down was pressed');
        }
    });
}

function destroy_gamepad() {
    document.removeEventListener("keydown")
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

  // normalize joystick values so they are always between -1 and 1
  var turn = turng;
  var forward = speedg;

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
