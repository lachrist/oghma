var Request = require("./lib/request.js");

var max = 900;

function build (query) {
  return "http://dblp.dagstuhl.de/search/publ/api?q="+encodeURIComponent(query)+"&format=json&h="+max;
}

exports.scrape = function (url, callback) {
  var hits = [];
  var start = 0;
  function loop (json) {
    json = JSON.parse(json).result;
    if (Number(json.status["@code"]) !== 200)
      throw new Error("Got @code="+json.status["@code"]+" for "+url);
    Array.prototype.push.apply(hits, json.hits.hit || []);
    (Number(json.hits["@sent"]) < max) ? callback(hits) : Request(url+"&f="+(start+=max), loop);
  }
  Request(url, loop);
}

exports.search = function (phrase, venue) {
  return build(venue ? phrase+" venue:"+venue : phrase);
};
