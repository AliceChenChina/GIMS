import { CreateElement } from 'vue';
import ListViewer from 'common/ListViewer.vue';
import './sysManage.scss';
import RoleList from '@/components/page/sysManager/roleList';
import { DynamicForm, dynamicFormState } from '@/types/types';
import { Component, Emit, Vue } from 'vue-property-decorator';
import dynamicForm from 'common/DynamicForm.vue';
import { Powers } from '@/utils/powers';

class RoleItem {
  name = '';
  remark = '';
  roleId = 0;
}

@Component({
  components: {
    dynamicForm
  }
})
class RoleItemEdit extends Vue {
  loading = false;
  dialogVisible = false;
  isReadOnly = false;
  roleItem!: RoleItem;
  defaultRoleItem: RoleItem = {
    roleId: 0,
    remark: '',
    name: ''
  };

  get formItems(): dynamicFormState {
    return [
      [
        {
          formLabel: '角色名称：',
          modelKey: 'name',
          formRules: 'required',
          inputTag: 'el-input',
          inputProps: {
            disabled: this.isReadOnly
          }
        }
      ],
      [
        {
          formLabel: '角色描述：',
          modelKey: 'remark',
          inputTag: 'el-input',
          inputProps: {
            disabled: this.isReadOnly
          }
        }
      ]
    ];
  }

  showEditDialog(roleItem?: RoleItem) {
    this.dialogVisible = true;
    this.isReadOnly = false;
    if (roleItem) {
      this.roleItem = { ...roleItem };
    } else {
      this.roleItem = { ...this.defaultRoleItem };
    }
  }

  showEditReadOnly(roleItem: RoleItem) {
    this.isReadOnly = true;
    this.dialogVisible = true;
    this.roleItem = { ...roleItem };
  }

  handleFormChange(value: any) {
    this.roleItem = { ...value };
  }

  hideEditDialog() {
    this.dialogVisible = false;
  }

  saveEdit() {
    (this.$refs.workday_form as DynamicForm).getFormValidate()(async(valid: boolean) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      const uriBase = '/systemSetting/role/';
      let uri;
      if (this.roleItem.roleId === 0) {
        uri = uriBase + 'save';
      } else {
        uri = uriBase + 'update';
      }
      this.loading = true;
      try {
        await this.$fetch.setParam(uri, this.roleItem).doRequest();
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

  render(h: CreateElement) {
    const dyFormProps = {
      props: {
        'label-width': '120px',
        form: this.formItems,
        model: this.roleItem
      },
      on: {
        onFormChange: this.handleFormChange
      }
    };
    return (
      <el-dialog title="编辑角色" visible={this.dialogVisible} width="30%" {...{ on: { 'update:visible': this.hideEditDialog } }}>
        <dynamic-form
          v-loading={this.loading}
          ref="workday_form"
          {...dyFormProps}
        />
        { !this.isReadOnly ? (<span slot="footer" class="dialog-footer">
          <el-button onClick={this.hideEditDialog}>取 消</el-button>
          <el-button type="primary" onClick={this.saveEdit}>保 存</el-button>
          </span>)
          : (<span slot="footer" class="dialog-footer">
          <el-button onClick={this.hideEditDialog}>关 闭</el-button>
        </span>)
        }
      </el-dialog>
    );
  }
}

@Component({
  components: {
    ListViewer, 'role-edit': RoleItemEdit
  }
})
export default class RoleListPage extends RoleList {
  created() {
    this.setViewerState();
  }

  async editRoleItem(roleItem: RoleItem) {
    await this.$power.checkPower(Powers.sysRoleListEdit);
    (this.$refs.role_edit as RoleItemEdit).showEditDialog(roleItem);
  }

  async addRoleItem() {
    await this.$power.checkPower(Powers.sysRoleListAdd);
    (this.$refs.role_edit as RoleItemEdit).showEditDialog();
  }

  onEditSuccess() {
    (this.$refs.role_edit as RoleItemEdit).hideEditDialog();
    this.fetchData();
  }

  async roleItemDetail(roleItem: RoleItem) {
    await this.$power.checkPower(Powers.sysRoleListView);
    (this.$refs.role_edit as RoleItemEdit).showEditReadOnly(roleItem);
  }

  activated() {
    this.setViewerState();
  }

  async delRoleItem(roleItem: RoleItem) {
    await this.$power.checkPower(Powers.sysRoleListDel);
    this.$elAlert({
      msg: '确认要删除该条数据吗？',
      onConfirm: async() => {
        const uri = '/systemSetting/role/remove';
        const queryEmployeeUri = '/systemSetting/employee/getEmployeeRoleByRoleId';
        this.loading = true;
        try {
          const res = await this.$fetch.setParam(queryEmployeeUri, { roleId: roleItem.roleId }).doRequest();
          if (res.length) {
            this.$message.error('该角色已绑定员工,不能直接删除');
            this.loading = false;
            return;
          }
          this.loading = true;
          await this.$fetch.setParam(uri, { roleId: roleItem.roleId }).doRequest();
          this.loading = false;
          this.$message.success('删除成功！');
          this.fetchData();
        } catch (msg) {
          this.$message.error(msg);
        }
        this.loading = false;
      }
    });
  }

  render(h: CreateElement) {
    const listViewerProps = {
      props: {
        context: this,
        state: this.tableViewerState
      },
      on: {
        onFetchData: this.fetchData
      }
    };
    return (
      <el-card class="employee-list role-list" v-loading={this.loading}>
        <list-viewer ref="data_viewer" {...listViewerProps} />
        <role-edit ref="role_edit" onSaveSuccess={this.onEditSuccess} />
      </el-card>
    );
  }
}
