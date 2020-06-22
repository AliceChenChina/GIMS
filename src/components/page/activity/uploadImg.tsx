import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { Upload } from '@/types/types';
import './uploadShareAvatar.scss';
import FetchApi from '@/api/fetchApiClass';
import FetchApiFactory from '@/api/fetchApi';
import { ActivityResultWrapper } from '@/api/ResultWrapper';
// @ts-ignore

@Component
export default class UploadImg extends Vue {
  resultWrapper = new ActivityResultWrapper();
  upload: Upload = this.$upload.getUploadInstance('share_icon_upload');
  @Prop() value!: string;
  requestInstanceImg!: FetchApi;
  name: string = 'ShareIconUpload';
  loading: boolean = false;

  created() {
    this.upload.setUploadHandler(this.uploadHandler);
    this.upload.setTypeLimit(['jpg', 'png', 'jpeg']);
    this.upload.setMaxSize('5');
    this.upload.setTypeLimitErrorHandler(this.onTypesError);
    this.upload.setSizeErrorHandler(this.onSizeError);
    this.requestInstanceImg = FetchApiFactory.getFetchInstance('/activity', false, this.resultWrapper);
  }

  uploadHandler(file: File) {
    // 宽高都需要是200
    const srcUrl = window.URL.createObjectURL(file);
    const img = new Image();
    img.src = srcUrl;
    img.onload = async() => {
      // if (img.width !== 200 || img.height !== 200) {
      //   this.$message.error('只能上传宽高200px的图片！');
      //   return;
      // }
      const uri = '/picture/upload';
      const form = new FormData();
      form.append('file', file);
      form.append('pictureOrder', '1');
      this.loading = true;
      try {
        const res = await this.requestInstanceImg.setParam(uri, form).doRequest();
        this.$emit('change', res);
        this.upload.clearFile();
      } catch (msg) {
        this.upload.clearFile();
        this.$message.error(msg);
      }
      this.loading = false;
    };
  }

  onTypesError(validTypes: Array<string>) {
    this.$message.error(`只有${validTypes.join(',')}文件类型可以上传`);
  }
  onSizeError(validSize: string) {
    this.$message.error(`图片大小超过${validSize}MB`);
  }

  @Emit('uploadSuccess')
  emitUploadSuccess() {}

  render() {
    return (
    <div class="upload-share-icon" v-loading={this.loading}>
      <div class="op">
        <el-button type="danger" onClick={ () => this.upload.triggerUpload() }>上传图片</el-button>
      </div>
      <img src={this.value} alt="" style='width:550px;max-height:310px;border-radius:0'/>
      <div style='color:#999999;font-size:12px'>注：图片大小最大5M</div>
    </div>);
  }
}
