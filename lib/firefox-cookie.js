
var Sqlite3 = require("sqlite3");

module.exports = function (path, callback) {
  var cookies = new Sqlite3.Database(path, Sqlite3.OPEN_READONLY, function (error) {
    callback(error, error || function (host, callback) {
      cookies.get("SELECT * FROM moz_cookies WHERE host = '"+host+"';", function (error, rows) {
        if (error)
          throw error;
        callback(row && row.value);
      });
    });
  });
};
