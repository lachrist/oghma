#!/usr/bin/env node

var Fs = require("fs");
var Minimist = require("minimist");
var SeleniumWebdriver = require("selenium-webdriver");
var Firefox = require("selenium-webdriver/firefox");
var Oghma = require("./main.js");
var Db = require("./db.js");

var args = Minimist(process.argv.slice(2));
["nodes", "edges", "recover", "profile", "seminal"].forEach(function (name) {
  args[name] = args[name] || args[name[0]];
});

if (!((args.seminal && args.nodes) || (args.nodes && args.edges && args.recover)))
  throw [
    "Arguments: ",
    "  --nodes   path/to/nodes.json",
    "  --edges   path/to/edges.json",
    "  --recover path/to/recover.swp",
    " [--profile path/to/firefox-profile]",
    " [--seminal \"A paper EXACT title\"]"
  ].join("\n")+"\n";

var driver = args.profile
  ? (new Firefox.Driver(new Firefox.Options().setProfile(new Firefox.Profile(args.profile))))
  : (new SeleniumWebdriver.Builder().forBrowser("firefox").build());

if (args.seminal) {
  Oghma.seminal(driver, args.seminal, Db(args.nodes), function (index) {
    process.stdout.write("Seminal paper: "+JSON.stringify(args.seminal)+" is at position "+index+"\n");
    driver.quit();
  });
} else {
  var nodes = Db(args.nodes);
  var edges = Db(args.edges);
  var loop = function (rest) {
    Fs.truncateSync(args.recover, 0);
    rest
      ? Oghma.explore(driver, nodes, edges, Db(args.recover), loop)
      : driver.quit();
  }
  Oghma.explore(driver, nodes, edges, Db(args.recover), loop);
}
