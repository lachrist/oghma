#!/usr/bin/env node

var Minimist = require("minimist");
var Oghma = require("./main.js");

var args = Minimist(process.argv.slice(2));

if (!args.nodes || !args.edges) {
  process.stderr.write([
    "Arguments: ",
    "  --nodes   path/to/nodes.json",
    "  --edges   path/to/edges.json",
    " [--delay   5000]",
    " [--limit   1000]",
    " [--cite    0]",
    " [--profile path/to/firefox-profile]"
  ].join("\n")+"\n");
  process.exit(1);
}

args.delay = Number(args.delay || 5000);
args.cite = Number(args.cite || 0);
args.limit = Number(args.limit || 1000);

Oghma(args);
