import FormDialog from '@/components/common/FormDialog';
import { ActivityItem, ArticleModel, ActivityViewPermissions } from '@/store/modules/activity/types';
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
export default class CreateActivityDialog extends FormDialog<ArticleModel> {
  dialogTitle = '';

  resultWrapper = new ActivityResultWrapper();
  requestInstance!: FetchApi;
  className = 'create-activity-dialog';

  created() {
    this.requestInstance = FetchApiFactory.getFetchInstance('/activity', false, this.resultWrapper);
  const type = this.statusArgsWithElOptionsTag('product_type');
  }

  statusArgsWithElOptionsTag(groupKey) {
    const argEnum = this.$store.state.argEnum || {};
    const enumArgs = argEnum[groupKey] || {};
    const options = Object.keys(enumArgs).map(key => {
      if (/^[^\u4e00-\u9fa5]+$/.test(key)) {
        return {
          label: enumArgs[key],
          value: /^\d+$/.test(key) ? parseInt(key) : key
        };
      }
    });
    return options.filter(nodes => nodes);
  }

  async showEditDialog(editItem?: ArticleModel | ActivityItem) {
    if (editItem) {
      this.dialogTitle = '编辑文章规则';
      // 从接口再拿一次详情
      const res = await this.requestInstance.setParam('/basis/findActivityById', { id: editItem.id, dataType: 2 }).doRequest();
      this.formModel = { ...res };
      this.formModel.startTime = res.startTimeStr;
      this.formModel.endTime = res.endTimeStr;
      this.formModel.sharePicture = res.sharePicture;
      this.formModel.labelArr = (res.labels && res.labels.split(',')) || [];
      console.log('this.formModel', this.formModel.labelArr);
    } else {
      this.dialogTitle = '新建文章规则';
      this.formModel = { ...this.defaultFormModel };
    }
    this.dialogVisible = true;
    this.resetFields();
  }

  get defaultFormModel(): ArticleModel {
    return {
      activityTitle: '',
      remarkName: '',
      viewPermissions: 1,
      ynShare: 1, // 0不可分享，1可以分享
      sharePictureModel: [],
      sharePicture: 'http://test.storage.jd.com/adms-picture/202005/17/OcPnpkho.png',
      shareContent: '',
      startTime: '',
      endTime: '',
      activityMd: '',
      dataType: 2,
      labels: '',
      labelArr: []
    };
  }

  get formState(): Array<formItem> {
    const arr = [
      {
        formLabel: '文章标题：',
        modelKey: 'activityTitle',
        formRules: [
          this.$utils.textLenValidator(64, '文章标题')
        ],
        inputTag: 'el-input',
        inputProps: {
          maxLength: 64,
          placeholder: '最多输入64个字'
        }
      },
      {
        formLabel: '文章摘要：',
        modelKey: 'remarkName',
        inputTag: 'el-input',
        formRules: [
          this.$utils.textLenValidator(100, '文章摘要')
        ],
        inputProps: {
          maxlength: 100,
          row: 2,
          type: 'textarea',
          placeholder: '最多可输入100个字'
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
            formLabel: '分享Icon：',
            modelKey: 'sharePicture',
            inputTag: 'share-icon-upload',
            formRules: 'required',
            inputProps: {
              requestInstance: this.requestInstance
            }
          },{
            formLabel: '分享文案：',
            modelKey: 'shareContent',
            formRules: [
              this.$utils.textLenValidator(50, '分享文案')
            ],
            inputTag: 'el-input',
            inputProps: {
              maxlength: 50,
              placeholder: '最多输入50个字'
            }
          },
      {
        formLabel: '开始时间：',
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
        formLabel: '结束时间：',
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
        formLabel: '埋点值：',
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
      },
      {
        formLabel: '产品类型：',
        modelKey: 'productType',
        inputTag: 'el-select',
        inputTagOptions: this.statusArgsWithElOptionsTag('article_product_type')
      },
      {
        formLabel: '标签：',
        modelKey: 'labelArr',
        inputTag: 'el-tag',
        inputProps: {
          requestInstance: this.requestInstance
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
        para.labels = para.labelArr.join(',');
        console.log('para', para);
        delete para.sharePictureModel;
        await this.requestInstance.setParam(uri, para).doRequest();
        this.$message.success('创建成功');
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
