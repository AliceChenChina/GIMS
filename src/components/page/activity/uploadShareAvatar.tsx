import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { Upload } from '@/types/types';
import './el_tag.scss';
import FetchApi from '@/api/fetchApiClass';
// @ts-ignore

@Component
export default class ShareIconUpload extends Vue {
  upload: Upload = this.$upload.getUploadInstance('share_icon_upload');
  @Prop() value!: string;
  @Prop() requestInstance!: FetchApi;
  name: string = 'ShareIconUpload';

  created() {
    this.upload.setUploadHandler(this.uploadHandler);
    this.upload.setTypeLimit(['jpg', 'png', 'jpeg']);
    this.upload.setTypeLimitErrorHandler(this.onTypesError);
  }

  uploadHandler(file: File) {
    // 宽高都需要是200
    const srcUrl = window.URL.createObjectURL(file);
    const img = new Image();
    img.src = srcUrl;
    img.onload = async() => {
      if (img.width !== 200 || img.height !== 200) {
        this.$message.error('只能上传宽高200px的图片！');
        return;
      }
      const uri = '/picture/upload';
      const form = new FormData();
      form.append('file', file);
      form.append('pictureOrder', '1');
      try {
        const res = await this.requestInstance.setParam(uri, form).doRequest();
        this.$emit('change', res);
        this.upload.clearFile();
      } catch (msg) {
        this.upload.clearFile();
        this.$message.error(msg);
      }
    };
  }

  onTypesError(validTypes: Array<string>) {
    this.$message.error(`只有${validTypes.join(',')}文件类型可以上传`);
  }

  @Emit('uploadSuccess')
  emitUploadSuccess() {}

  render() {
    return (
    <div class="upload-share-icon">
      <div class="op">
        <el-button type="danger" onClick={ () => this.upload.triggerUpload() }>上传图片</el-button>
        <a onClick={ () => this.$emit('change', { pictureLink: 'http://test.storage.jd.com/adms-picture/202005/17/OcPnpkho.png' }) }>恢复默认</a>
      </div>
      <img src={this.value || 'http://test.storage.jd.com/adms-picture/202005/17/OcPnpkho.png' } alt="" style="width: 80px;height:80px"/>
      <p>宽200px，高200px，非该大小无法上传</p>
    </div>);
  }
}
