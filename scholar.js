
var Request = require("./lib/request.js");
var Cheerio = require("cheerio");

// hl=en      => english language
// as_sdt=1. => articles, exclude patents
// as_vis=1   => exclude citations
function build (query) {
  return "https://scholar.google.com/scholar?as_vis=1&hl=en&as_sdt=1.&" + ((typeof query === "string")
    ? "&q="+encodeURIComponent(query)
    : Object.keys(query).map(function (key) {
        return "&"+key+"="+encodeURIComponent(query[key]).replace(/%20/g, "+")
      }).join(""));
};

function parse (s) { return Number(s.replace(/[^0-9]/g, "")) }

exports.scrape = function (url, headers, callback) {
  var hits = [];
  var start = 0;
  function loop (html) {
    var $ = Cheerio.load(html);
    console.log("#gs_ab_md >> "+$("#gs_ab_md").text());
    if ($("#gs_ab_md").text() === "")
      throw new Error("MAYBE CAPTCHA");
    var count = 0;
    $(".gs_ri").each(function () {
      count++;
      var infos = $(this).children(".gs_a").text().split(/\s*-\s*/g);
      if (infos.length !== 3)
        return process.stderr.write("Could not parse: "+JSON.stringify($(this).text())+"\n");
      var cite = $(this).children(".gs_fl").children("a[href^='/scholar?cites=']");
      hits.push({
        title: $(this).children(".gs_rt").children("a").text(),
        authors: infos[0].split(/\s*,\s*/g),
        venue: infos[1].replace(/\s*,\s*[0-9]{4}$/, ""),
        year: /[0-9]{4}$/.test(infos[1]) ? Number(infos[1].substring(infos[1].length-4)) : null,
        publisher: infos[2],
        cite: {
          url: cite.length ? "https://scholar.google.com"+cite.attr("href") : null,
          count: cite.length ? parse(cite.text()) : 0
        }
      });
    });
    (count < 10) ? callback(hits) : Request(url+"&start="+(start+=10), {}, loop);
  }
  Request(url, {}, loop);
};

(function () {
  function sanitize (string) { return string.replace(/\"/g, " ") }
  function flatten (xss) { return Array.prototype.concat.apply([], xss) }
  function eachtoken (token) { return " author:\""+token+"\"" }
  function eachauthor (author) { flatten(sanitize(author).split(/\s+/g).map(tokenize)).map(eachtoken).join("") }
  exports.match = function (infos) {
    var query = {q:""};
    infos.title && (query.q += "allintitle:\""+sanitize(infos.title)+"\"");
    infos.authors && (query.q += infos.authors.map(eachauthor).join(""));
    infos.year && (query.as_ylo = query.as_yhi = infos.year);
    return build(query);
  };
} ());
