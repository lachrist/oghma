
// Streams do not flushed themselves on process.end so I used synchronized write.
// https://github.com/nodejs/readable-stream/issues/118

var Fs = require("fs");

function strip (xs) {
  xs.pop()
  return xs;
}

module.exports = function (path) {
  try {
    var xs = Fs.readFileSync(path, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT")
      throw error;
    xs = "";
  }
  var fd = Fs.openSync(path, "a");
  xs = strip(xs.split("\n")).map(JSON.parse);
  xs.insert = function (x) {
    Fs.writeSync(fd, JSON.stringify(x)+"\n", "utf8");
    return xs.push(x) - 1;
  }
  xs.close = function () {
    Fs.closeSync(fd);
  }
  return xs;
};
