
// /Applications/Firefox.app/Contents/MacOS/firefox-bin --ProfileManager
// "/Users/soft/Library/Application\ Support/Firefox/Profiles/XXXX.ProfileName/"
// node bin.js --nodes test/nodes.json --edges test/edges.json --recover test/recover.swp --profile /Users/soft/Library/Application\ Support/Firefox/Profiles/ucc1d6jf.ScholarScraper/ --seminal "Prevalence and Maintenance of Automated Functional Tests for Web Applications"

var Readline = require("readline");

var Db = require("./db.js");
var Driver = require("./driver");
var Register = require("./register.js");

function seminal (options) {
  function done (hit) {
    if (hit)
      process.stdout.write(hit.title+" added at line "+Register(options.nodes)(hit)+"\n");
    else
      process.stderr.write("Could not find such paper...\n");
    seminal(options);
  }
  options.readline.question("Enter an EXACT influencal paper's title [empty line to stop]...\n", function (title) {
    if (!title) {
      options.nodes.insert(null);
      options.readline.close();
      return options.driver.quit();
    }
    var hits = [];
    options.driver.get("https://scholar.google.com/scholar?as_vis=1&q=allintitle:+%22"+title.replace(/\s/g, "+")+"%22&hl=en&as_sdt=1,5");
    options.driver.scholar(function (error, hit) {
      error || hits.push(hit);
      return true;
    }, function () {
      if (hits.length < 2)
        return done(hits[0]);
      options.readline.question("Which one did you mean [0-based index]?\n"+JSON.stringify(hits, null, 2)+"\n", function (index) {
        done(hits[index]);
      });
    });
  });
}

function explore (options) {
  var node = options.nodes[options.edges.length];
  if (node === null) {
    options.edges.insert(null);
    (options.edges.length < options.nodes.length) && options.nodes.insert(null);
    process.stdout.write("The current breadth is completely explored.\n");
    options.readline.close();
    return options.driver.quit();
  }
  if (!node.cite.url) {
    options.edges.insert([]);
    return explore(options);
  }
  var hits = [];
  options.driver.get(options.nodes[options.edges.length].cite.url);
  options.driver.scholar(function (error, hit) {
    if (error) {
      process.stderr.write(error+"\n");
      return true;
    }
    if (hit.cite.count < options.cite)
      return false;
    hits.push(hit);
    return hits.length < options.limit;
  }, function () {
    options.edges.insert(hits.map(Register(options.nodes)));
    explore(options);
  });
}

module.exports = function (options) {
  options.nodes = Db(options.nodes);
  options.edges = Db(options.edges);
  if (options.nodes.length && options.edges.length === options.nodes.length)
    return process.stdout.write("Oghma reached a fixpoint, the citation graph is complete!");
  options.readline = Readline.createInterface({input:process.stdin, output:process.stdout});
  options.driver = Driver(options.profile, options.delay);
  (options.nodes.length?explore:seminal)(options);
};
