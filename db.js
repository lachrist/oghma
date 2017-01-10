
// Streams do not flushed themselves on process.end so I used synchronized write.
// https://github.com/nodejs/readable-stream/issues/118

var Fs = require("fs");

function notempty (line) { return line !== "" }

module.exports = function (path) {
  try {
    var xs = Fs.readFileSync(path, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT")
      throw error;
    xs = "";
  }
  var fd = Fs.openSync(path, "a");
  xs = xs.split("\n").filter(notempty).map(JSON.parse);
  xs.insert = function (x) {
    Fs.writeSync(fd, JSON.stringify(x)+"\n", "utf8");
    return xs.push(x) - 1;
  }
  return xs;
};
