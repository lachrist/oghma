
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
    if (state !== "complete")
      return setTimeout(module.exports, 500, driver, callback);
    driver.findElements(locators.h1).then(function (elements) {
      for (var i=0; i<elements.length; i++)
        if (elements[i].getText() === "We're sorry...")
          return setTimeout(function () {
            driver.navigate().refresh();
            module.exports(driver, callback);
          }, 60000 + Math.ceil(6000 * Math.random()));
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
    });
  });
};
