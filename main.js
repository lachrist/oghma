
// /Applications/Firefox.app/Contents/MacOS/firefox-bin --ProfileManager
// "/Users/soft/Library/Application\ Support/Firefox/Profiles/XXXX.ProfileName/"
// node bin.js --nodes test/nodes.json --edges test/edges.json --recover test/recover.swp --profile /Users/soft/Library/Application\ Support/Firefox/Profiles/ucc1d6jf.ScholarScraper/ --seminal "Prevalence and Maintenance of Automated Functional Tests for Web Applications"

var Scholar = require("./scholar.js");
var Same = require("./same.js");
var Readline = require("readline");

function register (nodes, node) {
  for (var i=0, l=nodes.length; i<l; i++)
    if (Same(nodes[i], node))
      return i;
  return nodes.insert(node);
}

exports.seminal = function (driver, title, nodes, callback) {
  var hits = [];
  driver.get("https://scholar.google.com/scholar?as_vis=1&q=allintitle:+%22"+title.replace(/\s/g, "+")+"%22&hl=en&as_sdt=1,5");
  Scholar(driver, function (hit) { hits.push(hit) }, function () {
    if (hits.length === 0) {
      process.stderr.write("Got no match for: "+JSON.stringify(title)+"\n");
      return callback();
    }
    if (hits.length === 1)
      return callback(register(nodes, hits[0]));
    var readline = Readline.createInterface({input:process.stdin, output:process.stdout});
    readline.question("Which one did you mean [0-based index]?\n"+JSON.stringify(hits, null, 2)+"\n", function (index) {
      readline.close();
      callback(register(nodes, hits[index]));
    });
  });
};

exports.explore = function (driver, nodes, edges, recover, callback) {
  if (nodes.length === edges.length)
    return callback(0);
  if (!nodes[edges.length].cite.url) {
    edges.insert([]);
    return callback(nodes.length - edges.length);
  }
  driver.get(nodes[edges.length].cite.url+"&start="+recover.length);
  Scholar(driver, function (hit) { recover.insert(register(nodes, hit)) }, function () {
    recover.close();
    edges.insert(recover);
    callback(nodes.length - edges.length);
  });
};
