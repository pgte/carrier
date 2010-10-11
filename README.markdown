Carrier allows you to implement new-line terminated protocols over node.js.

The client can send you chunks of lines and carrier will only notify you on each completed line.

## Install

    $ npm install carrier
    
## Usage

    var net     = require('net'),
        carrier = require('carrier');

    var server;
    var port = 4001;
    var expected_line = "Hello World"

    server = net.createServer(function(conn) {
      carrier.carry(conn, function(line) {
        console.log('got one line: ' + line);
      });
    });
    server.listen(port);

  