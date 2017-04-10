import {observable} from 'aurelia-framework';

export class ImageResizerCustomElement {

  @observable file;

  attached() {
    this.supported = (window.File && window.FileReader && window.FileList && window.Blob);
  }

  update(e) {
    const file = e.target.files && e.target.files[0];
    if (!file ||
        !file.type.match('image.*')) return;

    const reader = new FileReader();
    reader.onload = fileE => {
      this.preview = fileE.target.result;
    };
    reader.readAsDataURL(file);
  }

  _resizeCanvas(file) {
    const ctx = this.canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = file;
  }
}
