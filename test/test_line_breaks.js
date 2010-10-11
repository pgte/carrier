var net     = require('net'),
    assert  = require('assert'),
    carrier = require('../lib/carrier.js');

var server;
var port = 4001;
var to_be_sents = ["Hel", "lo\n", "Wor", "ld\n", "Glorious", " place"]
var expecteds = to_be_sents.join('').split("\n");

exports.run = function(next) {

  server = net.createServer(function(conn) {
    var received_lines = -1;
    carrier.carry(conn, function(line) {
      received_lines ++;
      assert.equal(line, expecteds[received_lines]);
      if (received_lines == expecteds.length - 1) next();
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