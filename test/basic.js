var assert = require('assert');
var ReactHotTransform = require('../index');
var convert = require('convert-source-map');

describe('react-hot-transform', function() {
  it('basic case works', function(done) {
    var stream = ReactHotTransform('/foo.js', {});
    var all = [];
    stream.on('data', function(data) {
      all.push(data);
    });
    stream.on('end', function() {
      var transformed = all.join('');
      assert.equal(transformed.match(/REACT HOT LOADER/g).length, 2);
      assert.equal(transformed.match(/var x = 5;/g).length, 1);
      done();
    });

    stream.write(new Buffer("var x = 5;\n"), 'buffer');
    stream.end();
  });

  it('multiple writes', function(done) {
    var stream = ReactHotTransform('/foo.js', {});
    var all = [];
    stream.on('data', function(data) {
      all.push(data);
    });
    stream.on('end', function() {
      var transformed = all.join('');
      assert.equal(transformed.match(/REACT HOT LOADER/g).length, 2);
      assert.equal(transformed.match(/var x = 5;/g).length, 1);
      done();
    });

    stream.write(new Buffer("var x = "), 'buffer');
    stream.write(new Buffer("5;\n"), 'buffer');
    stream.end();
  });

  describe('sourcemaps', function() {
    it('no input map', function(done) {
      var stream = ReactHotTransform('/foo.js', {});
      var all = [];
      stream.on('data', function(data) {
        all.push(data);
      });
      stream.on('end', function() {
        var transformed = all.join('');
        var map = convert.fromSource(transformed);
        assert(map);
        done();
      });

      stream.write(new Buffer("var x = 5;\n"), 'buffer');
      stream.end();
    });
  });
});
