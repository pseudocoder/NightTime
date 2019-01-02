import clock from "clock";
import document from "document";
import userActivity from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { locale } from "user-settings";
import { preferences } from "user-settings";
import { battery } from "power";
import { me as device } from "device";
import * as messaging from "messaging";

import * as util from "../common/utils";
import * as config from "../common/config";

var nighttime = null;
var lasttime = null;

const clockPref = preferences.clockDisplay;
var lastValueTimestamp = Date.now();

if (!device.screen) device.screen = { width: 348, height: 250 };

config.loadConfig();

// Update the heartrate part of the clock...
var hrm = new HeartRateSensor();
var HRtext = document.getElementById("HRtext");
var animate = document.getElementById("animation");

hrm.onreading = function () { setHeartrate(hrm.heartRate); lastValueTimestamp = Date.now(); }

function setHeartrate(heartRate) {
  HRtext.text = (heartRate > 0) ? heartRate : "--";
  
  if (heartRate > 0 && config.get("beat")) {
    animate.to = 0.5;
    animate.dur = 60 / heartRate;
  }
  else {
    animate.to = 1;
  }
}

hrm.start();

// Update all the parts of the clock

function updateClock(force) {
  let lang = locale.language;
  
  let now = new Date();
  let nowhour = now.getHours();
  let hours = util.formatHour(nowhour, clockPref);
  let mins = util.zeroPad(now.getMinutes());

  // Only update time if it's changed
  if (hours + mins != lasttime || force) {
    lasttime = hours + mins;
    
    let day = util.zeroPad(now.getDate());
    let wday = now.getDay();
    let month = util.zeroPad(now.getMonth()+1);
    let year = now.getFullYear();
    let prefix = lang.substring(0, 2);

    if ( typeof util.weekday[prefix] === 'undefined' ) {
      prefix = 'en';
    }

    let datestring = config.get("datefmt").replace("dd", day).replace("mm", month).replace("yyyy", year);

    document.getElementById("myTime").text = `${hours}:${mins}`; 
    document.getElementById("myDate").text = `${util.weekday[prefix][wday]}  ${datestring}`;

    let bat = Math.floor(battery.chargeLevel);

    document.getElementById("battery").text = bat + "%";

    let batpct = document.getElementById("batpct");
    batpct.style.fill = (bat < 17 ? "#f81373" : (bat < 31 ? "#ffb230" : "#2adf2a"));
    batpct.y = 291 - bat / 4;
    batpct.height = bat / 4;
  }
  
  if ( (Date.now() - lastValueTimestamp)/1000 > 5 ) {
    setHeartrate(0);
  }
  
  setControl(userActivity.today.adjusted["steps"] || 0, userActivity.goals.steps, "steps");
  setControl(userActivity.today.adjusted["calories"] || 0, userActivity.goals.calories, "cals");
  setControl(userActivity.today.adjusted["activeMinutes"] || 0, userActivity.goals.activeMinutes, "mins");
  setControl(userActivity.today.adjusted["elevationGain"] || 0, userActivity.goals.elevationGain, "stairs");

  let night = util.hourBetween(nowhour, config.get("start"), config.get("end"));

  if (night != nighttime) {
    applyTheme(night);
  }
}

function setControl(val, goal, ctrl) {
  document.getElementById(ctrl + "Text").text = val;
  let ring = document.getElementById(ctrl + "Ring");
  ring.sweepAngle = Math.min(Math.floor(360*(val/goal)), 360);
  ring.arcWidth = (val >= goal ? 5 : 2);
}

// Update the clock every second
clock.granularity = "seconds";
clock.ontick = () => updateClock(false);

// Don't start with a blank screen
updateClock(true);

// Apply the nighttime theme
function applyTheme(night) {
  nighttime = night;
  var colour = (night ? "#c05020" : "#f8f8f8");
  
  let texts = document.getElementsByTagName("text");
  texts.forEach(function(entry) { entry.style.fill = colour; });
  document.getElementById("upperLine").style.fill = colour;
  document.getElementById("bottomLine").style.fill = colour;
  
  document.getElementById("dimmer").style.visibility = (night ? "visible" : "hidden");
  document.getElementById("dimmer2").style.visibility = (night ? "visible" : "hidden");
  document.getElementById("dimmer3").style.visibility = (night ? "visible" : "hidden");
}

messaging.peerSocket.onmessage = function(evt) {
  console.log("Device got: " + evt.data);
  
  let msg = JSON.parse(evt.data);
  
  config.set(msg.key, msg.value);

  updateClock(true);
}
