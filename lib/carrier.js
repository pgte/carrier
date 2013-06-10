var util    = require('util'),
    events = require('events');

function Carrier(reader, separator) {
  var self = this;
  encoding = 'utf-8';
  
  self.reader = reader;

  if (!separator) {
    separator = /\r?\n/;
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
      var line = JSON.parse(line);
      self.reader.emit(line.event, line);
    });
  });
  
  var ender = function() {
    if (buffer.length > 0) {
      var buffer = JSON.parse(buffer);
      self.reader.emit(buffer.event, buffer);
      buffer = '';
    }
    reader.emit('disconnect');
  }
  
  reader.on('end', ender);
}

util.inherits(Carrier, events.EventEmitter);

exports.carry = function(reader, separator) {
  return new Carrier(reader, separator);
}