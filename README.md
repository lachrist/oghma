# Oghma <img src="oghma.png" align="right" alt="oghma-logo" title="Oghma"/>

Oghma is a command-line tool for scraping a citation graph from [google-scholar](https://scholar.google.com/) starting from some seminal works.
[google-scholar](https://scholar.google.com/) will prompt a captcha from time to time even though Oghma uses Selenium and only launch requests every 5 to 10 seconds.
In which case a notification will pop-up; once you resolved the capcha, you can press enter in the terminal to resume the scraping.
Using a Firefox profile can help to remain undercover; being logged in a gmail account in this profile is even better.

The format used by Oghma to store persistant data are JSON objects with trailing newlines.
Therefore the following function can be used to parse Oghma's files:

```js
function read (path) {
  var lines = require("fs").readFileSync(path, "utf8").split("\n");
  lines.pop(); // remove the last empty line
  return lines.map(JSON.parse);
}
```

Oghma works with 3 files:
  1. `--nodes`: nodes of the citation graph.
  2. `--edges`: edges of the citation graph.
     Each line of this file is a list of integer which should be understood as the index of the nodes that are citing the node at the current line:

     ```js
     var nodes = read("/path/to/nodes.json");
     var edges = read("/path/to/edges.json");
     function nodeAt (index) { return nodes[index] }
     for (var i=0; i<edges.length; i++)
       nodes[i].citedBy = edges[i].map(nodeAt);
     ```

  3. `--recover`: data for resuming the scraping when it has been interrupted in any way.

## Add a seminal work

Add a new node if it does not already exists:

```
oghma --seminal "An exact paper's title" --nodes path/to/nodes.json [--profile path/to/firefox-profile]
```

## Scrape the citation graph

The scrapping process continues as long as the edge file contains less lines than than the node file.
Oghma picks the first unscrapped node and start scrapping its citers.
During this process new lines are added to the node file.
Because of the very slow rate of request this process may take a very long time.
This motivates why Oghma can be interupted safely at any time and resumed later with the same command.

```
oghma --nodes path/to/nodes.json --edges path/to/edges.json --recover path/to/recover.json [--profile path/to/firefox-profile]
```
