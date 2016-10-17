
var SeleniumWebdriver = require("selenium-webdriver");
var Firefox = require("selenium-webdriver/firefox");

var methods = [
  "actions",
  "call",
  "close",
  "controlFlow",
  "executeAsyncScript",
  "executeScript",
  "findElement",
  "findElements",
  "get",
  "getAllWindowHandles",
  "getCapabilities",
  "getCurrentUrl",
  "getExecutor",
  "getPageSource",
  "getSession",
  "getTitle",
  "getWindowHandle",
  "manage",
  "navigate",
  "quit",
  "schedule",
  "setFileDetector",
  "sleep",
  "switchTo",
  "takeScreenshot",
  "touchActions",
  "wait"
];

function create (profile) {
  return profile
    ? (new Firefox.Driver(new Firefox.Options().setProfile(new Firefox.Profile(profile))))
    : (new SeleniumWebdriver.Builder().forBrowser("firefox").build());
}

module.exports = function (profile) {
  var inner = create(profile);
  var interface = {};
  methods.forEach(function (name) {
    interface[name] = function () {
      return inner[name].apply(inner, arguments);
    };
  });
  interface.reinit = function (callback) {
    inner.getCurrentUrl().then(function (url) {
      inner = create(profile);
      inner.get(url);
      callback();
    });
  };
  return interface;
}
