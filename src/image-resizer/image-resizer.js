import {inject, bindable, bindingMode} from 'aurelia-framework';

function ratio(w, h) {
  return w / h;
}

@inject(Element)
export class ImageResizerCustomElement {

  @bindable input;
  @bindable({ defaultBindingMode: bindingMode.twoWay })  output;
  @bindable width = 100;
  @bindable height = 100;
  @bindable zoom = 1;
  @bindable type;
  @bindable encoderOptions;

  currentZoom = 1;
  _movable = false;
  x = 0;
  y = 0;

  imgDims = {
    width: 0,
    height: 0,
    get ratio() {
      return ratio(this.width, this.height);
    }
  };

  constructor(element) {
    this.element = element;
    this.canvas = document.createElement('canvas');
  }

  attached() {
    this.supported = (window.File && window.FileReader && window.FileList && window.Blob);
    this._listeners = {};
    this._documentListeners = {};
    this.element.addEventListener('mousedown', this._listeners.mousedown = e => this._movable = true);
    document.addEventListener('mouseup', this._documentListeners.mouseup = e => {
      if (this._movable) {
        e.preventDefault();
      }
      this._movable = false;
    });
    this.element.addEventListener('mousemove', this._listeners.mousemove = e => {
      if (!this._movable) return;
      this._moveInput(e);
    });
    this.element.addEventListener('mousewheel', this._listeners.mousewheel = e => {
      e.preventDefault();
      this.setZoom(e.deltaY / 100);
    });
    this.element.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('keydown', this._documentListeners.keydown = e => {
      switch (e.keyCode) {
      case 39: // ➡
        e.movementX = 1;
        break;
      case 37: // ⬅
        e.movementX = -1;
        break;
      case 38: // ⬆
        e.movementY = -1;
        break;
      case 40: // ⬇
        e.movementY = 1;
        break;
      case 187: // +
        return this.setZoom(0.1);
      case 189: // -
        return this.setZoom(-0.1);
      default:
        return;
      }
      this._moveInput(e);
    });

    // Touch
    let previousPosition;
    this.element.addEventListener('touchmove', this._listeners.touchmove = e => {
      e.preventDefault();
      const newPosition = [e.touches[0].screenX, e.touches[0].screenY];
      if (previousPosition) {
        e.movementX = newPosition[0] - previousPosition[0];
        e.movementY = newPosition[1] - previousPosition[1];
        this._moveInput(e);
      }
      previousPosition = newPosition;
    });
    this.element.addEventListener('touchend', this._listeners.touchend = e => previousPosition = null);
  }

  detached() {
    for (const event of Object.keys(this._listeners)) {
      this.element.removeEventListener(event, this._listeners[event]);
    }
    for (const event of Object.keys(this._documentListeners)) {
      document.removeEventListener(event, this._documentListeners[event]);
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

  zoomChanged(zoom) {
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

        const x = this.x * img.width / this.img.width;
        const y = this.y * img.height / this.img.height;

        ctx.drawImage(
          img,
          -x, -y, resized[0], resized[1],
          0, 0, this.canvas.width, this.canvas.height);

        this.output = this.canvas.toDataURL(this.type, this.encoderOptions);
      };
      img.src = this.input;
    }, 500);
  }

  setPinch(e) {
    this.setZoom(e.pinch);
  }
}
