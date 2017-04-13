define(['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FileReaderCustomElement = undefined;

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

  var _dec, _desc, _value, _class, _descriptor;

  var FileReaderCustomElement = exports.FileReaderCustomElement = (_dec = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), (_class = function () {
    function FileReaderCustomElement() {
      _classCallCheck(this, FileReaderCustomElement);

      _initDefineProp(this, 'file', _descriptor, this);
    }

    FileReaderCustomElement.prototype.update = function update(e) {
      var _this = this;

      var file = e.target.files && e.target.files[0];
      if (!file || !file.type.match('image.*')) return;

      var reader = new FileReader();
      reader.onload = function (fileE) {
        _this.file = fileE.target.result;
        _this.fileInput.value = null;
      };
      reader.readAsDataURL(file);
    };

    return FileReaderCustomElement;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'file', [_dec], {
    enumerable: true,
    initializer: null
  })), _class));
});