import { CreateElement } from 'vue';
import ListViewer from 'common/ListViewer.vue';
import EmployeeEdit from './EmployeeEdit';
import { State, Mutation, Action } from 'vuex-class';
import { ListViewerState, Selector } from '@/types/types';
import { sysManagerState } from '@/store/modules/systemManager/state';
import { BindingOptions } from 'vuex-class/lib/bindings';
import './sysManage.scss';
import RoleList from '@/components/page/sysManager/roleList';
import Component from 'vue-class-component';
import { Emit, Prop, Vue } from 'vue-property-decorator';
import { EmployeeUser } from '@/components/page/sysManager/model/EmployeeUser';
import selector from '@/components/common/Selector.vue';
import { RoleItem } from '@/components/page/sysManager/model/RoleItem';
import { deptItem } from '@/store/modules/systemManager/types';
import { Powers } from '@/utils/powers';

// vue文件改造为ts+jsx写法，即tsx
// 参考https://segmentfault.com/a/1190000011878086
// vuex使用 https://juejin.im/post/5c46c625e51d456e4138fa82

const storeNameSpace: BindingOptions = { namespace: 'sysManager' };

@Component({
  components: {
    selector, EmployeeEdit
  }
})
class RoleListSelector extends RoleList {
  created() {
    this.setViewerState('emp_list');
  }

  async showEditDialog(empUsers: Array<EmployeeUser>) {
    this.setViewerState('emp_list');
    (this.$refs.selector as Selector).showDialog();
    setTimeout(async() => {
      const employeeRoleUri = '/systemSetting/employee/getEmployeeRole';
      const res = await this.$fetch.setParam(employeeRoleUri, { empId: empUsers[0].empId }).doRequest();
      const recordsList = this.tableViewerState.tableData.records;
      const dyTableRef = (this.$refs.selector as any).getDyTableRef();
      if (res.length) {
        const row = recordsList.filter((item) => item.roleId === res[0].roleId);
        if (row.length > 0) {
          dyTableRef.toggleSelection(row[0]);
          this.onSelectList = row;
        }
      }
      this.empUsers = empUsers;
    });
  }

  hideEditDialog() {
    (this.$refs.selector as Selector).hideDialog();
  }

  async saveRoleChoose() {
    try {
      this.loading = true;
      await this.setEmployeeRole();
      this.loading = false;
      this.emitSaveRoleChoose();
      this.hideEditDialog();
    } catch (msg) {
      this.$message.error(msg);
    }
  }

  @Emit('saveRoleChoose')
  emitSaveRoleChoose() {}

  render(h: CreateElement) {
    const selectorProps = {
      props: {
        context: this,
        state: this.tableViewerState,
        loading: this.loading,
        title: '选择角色'
      },
      on: {
        onFetchData: this.fetchData,
        onSelectionChange: this.handleSelectionChange,
        onSelectionConfirm: this.saveRoleChoose
      }
    };
    return (
      <selector ref="selector" class="emp-role-select" { ...selectorProps } />
    );
  }
}

@Component({
  components: {
    ListViewer, EmployeeEdit, RoleListSelector
  }
})
export default class EmployeeList extends Vue {
  @State('sysManager') sysManagerState!: sysManagerState;
  @Mutation('SET_DEPARTMENT_DATA',
    storeNameSpace
  ) profileLoaded!: Function;
  @Mutation('SET_EMPLOYEE_LIST_VIEWER_STATE',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('getDepartmentList', storeNameSpace) getDepartmentList!: (arg: any) => Promise<void>;
  @Action('getSysEmployee', storeNameSpace) getEmployee!: (arg?: any) => Promise<void>;
  name: string = 'EmployeeList';
  elTreeProps = {
    label: 'name',
    children: 'children'
  };
  loading: boolean = false;
  selectedUsers: Array<EmployeeUser> = [];
  order: string = '';
  orderColumn: string = '';
  currentDeptItem!: deptItem;

  @Prop() private someProps!: string;

  get tableViewerState(): ListViewerState<EmployeeList> {
    return this.sysManagerState.employeeListState;
  };

  get elTreeData() {
    return [{
      name: '所有部门',
      children: [this.sysManagerState.deptTreeData],
      deptId: -1
    }];
  }

  created() {
    this.setViewerState();
  }

  async mounted() {
    await this.getDepartmentList({
      pageNumber: 1,
      pageSize: 99999
    });
    await this.fetchData();
  }

  async editUser(user: EmployeeUser) {
    // 其实这里user类型取any还是EmployeeUser有点纠结
    // 由于目前ListViewer这个组件里面还是以普通对象的形式存在，没有升级到EmployeeUser实体
    // 导致这里的user对象实际上是没有EmployeeUser里面的方法，只有属性对应
    await this.$power.checkPower(Powers.sysEditUser);
    (this.$refs.emp_edit as EmployeeEdit).showEditDialog(user);
  }

  handleSortChange(event: any) {
    let order;
    if (event.order === 'descending') {
      order = 'desc';
    } else {
      order = 'asc';
    }
    this.orderColumn = event.prop;
    this.order = order;
    this.fetchData();
  }

  // 设置角色
  async editRole(user: EmployeeUser) {
    await this.$power.checkPower(Powers.sysSetRole);
    (this.$refs.role_select as RoleListSelector).showEditDialog([user]);
  }

  getLoadParam(): any {
    const state = this.tableViewerState;
    const ids: Array<Number> = [];
    function flatIds(node: deptItem) {
      ids.push(node.deptId);
      for (const child of node.children) {
        flatIds(child);
      }
    }
    const params = { ...state.filterModel,
      ...state.paginationState!.getAjaxParam(),
      order: this.order,
      column: this.orderColumn,
      deptIds: ''
    };
    if (!this.currentDeptItem || this.currentDeptItem.deptId === -1) return params;
    flatIds(this.currentDeptItem);
    params.deptIds = ids.join(',');
    return params;
  }

  async delUser(user: EmployeeUser) {
    await this.$power.checkPower(Powers.sysDelUser);
    this.$elAlert({
      msg: '确认删除这个用户吗？',
      onConfirm: async() => {
        await this.commitDelUsers(user.empId.toString());
      }
    });
  }

  async resetUserPwd(user: EmployeeUser) {
    await this.$power.checkPower(Powers.sysResetPwd);
    this.$elAlert({
      msg: '确认要重置该员工的密码？',
      onConfirm: async() => {
        const uri = '/systemSetting/employee/resetPwd';
        this.loading = true;
        try {
          this.loading = true;
          await this.$fetch.setParam(uri, { empId: user.empId }).doRequest();
          this.loading = false;
          this.$message.success('重置成功！');
          this.fetchData();
        } catch (msg) {
          this.$message.error(msg);
        }
        this.loading = false;
      }
    });
  }

  // 删除用户，多个用逗号隔开
  async commitDelUsers(empIds: string) {
    const uri = '/systemSetting/employee/delete';
    this.loading = true;
    try {
      this.loading = true;
      await this.$fetch.setParam(uri, { empIds: empIds }).doRequest();
      this.loading = false;
      this.$message.success('删除成功！');
      this.fetchData();
    } catch (msg) {
      this.$message.error(msg);
    }
    this.loading = false;
  }

  selectionChange(users: Array<EmployeeUser>) {
    this.selectedUsers = users;
  }

  async fetchData() {
    this.loading = true;
    await this.getEmployee(this.getLoadParam());
    this.loading = false;
  }

  async addUser() {
    await this.$power.checkPower(Powers.sysAddUser);
    (this.$refs.emp_edit as EmployeeEdit).showEditDialog();
  }
  async downloadCreditCard() {
    window.open('/djjf-web/systemSetting/employee/exportCardInfo');
  }

  async deptNodeClick(deptItem: deptItem) {
    this.currentDeptItem = deptItem;
    (this.$refs.data_viewer as any).paginationState.currentPageNo = 1;
    this.loading = true;
    await this.getEmployee(this.getLoadParam());
    this.loading = false;
  }

  render(h: CreateElement) {
    const elTreeProps = {
      props: {
        data: this.elTreeData,
        props: this.elTreeProps,
        'node-key': 'deptId',
        'default-expanded-keys': [1]
      },
      on: {
        'node-click': this.deptNodeClick
      }
    };
    const listViewerProps = {
      props: {
        data: this.elTreeData,
        props: this.elTreeProps,
        context: this,
        state: this.tableViewerState
      },
      on: {
        onSelectionChange: this.selectionChange,
        onFetchData: this.fetchData,
        onSortChange: this.handleSortChange
      }
    };
    return (
      <el-card class="employee-list" v-loading={ this.loading }>
        <el-row>
          <el-col span={ 4 }>
            <el-tree { ...elTreeProps } />
          </el-col>
          <el-col span={ 20 } class="table-view">
            <list-viewer ref="data_viewer" { ...listViewerProps } />
          </el-col>
        </el-row>
        <employee-edit ref="emp_edit" onSaveSuccess={ this.fetchData }/>
        <role-list-selector ref="role_select"/>
      </el-card>
    );
  }
}
