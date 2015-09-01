'use strict';

var through = require('through2');
var path = require('path');
var convert = require('convert-source-map');
var reactHotLoader = require('react-hot-loader');

module.exports = function(file, opts) {
  var pieces = [];
  return through.obj(function(row, enc, next) {
    pieces.push(row);
    next();
  }, function(done) {
    var self = this;
    var source = pieces.join('');
    var inputMapCV = convert.fromSource(source);
    var inputMap;
    if (inputMapCV) {
      inputMap = inputMapCV.toObject();
      source = convert.removeComments(source);
    }
    reactHotLoader.call({
      resourcePath: file,
      callback: function(err, source, map) {
        if (err) {
          done(err);
        } else {
          if (map) {
            source = source + convert.fromJSON(map).toComment();
          }
          self.push(source);
          done();
        }
      }
    }, source, inputMap);
  });
};
