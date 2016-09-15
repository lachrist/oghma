
module.exports = function (context) {
  return function (error) {
    process.stderr.write(context+": "+error+"\n");
  }
};
