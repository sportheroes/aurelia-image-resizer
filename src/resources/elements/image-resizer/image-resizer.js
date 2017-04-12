import {inject, bindable} from 'aurelia-framework';

function ratio(w, h) {
  return w / h;
}

@inject(Element)
export class ImageResizerCustomElement {

  @bindable input;
  @bindable output;

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
  }

  attached() {
    this.supported = (window.File && window.FileReader && window.FileList && window.Blob);
    this._listeners = {};
    this.element.addEventListener('mousedown', this._listeners.mousedown = e => this._movable = true);
    this.element.addEventListener('mousemove', this._listeners.mousemove = e => this._moveInput(e));
    document.addEventListener('mouseup', this._documentListeners = e => this._movable = false);
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

  _zoom(zoom = 1) {
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
  }

  _moveInput(e) {
    if (!this._movable) return;
    e.preventDefault();
    const newY = this.y + e.movementY;
    const newX = this.x + e.movementX;

    const box = this.element.getBoundingClientRect();
    const imgDims = this.img.getBoundingClientRect();

    if (newX <= 0 &&
        imgDims.width + newX >= box.width) {
      this.x = newX;
    }
    if (newY <= 0 &&
        imgDims.height + newY >= box.height) {
      this.y = newY;
    }
  }

  // TODO : resize and set ouput
  _resizeCanvas(file) {
    const ctx = this.canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    this.output = file;
  }
}
