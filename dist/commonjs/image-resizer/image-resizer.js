'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageResizerCustomElement = undefined;

var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

var _aureliaFramework = require('aurelia-framework');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

function ratio(w, h) {
  return w / h;
}

var ImageResizerCustomElement = exports.ImageResizerCustomElement = (_dec = (0, _aureliaFramework.inject)(Element), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = function () {
  function ImageResizerCustomElement(element) {
    _classCallCheck(this, ImageResizerCustomElement);

    _initDefineProp(this, 'input', _descriptor, this);

    _initDefineProp(this, 'output', _descriptor2, this);

    _initDefineProp(this, 'width', _descriptor3, this);

    _initDefineProp(this, 'height', _descriptor4, this);

    this.currentZoom = 1;
    this._movable = false;
    this.x = 0;
    this.y = 0;
    this.imgDims = {
      width: 0,
      height: 0,
      get ratio() {
        return ratio(this.width, this.height);
      }
    };

    this.element = element;
    this.canvas = document.createElement('canvas');
  }

  ImageResizerCustomElement.prototype.attached = function attached() {
    var _this = this;

    this.supported = window.File && window.FileReader && window.FileList && window.Blob;
    this._listeners = {};
    this._documentListeners = {};
    this.element.addEventListener('mousedown', this._listeners.mousedown = function (e) {
      return _this._movable = true;
    });
    document.addEventListener('mouseup', this._documentListeners.mouseup = function (e) {
      return _this._movable = false;
    });
    this.element.addEventListener('mousemove', this._listeners.mousemove = function (e) {
      if (!_this._movable) return;
      _this._moveInput(e);
    });
    this.element.addEventListener('mousewheel', this._listeners.mousewheel = function (e) {
      e.preventDefault();
      _this.zoom(e.deltaY / 100);
    });
    this.element.addEventListener('dragstart', function (e) {
      return e.preventDefault();
    });
    document.addEventListener('keydown', this._documentListeners.keydown = function (e) {
      switch (e.keyCode) {
        case 39:
          e.movementX = -1;
          break;
        case 37:
          e.movementX = 1;
          break;
        case 38:
          e.movementY = 1;
          break;
        case 40:
          e.movementY = -1;
          break;
        case 187:
          return _this.zoom(0.1);
        case 189:
          return _this.zoom(-0.1);
        default:
          return;
      }
      console.log(e.movementY, e.movementX);
      _this._moveInput(e);
    });

    var previousPosition = void 0;
    this.element.addEventListener('touchmove', this._listeners.touchmove = function (e) {
      e.preventDefault();
      var newPosition = [e.touches[0].screenX, e.touches[0].screenY];
      if (previousPosition) {
        e.movementX = newPosition[0] - previousPosition[0];
        e.movementY = newPosition[1] - previousPosition[1];
        _this._moveInput(e);
      }
      previousPosition = newPosition;
    });
    this.element.addEventListener('touchend', this._listeners.touchend = function (e) {
      return previousPosition = null;
    });
  };

  ImageResizerCustomElement.prototype.detached = function detached() {
    for (var _iterator = Object.keys(this._listeners), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var event = _ref;

      this.element.removeEventListener(event, this._listeners[event]);
    }
    for (var _iterator2 = Object.keys(this._documentListeners), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var _event = _ref2;

      document.removeEventListener(_event, this._documentListeners[_event]);
    }
  };

  ImageResizerCustomElement.prototype.loaded = function loaded() {
    if (!this.img) return;
    var box = this.img.getBoundingClientRect();
    this.imgDims.width = box.width;
    this.imgDims.height = box.height;
    this._zoom(1);
    this.y = 0;
    this.x = 0;
  };

  ImageResizerCustomElement.prototype.zoom = function zoom(change) {
    this._zoom(Math.max(1, this.currentZoom + change / 10));
  };

  ImageResizerCustomElement.prototype._zoom = function _zoom() {
    var _this2 = this;

    var zoom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    this.currentZoom = zoom;
    var box = this.element.getBoundingClientRect();
    var elWidth = box.width;
    var elHeight = box.height;

    if (this.imgDims.ratio > 1) {
      this.img.style.height = elHeight * zoom + 'px';
      this.img.style.width = 'auto';
    } else {
      this.img.style.width = elWidth * zoom + 'px';
      this.img.style.height = 'auto';
    }
    setTimeout(function () {
      return _this2._constrain();
    });
  };

  ImageResizerCustomElement.prototype._moveInput = function _moveInput(e) {
    var _this3 = this;

    e.preventDefault();
    var newY = this.y + (e.movementY || 0);
    var newX = this.x + (e.movementX || 0);

    this.x = newX;
    this.y = newY;
    setTimeout(function () {
      return _this3._constrain();
    });
  };

  ImageResizerCustomElement.prototype._constrain = function _constrain() {
    var box = this.element.getBoundingClientRect();
    var imgDims = this.img.getBoundingClientRect();

    if (this.x > 0) {
      this.x = 0;
    }
    if (imgDims.width + this.x < box.width) {
      this.x = -(imgDims.width - box.width);
    }
    if (this.y > 0) {
      this.y = 0;
    }
    if (imgDims.height + this.y < box.height) {
      this.y = -(imgDims.height - box.height);
    }

    this._resizeCanvas();
  };

  ImageResizerCustomElement.prototype._resizeCanvas = function _resizeCanvas() {
    var _this4 = this;

    if (this._debouncedResizeCanvasTimeout) {
      clearTimeout(this._debouncedResizeCanvasTimeout);
    }
    this._debouncedResizeCanvasTimeout = setTimeout(function () {
      var ctx = _this4.canvas.getContext('2d');
      _this4.canvas.width = _this4.width;
      _this4.canvas.height = _this4.height;

      var img = new Image();
      img.onload = function () {
        var imgDim = Math.min(img.width, img.height);
        var r = _this4.canvas.height / _this4.canvas.width;
        var resized = [imgDim, imgDim * r];
        if (_this4.canvas.height > _this4.canvas.width) {
          r = _this4.canvas.width / _this4.canvas.height;
          resized = [imgDim * r, imgDim];
        }

        resized = resized.map(function (dim) {
          return dim / _this4.currentZoom;
        });

        var x = _this4.x * img.width / _this4.img.width;
        var y = _this4.y * img.height / _this4.img.height;

        ctx.drawImage(img, -x, -y, resized[0], resized[1], 0, 0, _this4.canvas.width, _this4.canvas.height);

        _this4.output = _this4.canvas.toDataURL();
      };
      img.src = _this4.input;
    }, 500);
  };

  ImageResizerCustomElement.prototype.setPinch = function setPinch(e) {
    this.zoom(e.pinch);
  };

  return ImageResizerCustomElement;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'input', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'output', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'width', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 100;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'height', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 100;
  }
})), _class2)) || _class);