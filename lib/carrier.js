var util    = require('util'),
    events = require('events');

function Carrier(reader, listener, encoding, separator) {
  var self = this;
  encoding = encoding || 'utf-8';
  
  self.reader = reader;

  if (!separator) {
    separator = /\r?\n/;
  }

  if (listener) {
    self.addListener('line', listener);
  }
  
  var buffer = '';
  
  reader.setEncoding(encoding);
  reader.on('data', function(data) {
    if (data instanceof Buffer) {
      data = data.toString(encoding);
    }

    var lines = data.split(separator);
    lines[0] = buffer + lines[0];
    buffer = lines.pop();

    lines.forEach(function(line, index) {
      self.emit('line', line);
    });
  });
  
  var ender = function() {
    if (buffer.length > 0) {
      self.emit('line', buffer);
      buffer = '';
    }
    self.emit('end');
  }
  
  reader.on('end', ender);
}

util.inherits(Carrier, events.EventEmitter);

exports.carry = function(reader, listener, encoding, separator) {
  return new Carrier(reader, listener, encoding, separator);
}

