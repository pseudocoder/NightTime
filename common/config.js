import userActivity from "user-activity";
import * as fs from "fs";

var config = null;
var def = userActivity.goals.elevationGain ? {"start": 23, "end": 7, "datefmt": "dd.mm.yyyy", "beat": true, "clickable": true, "daytext": "#ffffff", "nighttext": "#c05020", "stat1": "steps", "stat2": "floors", "stat3": "calories", "stat4": "azm"}
          : {"start": 23, "end": 7, "datefmt": "dd.mm.yyyy", "beat": true, "clickable": true, "daytext": "#ffffff", "nighttext": "#c05020", "stat1": "steps", "stat2": "calories", "stat3": "azm", "stat4": ""};

export function get(key) {
  loadConfig();
  return config[key];
}

export function loadConfig() {
  if (config === null) {
    console.log("Loading config");
    try {
      console.log(fs.readFileSync("config.json", "ascii"));
      config = fs.readFileSync("config.json", "json");
      console.log("Config read: " + JSON.stringify(config));
    }
    catch (err) {
      console.log("Error reading config (" + err.message + ") resetting");
      config = {}
      fs.writeFileSync("config.json", config, "json");
    }

    setDefaults();
  }
}

function saveConfig() {
  console.log("Saving config: " + JSON.stringify(config));
  fs.writeFileSync("config.json", config, "json");
}

function setDefaults() {
  for (var key in def) {
    if (typeof(config[key]) == "undefined") {
      console.log("Set default " + key + " = " + def[key])
      config[key] = def[key];
    }
  }
}

export function setConfig(newconf) {
  config = newconf;
  saveConfig();
}