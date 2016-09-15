
// text:test AND title:title AND abstract:abstract AND author:author_name AND affil:author_affiliation AND venue:publication_venue AND keyword:keywords AND ncites:[666 TO 15000] AND year:[1 TO 999]

var Http = require("http");

function isrange (x) {
  return Array.isArray(x)
      && x.length === 2
      && typeof x[0] === "number"
      && typeof x[1] === "number";
}

// cite date ascdate recent
function search (query, sort, max) {
  var url = "http://citeseerx.ist.psu.edu/search?t=doc&q="+encodeURIComponent(Object.keys(query).map(function (key) {
    if (typeof query[key] === "string")
      return key+":"+JSON.stringify(query[key]);
    if (isrange(query[key]))
      return key+":["+query[key][0]+" TO "+query[key][1]+"]"
    throw new Error("Unknown format for "+key+": "+query[key]);
  }).join(" AND "))+(sort?"&sort="+sort:"");
  var hits = [];
  request(url, function () {});
  Http.request(url);
  
  
};



function request (url, callback) {
  var req = Http.request(url);
  req.on("response", function (res) {
    var buffer;
    res.on("data", function (chunk) { buffer.push(chunk) })
    res.on("end", function () {
      callback(res.statusCode, buffer.join(""));
    });
  });
  req.end();
};






/// GRAVEYARD 2

search("\"symbolic execution and dynamic analysis\"", function (hits) { console.log(JSON.stringify(hits, null, 2)) });

function main (queries, callback) {
  var results = {};
  function loop (index) {
    if (index === queries.length)
      return callback(results);
    run(queries[index], 0, [], function (hits) {
      process.stderr.write("Done "+(index+1)+"/"+queries.length+": "+queries[index]+" >> "+hits.length+"\n");
      results[queries[index]] = {};
      for (var i=0; i<hits.length; i++)
        results[queries[index]][hits[i]["@id"]] = hits[i].info;
      setTimeout(loop, 500, index+1);
    });
  }
  loop(0);
}

var size = 900;
function run (query, page, hits, callback) {
  var url = "http://dblp.dagstuhl.de/search/publ/api?"+[
    "format=json",
    "q="+encodeURIComponent(query),
    "f="+(page*size),
    "h="+size
  ].join("&");
  Request(url, function (content) {
    content = JSON.parse(content).result;
    if (Number(content.status["@code"]) !== 200)
      throw new Error("Got @code="+content.status["@code"]+" for "+url);
    hits = hits.concat(content.hits.hit || []);
    (Number(content.hits["@sent"]) === size)
      ? run(query, page+1, hits, callback);
      : callback(hits);
  });
}

(function () {
  var conferences = [
    // "ICSE",
    // "ESEC/FSE",
    // "FASE",
    // "ASE",
    // "ICSM",
    // "WCRE",
    // "IWPC/ICPC",
    // "CSMR",
    "SCAM"
  ];
  var searches = [
    // "dynamic.analys",
    // "concolic.test",
    // "taint.analys",
    // "shadow.exec",
    "symbolic.exec"
  ];
  var queries = searches.map(function (s) { return s+" type:Journal_Articles:" });
  for (var c=0; c<conferences.length; c++)
    for (var s=0; s<searches.length; s++)
      queries.push(searches[s]+" venue:"+conferences[c]);
  main(queries, function (results) {
    process.stdout.write(JSON.stringify(results, null, 2));
  });
} ());

