# [buffering-object-stream: Buffer Node Object Streams](https://el-tramo.be/buffering-object-stream)

Adding a buffering input stream in your pipeline will collect a given number of objects,
and send them through as an array to the next stage. This is useful if you have a stream
source that emits objects, and you want to batch them together before sending them to a
database.


## Installation

    npm install buffering-object-stream --save

## Usage

For example:

    var through = require("through2");

    createSomeObjectStream()
      .pipe(bufferingObjectStream(4))
      .pipe(through(function (objects, enc, cb) {
        console.log("Got objects: ", objects);
        cb();
      });

If `createObjectStream` sends out 10 objects (e.g. strings), this will print
out something like:
    
    Got objects: ["object1", "object2", "object3", "object4"]
    Got objects: ["object5", "object6", "object7", "object8"]
    Got objects: ["object9", "object10"]


## API

### `bufferingObjectSream(bufferSize)`

- **`bufferSize`** - *integer*  
    The number of objects to buffer before emitting.
