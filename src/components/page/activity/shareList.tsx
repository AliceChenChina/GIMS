import { CreateElement } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import { BindingOptions } from 'vuex-class/lib/bindings';
import { ListViewerState, Upload, ListViewer } from '@/types/types';
import ArgEdit, { argItem } from '@/components/page/sysManager/argEdit';
import FetchApi from '@/api/fetchApiClass';
import ListViewerComp from 'common/ListViewer.vue';

const storeNameSpace: BindingOptions = { namespace: 'activity' };

@Component({
  components: {
    'list-viewer': ListViewerComp, ArgEdit
  }
})
export default class ShareList extends Vue {
  @State('shareListState', storeNameSpace) shareListState!: ListViewerState<this>;
  @Mutation('SET_SHARE_LIST_VIEWER_STATE',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('queryShareStatisticList', storeNameSpace) queryShareStatisticList!: (arg?: any) => Promise<void>;
  requestInstance!: FetchApi;
  loading: boolean = false;
  name = 'ShareListPage';
  shouldUpdateData = false;

  created() {
    this.setViewerState();
  }

  mounted() {
    this.fetchData();
  }

  getLoadParam() {
    const state = this.shareListState;
    return { ...state.filterModel, ...state.paginationState!.getAjaxParam() };
  }

  async fetchData() {
    this.loading = true;
    await this.queryShareStatisticList(this.getLoadParam());
    this.loading = false;
  }

  gotoDetailList(row) {
    this.$router.push({
      name: 'shareDetailList',
      query: {
        shareId: row.shareId
      }
    });
  }

  doExport() {
    const uri = '/share/shareStatistics/export';
    const arg = {
      shareTitle: (this.shareListState.filterModel as any).shareTitle
    };
    const query = this.$utils.queryString.stringify(arg);
    window.open(`${uri}?${query}`);
  }

  render(h: CreateElement) {
    const listViewerProps = {
      props: {
        context: this,
        state: this.shareListState
      },
      on: {
        onFetchData: this.fetchData
      }
    };
    return (
      <el-card class="employee-list" v-loading={this.loading}>
        <list-viewer ref="data_viewer" {...listViewerProps} />
        <arg-edit ref="arg_edit" onSaveSuccess={ () => this.fetchData() } />
      </el-card>
    );
  }
}
