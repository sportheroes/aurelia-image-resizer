import {bindable, bindingMode} from 'aurelia-framework';
import EXIF from 'exif-js';

export class FileReaderCustomElement {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) file;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) infos;

  update(e) {
    const file = e.target.files && e.target.files[0];
    if (!file ||
        !file.type.match('image.*')) return;

    this._loadImage(file)
    .then(image => {
      this.file = image;
      this.fileInput.value = null;
    });
  }

  _loadImage(file) {
    let fileAsUrl;
    return this._readFileAsUrl(file)
    .then(data => {
      fileAsUrl = data;
      return this._readInfos(file, fileAsUrl);
    })
    .then(infos => {
      this.infos = infos;
      switch (this.infos.exif.Orientation) {
      case 7:
      case 8:
        return this._rotate(fileAsUrl, -90);
      case 3:
        return this._rotate(fileAsUrl, 180);
      case 5:
      case 6:
        return this._rotate(fileAsUrl, 90);
      default:
        return fileAsUrl;
      }
    });
  }

  _readFileAsUrl(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  _readFileAsBinary(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  _readInfos(file, fileAsUrl) {
    const infos = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
    const img = new Image();
    img.src = fileAsUrl;
    return Promise.all([
      this._readFileAsBinary(file)
      .then(fileAsBinary => {
        infos.exif = EXIF.readFromBinaryFile(fileAsBinary) || {};
        infos.exif.Orientation = infos.exif.Orientation || 0;
      }),
      new Promise((resolve, reject) => {
        img.onload = () => {
          infos.width = img.width;
          infos.height = img.height;
          resolve(infos);
        }
        img.onerror = e => resolve(infos);
      })
    ])
    .then(() => infos);
  }

  _rotate(fileAsUrl, degrees) {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const x = width / 2;
        const y = height / 2;
        canvas.width = width;
        canvas.height = height;

        ctx.translate(x, y);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
        resolve(canvas.toDataURL());
      };
      img.src = fileAsUrl;
    });
  }
}
