define(['exports', './file-reader/file-reader', './image-resizer/image-resizer', './pinch/pinch'], function (exports, _fileReader, _imageResizer, _pinch) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_fileReader).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _fileReader[key];
      }
    });
  });
  Object.keys(_imageResizer).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _imageResizer[key];
      }
    });
  });
  Object.keys(_pinch).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _pinch[key];
      }
    });
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./file-reader/file-reader', './image-resizer/image-resizer', './pinch/pinch']);
  }
});