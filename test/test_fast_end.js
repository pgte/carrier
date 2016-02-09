var util    = require('util'),
    events  = require('events'),
    tap     = require('tap'),
    carrier = require('../lib/carrier.js');

function R() {
  this.readable = true;

  var self = this;
  process.nextTick(function() {
    self.emit("data", "line1\nline2");
    self.emit("end");
  });
}
util.inherits(R, events.EventEmitter);

tap.test("end is not emitted before last line", function(t) {
  var lines = [];

  carrier.carry(new R(), function(line) {
    lines.push(line);
  }).on('end', function() {
    t.deepEqual(lines.slice(), ["line1", "line2"]);
    t.end();
  });
});
