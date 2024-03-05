import clock from "clock";
import { display } from "display";
import document from "document";
import userActivity from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { locale } from "user-settings";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { battery } from "power";
import { inbox } from "file-transfer";
import { me as device } from "device";
import * as fs from "fs";

const ionic = device.screen.width == 348;

import * as util from "../common/utils";
import * as config from "../common/config";

var nighttime = null;
var lasttime = null;

const clockPref = preferences.clockDisplay;
var lastValueTimestamp = Date.now();

if (!device.screen) device.screen = { width: 348, height: 250 };


config.loadConfig();

// Update the heartrate part of the clock...
if (HeartRateSensor) {
  const hrm = new HeartRateSensor();
  hrm.onreading = function() {
    setHeartrate(hrm.heartRate);
    lastValueTimestamp = Date.now();
  };
  hrm.start();

  display.addEventListener("change", () => {
    if (display.on && !display.aodActive) {
      hrm.start();
    } else {
      hrm.stop();
    }
  });
}

const svg = document.getElementById("svg");
const HRtext = document.getElementById("HRtext");
const animate = document.getElementById("animation");
const groupStats = document.getElementById("groupStats");
const myTime = document.getElementById("time");
const myDate = document.getElementById("date");
const myBattery = document.getElementById("battery");
const batimg = document.getElementById("batimg");
const batpct = document.getElementById("batpct");

var big = "";
for (let n = 1; n <= 4; n++) {
  document.getElementById("stat" + n + "area").addEventListener("click", (evt) => {
    click("stat" + n);
  });
}
document.getElementById("bigclick").addEventListener("click", (evt) => {
  big = "";
  updateClock();
});

function setHeartrate(heartRate) {
  HRtext.text = heartRate > 0 ? heartRate : "--";

  if (heartRate > 0 && config.get("beat")) {
    animate.to = 0.5;
    animate.dur = 60 / heartRate;
  } else {
    animate.to = 1;
  }
}

// Update all the parts of the clock
function updateClock(force) {
  let now = new Date();

  let night = util.hourBetween(now.getHours(), config.get("start"), config.get("end"));
  
  if (night != nighttime || force) {
    applyTheme(night);
    nighttime = night;
  }
  
  let newclass = (display.aodActive ? "off" : "on") + " " + (night ? "night" : "day") + (ionic ? " ionic" : "") + (config.get("stat4") == "" ? " threestats" : "") + (big == "" ? "" : " big big" + big);
  
  if (svg.class != newclass) {
    svg.class = newclass;
  }

  let lang = locale.language;

  let nowhour = now.getHours();
  let hours = util.formatHour(nowhour, clockPref);
  let mins = util.zeroPad(now.getMinutes());

  // Only update time if it's changed
  if (hours + mins != lasttime || force) {
    lasttime = hours + mins;

    let day = util.zeroPad(now.getDate());
    let wday = now.getDay();
    let month = util.zeroPad(now.getMonth() + 1);
    let year = now.getFullYear();
    let prefix = lang.substring(0, 2);

    if (typeof util.weekday[prefix] === "undefined") {
      prefix = "en";
    }

    let datestring = config
      .get("datefmt")
      .replace("dd", day)
      .replace("mm", month)
      .replace("yyyy", year)
      .replace("yy", year % 100);

    myTime.text = (display.aodActive ? `${hours} ${mins}` : `${hours}:${mins}`);
    myDate.text = (display.aodActive ? "" : util.weekday[prefix][wday] + " ") + datestring;

    let bat = Math.floor(battery.chargeLevel);
    myBattery.text = bat + "%";

    batpct.style.fill = bat < 17 ? "#f81373" : bat < 31 ? "#ffb230" : "#2adf2a";
    
    if (display.aodActive) {
      batpct.y = batimg.y + 24 - bat / 5;
      batpct.height = bat / 5;
      batpct.width = 13;
    }
    else {
      batpct.y = batimg.y + 29 - bat / 4;
      batpct.height = bat / 4;
      batpct.width = 16;
    }
  }

  if (display.aodActive) {
    return;
  }
  
  if (HeartRateSensor && ((Date.now() - lastValueTimestamp) / 1000 > 5)) {
    setHeartrate(0);
  }

  for (let n = 1; n <= 4; n++) {
    let stat = config.get("stat" + n);
  
    switch (stat) {
      case "steps": {
        setControl( userActivity.today.adjusted.steps, userActivity.goals.steps, "stat" + n);
        if (force) { setStat("steps", "stat" + n, "#00ffff"); }
        break;
      }

      case "floors": {
        setControl( userActivity.today.adjusted.elevationGain, userActivity.goals.elevationGain, "stat" + n);
        if (force) { setStat("floors", "stat" + n, "#00ff00"); }
        break;
      }

      case "calories": {
        setControl( userActivity.today.adjusted.calories, userActivity.goals.calories, "stat" + n );
        if (force) { setStat("cals", "stat" + n, "#ff882c"); }
        break;
      }

      case "kj": {
        setControl( userActivity.today.adjusted.calories * 4.2, userActivity.goals.calories * 4.2, "stat" + n );
        if (force) { setStat("cals", "stat" + n, "#ff882c"); }
        break;
      }

      case "azm": {
        if (typeof(userActivity.goals.activeMinutes) == "undefined") {
          setControl( userActivity.today.adjusted.activeZoneMinutes.total || 0, userActivity.goals.activeZoneMinutes.total, "stat" + n );
          if (force) { setStat("azm", "stat" + n, "#dc00f6"); }
        }
        else {
          setControl( userActivity.today.adjusted.activeMinutes || 0, userActivity.goals.activeMinutes, "stat" + n );
          if (force) { setStat("mins", "stat" + n, "#dc00f6"); }
        }
        break;
      }

      case "dist_m": {
        setControl( userActivity.today.adjusted.distance, userActivity.goals.distance, "stat" + n);
        if (force) { setStat("distance", "stat" + n, "#00ccff"); }
        break;
      }

      case "dist_km": {
        setControl( userActivity.today.adjusted.distance / 1000.0, userActivity.goals.distance / 1000.0, "stat" + n, 2);
        if (force) { setStat("distance", "stat" + n, "#00ccff"); }
        break;
      }

      case "dist_mi": {
        setControl( userActivity.today.adjusted.distance * 0.000621371, userActivity.goals.distance * 0.000621371, "stat" + n, 2);
        if (force) { setStat("distance", "stat" + n, "#00ccff"); }
        break;
      }

      case "secs": {
        setControl( util.zeroPad(now.getSeconds()), 60, "stat" + n );
        if (force) { setStat("secs", "stat" + n, "#ffff00"); }
        break;
      }
    }
  }    
}

function setControl(val, goal, ctrl, dp = 0) {
  if (typeof(val) == "undefined") {
    document.getElementById("small" + ctrl).getElementById("text").text = "X";
    document.getElementById("big" + ctrl).getElementById("text").text = "X";
    document.getElementById("small" + ctrl).getElementById("arc").sweepAngle = 0;
    document.getElementById("big" + ctrl).getElementById("arc").sweepAngle = 0;
    return;
  }
  
  document.getElementById("small" + ctrl).getElementById("text").text = typeof(val) == "string" ? val : val.toFixed(dp);
  
  let arc1 = document.getElementById("small" + ctrl).getElementById("arc");
  arc1.sweepAngle = Math.min(Math.floor(360 * (val / goal)), 360);
  if (val >= goal) {
    if (arc1.class.indexOf("goal") == -1) {
      arc1.class += " goal";
    }
  }
  else {
    if (arc1.class.indexOf("goal") > -1) {
      arc1.class.replace(/ *goal/, "");    
    }
  }
  
  if (big != "") {
    document.getElementById("big" + ctrl).getElementById("text").text = typeof(val) == "string" ? val : val.toFixed(dp);

    let arc2 = document.getElementById("big" + ctrl).getElementById("arc");
    arc2.sweepAngle = Math.min(Math.floor(360 * (val / goal)), 360);
    if (val >= goal) {
      if (arc2.class.indexOf("goal") == -1) {
        arc2.class += " goal";
      }
    }
    else {
      if (arc2.class.indexOf("goal") > -1) {
        arc2.class.replace(/ *goal/, "");    
      }
    }
  }
}

function setStat(image, ctrl, colour) {
  let o = document.getElementById("small" + ctrl);
  o.getElementById("img").href = image + ".png";
  o.getElementById("imgoff").href = image + "-off.png";
  o.getElementById("arc").style.fill = colour;
  
  o = document.getElementById("big" + ctrl);
  o.getElementById("img").href = image + ".png";
  o.getElementById("arc").style.fill = colour;
}

// Update the clock every second
clock.granularity = "seconds";
clock.ontick = () => updateClock(false);

// Process files from companion
inbox.addEventListener("newfile", processInbox);
processInbox();

// Apply the nighttime theme
function applyTheme(night) {
  nighttime = night;
  var colour = night ? config.get("nighttext") : config.get("daytext");

  let texts = document.getElementsByTagName("text");
  texts.forEach(function(entry) {
    entry.style.fill = colour;
  });
  document.getElementById("upperLine").style.fill = colour;
  document.getElementById("bottomLine").style.fill = colour;
}

function processInbox() {
  let filename;

  while ((filename = inbox.nextFile())) {
    //console.log("File received: " + filename);

    if (filename == "config.cbor") {
      config.setConfig(fs.readFileSync("config.cbor", "cbor"));
      big = "";
      updateClock(true);
      if (typeof(hrm) !== "undefined") {
        setHeartrate(hrm.heartRate);
      }
    } else {
      fs.unlinkSync(filename);
    }
  }
}

if (display.aodAvailable) {
  display.aodAllowed = true;
  display.addEventListener("change", () => {
    updateClock(true);
    clock.granularity = display.aodActive ? "minutes" : "seconds";
  });
}

function click(stat) {
  if (config.get("clickable")) {
    big = stat;
    updateClock();
  }
}

updateClock(true);
