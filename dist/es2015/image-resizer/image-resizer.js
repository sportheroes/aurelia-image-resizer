var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
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

import { inject, bindable, bindingMode, EventManager } from 'aurelia-framework';

function ratio(w, h) {
  return w / h;
}

export let ImageResizerCustomElement = (_dec = inject(Element, EventManager), _dec2 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = (_class2 = class ImageResizerCustomElement {

  constructor(element, eventManager) {
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

  attached() {
    this.supported = window.File && window.FileReader && window.FileList && window.Blob;
    this._listeners = [this.eventManager.addEventListener(this.element, 'mousedown', e => this._movable = true, true), this.eventManager.addEventListener(document, 'mouseup', e => {
      if (this._movable) {
        e.preventDefault();
      }
      this._movable = false;
      delete this._ieLastCoord;
    }, true), this.eventManager.addEventListener(this.element, 'mousemove', e => {
      if (!this._movable) return;
      if (e.movementX === undefined) {
        if (this._ieLastCoord) {
          e.movementX = e.screenX - this._ieLastCoord.x;
          e.movementY = e.screenY - this._ieLastCoord.y;
        }
        this._ieLastCoord = {
          x: e.screenX,
          y: e.screenY
        };
      }
      this._moveInput(e);
    }), this.eventManager.addEventListener(this.element, 'mousewheel', e => {
      e.preventDefault();
      this.setZoom(e.deltaY / 100);
    }), this.eventManager.addEventListener(this.element, 'dragstart', e => e.preventDefault()), this.eventManager.addEventListener(document, 'keydown', e => {
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
          return this.setZoom(0.1);
        case 189:
          return this.setZoom(-0.1);
        default:
          return;
      }
      this._moveInput(e);
    }), this.eventManager.addEventListener(this.element, 'touchmove', e => {
      e.preventDefault();
      const newPosition = [e.touches[0].screenX, e.touches[0].screenY];
      if (previousPosition) {
        e.movementX = newPosition[0] - previousPosition[0];
        e.movementY = newPosition[1] - previousPosition[1];
        this._moveInput(e);
      }
      previousPosition = newPosition;
    }), this.eventManager.addEventListener(this.element, 'touchend', e => previousPosition = null)];

    this._resizeCtnAsRatio();
  }

  detached() {
    for (const off of this._listeners) {
      off();
    }
  }

  loaded() {
    if (!this.img) return;
    const box = this.img.getBoundingClientRect();
    this.imgDims.width = box.width;
    this.imgDims.height = box.height;
    this._zoom(1);
    this.y = 0;
    this.x = 0;
  }

  widthChanged() {
    this._resizeCtnAsRatio();
  }
  heightChanged() {
    this._resizeCtnAsRatio();
  }

  zoomChanged(zoom) {
    if (!this.img) return;
    this._zoom(zoom);
  }

  setZoom(change) {
    this.zoom = this.currentZoom + change;
  }

  _zoom(zoom = 1) {
    this.currentZoom = +zoom;
    zoom = Math.min(100, Math.max(1, this.currentZoom));
    const box = this.element.getBoundingClientRect();
    const elWidth = box.width;
    const elHeight = box.height;

    if (this.imgDims.ratio > 1) {
      this.img.style.height = `${elHeight * zoom}px`;
      this.img.style.width = 'auto';
    } else {
      this.img.style.width = `${elWidth * zoom}px`;
      this.img.style.height = 'auto';
    }
    setTimeout(() => this._constrain());
  }

  _moveInput(e) {
    e.preventDefault();
    const newY = this.y + (e.movementY || 0);
    const newX = this.x + (e.movementX || 0);

    this.x = newX;
    this.y = newY;
    setTimeout(() => this._constrain());
  }

  _constrain() {
    const box = this.element.getBoundingClientRect();
    const imgDims = this.img.getBoundingClientRect();

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
  }

  _resizeCanvas() {
    if (this._debouncedResizeCanvasTimeout) {
      clearTimeout(this._debouncedResizeCanvasTimeout);
    }
    this._debouncedResizeCanvasTimeout = setTimeout(() => {
      const ctx = this.canvas.getContext('2d');
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      const img = new Image();
      img.onload = () => {
        const imgDim = Math.min(img.width, img.height);
        let r = this.canvas.height / this.canvas.width;
        let resized = [imgDim, imgDim * r];
        if (this.canvas.height > this.canvas.width) {
          r = this.canvas.width / this.canvas.height;
          resized = [imgDim * r, imgDim];
        }

        resized = resized.map(dim => dim / this.currentZoom);

        const x = parseInt(this.x * img.width / this.img.width, 10);
        const y = parseInt(this.y * img.height / this.img.height, 10);

        ctx.drawImage(img, -x, -y, resized[0], resized[1], 0, 0, this.canvas.width, this.canvas.height);

        const encoderOptions = ['string', 'number'].includes(typeof this.encoderOptions) ? Number(this.encoderOptions) : null;

        this.output = this.canvas.toDataURL(this.type, encoderOptions);
      };
      img.src = this.input;
    }, 500);
  }

  _resizeCtnAsRatio() {
    this.element.style.paddingTop = `${this.height / this.width * 100}%`;
  }

  setPinch(e) {
    this.setZoom(e.pinch / 10);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'input', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'output', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'width', [bindable], {
  enumerable: true,
  initializer: function () {
    return 100;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'height', [bindable], {
  enumerable: true,
  initializer: function () {
    return 100;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'zoom', [bindable], {
  enumerable: true,
  initializer: function () {
    return 1;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'type', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'encoderOptions', [bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class);