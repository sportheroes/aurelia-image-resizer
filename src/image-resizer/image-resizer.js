import {inject, bindable, bindingMode, EventManager} from 'aurelia-framework';

function ratio(w, h) {
  return w / h;
}

@inject(Element, EventManager)
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

  constructor(element, eventManager) {
    this.element = element;
    this.eventManager = eventManager;
    this.canvas = document.createElement('canvas');
  }

  attached() {
    this.supported = (window.File && window.FileReader && window.FileList && window.Blob);
    this._listeners = [
      this.eventManager.addEventListener(this.element, 'mousedown', e => this._movable = true, true),
      this.eventManager.addEventListener(document, 'mouseup', e => {
        if (this._movable) {
          e.preventDefault();
        }
        this._movable = false;
        delete this._ieLastCoord;
      }, true),
      this.eventManager.addEventListener(this.element, 'mousemove', e => {
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
      }),
      this.eventManager.addEventListener(this.element, 'mousewheel', e => {
        e.preventDefault();
        this.setZoom(e.deltaY / 100);
      }),
      this.eventManager.addEventListener(this.element, 'dragstart', e => e.preventDefault()),
      this.eventManager.addEventListener(document, 'keydown', e => {
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
      }),
      this.eventManager.addEventListener(this.element, 'touchmove', e => {
        e.preventDefault();
        const newPosition = [e.touches[0].screenX, e.touches[0].screenY];
        if (previousPosition) {
          e.movementX = newPosition[0] - previousPosition[0];
          e.movementY = newPosition[1] - previousPosition[1];
          this._moveInput(e);
        }
        previousPosition = newPosition;
      }),
      this.eventManager.addEventListener(this.element, 'touchend', e => previousPosition = null)
    ];

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

        ctx.drawImage(
          img,
          -x, -y, resized[0], resized[1],
          0, 0, this.canvas.width, this.canvas.height);

        const encoderOptions = ['string', 'number'].includes(typeof this.encoderOptions)
          ? Number(this.encoderOptions)
          : null;

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
}
