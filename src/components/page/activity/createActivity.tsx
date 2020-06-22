import FormDialog from '@/components/common/FormDialog';
import { ActivityItem, ActivityModel, ActivityViewPermissions } from '@/store/modules/activity/types';
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
export default class CreateActivityDialog extends FormDialog<ActivityModel> {
  dialogTitle = '';

  resultWrapper = new ActivityResultWrapper();
  requestInstance!: FetchApi;
  className = 'create-activity-dialog';

  created() {
    this.requestInstance = FetchApiFactory.getFetchInstance('/activity', false, this.resultWrapper);
  }

  async showEditDialog(editItem?: ActivityModel | ActivityItem) {
    if (editItem) {
      this.dialogTitle = '编辑活动';
      // 从接口再拿一次详情
      const res = await this.requestInstance.setParam('/basis/findActivityById', { id: editItem.id, dataType: 1 }).doRequest();
      this.formModel = { ...res };
      this.formModel.startTime = res.startTimeStr;
      this.formModel.endTime = res.endTimeStr;
      this.formModel.sharePicture = res.sharePicture;
    } else {
      this.dialogTitle = '新建活动';
      this.formModel = { ...this.defaultFormModel };
    }
    this.dialogVisible = true;
    this.resetFields();
  }

  get defaultFormModel(): ActivityModel {
    return {
      activityTitle: '',
      remarkName: '',
      viewPermissions: 1,
      ynShare: 1, // 0不可分享，1可以分享
      sharePictureModel: [],
      sharePicture: '',
      shareContent: '',
      startTime: '',
      endTime: '',
      activityMd: '',
      dataType: 1
    };
  }

  get formState(): Array<formItem> {
    const arr = [
      {
        formLabel: '活动标题：',
        modelKey: 'activityTitle',
        formRules: [
          this.$utils.textLenValidator(25, '活动标题')
        ],
        inputTag: 'el-input',
        inputProps: {
          maxLength: 25,
          placeholder: '最多输入25个字'
        }
      },
      {
        formLabel: '备注名称：',
        modelKey: 'remarkName',
        inputTag: 'el-input',
        formRules: [
          this.$utils.textLenValidator(20, '备注名称')
        ],
        inputProps: {
          maxlength: 25,
          placeholder: '仅供运营识别活动，最多可输入20个字，如：9月资产证明'
        }
      },
      {
        formLabel: '浏览条件：',
        modelKey: 'viewPermissions',
        formRules: 'required',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '所有用户',
            value: ActivityViewPermissions.all
          },
          {
            label: '登录用户',
            value: ActivityViewPermissions.onlyLogin
          },
          {
            label: '合格投资者',
            value: ActivityViewPermissions.certificatedUser
          }
        ]
      },
      {
        formLabel: '分享设置：',
        modelKey: 'ynShare',
        formRules: 'required',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '可分享',
            value: 1
          },
          {
            label: '不可分享',
            value: 0
          }
        ]
      },
      this.formModel.ynShare === 1
       ? {
          formLabel: '分享Icon：',
          modelKey: 'sharePicture',
          inputTag: 'share-icon-upload',
          inputProps: {
            requestInstance: this.requestInstance
          }
        } : null,
      this.formModel.ynShare === 1
       ? {
          formLabel: '分享文案：',
          modelKey: 'shareContent',
          formRules: [
            this.$utils.textLenValidator(25, '分享文案')
          ],
          inputTag: 'el-input',
          inputProps: {
            maxlength: 25,
            placeholder: '最多输入25个字'
          }
        } : null,
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
        formLabel: '埋点值T1：',
        modelKey: 'activityMd',
        formRules: [
          this.$utils.textLenValidator(25, '埋点值')
        ],
        inputTag: 'el-input',
        inputProps: {
          type: 'text',
          maxlength: 25,
          placeholder: '最多输入25个字'
        }
      }
    ].filter(item => item);
    return arr as Array<formItem>;
  }

  saveEdit(): void {
    this.getFormRef().getFormValidate()(async(valid: boolean) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      const uri = '/basis/createActivity';
      this.loading = true;
      try {
        const para = { ...this.formModel };
        delete para.sharePictureModel;
        await this.requestInstance.setParam(uri, para).doRequest();
        this.$message.success('操作成功');
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
