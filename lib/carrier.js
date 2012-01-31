var util    = require('util'),
    events = require('events');

function Carrier(reader, listener, encoding) {
  var self = this;
  
  self.reader = reader;

  if (listener) {
    self.addListener('line', listener);
  }
  
  var buffer = '';
  
  reader.setEncoding(encoding || 'utf-8');
  reader.on('data', function(data) {
    var lines = (buffer + data).split("\n");
    buffer = lines.pop();

    lines.forEach(function(line, index) {
      line = line.replace("\r", '');
      self.emit('line', line);
    });
  });
  
  var ender = function() {
    if (buffer.length > 0) {
      buffer = buffer.replace("\r", '');
      self.emit('line', buffer);
      buffer = '';
    }
    self.emit('end');
  }
  
  reader.on('end', ender);
}

util.inherits(Carrier, events.EventEmitter);

exports.carry = function(reader, listener, encoding) {
  return new Carrier(reader, listener, encoding);
}

