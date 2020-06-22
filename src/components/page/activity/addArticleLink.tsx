import FormDialog from '@/components/common/FormDialog';
import { LinkModel } from '@/store/modules/activity/types';
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
export default class CreateActivityDialog extends FormDialog<LinkModel> {
  dialogTitle = '外部文章链接';
  resultWrapper = new ActivityResultWrapper();
  requestInstance!: FetchApi;
  className = 'create-activity-dialog';

  created() {
    this.requestInstance = FetchApiFactory.getFetchInstance('/activity', false, this.resultWrapper);
  }

  async showEditDialog() {
      this.formModel = { ...this.defaultFormModel };
    this.dialogVisible = true;
    this.resetFields();
  }

  get defaultFormModel(): LinkModel {
    return {
      url: ''
    };
  }

  get formState(): Array<formItem> {
    const arr = [
      {
        formLabel: ' ',
        modelKey: 'url',
        inputTag: 'el-input',
        formRules: 'required'
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
      const uri = '/readArticle';
      this.loading = true;
      try {
        const para = { ...this.formModel };
        await this.requestInstance.setParam(uri, para).doRequest();
        this.$message.success('导入成功');
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
