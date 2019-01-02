import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";

// Initialise settings if not already set
if (settingsStorage.length != 4) {
  console.log("Initialising settings")
  settingsStorage.setItem("datefmt", JSON.stringify({ values: [{ name: "23.12.2018", value: "dd.mm.yyyy" }], selected: [0] }));
  settingsStorage.setItem("start", JSON.stringify({ values: [{ name: "23:00" }], selected: [23] }));
  settingsStorage.setItem("end", JSON.stringify({ values: [{ name: "07:00" }], selected: [7] }));
  settingsStorage.setItem("beat", true);
}

// Listen for the onopen event and send all settings
messaging.peerSocket.onopen = function() {
  console.log("Peer socket opened");
  sendAll();
}

// Send changes to the device
settingsStorage.onchange = function(evt) {
  console.log(evt.newValue);
  let key = evt.key;
  let value = JSON.parse(evt.newValue);
  let msg = ""
  
  switch (key) {
    case "datefmt":
      msg = JSON.stringify({ key: "datefmt", value: value.values[0].value });
      break;
  
    case "start":
    case "end":
      msg = JSON.stringify({ key: key, value: value.selected[0] });
      break;
  
    case "beat":
      msg = JSON.stringify({ key: "beat", value: value });
      break;
 
    default:
      console.error("Unknown setting: " + key);
  }

  sendMessage(msg);
}

function sendMessage(msg) {
  console.log("Sending: " + msg);

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(msg);
    console.log("Message sent");
  }
  else {
    console.log("No connection");
    setTimeout(function(){messaging.peerSocket.send(msg);console.log("Message sent");}, 2500);
  }
}

function sendAll() {
  console.log("Sending all settings");
  sendMessage(JSON.stringify({ key: "datefmt", value: JSON.parse(settingsStorage.getItem("datefmt")).values[0].value }));
  sendMessage(JSON.stringify({ key: "start", value: JSON.parse(settingsStorage.getItem("start")).selected[0] }));
  sendMessage(JSON.stringify({ key: "end", value: JSON.parse(settingsStorage.getItem("end")).selected[0] }));
  sendMessage(JSON.stringify({ key: "beat", value: settingsStorage.getItem("beat") }));
}
