
var collator = new Intl.Collator("en", {sensitivity:"base", ignorePunctuation:true});

module.exports = function (n1, n2) {
  return (n1.cite.url === undefined && n2.cite.url === undefined)
    ? collator.compare(n1.title, n2.title) === 0
    : n1.cite.url === n2.cite.url;
};

// var ReadlineSync = require("readline-sync");
//   if (n1.cite.url && n1.cite.url === n2.cite.url)
//     return true;
//   if (!n1.cite.url && collator.compare(n1.title, n2.title) === 0)
//     return true;
//   return (n1.year === n2.year && n1.title === n2.title && n1.cite.url === n2.cite.url)
//       || (   collator.compare(n1.title, n2.title) === 0
//           && ReadlineSync.question("Are these two the same [y/n]? "+JSON.stringify([n1, n2], null, 2)) === "y");
// };
