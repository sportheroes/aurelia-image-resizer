import {bindable, bindingMode} from 'aurelia-framework';

export class FileReaderCustomElement {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) file;

  update(e) {
    const file = e.target.files && e.target.files[0];
    if (!file ||
        !file.type.match('image.*')) return;

    const reader = new FileReader();
    reader.onload = fileE => {
      this.file = fileE.target.result;
      this.fileInput.value = null;
    };
    reader.readAsDataURL(file);
  }
}
