
var Locators = require("./locators.js");
var NodeNotifier = require("node-notifier");

module.exports = function (driver, delay, callback) {
  function load () {
    driver.executeScript("return document.readyState;").then(function (state) {
      if (state !== "complete")
        return setTimeout(load, 500);
      driver.getTitle().then(function (title) {
        if (title === "Sorry...") {
          driver.getCurrentUrl().then(function (url) {
            var sleep = Math.ceil(2 * 60 * 1000 * (1 + Math.random()));
            process.stderr.write("Too many requests, Oghma will sleep for "+sleep+"[ms]...\n");
            setTimeout(function () { driver.reinit(load) }, sleep);
          });
        } else {
          driver.findElements(Locators.captcha).then(function (captchas) {
            if (captchas.length) {
              NodeNotifier.notify({
                title: "Oghma",
                message: "Please show you're not a robot",
                icon: __dirname+"/../oghma.png"
              });
              setTimeout(load, 60 * 1000);
            } else {
              driver.findElement(Locators.results).then(function (results) {
                results.findElements(Locators.hit).then(callback);
              });
            }
          });
        }
      });
    });
  }
  setTimeout(load, Math.ceil(delay * (1 + Math.random())));
};
