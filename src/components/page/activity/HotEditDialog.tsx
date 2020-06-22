import { CreateElement } from 'vue';
import { dynamicFormState, elOptionTag, formItem } from '@/types/types';
import { Component, Emit, Vue, Watch } from 'vue-property-decorator';
import { HotCoordInfo, ImageHotEditCanvas } from '@/components/page/activity/ImageCanvas';
import {
  AppointChannel,
  AppointNumber,
  AppointProductType,
  AppointType,
  HotInfo,
  HotType
} from '@/store/modules/activity/types';
import DynamicForm from 'common/DynamicForm.vue';

@Component({
  components: {
    'img-canvas': ImageHotEditCanvas, DynamicForm
  }
})
export default class HotEditDialog extends Vue {
  loading = false;
  dialogVisible = false;
  hotInfo: HotInfo = {} as HotInfo;
  hotEditIndex: number | undefined;
  onCanvasLoadCallBack!: Function;
  pictureLink!: string;
  canvasRef!: ImageHotEditCanvas;
  coordAdded = false;
  allHotCoordInfo: Array<HotInfo> = [];
  isEdit = false; // 如果没提交接口保存的画hotInfo不存在id，所以加一个字段判断是不是编辑

  get formState(): dynamicFormState {
    if (!this.hotInfo.hotType) return [];
    const hotType: formItem = {
      formLabel: '热区类型',
      formRules: 'required',
      modelKey: 'hotType',
      inputTag: 'el-radio-group',
      inputTagOptions: [
        {
          label: '跳转链接',
          value: HotType.link
        },
        {
          label: '预约活动',
          value: HotType.reserve
        }
      ]
    };
    if (this.hotInfo.hotType === HotType.reserve) {
      // 预约类型
      return [
        [
          hotType
        ],
        [
          {
            formLabel: '预约名称',
            formRules: [
              this.$utils.textLenValidator(25, '预约名称')
            ],
            inputTag: 'el-input',
            modelKey: 'appointName'
          }
        ],
        [
          {
            formLabel: '预约类型',
            formRules: 'required',
            inputTag: 'el-select',
            modelKey: 'appointType',
            inputTagOptions: this.appointTypes
          },
          {
            formLabel: '产品类型',
            formRules: [
              {
                validator: (rule, value, callback) => {
                  if (!value && this.hotInfo.appointChannel !== AppointChannel.serviceReserve) {
                    callback(new Error('请选择产品类型'));
                  } else {
                    callback();
                  }
                },
                required: true
              }
            ],
            inputTag: 'el-select',
            modelKey: 'appointProductType',
            inputTagOptions: this.appointProductType,
            inputProps: {
              disabled: this.hotInfo.appointChannel === AppointChannel.serviceReserve
            }
          }
        ],
        [
          {
            formLabel: '预约渠道',
            formRules: 'required',
            inputTag: 'el-select',
            modelKey: 'appointChannel',
            inputTagOptions: this.appointChannel
          },
          {
            formLabel: '预约次数',
            formRules: 'required',
            inputTag: 'el-select',
            modelKey: 'appointNumber',
            inputTagOptions: this.appointNumber
          }
        ]
      ];
    } else {
      return [
        [
          hotType
        ],
        [
          {
            formLabel: '跳转链接',
            formRules: 'required',
            inputTag: 'el-input',
            modelKey: 'jumpUrl'
          }
        ],
        [
          {
            formLabel: '埋点值T2',
            formRules: [
              this.$utils.textLenValidator(20, '埋点值')
            ],
            inputTag: 'el-input',
            modelKey: 'hotMd'
          }
        ]
      ];
    }
  }

  get appointTypes(): Array<elOptionTag> {
    return [
      {
        label: '线上财富预约',
        value: AppointType.onlineReserve
      },
      {
        label: '线上合格投资者',
        value: AppointType.certificateUser
      },
      {
        label: '线下财富预约',
        value: AppointType.offlineReserve
      },
      {
        label: '海外线上预约',
        value: AppointType.oversea
      },
      {
        label: '保险',
        value: AppointType.insurance
      },
      {
        label: '其他类',
        value: AppointType.other
      }
    ];
  }

  get appointProductType(): Array<elOptionTag> {
    return [
      {
        label: '类固收',
        value: AppointProductType.fixed
      },
      {
        label: '私募股权',
        value: AppointProductType.stock
      },
      {
        label: '阳光私募',
        value: AppointProductType.secondaryMarket
      },
      {
        label: '海外资产',
        value: AppointProductType.oversea
      },
      {
        label: '信托资产',
        value: AppointProductType.xintuo
      },
      {
        label: '券商大集合',
        value: AppointProductType.qsdjh
      },
      {
        label: '券商小集合',
        value: AppointProductType.qsxjh
      }
    ];
  }

  get appointNumber(): Array<elOptionTag> {
    return [
      {
        label: '1天3次',
        value: AppointNumber.times3
      },
      {
        label: '1天1次',
        value: AppointNumber.times1
      },
      {
        label: '3天1次',
        value: AppointNumber.times1in3Days
      }
    ];
  }

  get appointChannel(): Array<elOptionTag> {
    return [
      {
        label: '活动预约',
        value: AppointChannel.activityReserve
      },
      {
        label: '服务预约',
        value: AppointChannel.serviceReserve
      },
      {
        label: '产品预约',
        value: AppointChannel.productReserve
      }
    ];
  }

  // 添加热区或者编辑热区
  // 编辑热区传入需要编辑的hotInfo数组下标
  showEditDialog(hotinfo: HotInfo, pictureLink: string, allHotCoordInfo: Array<HotInfo>) {
    this.pictureLink = pictureLink;
    this.dialogVisible = true;
    this.hotInfo = this.$utils.jsonClone(hotinfo);
    this.hotEditIndex = 0;
    this.allHotCoordInfo = allHotCoordInfo;
    if (!this.isEmptyCoord(this.hotInfo.hotCoord) && allHotCoordInfo) {
      // 编辑
      // 推送编辑的坐标到ImageCanvas
      this.isEdit = true;
      this.coordAdded = true;
      this.onCanvasLoadCallBack = () => {
        const coordArr = allHotCoordInfo.map((hotinfoItem) => {
          return hotinfoItem.hotCoord;
        });
        const editIndex = coordArr.indexOf(hotinfo.hotCoord);
        this.canvasRef.setHotCoordArray(coordArr);
        this.canvasRef.editCoord(editIndex);
        this.canvasRef.drawFixedRects();
      };
    } else {
      // 新增热区
      this.isEdit = false;
      this.coordAdded = false;
      this.onCanvasLoadCallBack = () => {
        const coordArr = allHotCoordInfo.map((hotinfoItem) => {
          if (this.isEmptyCoord(hotinfoItem.hotCoord)) {
            return;
          }
          return hotinfoItem.hotCoord;
        }).filter(item => item);
        this.canvasRef.editCoordIndex = -1;
        this.canvasRef.setHotCoordArray(coordArr as Array<HotCoordInfo>);
        this.canvasRef.drawFixedRects(); // 当前热区有的点
        this.canvasRef.setAddCoordDrawLayer();
        this.canvasRef.beforeDrawMouseDown = () => {
          // 添加热区只留一个，先清空所有坐标
          if (this.coordAdded) {
            coordArr.pop(); // 移除最后添加的
            this.coordAdded = false;
          }
          this.canvasRef.setHotCoordArray(coordArr as Array<HotCoordInfo>);
          this.canvasRef.drawFixedRects(); // 更新展示层
        };
      };
    }
    setTimeout(() => {
      (this.$refs.edit_form as any).resetFields();
    });
  }

  handleFormChange(value: HotInfo) {
    const newVal = this.$utils.jsonClone(value) as HotInfo;
    if (newVal.hotType !== this.hotInfo.hotType) {
      setTimeout(() => {
        (this.$refs.edit_form as any).resetFields();
      });
    }
    this.hotInfo = newVal;
  }

  // 取消添加并且关闭对话框
  hideEditDialog() {
    this.pictureLink = '';
    // 如果是添加热区的话，删除最后一个hot信息
    if (!this.isEdit) {
      this.allHotCoordInfo.pop();
    }
    this.dialogVisible = false;
  }

  closeEditDialog() {
    // 成功调用关闭对话框
    this.pictureLink = '';
    this.dialogVisible = false;
  }

  onCanvasLoad() {
    this.canvasRef = this.$refs['canvas_choosed'] as ImageHotEditCanvas;
    this.canvasRef.setCanvasWrapperHeight(450);
    this.onCanvasLoadCallBack();
  }

  onCoordAdded(coord: HotCoordInfo) {
    this.coordAdded = true;
    this.hotInfo.hotCoord = coord;
  }

  isEmptyCoord(hotCoord: HotCoordInfo) {
    return !!(hotCoord.startPos[0] === 0 && hotCoord.endPos[0] === 0 &&
      hotCoord.startPos[1] === 0 && hotCoord.endPos[1] === 0);
  }

  // 更新被编辑的坐标
  onEditCoordUpdated(hotCoordInfo: HotCoordInfo) {
    this.hotInfo.hotCoord = hotCoordInfo;
  }

  saveEdit() {
    (this.$refs.edit_form as any).getFormValidate()(async(valid: Function) => {
      if (!valid) {
        this.$message.error('请检查输入。');
        return;
      }
      if ((this.hotInfo.hotCoord.startPos[0] === 0 && this.hotInfo.hotCoord.startPos[0] === 0) ||
        (this.hotInfo.hotCoord.endPos[0] === 0 && this.hotInfo.hotCoord.endPos[0] === 0)) {
        this.$message.error('请添加热区。');
        return;
      }
      this.emitSaveSuccess();
      // todo 添加失败删除最后变更的项目a
    });
  }

  @Emit('saveSuccess')
  emitSaveSuccess() {
    return this.hotInfo;
  }

  @Watch('hotInfo')
  watchHotInfo() {
    if (this.hotInfo.hotType === HotType.reserve) {
      if (!this.hotInfo.appointChannel) {
        this.hotInfo.appointChannel = AppointChannel.activityReserve;
        this.hotInfo.appointType = AppointType.onlineReserve;
        this.hotInfo.appointProductType = AppointProductType.fixed;
        this.hotInfo.appointNumber = AppointNumber.times1;
      }
    }
  }

  render(h: CreateElement) {
    const dyFormProps = {
      props: {
        'label-width': '120px',
        form: this.formState,
        model: this.hotInfo
      },
      on: {
        onFormChange: this.handleFormChange
      }
    };
    return (
      <el-dialog title="编辑热区"
                 class="activity-hot-edit"
                 visible={this.dialogVisible} width="80%"
                 showClose={false}>
        <div class="hot-edit-preview-area">
          <div class="img-canvas-wrapper">
            {
              this.pictureLink
                ? (<img-canvas imgSrc={ this.pictureLink }
                               ref="canvas_choosed"
                               onCanvasLoad={ this.onCanvasLoad }
                               onCoordAdded={ this.onCoordAdded }
                               onEditCoordUpdated={ this.onEditCoordUpdated }
                />) : ''
            }
          </div>
        </div>
        <div class="dy-form">
          <dynamic-form
            ref="edit_form"
            {...dyFormProps}
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button onClick={this.hideEditDialog}>取 消</el-button>
          <el-button type="primary" onClick={this.saveEdit}>保 存</el-button>
        </span>
      </el-dialog>
    );
  }
}
