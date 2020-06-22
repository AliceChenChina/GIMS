import { Component, Vue } from 'vue-property-decorator';
import ListViewer from 'common/ListViewer.vue';
import EmployeeEdit from './EmployeeEdit';
import { State, Mutation, Action } from 'vuex-class';
import { ListViewerState } from '@/types/types';
import { sysManagerState } from '@/store/modules/systemManager/state';
import { BindingOptions } from 'vuex-class/lib/bindings';
import { CreateElement } from 'vue';
import { roleListStateType } from '@/store/pageConf/sysManager/roleList';
import { Powers } from '@/utils/powers';
import { ElPowerTreeItem } from '@/store/modules/systemManager/types';

const storeNameSpace: BindingOptions = { namespace: 'sysManager' };

@Component({
  components: {
    ListViewer, EmployeeEdit
  }
})
export default class PowerList extends Vue {
  @State('sysManager') sysManagerState!: sysManagerState;
  @State powerListState!: ElPowerTreeItem;
  @Mutation('SET_ROLELIST_VIEWER_STATE',
    storeNameSpace
  ) setRoleListViewerState!: Function;
  @Action('getRoleList', storeNameSpace) getRoleList!: (arg: any) => Promise<void>;
  @Action('getPowerList') getPowerList!: () => Promise<void>;
  @Action('getRolePower', storeNameSpace) getRolePower!: (arg: { roleId: number }) => Promise<Array<any>>;
  name: string = 'PowerList';
  loading: boolean = false;
  defaultKeys: Array<number> = [];
  selectedRoleId: number = 0;

  get tableViewerState(): ListViewerState<roleListStateType> {
    return this.sysManagerState.roleListState;
  };

  get powerTreeState(): Array<ElPowerTreeItem> {
    return [this.powerListState];
  };

  created() {
    this.setRoleListViewerState('power_list');
  }

  activated() {
    this.setRoleListViewerState('power_list');
  }

  async mounted() {
    await this.fetchData();
  }

  getLoadParam() {
    const state = this.tableViewerState;
    const ajaxParam = state.paginationState!.getAjaxParam();
    // ajaxParam.pageSize = 100;
    return { ...state.filterModel, ...ajaxParam };
  }

  async handleRoleChooseChange(role: { roleId: number }) {
    this.selectedRoleId = role.roleId;
    this.loading = true;
    const res = await this.getRolePower({ roleId: role.roleId });
    this.defaultKeys = res.map((powerItem: { powerId: number, roleId: number }) => powerItem.powerId);
    (this.$refs.power_tree as any).setCheckedKeys(this.defaultKeys);
    this.loading = false;
  }

  async saveRolePower() {
    await this.$power.checkPower(Powers.sysPowerListSave);
    if (!this.selectedRoleId) {
      this.$message.error('请选择一个角色');
      return;
    }
    const arg = {
      roleId: this.selectedRoleId,
      powerIds: (this.$refs.power_tree as any).getCheckedKeys().join(',')
    };
    // roleId只能是一个
    const uri = '/systemSetting/role/setRolePower';
    try {
      this.loading = true;
      await this.$fetch.setParam(uri, arg).doRequest();
      this.loading = false;
      this.$message.success('设置成功！');
    } catch (msg) {
      throw new Error(msg);
    }
    this.loading = false;
  }

  async fetchData() {
    this.loading = true;
    this.getPowerList();
    await this.getRoleList(this.getLoadParam());
    this.loading = false;
  }

  render(h: CreateElement) {
    const powerTreeProps = {
      props: {
        label: 'name',
        children: 'children',
        'show-checkbox': true,
        'node-key': 'powerId',
        'default-expanded-keys': this.defaultKeys,
        'check-strictly': true, // 父子节点的选择不进行关联
        data: this.powerTreeState
      }
    };
    const listViewerProps = {
      props: {
        context: this,
        state: this.tableViewerState
      },
      on: {
        onFetchData: this.fetchData,
        onCurrentChange: this.handleRoleChooseChange
      }
    };
    return (
      <el-card class="power-list" v-loading={ this.loading }>
        <el-row>
          <el-col span={ 12 } class="table-view">
            <list-viewer ref="data_viewer" { ...listViewerProps } />
          </el-col>
            <el-col span={ 12 }>
              {
                this.selectedRoleId
                  ? (<el-tree ref="power_tree" style={"overflow-y:scroll;-webkit-overflow-scrolling:touch;height:100vh;margin-top:62px;margin-bottom:22px;"} class="power-tree" { ...powerTreeProps } />)
                  : (<p style="padding: 62px;">请选择一个角色...</p>)
              }
            </el-col>
        </el-row>
      </el-card>
    );
  }
}

export { ElPowerTreeItem };
