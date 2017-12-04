'use strict';

System.register(['aurelia-framework', 'exif-js'], function (_export, _context) {
  "use strict";

  var bindable, bindingMode, EXIF, _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2, FileReaderCustomElement;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  return {
    setters: [function (_aureliaFramework) {
      bindable = _aureliaFramework.bindable;
      bindingMode = _aureliaFramework.bindingMode;
    }, function (_exifJs) {
      EXIF = _exifJs.default;
    }],
    execute: function () {
      _export('FileReaderCustomElement', FileReaderCustomElement = (_dec = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec2 = bindable({ defaultBindingMode: bindingMode.twoWay }), (_class = function () {
        function FileReaderCustomElement() {
          _classCallCheck(this, FileReaderCustomElement);

          _initDefineProp(this, 'file', _descriptor, this);

          _initDefineProp(this, 'infos', _descriptor2, this);
        }

        FileReaderCustomElement.prototype.update = function update(e) {
          var _this = this;

          var file = e.target.files && e.target.files[0];
          if (!file || !file.type.match('image.*')) return;

          this._loadImage(file).then(function (image) {
            _this.file = image;
            _this.fileInput.value = null;
          });
        };

        FileReaderCustomElement.prototype._loadImage = function _loadImage(file) {
          var _this2 = this;

          var fileAsUrl = void 0;
          return this._readFileAsUrl(file).then(function (data) {
            fileAsUrl = data;
            return _this2._readInfos(file, fileAsUrl);
          }).then(function (infos) {
            _this2.infos = infos;
            switch (_this2.infos.exif.Orientation) {
              case 7:
              case 8:
                return _this2._rotate(fileAsUrl, -90);
              case 3:
                return _this2._rotate(fileAsUrl, 180);
              case 5:
              case 6:
                return _this2._rotate(fileAsUrl, 90);
              default:
                return fileAsUrl;
            }
          });
        };

        FileReaderCustomElement.prototype._readFileAsUrl = function _readFileAsUrl(file) {
          return new Promise(function (resolve) {
            var reader = new FileReader();
            reader.onload = function (e) {
              resolve(e.target.result);
            };
            reader.readAsDataURL(file);
          });
        };

        FileReaderCustomElement.prototype._readFileAsBinary = function _readFileAsBinary(file) {
          return new Promise(function (resolve) {
            var reader = new FileReader();
            reader.onload = function (e) {
              resolve(e.target.result);
            };
            reader.readAsArrayBuffer(file);
          });
        };

        FileReaderCustomElement.prototype._readInfos = function _readInfos(file, fileAsUrl) {
          var infos = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          };
          var img = new Image();
          img.src = fileAsUrl;
          return Promise.all([this._readFileAsBinary(file).then(function (fileAsBinary) {
            infos.exif = EXIF.readFromBinaryFile(fileAsBinary) || {};
            infos.exif.Orientation = infos.exif.Orientation || 0;
          }), new Promise(function (resolve, reject) {
            img.onload = function () {
              infos.width = img.width;
              infos.height = img.height;
              resolve(infos);
            };
            img.onerror = function (e) {
              return resolve(infos);
            };
          })]).then(function () {
            return infos;
          });
        };

        FileReaderCustomElement.prototype._rotate = function _rotate(fileAsUrl, degrees) {
          return new Promise(function (resolve) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.onload = function () {
              var width = img.width;
              var height = img.height;
              var x = width / 2;
              var y = height / 2;
              canvas.width = width;
              canvas.height = height;

              ctx.translate(x, y);
              ctx.rotate(degrees * Math.PI / 180);
              ctx.drawImage(img, -width / 2, -height / 2, width, height);
              ctx.restore();
              resolve(canvas.toDataURL());
            };
            img.src = fileAsUrl;
          });
        };

        return FileReaderCustomElement;
      }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'file', [_dec], {
        enumerable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'infos', [_dec2], {
        enumerable: true,
        initializer: null
      })), _class)));

      _export('FileReaderCustomElement', FileReaderCustomElement);
    }
  };
});