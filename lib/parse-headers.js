
module.exports = function (lines) {
  var headers = {};
  lines.split("\n").forEach(function (line) {
    var split = line.indexOf(":");
    headers[line.substring(0, split)] = line.substring(split+2);
  });
  return headers;
}
