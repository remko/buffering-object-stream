'use strict';

var through = require('through2');

function createBufferingObjectStream(size) {
	var buffer = [];
	return through.obj(
			function (obj, enc, cb) {
				buffer.push(obj);
				if (buffer.length >= size) {
					this.push(buffer);
					buffer = [];
				}
				cb();
			},
			function (cb) {
				if (buffer.length > 0) {
					this.push(buffer);
				}
				cb();
			});
}

module.exports = createBufferingObjectStream;
