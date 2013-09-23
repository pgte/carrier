var net     = require('net'),
    tap     = require('tap'),
    carrier = require('../lib/carrier.js');

tap.test("strips CR", function(t) {
  var server;
  var port = 4001;
  var to_be_sents = ["ONE\r\nTWO\r", "\nTHREE\r\n"];
  var expected = ["ONE", "TWO", "THREE"]

  t.plan(3);

  server = net.createServer(function(conn) {
    carrier.carry(conn, function(line) {
      var e = expected.shift();
      t.equal(line, e);
    }, 'utf8', /\r?\n/);
  });
  server.listen(port);

  var client = net.createConnection(port);
  client.once('connect', function() {
    while(to_be_sents.length) client.write(to_be_sents.shift());
    client.end();
  });

  t.once("end", function() {
    server.close();
  });
});
