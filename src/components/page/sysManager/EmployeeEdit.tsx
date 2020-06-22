import { CreateElement } from 'vue';
import { Component, Emit, Vue } from 'vue-property-decorator';
import ListViewer from 'common/ListViewer.vue';
import dynamicForm from 'common/DynamicForm.vue';
import { State } from 'vuex-class';
import { dynamicFormState, DynamicForm } from '@/types/types';
import { sysManagerState } from '@/store/modules/systemManager/state';
import { employeeEditFields } from '@/components/page/sysManager/employeeEditFields';
import './sysManage.scss';
import { EmployeeUser } from '@/components/page/sysManager/model/EmployeeUser';
import { deptItem } from '@/store/modules/systemManager/types';
import { textValidator, ValidateType } from '@/utils/FieldValidator';

interface cascaderItem {
  label: string,
  value: number,
  children?: Array<cascaderItem>
}

@Component({
  components: {
    ListViewer, dynamicForm
  }
})
export default class EmployeeEdit extends Vue {
  @State('sysManager') sysManagerState!: sysManagerState;

  loading: boolean = false;
  user!: EmployeeUser;
  defaultUser: EmployeeUser;
  dialogVisible: boolean = false;
  dialogTitle = '';

  constructor() {
    super();
    this.defaultUser = EmployeeUser.getDefaultUser();
    this.user = this.defaultUser;
  }

  get formItems(): dynamicFormState {
    return employeeEditFields(this);
  }

  get deptCascaderOptions() {
    return [this.getDeptTree(this.sysManagerState.deptTreeData)];
  }

  handleFormChange(value: any) {
    this.user.setData(value);
  }

  showEditDialog(user?: any) {
    // 加载完成，移除验证结果
    setTimeout(() => {
      (this.$refs.edit_form as any).clearFormValid();
    });
    this.dialogVisible = true;
    if (user) {
      this.dialogTitle = '编辑用户';
      this.user = EmployeeUser.fromJSONObject(user);
      this.user.setDeptIdWithPath(this.sysManagerState.deptTreeData);
    } else {
      // 没有user对象则为添加
      this.dialogTitle = '添加用户';
      this.user = EmployeeUser.getDefaultUser();
    }
  }

  hideEditDialog() {
    this.dialogVisible = false;
  }

  getDeptTree(node: deptItem) {
    const children: Array<cascaderItem> = node.children.map(child => {
      return this.getDeptTree(child);
    });
    const rt = {
      label: node.name,
      value: node.deptId,
      children
    };
    if (rt.children.length === 0) {
      delete rt.children;
    }
    return rt;
  }

  saveEdit() {
    (this.$refs.edit_form as DynamicForm).getFormValidate()(async(valid: boolean) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      let uri = '/systemSetting/employee/add';
      if (this.user.empId) {
        uri = '/systemSetting/employee/update';
      }
      this.loading = true;
      try {
        const para = this.user.getJson();
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
        'label-width': '120px',
        form: this.formItems,
        model: this.user
      },
      on: {
        onFormChange: this.handleFormChange
      }
    };
    return (
      <el-dialog title={this.dialogTitle} visible={this.dialogVisible}
                 {...{ on: { 'update:visible': this.hideEditDialog } }}
                 width="80%"
                 class="employee-edit">
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
