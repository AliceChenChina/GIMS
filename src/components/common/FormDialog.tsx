import { CreateElement, VNode } from 'vue';
import ListViewer from '@/components/common/ListViewer.vue';
import RoleList from '@/components/page/sysManager/roleList';
import { DynamicForm, dynamicFormState } from '@/types/types';
import { Emit, Vue, Component } from 'vue-property-decorator';
import dynamicForm from '@/components/common/DynamicForm.vue';

/*
表单编辑弹出框抽象类
子类需要加上Component装饰器，因为装饰器目前不支持直接加在抽象类上
@Component({
  components: {
    dynamicForm
  }
})
 */
export default abstract class FormDialog<T> extends Vue {
  abstract dialogTitle: string;
  loading = false;
  dialogVisible = false;
  formModel: T = {} as T; // 当前表单绑定的数据对象
  labelWidth = '130px';
  className = '';
  isAdd = false;

  abstract get formState(): dynamicFormState;
  abstract get defaultFormModel(): T; // 为空时默认表单

  showEditDialog(editItem?: T) {
    this.dialogVisible = true;
    this.resetFields();
    if (editItem) {
      this.isAdd = false;
      this.formModel = { ...editItem };
    } else {
      this.isAdd = true;
      this.formModel = { ...this.defaultFormModel };
    }
  }

  handleFormChange(value: T) {
    this.formModel = { ...value };
  }

  hideEditDialog() {
    this.dialogVisible = false;
  }

  getFormRef(): DynamicForm {
    return this.$refs.dialog_edit_form as DynamicForm;
  }

  formValidate(valFn) {
    (this.$refs.dialog_edit_form as DynamicForm).getFormValidate()(valFn);
  }

  resetFields() {
    setTimeout(() => {
      (this.$refs.dialog_edit_form as any).resetFields();
    });
  }

  abstract saveEdit(): void

  @Emit('saveSuccess')
  emitSaveSuccess() {}

  renderElDialog(h: CreateElement, context: Vue) {
    const dyFormProps = {
      props: {
        'label-width': this.labelWidth,
        form: this.formState,
        model: this.formModel
      },
      on: {
        onFormChange: this.handleFormChange.bind(context)
      }
    };
    return (
      <el-dialog title={this.dialogTitle} visible={this.dialogVisible} width="50%" showClose={false} class={this.className}>
        <dynamic-form
          v-loading={this.loading}
          ref="dialog_edit_form"
          class="custom-el-form"
          {...dyFormProps}
        />
        <span slot="footer" class="dialog-footer">
          <el-button onClick={this.hideEditDialog.bind(context)}>取 消</el-button>
          <el-button type="primary" onClick={this.saveEdit.bind(context)}>保 存</el-button>
          </span>
      </el-dialog>
    );
  }

  abstract render(h: CreateElement): VNode;
}
