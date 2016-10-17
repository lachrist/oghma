
var SeleniumWebdriver = require("selenium-webdriver");
var NodeNotifier = require("node-notifier");
var Readline = require("readline");

var locators = {
  h1: SeleniumWebdriver.By.css("h1"),
  results: SeleniumWebdriver.By.css("#gs_ccl_results"),
  hit: SeleniumWebdriver.By.css(".gs_ri"),
  captcha: SeleniumWebdriver.By.css("#gs_captcha_ccl, #captcha")
}

module.exports = function (driver, callback) {
  driver.executeScript("return document.readyState;").then(function (state) {
    if (state === "complete")
      return sorry(driver, callback);
    setTimeout(module.exports, 500, driver, callback);
  });
};

function sorry (driver, callback) {
  driver.getTitle().then(function (title) {
    if (title !== "Sorry...")
      return captcha(driver, callback);
    var sleep = Math.ceil(2 * 60 * 1000 * (1 + Math.random()));
    process.stderr.write("Too many requests, Oghma will sleep for "+sleep+"[ms]...\n");
    setTimeout(function () {
      driver.reinit(function () {
        module.exports(driver, callback)
      });
    }, sleep);
  });
}

function captcha (driver, callback) {
  sleep = 0;
  driver.findElements(locators.captcha).then(function (captchas) {
    if (captchas.length === 0)
      return driver.findElement(locators.results).then(function (results) {
        results.findElements(locators.hit).then(callback);
      });
    NodeNotifier.notify({
      title: "Oghma",
      message: "Please show you're not a robot",
      icon: __dirname+"/oghma.png"
    });
    var readline = Readline.createInterface({input:process.stdin, output:process.stdout});
    return readline.question("Resolve the captcha and press <enter> when done...", function () {
      readline.close();
      module.exports(driver, callback);
    });
  });
}
