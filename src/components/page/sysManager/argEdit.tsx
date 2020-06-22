import { CreateElement } from 'vue';
import { Component, Emit, Vue } from 'vue-property-decorator';
import ListViewer from 'common/ListViewer.vue';
import dynamicForm from 'common/DynamicForm.vue';
import { dynamicFormState, DynamicForm } from '@/types/types';
import './sysManage.scss';
import { textValidator, ValidateType } from '@/utils/FieldValidator';

interface argItem {
  argGroup: string,
  argCode: string,
  argText: string,
  seq: string,
  id?: string | number
}

@Component({
  components: {
    ListViewer, dynamicForm
  }
})
export default class ArgEdit extends Vue {
  loading: boolean = false;
  argItem!: argItem;
  defaultArg: argItem;
  dialogVisible: boolean = false;
  dialogTitle = '';

  constructor() {
    super();
    this.defaultArg = {
      argGroup: '',
      argCode: '',
      argText: '',
      seq: ''
    };
    this.argItem = this.defaultArg;
  }

  get formItems(): dynamicFormState {
    return [
      [
        {
          formLabel: '字典分组：',
          modelKey: 'argGroup',
          formRules: 'required',
          inputTag: 'el-input'
        }
      ],
      [
        {
          formLabel: '字典编码：',
          modelKey: 'argCode',
          formRules: 'required',
          inputTag: 'el-input',
          inputProps: {
            type: 'number'
          }
        }
      ],
      [
        {
          formLabel: '字典文本：',
          modelKey: 'argText',
          formRules: 'required',
          inputTag: 'el-input'
        }
      ],
      [
        {
          formLabel: '排序：',
          modelKey: 'seq',
          formRules: 'required',
          inputTag: 'el-input',
          inputProps: {
            type: 'number'
          }
        }
      ]
    ];
  }

  handleFormChange(value: any) {
    this.argItem = { ...value };
  }

  hideEditDialog() {
    this.dialogVisible = false;
  }

  showEditDialog(argItem?: argItem) {
    this.dialogVisible = true;
    if (argItem) {
      this.dialogTitle = '编辑数据字典';
      this.argItem = { ...argItem };
    } else {
      // 没有argItem对象则为添加
      this.dialogTitle = '添加数据字典';
      this.argItem = { ...this.defaultArg };
    }
  }

  saveEdit() {
    (this.$refs.edit_form as DynamicForm).getFormValidate()(async(valid: boolean) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      const uri = '/systemSetting/arg/save';
      this.loading = true;
      try {
        const para = { ...this.argItem };
        await this.$fetch.setParam(uri, para).doRequest();
        this.$message.success('保存成功');
        this.emitSaveSuccess();
        this.dialogVisible = false;
      } catch (msg) {
        this.$message.error(msg);
      }
      this.loading = false;
    });
  }

  @Emit('saveSuccess')
  emitSaveSuccess() {}

  validateText(type: ValidateType, isRequired: boolean) {
    return (rule: any, value: string, callback: Function) =>
      textValidator(value, type, isRequired) ? callback() : callback(new Error('请输入正确的格式'));
  }

  render(h: CreateElement) {
    const dyFormProps = {
      props: {
        'label-width': '140px',
        form: this.formItems,
        model: this.argItem
      },
      on: {
        onFormChange: this.handleFormChange
      }
    };
    return (
      <el-dialog title={ this.dialogTitle }
                 visible={this.dialogVisible}
                 {...{ on: { 'update:visible': this.hideEditDialog } }}
                 width="40%" class="arg-item-edit">
        <dynamic-form
          v-loading={this.loading}
          ref="edit_form"
          {...dyFormProps}
        />
        <span slot="footer" class="dialog-footer">
          <el-button onClick={this.hideEditDialog}>取 消</el-button>
          <el-button type="primary" onClick={this.saveEdit}>保 存</el-button>
        </span>
      </el-dialog>
    );
  }
}

export { argItem };
