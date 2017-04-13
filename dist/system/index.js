'use strict';

System.register(['./file-reader/file-reader', './image-resizer/image-resizer', './pinch/pinch'], function (_export, _context) {
  "use strict";

  function configure(config) {
    config.globalResources(['./file-reader/file-reader', './image-resizer/image-resizer', './pinch/pinch']);
  }

  _export('configure', configure);

  return {
    setters: [function (_fileReaderFileReader) {
      var _exportObj = {};

      for (var _key in _fileReaderFileReader) {
        if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _fileReaderFileReader[_key];
      }

      _export(_exportObj);
    }, function (_imageResizerImageResizer) {
      var _exportObj2 = {};

      for (var _key2 in _imageResizerImageResizer) {
        if (_key2 !== "default" && _key2 !== "__esModule") _exportObj2[_key2] = _imageResizerImageResizer[_key2];
      }

      _export(_exportObj2);
    }, function (_pinchPinch) {
      var _exportObj3 = {};

      for (var _key3 in _pinchPinch) {
        if (_key3 !== "default" && _key3 !== "__esModule") _exportObj3[_key3] = _pinchPinch[_key3];
      }

      _export(_exportObj3);
    }],
    execute: function () {}
  };
});