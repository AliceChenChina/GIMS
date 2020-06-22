import FormDialog from '@/components/common/FormDialog';
import { PosterItem, PosterModel, ActivityViewPermissions } from '@/store/modules/activity/types';
import { Component, Watch } from 'vue-property-decorator';
import { formItem } from '@/types/types';
import dynamicForm from 'common/DynamicForm.vue';
import { CreateElement, VNode } from 'vue';
import './activity.scss';
import { ActivityResultWrapper, ExtractedResponseResult } from '@/api/ResultWrapper';
import FetchApiFactory from '@/api/fetchApi';
import FetchApi from '@/api/fetchApiClass';

@Component({
  components: {
    dynamicForm
  }
})
export default class CreateActivityDialog extends FormDialog<PosterModel> {
  dialogTitle = '';

  resultWrapper = new ActivityResultWrapper();
  requestInstance!: FetchApi;
  className = 'create-activity-dialog';

  created() {
    this.requestInstance = FetchApiFactory.getFetchInstance('/cmsCfg', false, this.resultWrapper);
  }

  async showEditDialog(editItem?: PosterModel | PosterItem) {
    if (editItem) {
      this.dialogTitle = '编辑海报';
      // 从接口再拿一次详情
      const res = await this.requestInstance.setParam('/queryDetail', { id: editItem.id }).doRequest();
      this.formModel = { ...res };
      this.formModel.startTime = res.startTimeStr;
      this.formModel.endTime = res.endTimeStr;
      this.formModel.cfgPicture = res.cfgPicture;
    } else {
      this.dialogTitle = '新建海报';
      this.formModel = { ...this.defaultFormModel };
    }
    this.dialogVisible = true;
    this.resetFields();
  }

  get defaultFormModel(): PosterModel {
    return {
      cfgName: '',
      linkUrl: '',
      sharePictureModel: [],
      cfgPicture: '',
      startTime: '',
      endTime: '',
      onlineStatus: '1',
      cfgType: '1', // 海报
      linkShow: '1'
    };
  }

  get formState(): Array<formItem> {
    const arr = [
      {
        formLabel: '海报名称：',
        modelKey: 'cfgName',
        formRules: [
          this.$utils.textLenValidator(25, '海报名称')
        ],
        inputTag: 'el-input',
        inputProps: {
          maxLength: 25,
          placeholder: '最多输入25个字'
        }
      },
      {
        formLabel: '图片：',
        modelKey: 'cfgPicture',
        inputTag: 'upload-img',
        formRules: 'required',
        inputProps: {
          requestInstance: this.requestInstance
        }
      },
      {
        formLabel: '二维码链接：',
        modelKey: 'linkUrl',
        inputTag: 'el-input',
        formRules: [
          this.$utils.textContentValidator('https://', '二维码链接必须以https://协议开头', '500')
        ],
        inputProps: {
          maxLength: 500,
          placeholder: '最多输入500个字'
        }
      },
      {
        formLabel: '生成专属链接：',
        modelKey: 'linkShow',
        formRules: 'required',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      },
      {
        formLabel: '在线开始时间：',
        modelKey: 'startTime',
        formRules: 'required',
        inputTag: 'el-date-picker',
        inputProps: {
          type: 'datetime',
          clearable: true,
          'value-format': 'yyyy-MM-dd HH:mm:ss'
        }
      },
      {
        formLabel: '在线结束时间：',
        modelKey: 'endTime',
        formRules: 'required',
        inputTag: 'el-date-picker',
        inputProps: {
          type: 'datetime',
          clearable: true,
          'value-format': 'yyyy-MM-dd HH:mm:ss'
        }
      },
      {
        formLabel: '上下线状态：',
        modelKey: 'onlineStatus',
        formRules: 'required',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '在线',
            value: 1
          },
          {
            label: '下线',
            value: 0
          }
        ]
      },
    ].filter(item => item);
    return arr as Array<formItem>;
  }

  saveEdit(): void {
    this.getFormRef().getFormValidate()(async(valid: boolean) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      let url = '/save';
      let responseText = '创建成功';
      if (this.formModel.id){
        url = '/update';
        responseText = '编辑成功';
      }
      this.loading = true;
      try {
        const para = { ...this.formModel };
        delete para.sharePictureModel;
        await this.requestInstance.setParam(url, para).doRequest();
        this.$message.success(`${responseText}`);
        this.emitSaveSuccess();
        this.dialogVisible = false;
      } catch (msg) {
        this.$message.error(msg);
      }
      this.loading = false;
    });
  }

  render(h: CreateElement): VNode {
    return super.renderElDialog(h, this);
  }
}
