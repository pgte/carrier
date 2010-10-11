var net     = require('net'),
    assert  = require('assert'),
    carrier = require('../lib/carrier.js');

var server;
var port = 4001;
var to_be_sents = ["Hel", "lo ", "Wor", "ld"]
var expected = to_be_sents.join('');

exports.run = function(next) {

  server = net.createServer(function(conn) {
    carrier.carry(conn, function(line) {
      assert.equal(line, expected);
      next();
    });
  });
  server.listen(port);;

  var client = net.createConnection(port);
  client.on('connect', function() {
    to_be_sents.forEach(function(to_be_sent) {
      client.write(to_be_sent);
      client.flush();
    })
    client.end();
  });
}

exports.teardown = function() {
  server.close();
}