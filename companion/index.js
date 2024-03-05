import { device } from "peer"
import { settingsStorage } from "settings";
import { outbox } from "file-transfer"
import * as cbor from "cbor";
import { me } from "companion";

// Initialise settings if not already set
setDefault("datefmt", JSON.stringify({ values: [{ name: "23.12.2018", value: "dd.mm.yyyy" }], selected: [0] }));
setDefault("start", JSON.stringify({ values: [{ name: "23:00" }], selected: [23] }));
setDefault("end", JSON.stringify({ values: [{ name: "07:00" }], selected: [7] }));
setDefault("beat", true);
setDefault("clickable", true);
setDefault("daytext", "\"#ffffff\"");
setDefault("nighttext", "\"#c05020\"");
setDefault("stat1", JSON.stringify({ values: [{ name: "Steps", value: "steps" }], selected: [0] }));

if (device.modelId != 38) {
  setDefault("stat2", JSON.stringify({ values: [{ name: "Floors", value: "floors" }], selected: [1] }));
  setDefault("stat3", JSON.stringify({ values: [{ name: "Calories", value: "calories" }], selected: [2] }));
  setDefault("stat4", JSON.stringify({ values: [{ name: "Active Zone Minutes", value: "azm" }], selected: [4] }));
}
else { // Versa Lite
  setDefault("stat2", JSON.stringify({ values: [{ name: "Calories", value: "calories" }], selected: [2] }));
  setDefault("stat3", JSON.stringify({ values: [{ name: "Active Zone Minutes", value: "azm" }], selected: [4] }));
  setDefault("stat4", JSON.stringify({ values: [{ name: "(none)", value: "" }], selected: [9] }));
}

// Send changes to the device if changed

if (me.launchReasons.settingsChanged) {
  sendSettings();
}

settingsStorage.onchange = function(evt) {
  console.log("Event: " + JSON.stringify(evt));
  sendSettings();
}

function sendSettings() {
/*  console.log("Sending all settings");
  console.log("start:" + settingsStorage.getItem("start"));
  console.log("end:" + settingsStorage.getItem("end"));
  console.log("datefmt:" + settingsStorage.getItem("datefmt"));
  console.log("beat:" + settingsStorage.getItem("beat"));
  console.log("clickable:" + settingsStorage.getItem("clickable"));
  console.log("daytext:" + settingsStorage.getItem("daytext"));
  console.log("nighttext:" + settingsStorage.getItem("nighttext"));
  console.log("stat1:" + settingsStorage.getItem("stat1"));
  console.log("stat2:" + settingsStorage.getItem("stat2"));
  console.log("stat3:" + settingsStorage.getItem("stat3"));
  console.log("stat4:" + settingsStorage.getItem("stat4")); */
  
  outbox.enqueue("config.cbor", cbor.encode({ start: JSON.parse(settingsStorage.getItem("start")).selected[0],
                                              end: JSON.parse(settingsStorage.getItem("end")).selected[0],
                                              datefmt: JSON.parse(settingsStorage.getItem("datefmt")).values[0].value,
                                              beat: JSON.parse(settingsStorage.getItem("beat")),
                                              clickable: JSON.parse(settingsStorage.getItem("clickable")),
                                              daytext: JSON.parse(settingsStorage.getItem("daytext")),
                                              nighttext: JSON.parse(settingsStorage.getItem("nighttext")),
                                              stat1: JSON.parse(settingsStorage.getItem("stat1")).values[0].value,
                                              stat2: JSON.parse(settingsStorage.getItem("stat2")).values[0].value,
                                              stat3: JSON.parse(settingsStorage.getItem("stat3")).values[0].value,
                                              stat4: JSON.parse(settingsStorage.getItem("stat4")).values[0].value }));
}

function setDefault(key, value) {
  if (settingsStorage.getItem(key) == null) {
    //console.log("Set default for " + key);
    settingsStorage.setItem(key, value);
  }
}