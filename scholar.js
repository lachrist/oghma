
// https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs
// http://seleniumhq.github.io/selenium/docs/api/javascript/
// https://github.com/SeleniumHQ/selenium/tree/master/javascript/node/selenium-webdriver/lib
// https://github.com/SeleniumHQ/selenium/tree/master/javascript/node/selenium-webdriver/example

var SeleniumWebdriver = require("selenium-webdriver");
var Onload = require("./onload.js");

var locators = {
  next: SeleniumWebdriver.By.css("#gs_n .gs_ico_nav_next"), // "#gs_n .gs_ico_nav_next, #gs_nm .gs_wr"
  title: SeleniumWebdriver.By.css(".gs_rt a"),
  info: SeleniumWebdriver.By.css(".gs_a"),
  cite: SeleniumWebdriver.By.css(".gs_fl a[href^='/scholar?cites=']")
};

function extract (hit, callback) {
  var error = null;
  var object = {cite:{}};
  hit.findElements(locators.title).then(function (titles) {
    if (titles.length === 0)
      return error = "empty title";
    if (titles.length > 1)
      throw new Error("Multiple title???");
    titles[0].getText().then(function (text) { object.title = text });
  });
  hit.findElement(locators.info).getText().then(function (text) {
    var infos = text.split(/\s+-\s+/g);
    if (infos.length !== 2 && infos.length !== 3)
      return error = "cannot parse "+text;
    object.authors = infos[0].split(/,\s+/g);
    if (infos.length === 2)
      return object.publisher = infos[1];
    var parts = /(.*), ([0-9]{4})$/.exec(infos[1]);
    if (parts) {
      object.venue = parts[1];
      object.year = Number(parts[2]);
    } else {
      object.venue = infos[1];
    }
    object.publisher = infos[2];
  });
  hit.findElements(locators.cite).then(function (cites) {
    if (cites.length === 0) {
      object.cite.count = 0;
      return callback(error, object);
    }
    if (cites.length > 1)
      throw new Error("Mutiple cite???");
    cites[0].getText().then(function (text) {
      object.cite.count = Number(text.replace(/[^0-9]/g, ""));
    });
    cites[0].getAttribute("href").then(function (href) {
      object.cite.url = "https://scholar.google.com"+href;
      callback(error, object);
    });
  });
}

module.exports = function (driver, onhit, callback) {
  function loop () {
    driver.sleep(5000 + Math.ceil(5000 * Math.random()));
    Onload(driver, function (hits) {
      if (!hits.length)
        return callback();
      hits.forEach(function (hit, index) {
        extract(hit, function (error, object) {
          if (error)
            driver.getCurrentUrl().then(function (url) { process.stderr.write(url+" ["+index+"] >> "+error+"\n") });
          else
            onhit(object);
          (index === hits.length-1) && driver.findElements(locators.next).then(function (nexts) {
            if (nexts.length === 0)
              return callback();
            if (nexts.length > 1)
              throw new Error("Multiple next button???");
            nexts[0].click();
            loop();
          });
        });
      });
    });
  }
  loop();
};
