var Scholar = require("./scholar.js");
var Db = require("./lib/db.js");
var ReadlineSync = require("readline-sync");

module.exports = function (nodes, edges, headers) {
  var nodes = Db(nodes);
  var edges = Db(edges);
  var collator = new Intl.Collator("en", {sensitivity:"base", ignorePunctuation:true});
  function register (node) {
    for (var i=0, l=nodes.length; i<l; i++) {
      if (node.year === nodes[i].year && node.title === nodes[i].title && node.cite.url === nodes[i].cite.url)
        return i;
      if (collator.compare(node.title, nodes[i].title) === 0) {
        if (ReadlineSync.question("Are these two the same [y/n]? "+JSON.stringify([node, nodes[i]], null, 2)) === "y")
          return i;
      }
    }
    return nodes.insert(node);
  }
  return {
    explore: function (callback) {
      if (nodes.length === edges.length)
        return callback(0)
      if (!nodes[edges.length].cite.url) {
        edges.insert([]);
        return callback(nodes.length - edges.length);
      }
      Scholar.scrape(nodes[edges.length].cite.url, headers, function (hits) {
        edges.insert(hits.map(register));
        callback(nodes.length - edges.length)
      });
    },
    seminal: function (infos, callback) {
      var url = Scholar.match(infos);
      Scholar.scrape(url, headers, function (hits) {
        if (hits.length !== 1)
          throw new Error("Got "+hits.length+" for "+url);
        callback(register(hits[0]));
      });
    }
  };
};
