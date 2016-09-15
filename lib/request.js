
var Url = require("url");
var Http = require("http");
var Https = require("https");

var queues = Object.create(null);
var pause = true;
function flush () {
  var first;
  for (var key in queues)
    (first = queues[key].shift())
      ? first()
      : (delete queues[key]);
  Object.keys(queues).length
    ? setTimeout(flush, Math.floor(1000*(1+2*Math.random())))
    : (pause = true);
}

module.exports = function (url, headers, callback) {
  var options = Url.parse(url);
  options.headers = headers;
  var req = (options.protocol === "https:" ? Https : Http).request(options);
  req.on("response", function (res) {
    var buffer = [];
    res.on("data", function (chunk) { buffer.push(chunk) })
    res.on("end", function () {
      if (Number(res.statusCode) !== 200)
        throw new Error("Got "+res.statusCode+" for "+url);
      callback(buffer.join(""));
    });
  });
  (queues[options.hostname] || (queues[options.hostname] = [])).push(function () {
    process.stderr.write(url+"\n");
    req.end();
  });
  if (pause) {
    pause = false;
    flush();
  }
};
