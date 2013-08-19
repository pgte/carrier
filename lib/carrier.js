var util    = require('util'),
    events = require('events'),
    dgram   = require('dgram');

function Carrier(reader, listener, encoding, separator) {
  var self = this;
  encoding = encoding || 'utf-8';

  var event = reader.constructor === dgram.Socket ? 'message' : 'data';

  self.reader = reader;

  if (!separator) {
    separator = /\r?\n/;
  }

  if (listener) {
    self.addListener('line', listener);
  }

  var buffer = '';

  if (typeof reader.setEncoding === 'function')
      reader.setEncoding(encoding);

  reader.on(event, function(data) {
    var args = Array.prototype.slice.call(arguments, 1);

    if (data instanceof Buffer) {
      data = data.toString(encoding);
    }

    var lines = data.split(separator);
    lines[0] = buffer + lines[0];
    buffer = lines.pop();

    lines.forEach(function(line, index) {
      var _args = args.slice(0);

      _args.unshift(line);
      _args.unshift('line');

      self.emit.apply(self, _args);
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

