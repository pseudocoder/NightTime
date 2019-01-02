import * as fs from "fs";

var config = null;

export function get(key) {
  loadConfig();
  return config[key];
}

export function set(key, value) {
  loadConfig();
  config[key] = value;
  saveConfig();
}

export function loadConfig() {
  if (config === null) {
    console.log("Loading config");
    try {
      config = fs.readFileSync("config.json", "json");
      console.log("Config read: " + JSON.stringify(config));
    }
    catch (err) {
      console.log("Error reading config, resetting");
      config = {"start": 23, "end": 7, "datefmt": "dd.mm.yyyy", "beat": true};
      fs.writeFileSync("config.json", config, "json");
    }
  }
}

function saveConfig() {
  console.log("Saving config: " + JSON.stringify(config));
  fs.writeFileSync("config.json", config, "json");
}