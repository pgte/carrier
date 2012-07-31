var util   = require('util'),
    stream = require('stream');

function Carrier(reader, listener, encoding, separator) {
  stream.Stream.call(this);
  var self = this;
  
  self.reader = reader;
  self.readable = reader.readable;

  if (!separator) {
    separator = /\r?\n/;
  }

  if (listener) {
    self.addListener('data', listener);
  }
  
  var buffer = '';
  
  reader.on('data', function(data) {
    var lines = (buffer + data).split(separator);
    buffer = lines.pop();

    lines.forEach(function(line, index) {
      self.emit('data', line);
    });
  });
  
  var ender = function() {
    if (buffer.length > 0) {
      self.emit('data', buffer);
      buffer = '';
    }
    self.readable = reader.readable;
    self.emit('end');
  }
  
  reader.on('end', ender);
  reader.on('close', function () { self.emit('close') });
}

util.inherits(Carrier, stream.Stream);

Carrier.prototype.pipe = function(dest, opts) {
  stream.Stream.prototype.pipe.call(this, dest, opts);
  return dest;
}

Carrier.prototype.pause = function() {
  this.reader.pause.apply(this.reader, arguments);
}

Carrier.prototype.resume = function() {
  this.reader.resume.apply(this.reader, arguments);
}

Carrier.prototype.destroy = function () {
  this.reader.destroy();
}

exports.carry = function(reader, listener, encoding, separator) {
  return new Carrier(reader, listener, encoding, separator);
}

