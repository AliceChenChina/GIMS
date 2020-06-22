import FormDialog from '@/components/common/FormDialog';
import { DynamicForm, formItem } from '@/types/types';
import { CreateElement, VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import dynamicForm from 'common/DynamicForm.vue';

interface ConsumerEditModel {
  pinCode: string,
  customerName: string,
  salesName: string,
  customerId: string,
  relationship: number,
  customerFrom: number,
  originSource: number,
  isDjTrade: number,
  referPin: string,
  changeReason: string
}
@Component({
  components: {
    dynamicForm
  }
})
export default class ConsumerEditDialog extends FormDialog<ConsumerEditModel> {
  dialogTitle = '编辑客户';
  labelWidth = '160px';

  get defaultFormModel(): ConsumerEditModel {
    return {
      pinCode: '',
      customerName: '',
      salesName: '',
      customerId: '',
      relationship: 0, // 关联关系
      customerFrom: 0, // 客户来源
      originSource: 1, // 客户初始来源
      isDjTrade: 1, // 东家成交客户
      referPin: '', // 推荐人京东用户名
      changeReason: '' // 调整原因
    };
  }

  get formState(): Array<Array<formItem>> | Array<formItem> {
    const state = [
      {
        formLabel: '京东用户名:',
        modelKey: 'pinCode',
        inputProps: {
          disabled: true
        },
        inputTag: 'el-input'
      },
      {
        formLabel: '客户姓名:',
        modelKey: 'customerName',
        inputProps: {
          disabled: true
        },
        inputTag: 'el-input'
      },
      {
        formLabel: '客户初始来源：',
        modelKey: 'originSource',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '公司获取',
            value: 1
          },
          {
            label: '非公司获取',
            value: 0
          }
        ]
      },
      {
        formLabel: '东家成交客户：',
        modelKey: 'isDjTrade',
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
      }
    ];
    const relatedData = [
      {
        formLabel: '理财师姓名:',
        modelKey: 'salesName',
        inputProps: {
          disabled: true
        },
        inputTag: 'el-input'
      },
      {
        formLabel: '客户来源:',
        modelKey: 'customerFrom',
        formRules: 'required',
        inputTag: 'el-select',
        inputTagOptions: [{ value: 1, label: '自行拓客' },
          { value: 2, label: '老客推荐' },
          { value: 3, label: '公司分配' }]
      },
      {
        formLabel: '关联关系：',
        modelKey: 'relationship',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '绑定',
            value: 1
          },
          {
            label: '专属',
            value: 2
          }
        ]
      },
      {
        formLabel: '推荐人京东用户名',
        modelKey: 'referPin',
        formRules: 'required',
        inputTag: 'el-input'
      }
    ];
    const tail = [
      {
        formLabel: '调整原因:',
        inputTag: 'el-input',
        modelKey: 'changeReason',
        formRules: 'required',
        inputProps: {
          type: 'textarea',
          rows: 10
        }
      }
    ];
    if (this.formModel.relationship !== 0) {
      // @ts-ignore
      state.push.apply(state, relatedData);
    }
    // @ts-ignore
    state.push.apply(state, tail);
    if (this.formModel.relationship !== 0 && this.formModel.customerFrom !== 2) {
      state.splice(state.length - 2, 1);
    }
    return state;
  }

  saveEdit(): void {
    this.getFormRef().getFormValidate()(async(valid: boolean) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      const uri = '/customerOverview/editCustomer';
      this.loading = true;
      const para = {
        source: 0,
        originSource: 1,
        isDjTrade: 1,
        customerFrom: '',
        relationship: 0,
        referPin: '',
        changeReason: '',
        customerId: ''
      };
      para.originSource = this.formModel.originSource;
      para.isDjTrade = this.formModel.isDjTrade;
      para.customerFrom = this.formModel.customerFrom + '';
      para.relationship = this.formModel.relationship;
      para.referPin = this.formModel.referPin + '';
      para.changeReason = this.formModel.changeReason;
      para.source = this.formModel.customerFrom;
      para.customerId = this.formModel.customerId;
      try {
        await this.$fetch.setParam(uri, para).doRequest();
        this.$message.success('保存成功');
        this.emitSaveSuccess();
        this.dialogVisible = false;
      } catch (msg) {
        this.$message.error(msg);
        this.dialogVisible = true;
      }
      this.loading = false;
      // this.dialogVisible = false;
    });
  }

  @Watch('formModel.customerFrom', { deep: true })
  handleCustomerFromChange() {
    this.resetFields();
  }

  render(h: CreateElement): VNode {
    return super.renderElDialog(h, this);
  }
}
