'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fileReader = require('./file-reader/file-reader');

Object.keys(_fileReader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fileReader[key];
    }
  });
});

var _imageResizer = require('./image-resizer/image-resizer');

Object.keys(_imageResizer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _imageResizer[key];
    }
  });
});

var _pinch = require('./pinch/pinch');

Object.keys(_pinch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _pinch[key];
    }
  });
});
exports.configure = configure;
function configure(config) {
  config.globalResources(['./file-reader/file-reader', './image-resizer/image-resizer', './pinch/pinch']);
}