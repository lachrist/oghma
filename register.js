
var collator = new Intl.Collator("en", {sensitivity:"base", ignorePunctuation:true});

function same (n1, n2) {
  return (n1.cite.url === undefined && n2.cite.url === undefined)
    ? collator.compare(n1.title, n2.title) === 0
    : n1.cite.url === n2.cite.url;
}

module.exports = function (nodes) {
  return function (node) {
    for (var i=0, l=nodes.length; i<l; i++)
      if (nodes[i] && same(nodes[i], node))
        return i;
    return nodes.insert(node);
  };
};
