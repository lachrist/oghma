
var Locators = require("./locators.js");

module.exports = function (hit, callback) {
  var error = null;
  var object = {cite:{}};
  hit.findElements(Locators.title).then(function (titles) {
    if (titles.length === 0)
      return error = "empty title";
    if (titles.length > 1)
      throw new Error("Multiple title???");
    titles[0].getText().then(function (text) { object.title = text });
  });
  hit.findElement(Locators.info).getText().then(function (text) {
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
  hit.findElements(Locators.pdf).then(function (pdfs) {
    if (pdfs.length === 0)
      return;
    if (pdfs.length > 1)
      throw new Error("Multiple pdf???");
    pdfs[0].getAttribute("href").then(function (href) {
      object.pdf = href;
    });
  });
  hit.findElements(Locators.cite).then(function (cites) {
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
