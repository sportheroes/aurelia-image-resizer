'use strict';

System.register(['aurelia-framework'], function (_export, _context) {
  "use strict";

  var inject, bindable, bindingMode, EventManager, _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, ImageResizerCustomElement;

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

  function ratio(w, h) {
    return w / h;
  }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      bindable = _aureliaFramework.bindable;
      bindingMode = _aureliaFramework.bindingMode;
      EventManager = _aureliaFramework.EventManager;
    }],
    execute: function () {
      _export('ImageResizerCustomElement', ImageResizerCustomElement = (_dec = inject(Element, EventManager), _dec2 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = (_class2 = function () {
        function ImageResizerCustomElement(element, eventManager) {
          _classCallCheck(this, ImageResizerCustomElement);

          _initDefineProp(this, 'input', _descriptor, this);

          _initDefineProp(this, 'output', _descriptor2, this);

          _initDefineProp(this, 'width', _descriptor3, this);

          _initDefineProp(this, 'height', _descriptor4, this);

          _initDefineProp(this, 'zoom', _descriptor5, this);

          _initDefineProp(this, 'type', _descriptor6, this);

          _initDefineProp(this, 'encoderOptions', _descriptor7, this);

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
          this.eventManager = eventManager;
          this.canvas = document.createElement('canvas');
        }

        ImageResizerCustomElement.prototype.attached = function attached() {
          var _this = this;

          this.supported = window.File && window.FileReader && window.FileList && window.Blob;
          this._listeners = [this.eventManager.addEventListener(this.element, 'mousedown', function (e) {
            return _this._movable = true;
          }, true), this.eventManager.addEventListener(document, 'mouseup', function (e) {
            if (_this._movable) {
              e.preventDefault();
            }
            _this._movable = false;
            delete _this._ieLastCoord;
          }, true), this.eventManager.addEventListener(this.element, 'mousemove', function (e) {
            if (!_this._movable) return;
            if (e.movementX === undefined) {
              if (_this._ieLastCoord) {
                e.movementX = e.screenX - _this._ieLastCoord.x;
                e.movementY = e.screenY - _this._ieLastCoord.y;
              }
              _this._ieLastCoord = {
                x: e.screenX,
                y: e.screenY
              };
            }
            _this._moveInput(e);
          }), this.eventManager.addEventListener(this.element, 'mousewheel', function (e) {
            e.preventDefault();
            _this.setZoom(e.deltaY / 100);
          }), this.eventManager.addEventListener(this.element, 'dragstart', function (e) {
            return e.preventDefault();
          }), this.eventManager.addEventListener(document, 'keydown', function (e) {
            switch (e.keyCode) {
              case 39:
                e.movementX = 1;
                break;
              case 37:
                e.movementX = -1;
                break;
              case 38:
                e.movementY = -1;
                break;
              case 40:
                e.movementY = 1;
                break;
              case 187:
                return _this.setZoom(0.1);
              case 189:
                return _this.setZoom(-0.1);
              default:
                return;
            }
            _this._moveInput(e);
          }), this.eventManager.addEventListener(this.element, 'touchmove', function (e) {
            e.preventDefault();
            var newPosition = [e.touches[0].screenX, e.touches[0].screenY];
            if (previousPosition) {
              e.movementX = newPosition[0] - previousPosition[0];
              e.movementY = newPosition[1] - previousPosition[1];
              _this._moveInput(e);
            }
            previousPosition = newPosition;
          }), this.eventManager.addEventListener(this.element, 'touchend', function (e) {
            return previousPosition = null;
          })];

          this._resizeCtnAsRatio();
        };

        ImageResizerCustomElement.prototype.detached = function detached() {
          for (var _iterator = this._listeners, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref = _i.value;
            }

            var off = _ref;

            off();
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

        ImageResizerCustomElement.prototype.widthChanged = function widthChanged() {
          this._resizeCtnAsRatio();
        };

        ImageResizerCustomElement.prototype.heightChanged = function heightChanged() {
          this._resizeCtnAsRatio();
        };

        ImageResizerCustomElement.prototype.zoomChanged = function zoomChanged(zoom) {
          if (!this.img) return;
          this._zoom(zoom);
        };

        ImageResizerCustomElement.prototype.setZoom = function setZoom(change) {
          this.zoom = this.currentZoom + change;
        };

        ImageResizerCustomElement.prototype._zoom = function _zoom() {
          var _this2 = this;

          var zoom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

          this.currentZoom = +zoom;
          zoom = Math.min(100, Math.max(1, this.currentZoom));
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

              var x = parseInt(_this4.x * img.width / _this4.img.width, 10);
              var y = parseInt(_this4.y * img.height / _this4.img.height, 10);

              ctx.drawImage(img, -x, -y, resized[0], resized[1], 0, 0, _this4.canvas.width, _this4.canvas.height);

              _this4.output = _this4.canvas.toDataURL(_this4.type, _this4.encoderOptions);
            };
            img.src = _this4.input;
          }, 500);
        };

        ImageResizerCustomElement.prototype._resizeCtnAsRatio = function _resizeCtnAsRatio() {
          this.element.style.paddingTop = this.height / this.width * 100 + '%';
        };

        ImageResizerCustomElement.prototype.setPinch = function setPinch(e) {
          this.setZoom(e.pinch / 10);
        };

        return ImageResizerCustomElement;
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'input', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'output', [_dec2], {
        enumerable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'width', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'height', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'zoom', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'type', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'encoderOptions', [bindable], {
        enumerable: true,
        initializer: null
      })), _class2)) || _class));

      _export('ImageResizerCustomElement', ImageResizerCustomElement);
    }
  };
});