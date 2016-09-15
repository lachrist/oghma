
var Fs = require("fs");

function strip (xs) {
  xs.pop()
  return xs;
}

module.exports = function (path) {
  var xs = strip(Fs.readFileSync(path, "utf8").split("\n")).map(JSON.parse);
  var stream = Fs.createWriteStream(path, {defaultEncoding:"utf8", flags:"a"});
  xs.insert = function (x) {
    stream.write(JSON.stringify(x)+"\n");
    return xs.push(x) - 1;
  }
  return xs;
}
