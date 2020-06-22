import { Component, Vue } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import FetchApi from '@/api/fetchApiClass';
import FetchApiFactory from '@/api/fetchApi';
import { ActivityResultWrapper } from '@/api/ResultWrapper';
import {
  ActivityDetail,
  ActivityPictureItem,
  AppointChannel,
  AppointNumber,
  AppointProductType,
  AppointType,
  HotInfo,
  HotType
} from '@/store/modules/activity/types';
import './activity.scss';
import { ImageHotEditCanvas } from '@/components/page/activity/ImageCanvas';
import { DynamicTableColumn, Upload } from '@/types/types';
import DynamicTable from '@/components/common/DynamicTable.vue';
import HotEditDialog from '@/components/page/activity/HotEditDialog';
// @ts-ignore
import iosHeadImg from '@/assets/img/ios_head.png';

@Component({
  components: {
    'img-canvas': ImageHotEditCanvas, DynamicTable, 'hot-edit': HotEditDialog
  }
})
export default class ActivityEdit extends Vue {
  requestInstance!: FetchApi;
  name = 'ActivityDetailPage';
  activityId!: string;
  activityDetail: ActivityDetail = {
    pictureInfo: []
  };
  choosedImgCanvasIndex: number = -1; // 当前编辑的图片信息顺序下标和canvas下标
  imgCanvasLoadStatus: Array<boolean> = [];
  editingHotIndex: number = 0;
  upload!: Upload;
  addPos: number = 0;
  uploadLoading = false;
  afterUpload!: (pictureLink: string) => void;
  loading = false;
  imgWidth = 1125;
  imgMaxSize = 1024 * 1024;

  get hotEditDialog(): HotEditDialog {
    return this.$refs['hot-edit'] as HotEditDialog;
  }

  get imgMaxSizeStr() {
    if (this.imgMaxSize >= 1024 * 1024) {
      return `${(this.imgMaxSize / 1024 / 1024).toFixed(2)}MB`;
    }
    return `${(this.imgMaxSize / 1024).toFixed(2)}KB`;
  }

  get canvasList() {
    return this.activityDetail.pictureInfo.map((pictureItem, index) => {
      return (<img-canvas imgSrc={ pictureItem.pictureLink }
                ref={`canvas${index}`}
                key={ pictureItem.pictureLink }
                onCanvasLoad={ () => this.handleOnCanvasLoad(index) }
                onCanvasChoosed={ () => this.handleOnCanvasChoosed(index) }
              />);
    });
  }

  // 渲染按钮和吸底顺序
  get canvasListWithBtnAndOrder() {
    let renderList = [...this.canvasList];
    let bottomFlagPos = -1;
    for (let i = 0; i < this.canvasList.length; i++) {
      if (this.activityDetail.pictureInfo[i].bottomFlag === 1) {
        bottomFlagPos = i;
        break;
      }
    }
    const addBtn = (pos: number) =>
      (<div class="add-pic" onClick={() => {
        this.upload.triggerUpload();
        this.addPos = pos;
        this.afterUpload = (pictureLink: string) => {
          this.addImage(pictureLink);
        };
      } }>添加图片</div>);
    const temp: Array<any> = [];
    for (let i = 0; i < renderList.length; i++) {
      if (i === bottomFlagPos) continue;
      temp.push(renderList[i]);
      temp.push(addBtn(i + 1));
    }
    renderList = temp;
    renderList.unshift(addBtn(0));
    if (bottomFlagPos !== -1) {
      renderList.push(this.canvasList[bottomFlagPos]);
      renderList.push(addBtn(renderList.length + 1));
    }
    return renderList;
  }

  get emptyHotInfo() {
    const hotInfo: HotInfo = {
      hotType: HotType.link,
      hotCoord: {
        startPos: [0, 0],
        endPos: [0, 0]
      },
      jumpUrl: '',
      hotMd: '',
      appointChannel: AppointChannel.activityReserve,
      appointType: AppointType.onlineReserve,
      appointProductType: AppointProductType.fixed,
      appointNumber: AppointNumber.times1,
      appointName: ''
    };
    return hotInfo;
  }

  get choosedPictureItem(): ActivityPictureItem {
    if (this.choosedImgCanvasIndex < 0) {
      return {} as ActivityPictureItem;
    }
    return this.activityDetail.pictureInfo[this.choosedImgCanvasIndex];
  }

  get perviewTitle() {
    let title = this.$route.query.title as string;
    if (!title) {
      return '';
    }
    if (title.length > 10) {
      title = title.substr(0, 10);
      return `${title}...`;
    }
    return title;
  }

  created() {
    this.requestInstance = FetchApiFactory.getFetchInstance('/activity', false, new ActivityResultWrapper());
    this.upload = this.$upload.getUploadInstance('activity_upload');
    this.upload.setUploadHandler(this.uploadHandler);
    this.upload.setTypeLimit(['jpg', 'jpeg', 'png', 'gif']);
    this.upload.setTypeLimitErrorHandler(this.onTypesError);
  }

  async mounted() {
    this.activityId = this.$route.query.activityId as string;
    await this.fetchData();
    setTimeout(() => {
      this.setImageCanvasLoadStatus();
    });
  }

  async activated() {
    if (this.activityId !== this.$route.query.activityId) {
      this.activityId = this.$route.query.activityId as string;
      this.setEmptyChoosed();
      await this.fetchData();
      setTimeout(() => {
        this.setImageCanvasLoadStatus();
      });
    }
  }

  // 转换字符串坐标到对象
  convertDetailItemsRes(res: any): ActivityDetail {
    const converted = this.$utils.jsonClone(res);
    for (const activityItem of converted.pictureInfo) {
      if (!activityItem.hotInfo) {
        activityItem.hotInfo = [];
        continue;
      }
      for (const hotinfoItem of activityItem.hotInfo) {
        let arr = hotinfoItem.hotCoord.split(',');
        arr = arr.map((n: string) => parseInt(n));
        hotinfoItem.hotCoord = {
          startPos: [arr[0], arr[1]],
          endPos: [arr[2], arr[3]]
        };
      }
    }
    return converted as ActivityDetail;
  }

  async uploadHandler(file: File) {
    const srcUrl = window.URL.createObjectURL(file);
    const img = new Image();
    img.src = srcUrl;
    img.onload = async() => {
      if (img.width !== this.imgWidth) {
        this.$message.error(`只能上传宽度是${this.imgWidth}px的图片！`);
        return;
      }
      if (file.size > this.imgMaxSize) {
        this.$message.error(`图片大小超过限制！只能小于等于${this.imgMaxSizeStr}`);
        return;
      }
      const uri = '/picture/upload';
      const form = new FormData();
      form.append('file', file);
      form.append('activityId', this.$route.query.activityId as any);
      this.setEmptyChoosed();
      try {
        this.uploadLoading = true;
        const res = await this.requestInstance.setParam(uri, form).doRequest();
        this.uploadLoading = false;
        this.upload.clearFile();
        this.afterUpload(res.pictureLink);
      } catch (msg) {
        this.upload.clearFile();
        this.$message.error(msg);
      }
    };
  }

  async fetchData() {
    this.uploadLoading = true;
    const res = await this.requestInstance.setParam('/detail/findActivityById',
      { activityId: this.activityId }).doRequest();
    this.uploadLoading = false;
    this.activityDetail = this.convertDetailItemsRes(res);
  }

  onTypesError(validTypes: Array<string>) {
    this.$message.error(`只有${validTypes.join(',')}文件类型可以上传`);
  }

  replaceImage(imgSrc: string, index: number) {
    this.activityDetail.pictureInfo.splice(index, 1, this.createPictureItem(imgSrc));
    this.setEmptyChoosed();
    this.setImageCanvasLoadStatus();
  }

  addImage(imgSrc: string) {
    this.activityDetail.pictureInfo.splice(this.addPos, 0, this.createPictureItem(imgSrc));
    this.setEmptyChoosed();
    this.setImageCanvasLoadStatus();
  }

  delImage(index: number) {
    this.$elAlert({
      msg: '是否确认删除图片？',
      onConfirm: () => {
        this.setEmptyChoosed();
        this.activityDetail.pictureInfo.splice(index, 1);
      }
    });
  }

  setImageCanvasLoadStatus() {
    setTimeout(() => {
      this.imgCanvasLoadStatus = new Array<boolean>(this.activityDetail.pictureInfo.length);
      this.imgCanvasLoadStatus.fill(false);
      // 为true时表示未加载完成
      this.imgCanvasLoadStatus = this.activityDetail.pictureInfo.map((item, index) => {
        const canvasRef = this.$refs[`canvas${index}`] as ImageHotEditCanvas;
        // 设定canvas
        return !canvasRef.isLoad;
      });
    });
  }

  // 设置图片吸底
  setBottom() {
    for (const pictureItem of this.activityDetail.pictureInfo) {
      if (pictureItem.bottomFlag === 1) {
        this.$message.error('已有吸底图片，请勿重复设置！');
        return;
      }
    }
    this.choosedPictureItem.bottomFlag = 1;
  }

  clearSetBottom() {
    this.choosedPictureItem.bottomFlag = 0;
  }

  handleOnCanvasLoad(index: number) {
    const canvasRef = this.$refs[`canvas${index}`] as ImageHotEditCanvas;
    canvasRef.setCanvasWrapperHeight(414);
    this.imgCanvasLoadStatus[index] = false;
    this.imgCanvasLoadStatus = [...this.imgCanvasLoadStatus];
    setTimeout(() => {
      // render后再等一会更新卡片位置不然会错位
      this.updateChooseCardPos();
    }, 200);
  }

  handleOnCanvasChoosed(index: number) {
    this.choosedImgCanvasIndex = index;
    this.handleCanvasChoosed(`canvas${index}`);
  }

  handleCanvasChoosed(refKey: string) {
    for (const index in this.activityDetail.pictureInfo) {
      const loopRefKey = `canvas${index}`;
      if (refKey === loopRefKey) continue;
      const canvasRef = (this.$refs[`canvas${index}`] as ImageHotEditCanvas);
      canvasRef.choosed = false;
    }
  }

  updateChooseCardPos() {
    const editCard = this.$refs.edit_card as HTMLDivElement;
    const index = this.choosedImgCanvasIndex;
    const choosedImgCanvas = this.$refs[`canvas${index}`] as ImageHotEditCanvas;
    if (!choosedImgCanvas) {
      editCard.style.display = 'none';
      return;
    }
    let offsetTop = (choosedImgCanvas.$el as HTMLDivElement).offsetTop;
    const offsetLeft = (choosedImgCanvas.$el as HTMLDivElement).offsetLeft;
    const clientWidth = (choosedImgCanvas.$el as HTMLDivElement).clientWidth;
    const divScroller = document.getElementsByClassName('content')[0] as HTMLDivElement;
    if (offsetTop + editCard.clientHeight > divScroller.scrollHeight - 100) {
      offsetTop = offsetTop - ((offsetTop + editCard.clientHeight) - (divScroller.scrollHeight - 100)) - 120;
      editCard.classList.add('bottom-triangle');
    } else {
      editCard.classList.remove('bottom-triangle');
    }
    editCard.style.display = 'block';
    editCard.style.top = offsetTop + 'px';
    editCard.style.left = offsetLeft + clientWidth + 30 + 'px';
  }

  createPictureItem(imgSrc: string): ActivityPictureItem {
    return {
      pictureLink: imgSrc,
      bottomFlag: 0,
      hotInfo: []
    };
  }

  getEditColumn(): DynamicTableColumn<this> {
    return [
      {
        label: 'ID',
        dataKey: '',
        props: {
          formatter: (row: any, column: any, cellValue: any, index: number) => {
            return (<div>{ index + 1 }</div>);
          }
        }
      },
      {
        label: '跳转链接',
        dataKey: 'jumpUrl',
        props: {
          formatter(row: HotInfo) {
            if (row.hotType === HotType.link) {
              return row.jumpUrl;
            }
            return '预约活动';
          }
        }
      },
      {
        label: '埋点值T2',
        dataKey: 'hotMd',
        props: {
          formatter: (row: HotInfo) => {
            if (row.hotType === HotType.reserve) {
              return 'yy';
            }
            return row.hotMd;
          }
        }
      },
      {
        label: '操作',
        dataKey: '',
        props: {
          width: 200,
          formatter: (row: any, column: any, cellValue: any, index: number) => {
            // 跳转链接类的热区设置的埋点值；
            // 预约活动类的热区显示默认埋点值yy；
            return (<div>
              <el-button size="mini" onClick={ () => this.editHotInfo(index)}>编辑热区</el-button>
              <el-button size="mini" onClick={ () => { this.delHot(index); }}>删除</el-button>
            </div>);
          }
        }
      }
    ];
  };

  addHotInfo() {
    this.choosedPictureItem.hotInfo.push(this.emptyHotInfo);
    this.editingHotIndex = this.choosedPictureItem.hotInfo.length - 1;
    this.hotEditDialog.showEditDialog(this.choosedPictureItem.hotInfo[this.editingHotIndex],
      this.choosedPictureItem.pictureLink, this.choosedPictureItem.hotInfo);
  }

  delHot(index: number) {
    this.$elAlert({
      msg: '确认删除该热区吗？',
      onConfirm: () => {
        this.choosedPictureItem.hotInfo.splice(index, 1);
        this.$message.success('删除成功！');
      }
    });
  }

  editHotInfo(hotIndex: number) {
    if (!this.choosedPictureItem) return;
    this.editingHotIndex = hotIndex;
    this.hotEditDialog.showEditDialog(this.choosedPictureItem.hotInfo[this.editingHotIndex],
      this.choosedPictureItem.pictureLink, this.choosedPictureItem.hotInfo);
  }

  async handleHotEditSuccess(hotinfo: HotInfo) {
    const choosedImgCanvasIndex = this.choosedImgCanvasIndex;
    this.choosedPictureItem.hotInfo[this.editingHotIndex] = hotinfo;
    this.$message.success('修改热区信息成功，请点击右上角保存修改！');
    this.setEmptyChoosed();
    setTimeout(() => {
      // 重新加载右侧编辑卡片
      this.choosedImgCanvasIndex = choosedImgCanvasIndex;
      const canvasRef = (this.$refs[`canvas${choosedImgCanvasIndex}`] as ImageHotEditCanvas);
      canvasRef.choosed = true;
    });
    this.hotEditDialog.closeEditDialog();
  }

  async submitResult() {
    const submitArg = this.$utils.jsonClone(this.activityDetail);
    submitArg.id = this.$route.query.activityId;
    for (const pictureItem of submitArg.pictureInfo) {
      for (const hotinfoItem of pictureItem.hotInfo) {
        hotinfoItem.hotCoord = `${hotinfoItem.hotCoord.startPos.join(',')},${hotinfoItem.hotCoord.endPos.join(',')}`;
        if (hotinfoItem.hotType === HotType.reserve) {
          hotinfoItem.hotMd = 'yy';
        }
        if (hotinfoItem.appointChannel === AppointChannel.serviceReserve) {
          delete hotinfoItem.appointProductType;
        }
      }
    }
    try {
      this.loading = true;
      await this.requestInstance.setParam('/detail/updateActivity', submitArg).doRequest();
      this.$message.success('操作成功！');
      this.fetchData();
      // this.setEmptyChoosed();
      this.$bus.$emit('close_current_tags');
    } catch (e) {
      this.$message.error(e);
    }
    this.loading = false;
  }

  setEmptyChoosed() {
    // 关闭右侧热区编辑框
    setTimeout(() => {
      this.choosedImgCanvasIndex = -1;
      for (const index in this.activityDetail.pictureInfo) {
        const canvasRef = (this.$refs[`canvas${index}`] as ImageHotEditCanvas);
        canvasRef.choosed = false;
      }
    });
  }

  operationPanel() {
    if (!this.choosedPictureItem) return;
    const style = {
      display: this.choosedPictureItem.hotInfo ? 'block' : 'none'
    };
    return (
      <div class="edit-card" ref="edit_card" style={style}>
        <h3>图片</h3>
        <div class="operation">
          <el-button onClick={ () => {
            const index = this.choosedImgCanvasIndex;
            this.delImage(index);
          } }>删除图片</el-button>
          <el-button onClick={ () => {
            const index = this.choosedImgCanvasIndex;
            this.upload.triggerUpload();
            this.afterUpload = (picUrl: string) => {
              this.replaceImage(picUrl, index);
            };
          } }>替换图片</el-button>
          <el-button type="primary" onClick={this.addHotInfo}>添加热区</el-button>
          {
            this.choosedPictureItem.bottomFlag === 0
              ? (<el-button type="primary" onClick={this.setBottom}>吸底显示</el-button>)
              : (<el-button type="primary" onClick={this.clearSetBottom}>取消吸底</el-button>)
          }
        </div>
        <dynamic-table
          class="hot-table"
          column={ this.getEditColumn() }
          data={ this.choosedPictureItem.hotInfo ? this.choosedPictureItem.hotInfo : [] }
        />
      </div>
    );
  }

  render(h: CreateElement) {
    setTimeout(() => {
      this.updateChooseCardPos();
    });
    return (
    <div class="activity-edit" v-loading={ this.loading }>
      <div class="op-row">
        <el-button size="big" type="danger" onClick={ this.submitResult }
                   disabled={this.activityDetail.pictureInfo.length === 0}>保存修改</el-button>
      </div>
      <h3 class="notice">图片宽度须等于{this.imgWidth}px, 图片大小小于{this.imgMaxSizeStr}。</h3>
      <div class="preview-area"
           v-loading={ this.uploadLoading || this.imgCanvasLoadStatus.some(status => status) }>
        <div class="preview-title">
          <img src={iosHeadImg} class="ios-head" alt="" />
          <div class="ios-head-title">{ this.perviewTitle }</div>
        </div>
        <div class="op-area">
          { this.canvasListWithBtnAndOrder }
        </div>
      </div>
      { this.operationPanel() }
      <hot-edit ref="hot-edit" onSaveSuccess={ this.handleHotEditSuccess } />
    </div>);
  }
}
