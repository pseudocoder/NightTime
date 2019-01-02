import clock from "clock";
import document from "document";
import userActivity from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { locale } from "user-settings";
import { preferences } from "user-settings";
import { me as device } from "device";

import * as util from "../common/utils";

var nighttime = false;

clock.granularity = "seconds";

const clockPref = preferences.clockDisplay;
let lastValueTimestamp = Date.now();

if (!device.screen) device.screen = { width: 348, height: 250 };

// Get a handle on the <text> element

function updateStats() {
  setControl(userActivity.today.adjusted["steps"] || 0, userActivity.goals.steps, "steps");
  setControl(userActivity.today.adjusted["calories"] || 0, userActivity.goals.calories, "cals");
  setControl(userActivity.today.adjusted["activeMinutes"] || 0, userActivity.goals.activeMinutes, "mins");
  setControl(userActivity.today.adjusted["elevationGain"] || 0, userActivity.goals.elevationGain, "stairs");
}

function setControl(val, goal, ctrl) {
  document.getElementById(ctrl + "Text").text = val;
  let ring = document.getElementById(ctrl + "Ring");
  ring.sweepAngle = Math.min(Math.floor(360*(val/goal)), 360);
  ring.arcWidth = (val >= goal ? 5 : 2);
}

var hrm = new HeartRateSensor();

hrm.onreading = function () {
  document.getElementById("myHR").text = ( hrm.heartRate > 0 ) ? hrm.heartRate : "--";
  lastValueTimestamp = Date.now();
}
hrm.start();

// Update the <text> element with the current time
function updateClock() {
  let lang = locale.language;

  let today = new Date();
  let nowhour = today.getHours();

  let day = util.zeroPad(today.getDate());
  let wday = today.getDay();
  let month = util.zeroPad(today.getMonth()+1);
  let year = today.getFullYear();
  let hours = util.zeroPad(util.formatHour(nowhour, clockPref));
  let mins = util.zeroPad(today.getMinutes());
  let prefix = lang.substring(0, 2);

  if ( typeof util.weekday[prefix] === 'undefined' ) {
    prefix = 'en';
  }

  let divide = ".";

  if ( prefix == "nl" || prefix == "ko") {
    divide = "-"
  }
  
  let datestring = day + divide + month + divide + year;

  document.getElementById("myTime").text = `${hours}:${mins}`; 
  document.getElementById("myDate").text = `${util.weekday[prefix][wday]}  ${datestring}`;
  updateStats();

  if ( (Date.now() - lastValueTimestamp)/1000 > 5 ) {
    document.getElementById("myHR").text = "--";
  }
  
  let night = (nowhour >= 23 || nowhour < 7);
  if (night != nighttime) {
    applyTheme(night);
  }
}

// Update the clock every tick event
clock.ontick = () => updateClock();

// Don't start with a blank screen
updateClock();

function applyTheme(night) {
  nighttime = night;
  var colour = (night ? "#c05020" : "#f8f8f8");
  
  let texts = document.getElementsByTagName("text");
  texts.forEach(function(entry) { entry.style.fill = colour; });
  document.getElementById("upperLine").style.fill = colour;
  document.getElementById("bottomLine").style.fill = colour;
  
  document.getElementById("dimmer").style.visibility = (night ? "visible" : "hidden");
}