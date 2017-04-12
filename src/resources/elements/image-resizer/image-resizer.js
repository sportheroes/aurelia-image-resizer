import {inject, bindable} from 'aurelia-framework';

function ratio(w, h) {
  return w / h;
}

@inject(Element)
export class ImageResizerCustomElement {

  @bindable input;
  @bindable output;
  @bindable width = 100;
  @bindable height = 100;

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
    this.element.addEventListener('mousedown', this._listeners.mousedown = e => this._movable = true);
    this.element.addEventListener('mousemove', this._listeners.mousemove = e => this._moveInput(e));
    this.element.addEventListener('mousewheel', this._listeners.mousewheel = e => {
      e.preventDefault();
      this.zoom(e.deltaY / 100);
    });
    this.element.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('mouseup', this._documentListeners = e => this._movable = false);

    // Touch
    let previousPosition;
    this.element.addEventListener('touchmove', this._listeners.touchmove = e => {
      e.preventDefault();
      this._movable = true;
      const newPosition = [e.touches[0].screenX, e.touches[0].screenY];
      if (previousPosition) {
        this._movable = true;
        e.movementX = newPosition[0] - previousPosition[0];
        e.movementY = newPosition[1] - previousPosition[1];
        this._moveInput(e);
        this._movable = false;
      }
      previousPosition = newPosition;
    });
    this.element.addEventListener('touchend', this._listeners.touchend = e => previousPosition = null);
  }

  detached() {
    for (const event of Object.keys(this._listeners)) {
      this.element.removeEventListener(event, this._listeners[event]);
    }
    document.removeEventListener('mouseup', this._documentListeners);
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

  zoom(change) {
    this._zoom(Math.max(1, this.currentZoom + change / 10));
  }

  _zoom(zoom = 1) {
    this.currentZoom = zoom;
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
    if (!this._movable) return;
    e.preventDefault();
    const newY = this.y + e.movementY;
    const newX = this.x + e.movementX;

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

        ctx.drawImage(
          img,
          0, 0, resized[0], resized[1],
          0, 0, this.canvas.width, this.canvas.height);

        this.output = this.canvas.toDataURL();
      };
      img.src = this.input;
    }, 500);
  }

  setPinch(e) {
    this.zoom(e.pinch);
  }
}
