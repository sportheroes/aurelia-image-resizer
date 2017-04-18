import {bindable, bindingMode} from 'aurelia-framework';

export class FileReaderCustomElement {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) file;

  update(e) {
    const file = e.target.files && e.target.files[0];
    if (!file ||
        !file.type.match('image.*')) return;

    const reader = new FileReader();
    reader.onload = fileE => {
      this.file = this._fixOrientation(fileE.target.result);
      this.fileInput.value = null;
    };
    reader.readAsDataURL(file);
  }

  _fixOrientation(file) {
    const exif = EXIF.readFromBinaryFile(new BinaryFile(file));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    switch (exif.Orientation) {
    case 8:
      ctx.rotate(90 * Math.PI / 180);
      break;
    case 3:
      ctx.rotate(180 * Math.PI / 180);
      break;
    case 6:
      ctx.rotate(-90 * Math.PI / 180);
      break;
    default:
    }

    return canvas.toDataURL();
  }
}
