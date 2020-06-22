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
export default class ShareDetailList extends Vue {
  @State('shareDetailListState', storeNameSpace) shareDetailListState!: ListViewerState<this>;
  @Mutation('SET_SHARE_DETAIL_LIST_VIEWER_STATE',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('queryShareDetailList', storeNameSpace) queryShareDetailList!: (arg?: any) => Promise<void>;
  requestInstance!: FetchApi;
  loading: boolean = false;
  shareId = '';
  name = 'ShareDetailListPage';

  created() {
    this.setViewerState();
  }

  mounted() {
    this.fetchData();
    this.shareId = this.$route.query.shareId as string;
  }

  activated() {
    if (this.shareId !== this.$route.query.shareId) {
      this.fetchData();
    }
  }

  getLoadParam() {
    const state = this.shareDetailListState;
    return {
      shareId: this.$route.query.shareId,
      ...state.filterModel,
      ...state.paginationState!.getAjaxParam() };
  }

  async fetchData() {
    this.loading = true;
    await this.queryShareDetailList(this.getLoadParam());
    this.loading = false;
  }

  doExport() {
    const uri = '/share/shareDetail/export';
    const arg = {
      sharerName: (this.shareDetailListState.filterModel as any).sharerName,
      shareId: this.shareId
    };
    const query = this.$utils.queryString.stringify(arg);
    window.open(`${uri}?${query}`);
  }

  render(h: CreateElement) {
    const listViewerProps = {
      props: {
        context: this,
        state: this.shareDetailListState
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
