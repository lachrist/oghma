#!/usr/bin/env node

var Minimist = require("minimist");
var args = Minimist(process.argv.slice(2));
var Scholar = require("./scholar.js");
var Corpus = require("./main.js");
var ParseHeaders = require("./lib/parse-headers.js");

var args = Minimist(process.argv.slice(2));
["edges", "nodes", "headers"].forEach(function (name) {
  args[name] = args[name] || args[name[0]];
});

var corpus = Corpus(args.edges, args.nodes, args.headers ? ParseHeaders(Fs.readFileSync(args.headers)) : {});

function loop (rest) {
  console.log("Rest: "+rest);
  if (rest)
   corpus.explore(loop);
}

corpus.seminal({
  title: "Prevalence and maintenance of automated functional tests for web applications",
  year: 2014
}, function (index) {
  console.log("Seminal index: "+index);
  loop(1);
});
