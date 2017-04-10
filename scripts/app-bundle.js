define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function App() {
    _classCallCheck(this, App);

    this.message = 'Hello World!';
  };
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('resources/elements/image-resizer/image-resizer',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ImageResizerCustomElement = undefined;

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

  var _desc, _value, _class, _descriptor;

  var ImageResizerCustomElement = exports.ImageResizerCustomElement = (_class = function () {
    function ImageResizerCustomElement() {
      _classCallCheck(this, ImageResizerCustomElement);

      _initDefineProp(this, 'file', _descriptor, this);
    }

    ImageResizerCustomElement.prototype.attached = function attached() {
      this.supported = window.File && window.FileReader && window.FileList && window.Blob;
    };

    ImageResizerCustomElement.prototype.update = function update(e) {
      var _this = this;

      var file = e.target.files && e.target.files[0];
      if (!file || !file.type.match('image.*')) return;

      var reader = new FileReader();
      reader.onload = function (fileE) {
        _this.preview = fileE.target.result;
      };
      reader.readAsDataURL(file);
    };

    ImageResizerCustomElement.prototype._resizeCanvas = function _resizeCanvas(file) {
      var ctx = this.canvas.getContext('2d');
      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
      };
      img.src = file;
    };

    return ImageResizerCustomElement;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'file', [_aureliaFramework.observable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n<require\n  from=\"./app.css\"></require>\n<require\n  from=\"resources/elements/image-resizer/image-resizer\"></require>\n<image-resizer></image-resizer>\n</template>\n"; });
define('text!resources/elements/image-resizer/image-resizer.html', ['module'], function(module) { module.exports = "<template>\n<require\n  from=\"./image-resizer.css\"></require>\n<div\n  if.bind=\"!supported\">\n  Not supported\n</div>\n<div\n  if.bind=\"supported\">\n  <input\n    type=\"file\"\n    change.delegate=\"update($event)\">\n  <img\n    if.bind=\"preview\"\n    src.bind=\"preview\">\n</div>\n</template>\n"; });
define('text!resources/elements/image-resizer/image-resizer.css', ['module'], function(module) { module.exports = "image-resizer img {\n  width: 100%;\n  height: 100%; }\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "image-resizer {\n  display: block;\n  width: 400px;\n  height: 400px; }\n"; });
//# sourceMappingURL=app-bundle.js.map