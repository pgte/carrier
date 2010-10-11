var sys    = require('sys'),
    events = require('events');

function Carrier(reader, listener, encoding) {
  var self = this;
  
  self.reader = reader;

  if (listener) {
    self.addListener('line', listener);
  }
  
  line = '';
  
  reader.on('data', function(data) {
    var decoded = data.toString(encoding);
    var lines = decoded.split("\n");
    if (decoded.charAt(decoded.length - 1) == "\n") {
      // get rid of last "" after last "\n"
      lines.pop(1);
    }
    
    if (lines.length > 0) {
      lines.forEach(function(one_line, index) {
        line += one_line;
        var emit = true;
        if (index == lines.length - 1) {
          // processing last line
          if (decoded.charAt(decoded.length - 1) != "\n") {
            // if it was not terminated by "\n" then the last line was not finished; we just buffer it.
            emit = false;
          }
        }
        if (emit) {
          self.emit('line', line);
          line = '';
        }
      })
    }
  });
  
  reader.on('end', function() {
    if (line.length > 0) {
      self.emit('line', line);
      line = '';
    }
  });
}

sys.inherits(Carrier, events.EventEmitter);

exports.carry = function(reader, listener, encoding) {
  return new Carrier(reader, listener, encoding);
}

