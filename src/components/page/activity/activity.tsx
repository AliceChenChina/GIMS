import { CreateElement } from 'vue';
import ListViewerComp from 'common/ListViewer.vue';
import { Component, Vue } from 'vue-property-decorator';
import { Action, BindingOptions, Mutation, State } from 'vuex-class/lib/bindings';
import CreateActivityDialog from '@/components/page/activity/createActivity';
import { ActivityItem, ActivityStatus } from '@/store/modules/activity/types';
import FetchApiFactory from '@/api/fetchApi';
import FetchApi from '@/api/fetchApiClass';
import { ActivityResultWrapper } from '@/api/ResultWrapper';
import HotEditDialog from '@/components/page/activity/HotEditDialog';
import { ListViewer, ListViewerState } from '@/types/types';
import { Powers } from '@/utils/powers';

const storeNameSpace: BindingOptions = { namespace: 'activity' };

@Component({
  components: {
    'list-viewer': ListViewerComp,
    'create-dialog': CreateActivityDialog,
    'hot-edit': HotEditDialog
  }
})
export default class ActivityListPage extends Vue {
  @State('activityListState', storeNameSpace) activityListState!: ListViewerState<this>;
  @Mutation('SET_ACTIVITY_LIST_VIEWER_STATE',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('getActivityList', storeNameSpace) getActivityList!: (arg?: any) => Promise<void>;
  requestInstance!: FetchApi;
  loading: boolean = false;
  name = 'ActivityPage';
  shouldUpdateData = false;

  created() {
    this.setViewerState();
    const resultWrapper = new ActivityResultWrapper();
    this.requestInstance = FetchApiFactory.getFetchInstance('/activity', false, resultWrapper);
    this.fetchData();
  }
  activated() {
    if (this.shouldUpdateData) {
      this.fetchData();
      this.shouldUpdateData = false;
    }
  }

  getLoadParam() {
    const state = this.activityListState;
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
    await this.getActivityList(this.getLoadParam());
    this.loading = false;
  }

  async createActivity() {
    await this.$power.checkPower(Powers.activityCreate);
    (this.$refs.activity_create as CreateActivityDialog).showEditDialog();
  }

  async editActivityBase(row: ActivityItem) {
    await this.$power.checkPower(Powers.activityCreate);
    (this.$refs.activity_create as CreateActivityDialog).showEditDialog(row);
  }

  async editActivityDetail(row: ActivityItem) {
    await this.$power.checkPower(Powers.activityPicEdit);
    this.shouldUpdateData = true;
    this.$router.push({
      name: 'gimsActivityEdit',
      query: {
        activityId: row.id,
        title: row.activityTitle
      } as any
    });
  }

  async setActivityOnline(row: ActivityItem) {
    await this.$power.checkPower(Powers.activityOp);
    const param = {
      id: row.id,
      activityStatus: ActivityStatus.online
    };
    this._updateOnlineStatus(param, '是否确认将该活动上线？');
  }

  doQueryWithDayCheck() {
    // todo model没适配ts类型
    const filterModel = this.activityListState.filterModel! as any;
    const startTime = filterModel.startTime;
    const endTime = filterModel.endTime;
    if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
      this.$message.error('结束时间不能大于开始时间！');
      return;
    }
    (this.$refs.data_viewer as ListViewer).doQuery();
  }

  async setActivityOffline(row: ActivityItem) {
    await this.$power.checkPower(Powers.activityOp);
    const param = {
      id: row.id,
      activityStatus: ActivityStatus.offline
    };
    this._updateOnlineStatus(param, '是否确认将该活动下线？');
  }

  async delActivity(row: ActivityItem) {
    await this.$power.checkPower(Powers.activityDel);
    this.$elAlert({
      msg: '确认要删除这个活动吗？',
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

  async _updateOnlineStatus(params: {id: number, activityStatus: ActivityStatus}, msg: string) {
    this.$elAlert({
      msg,
      onConfirm: async() => {
        this.loading = true;
        try {
          this.loading = true;
          await this.requestInstance.setParam('/updateOnlineStatus',
            { id: params.id, activityStatus: params.activityStatus }).doRequest();
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
        state: this.activityListState
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
