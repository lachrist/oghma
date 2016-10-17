
var SeleniumWebdriver = require("selenium-webdriver");
var Firefox = require("selenium-webdriver/firefox");
var NodeNotifier = require("node-notifier");
var Readline = require("readline");

var methods = [
  "actions",
  "call",
  "close",
  "controlFlow",
  "executeAsyncScript",
  "executeScript",
  "findElement",
  "findElements",
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

var locators = {
  h1: SeleniumWebdriver.By.css("h1"),
  results: SeleniumWebdriver.By.css("#gs_ccl_results"),
  hit: SeleniumWebdriver.By.css(".gs_ri"),
  captcha: SeleniumWebdriver.By.css("#gs_captcha_ccl, #captcha")
}

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
  interface.search = function (url, callback) {
    function load () {
      inner.get(url).then(function () {
        inner.getTitle().then(function (title) {
          if (title === "Sorry...") {
            inner.quit();
            var sleep = Math.ceil(2 * 60 * 1000 * (1 + Math.random()));
            process.stderr.write("Too many requests, Oghma will sleep for "+sleep+"[ms]...\n");
            setTimeout(function () {
              inner = create(profile);
              load();
            }, sleep);
          } else {
            inner.findElements(locators.captcha).then(function (captchas) {
              if (captchas.length) {
                NodeNotifier.notify({
                  title: "Oghma",
                  message: "Please show you're not a robot",
                  icon: __dirname+"/oghma.png"
                });
                var readline = Readline.createInterface({input:process.stdin, output:process.stdout});
                return readline.question("Resolve the captcha and press <enter> when done...", function () {
                  readline.close();
                  load();
                });
              } else {
                inner.findElement(locators.results).then(function (results) {
                  results.findElements(locators.hit).then(callback);
                });
              }
            });
          }
        });
      });
    }
    setTimeout(load, Math.ceil(delay * (1 + Math.random())))
  };
  return interface;
}
