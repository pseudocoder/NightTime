import { settingsStorage } from "settings";
import { outbox } from "file-transfer"
import * as cbor from "cbor";
import { me } from "companion";

// Initialise settings if not already set
if (settingsStorage.length != 4) {
  console.log("Initialising settings")
  settingsStorage.setItem("datefmt", JSON.stringify({ values: [{ name: "23.12.2018", value: "dd.mm.yyyy" }], selected: [0] }));
  settingsStorage.setItem("start", JSON.stringify({ values: [{ name: "23:00" }], selected: [23] }));
  settingsStorage.setItem("end", JSON.stringify({ values: [{ name: "07:00" }], selected: [7] }));
  settingsStorage.setItem("beat", true);
}

// Send changes to the device if changed

if (me.launchReasons.settingsChanged) {
  sendSettings();
}

settingsStorage.onchange = function(evt) {
  console.log(JSON.stringify(evt));
  sendSettings();
}

function sendSettings() {
  console.log("Sending all settings");
  console.log(JSON.stringify({ start: JSON.parse(settingsStorage.getItem("start")).selected[0], end: JSON.parse(settingsStorage.getItem("end")).selected[0], datefmt: JSON.parse(settingsStorage.getItem("datefmt")).values[0].value, beat: JSON.parse(settingsStorage.getItem("beat")) }));
  
  outbox.enqueue("config.cbor", cbor.encode({ start: JSON.parse(settingsStorage.getItem("start")).selected[0], end: JSON.parse(settingsStorage.getItem("end")).selected[0], datefmt: JSON.parse(settingsStorage.getItem("datefmt")).values[0].value, beat: JSON.parse(settingsStorage.getItem("beat")) }));
}
