class Upload {
  constructor({ uploadEleId }) {
    this.uploadEleId = uploadEleId;
    const inputElement = document.createElement('INPUT');
    inputElement.setAttribute('type', 'file');
    inputElement.setAttribute('style', 'display:none');
    inputElement.setAttribute('id', uploadEleId);
    this.inputElement = inputElement;
    document.querySelector('body').appendChild(inputElement);
  }

  setUploadHandler(fn) {
    this.inputElement.onchange = () => {
      // 先检查上传文件类型
      const fileName = this.inputElement.files[0].name;
      const ldot = fileName.lastIndexOf('.');
      const type = fileName.substring(ldot + 1);
      const fileSize = this.inputElement.files[0].size;
      console.log('fileSize',fileSize)
      if (this.checkType(type) && this.checkMaxSize(fileSize)) {
        fn(this.inputElement.files[0]);
      }
    };
  }

  setTypeLimit(types) {
    this.types = types;
  }
  setMaxSize(maxSize) {
    this.maxSize = maxSize;
  }
  setTypeLimitErrorHandler(fn) {
    this.typesErrorHandler = fn;
  }
  setSizeErrorHandler(fn) {
    this.sizeErrorHandler = fn;
  }

  checkType(fileTypeName) {
    if (this.types.length === 0) return true;
    if (this.types.indexOf(fileTypeName.toLowerCase()) < 0) {
      this.typesErrorHandler(this.types);
      return false;
    }
    return true;
  }
  checkMaxSize(fileSize) {
    console.log('fileSize',fileSize)
    console.log('this.maxSize',this.maxSize)
    if (!this.maxSize) return true;
    const maxSize = (this.maxSize) * 1024 * 1024;
    if (fileSize > maxSize) {
      this.sizeErrorHandler(this.maxSize);
      return false;
    }
    return true;
  }

  triggerUpload() {
    this.inputElement.click();
  }

  clearFile() {
    this.inputElement.value = '';
  }

  static getUploadInstance(id) {
    return new Upload({ uploadEleId: id });
  }
}

export default Upload;
