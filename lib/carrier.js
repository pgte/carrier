var util    = require('util'),
    events = require('events');

function Carrier(reader, listener, encoding) {
  var self = this;
  
  self.reader = reader;

  if (listener) {
    self.addListener('line', listener);
  }
  
  var line = '';
  
  reader.setEncoding(encoding || 'utf-8');
  reader.on('data', function(data) {
    var lines = data.split("\n");
    if (data.charAt(data.length - 1) == "\n") {
      // get rid of last "" after last "\n"
      lines.pop(1);
    }
    
    if (lines.length > 0) {
      //console.log('Have ' + lines.length + " lines\n");
      lines.forEach(function(one_line, index) {
        line += one_line;
        var emit = true;
        if (index == lines.length - 1) {
          // processing last line
          if (data.charAt(data.length - 1) != "\n") {
            // if it was not terminated by "\n" then the last line was not finished; we just buffer it.
            //console.log('last one does not have \n, not emitting');
            emit = false;
          }
        }
        if (emit) {
          line = line.replace("\r", '');
          //console.log('emiting ' + line + "\n");
          self.emit('line', line);          
          line = '';
        }
      })
    }
  });
  
  var ender = function() {
    if (line.length > 0) {
      line = line.replace("\r", '');
      self.emit('line', line);
      line = '';
    }
    self.emit('end');
  }
  
  reader.on('end', ender);
}

util.inherits(Carrier, events.EventEmitter);

exports.carry = function(reader, listener, encoding) {
  return new Carrier(reader, listener, encoding);
}

