
var SeleniumWebdriver = require("selenium-webdriver");
var Firefox = require("selenium-webdriver/firefox");

var Scholar = require("./scholar.js");

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

module.exports = function (profile, delay) {
  var inner = create(profile);
  var interface = {};
  methods.forEach(function (name) {
    interface[name] = function () {
      return inner[name].apply(inner, arguments);
    };
  });
  interface.reinit = function (callback) {
    inner.getCurrentUrl().then(function (url) {
      inner.quit();
      inner = create(profile);
      inner.get(url).then(callback);
    });
  }
  interface.get = function (url) {
    process.stdout.write("Get "+url+"\n");
    return inner.get(url);
  };
  interface.scholar = Scholar(interface, delay);
  return interface;
};
