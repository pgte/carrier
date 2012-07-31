var carrier = require('../lib/carrier.js');
    spec    = require('stream-spec');
	tester  = require('stream-tester');

var strm = tester.createRandomStream(function () {
	return 'line ' + Math.random()
}, 1000)

spec(carrier.carry(strm))
	.readable()
	.pausable({strict: true}) //strict is optional.
	.validateOnExit()