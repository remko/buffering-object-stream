/* eslint no-underscore-dangle: 0 */

var test = require('tape');
var through = require('through2');
var bufferingInputStream = require('../index');
var Readable = require('stream').Readable;

function createBufferedStream(size, dataCB) {
	var input = new Readable({objectMode: true});
	input._read = function () {};
	input
		.pipe(bufferingInputStream(size))
		.pipe(through.obj(
			function (chunk, enc, cb) {
				dataCB(chunk);
				cb();
			}));
	return input;
}

test('Push 1 element in buffer of 3', function (t) {
	var results = [];
	var input = createBufferedStream(3, function (chunk) {
		results.push(chunk);
	});

	input.push(2);

	process.nextTick(function () {
		t.deepEqual(results, []);
		t.end();
	});
});

test('Push 2 elements in buffer of 3', function (t) {
	var results = [];
	var input = createBufferedStream(3, function (chunk) {
		results.push(chunk);
	});

	input.push(1);
	input.push(2);

	process.nextTick(function () {
		t.deepEqual(results, []);
		t.end();
	});
});

test('Push 3 elements in buffer of 3', function (t) {
	var results = [];
	var input = createBufferedStream(3, function (chunk) {
		results.push(chunk);
	});

	input.push(1);
	input.push(2);
	input.push(3);

	process.nextTick(function () {
		t.deepEqual(results, [[1, 2, 3]]);
		t.end();
	});
});

test('Push 4 elements in buffer of 3', function (t) {
	var results = [];
	var input = createBufferedStream(3, function (chunk) {
		results.push(chunk);
	});

	input.push(1);
	input.push(2);
	input.push(3);
	input.push(4);

	process.nextTick(function () {
		t.deepEqual(results, [[1, 2, 3]]);
		t.end();
	});
});

test('Push 6 elements in buffer of 3', function (t) {
	var results = [];
	var input = createBufferedStream(3, function (chunk) {
		results.push(chunk);
	});

	input.push(1);
	input.push(2);
	input.push(3);
	input.push(4);
	input.push(5);
	input.push(6);

	process.nextTick(function () {
		t.deepEqual(results, [[1, 2, 3], [4, 5, 6]]);
		t.end();
	});
});

test('Flush stream with buffered elements', function (t) {
	var results = [];
	var input = createBufferedStream(3, function (chunk) {
		results.push(chunk);
	});

	input.push(1);
	input.push(2);
	input.push(3);
	input.push(4);
	input.push(null);

	input.on('end', function () {
		t.deepEqual(results, [[1, 2, 3], [4]]);
		t.end();
	});
});

test('Flush stream without buffered elements', function (t) {
	var results = [];
	var input = createBufferedStream(3, function (chunk) {
		results.push(chunk);
	});

	input.push(1);
	input.push(2);
	input.push(3);
	input.push(null);

	input.on('end', function () {
		t.deepEqual(results, [[1, 2, 3]]);
		t.end();
	});
});

