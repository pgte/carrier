var net     = require('net'),
    assert  = require('assert'),
    carrier = require('../lib/carrier.js');

var server;
var port = 4001;
var expected_line = "Hello World"

exports.run = function(next) {

  server = net.createServer(function(conn) {
    carrier.carry(conn, function(line) {
      assert.equal(line, expected_line);
      next();
    });
  });
  server.listen(port);;

  var client = net.createConnection(port);
  client.on('connect', function() {
    client.write(expected_line + "\n");
  });
}

exports.teardown = function() {
  server.close();
}