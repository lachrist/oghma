
var Onload = require("./onload.js");
var Extract = require("./extract.js");
var Locators = require("./locators.js");

module.exports = function (driver, delay) {
  return function (onhit, callback) {
    function onhits (hits) {
      function loop (index) {
        if (index === hits.length) {
          driver.findElements(Locators.next).then(function (nexts) {
            if (nexts.length === 0)
              return callback();
            if (nexts.length > 1)
              throw new Error("Multiple next buttons???");
            nexts[0].click().then(function () {
              driver.getCurrentUrl().then(function (url) { 
                process.stdout.write("Next "+url+"\n");
              });
              Onload(driver, delay, onhits);
            });
          });
        } else {
          Extract(hits[index], function (error, object) {
            onhit(error, object) ? loop(index+1) : callback();
          });
        }
      }
      loop(0);
    }
    Onload(driver, delay, onhits);
  };
};