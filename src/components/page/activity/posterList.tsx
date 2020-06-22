import { CreateElement } from 'vue';
import ListViewerComp from 'common/ListViewer.vue';
import { Component, Vue } from 'vue-property-decorator';
import { Action, BindingOptions, Mutation, State } from 'vuex-class/lib/bindings';
import CreateActivityDialog from '@/components/page/activity/createPoster';
import { PosterItem, ActivityStatus } from '@/store/modules/activity/types';
import FetchApiFactory from '@/api/fetchApi';
import FetchApi from '@/api/fetchApiClass';
import { ActivityResultWrapper } from '@/api/ResultWrapper';
import HotEditDialog from '@/components/page/activity/HotEditDialog';
import { ListViewer, ListViewerState } from '@/types/types';

const storeNameSpace: BindingOptions = { namespace: 'activity' };

@Component({
  components: {
    'list-viewer': ListViewerComp,
    'create-dialog': CreateActivityDialog,
    'hot-edit': HotEditDialog
  }
})
export default class ActivityListPage extends Vue {
  @State('posterListState', storeNameSpace) posterListState!: ListViewerState<this>;
  @Mutation('SET_POSTER_LIST_VIEWER_STATE',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('getPosterList', storeNameSpace) getPosterList!: (arg?: any) => Promise<void>;
  requestInstance!: FetchApi;
  loading: boolean = false;
  name = 'ActivityPage';
  shouldUpdateData = false;

  created() {
    this.setViewerState();
    const resultWrapper = new ActivityResultWrapper();
    this.requestInstance = FetchApiFactory.getFetchInstance('/cmsCfg', false, resultWrapper);
    this.fetchData();
  }
  activated() {
    if (this.shouldUpdateData) {
      this.fetchData();
      this.shouldUpdateData = false;
    }
  }

  getLoadParam() {
    const state = this.posterListState;
    const ajaxParam = state.paginationState!.getAjaxParam();
    const arg = { ...state.filterModel, ...ajaxParam } as { [index: string]: string | number };
    const argFiltered: { [index: string]: string | number } = {};
    Object.keys(arg).forEach((key: string) => {
      if (arg[key] !== '') {
        argFiltered[key] = arg[key];
      }
    });
    return argFiltered;
  }

  async fetchData() {
    this.loading = true;
    await this.getPosterList(this.getLoadParam());
    this.loading = false;
  }

  async createActivity() {
    (this.$refs.activity_create as CreateActivityDialog).showEditDialog();
  }

  async editActivityBase(row: PosterItem) {
    (this.$refs.activity_create as CreateActivityDialog).showEditDialog(row);
  }

  async editActivityDetail(row: PosterItem) {
    this.shouldUpdateData = true;
    this.$router.push({
      name: 'gimsActivityEdit',
      query: {
        activityId: row.id,
        title: row.activityTitle
      } as any
    });
  }

  async setActivityOnline(row: PosterItem) {
    const param = {
      id: row.id,
      onlineStatus: 1
    };
    this._updateOnlineStatus(param, '是否确认将该活动上线？');
  }

  doQueryWithDayCheck() {
    // todo model没适配ts类型
    const filterModel = this.posterListState.filterModel! as any;
    (this.$refs.data_viewer as ListViewer).doQuery();
  }

  async setActivityOffline(row: PosterItem) {
    const param = {
      id: row.id,
      onlineStatus: 0
    };
    this._updateOnlineStatus(param, '是否确认将该海报下线吗？');
  }

  async delActivity(row: PosterItem) {
    this.$elAlert({
      msg: '确认要删除这个海报吗？',
      onConfirm: async() => {
        this.loading = true;
        try {
          this.loading = true;
          await this.requestInstance.setParam(`/deleteById/${row.id}`,
            {}).doRequest();
          this.loading = false;
          this.$message.success('操作成功！');
          this.fetchData();
        } catch (msg) {
          this.$message.error(msg);
        }
        this.loading = false;
      }
    });
  }

  async _updateOnlineStatus(params: {id: number, onlineStatus: number}, msg: string) {
    this.$elAlert({
      msg,
      onConfirm: async() => {
        this.loading = true;
        try {
          this.loading = true;
          await this.requestInstance.setParam('/updateOnlineStatus',
            { id: params.id, onlineStatus: params.onlineStatus }).doRequest();
          this.loading = false;
          this.$message.success('操作成功！');
          this.fetchData();
        } catch (msg) {
          this.$message.error(msg);
        }
        this.loading = false;
      }
    });
  }

  onCreateSuccess() {
    this.fetchData();
  }

  render(h: CreateElement) {
    const listViewerProps = {
      props: {
        context: this,
        state: this.posterListState
      },
      on: {
        onFetchData: this.fetchData
      }
    };
    return (
      <el-card class="employee-list" v-loading={this.loading}>
        <list-viewer ref="data_viewer" {...listViewerProps} />
        <create-dialog ref="activity_create" onSaveSuccess={this.onCreateSuccess} />
        <hot-edit ref="hot-edit" />
      </el-card>
    );
  }
}
