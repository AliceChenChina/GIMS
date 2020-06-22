import { Component, Vue } from 'vue-property-decorator';
import ListViewer from 'common/ListViewer.vue';
import EmployeeEdit from './EmployeeEdit';
import { State, Mutation, Action } from 'vuex-class';
import { ListViewerState } from '@/types/types';
import { sysManagerState } from '@/store/modules/systemManager/state';
import { BindingOptions } from 'vuex-class/lib/bindings';
import { RoleItem } from '@/components/page/sysManager/model/RoleItem';
import { EmployeeUser } from '@/components/page/sysManager/model/EmployeeUser';
import { roleListStateType } from '@/store/pageConf/sysManager/roleList';

const storeNameSpace: BindingOptions = { namespace: 'sysManager' };

@Component({
  components: {
    ListViewer, EmployeeEdit
  }
})
export default class RoleList extends Vue {
  @State('sysManager') sysManagerState!: sysManagerState;
  @Mutation('SET_ROLELIST_VIEWER_STATE',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('getRoleList', storeNameSpace) getRoleList!: (arg: any) => Promise<void>;
  @Action('getRolePower', storeNameSpace) getRolePower!: (arg: { roleId: number }) => Promise<void>;
  name: string = 'RoleList';
  loading: boolean = false;
  onSelectList:Array<RoleItem> = [];
  empUsers: Array<EmployeeUser> = [];

  get tableViewerState(): ListViewerState<roleListStateType> {
    return this.sysManagerState.roleListState;
  };

  async mounted() {
    await this.fetchData();
  }

  getLoadParam() {
    const state = this.tableViewerState;
    return { ...state.filterModel,
      ...state.paginationState!.getAjaxParam()
    };
  }

  handleSelectionChange(selected: Array<RoleItem>) {
    this.onSelectList = selected;
  }

  async setEmployeeRole() {
    // roleId只能是一个
    const uri = '/systemSetting/employee/setEmployeeRole';
    const para = this.empUsers.map(selectedEmpUser => {
      return {
        empId: selectedEmpUser.empId,
        roleId: this.onSelectList[0].roleId
      };
    });
    try {
      this.loading = true;
      await this.$fetch.setParam(uri, para).doRequest();
      this.loading = false;
      this.$message.success('设置成功！');
    } catch (msg) {
      throw new Error(msg);
    }
    this.loading = false;
  }

  async fetchData() {
    this.loading = true;
    await this.getRoleList(this.getLoadParam());
    this.loading = false;
  }
}
