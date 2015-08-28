'use strict';

var through = require('through2');
var path = require('path');
var convert = require('convert-source-map');
var reactHotLoader = require('react-hot-loader');

module.exports = function(file, opts) {
  var basedir = opts.basedir !== undefined ? opts.basedir : process.cwd();

  return through.obj(function(row, enc, next) {
    var source = row.toString();
    var inputMapCV = convert.fromSource(source);
    var inputMap;
    if (inputMapCV) {
      inputMap = inputMapCV.toObject();
      source = convert.removeComments(source);
    }
    reactHotLoader.call({
      resourcePath: file,
      callback: function(err, source, map) {
        if (source && map) {
          source = source + convert.fromJSON(map).toComment();
        }
        next(err, source);
      }
    }, source, inputMap);
  });
};
