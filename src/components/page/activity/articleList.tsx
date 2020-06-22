import { CreateElement } from 'vue';
import ListViewerComp from 'common/ListViewer.vue';
import { Component, Vue } from 'vue-property-decorator';
import { Action, BindingOptions, Mutation, State } from 'vuex-class/lib/bindings';
import CreateActivityDialog from '@/components/page/activity/createArticle';
import AddArticleLinkDialog from '@/components/page/activity/addArticleLink';
import { ActivityItem, ActivityStatus } from '@/store/modules/activity/types';
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
    'add-link': AddArticleLinkDialog,
    'hot-edit': HotEditDialog
  }
})
export default class ActivityListPage extends Vue {
  @State('articleListState', storeNameSpace) articleListState!: ListViewerState<this>;
  @Mutation('SET_ARTICLE_LIST_VIEWER_STATE',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('getArticleList', storeNameSpace) getArticleList!: (arg?: any) => Promise<void>;
  requestInstance!: FetchApi;
  loading: boolean = false;
  name = 'ActivityPage';
  shouldUpdateData = false;

  created() {
    this.setViewerState();
    const resultWrapper = new ActivityResultWrapper();
    this.requestInstance = FetchApiFactory.getFetchInstance('/activity', false, resultWrapper);
    this.fetchData('add');
  }
  activated() {
    if (this.shouldUpdateData) {
      this.fetchData('add');
      this.shouldUpdateData = false;
    }
  }

  getLoadParam() {
    const state = this.articleListState;
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

  async fetchData(status) {
    this.loading = true;
    const param = this.getLoadParam();
    if(status === 'update') {
      Object.keys(param).forEach((key: string) => {
        if (key !== 'dataType') {
          param[key] = '';
          this.articleListState && this.articleListState.filterModel && this.articleListState.filterModel[key] && (this.articleListState.filterModel[key] = '');
        }
      });
      param.pageSize = 10;
      param.pageNumber = 1;
    }
    await this.getArticleList(param);
    this.loading = false;
  }

  doResetArticle(){
    this.fetchData('update');
  }

  async createActivity() {
    (this.$refs.activity_create as CreateActivityDialog).showEditDialog();
  }
  async addArticleLink() {
    (this.$refs.article_add_link as AddArticleLinkDialog).showEditDialog();
  }
  async editActivityBase(row: ActivityItem) {
    (this.$refs.activity_create as CreateActivityDialog).showEditDialog(row);
  }

  async editActivityDetail(row: ActivityItem) {
    this.shouldUpdateData = true;
    this.$router.push({
      name: 'gimsArticleEdit',
      query: {
        activityId: row.id,
        title: row.activityTitle
      } as any
    });
  }

  async setActivityOnline(row: ActivityItem) {
    const param = {
      id: row.id,
      activityStatus: ActivityStatus.online
    };
    if(!row.remarkName){
      this.$message.error('请到编辑规则页面填写文章摘要！');
      return false;
    }
    this._updateOnlineStatus(param, '是否确认将该文章上线？');
  }

  doQueryWithDayCheck() {
    // todo model没适配ts类型
    const filterModel = this.articleListState.filterModel! as any;
    (this.$refs.data_viewer as ListViewer).doQuery();
  }

  async setActivityOffline(row: ActivityItem) {
    const param = {
      id: row.id,
      activityStatus: ActivityStatus.offline
    };
    this._updateOnlineStatus(param, '是否确认将该文章下线？');
  }

  async delActivity(row: ActivityItem) {
    this.$elAlert({
      msg: '确认要删除这个文章吗？',
      onConfirm: async() => {
        this.loading = true;
        try {
          this.loading = true;
          await this.requestInstance.setParam(`/deleteById/${row.id}`,
            {dataType: 2}).doRequest();
          this.loading = false;
          this.$message.success('操作成功！');
          this.fetchData('add');
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
          this.fetchData('add');
        } catch (msg) {
          this.$message.error(msg);
        }
        this.loading = false;
      }
    });
  }

  onCreateSuccess() {
    this.fetchData('add');
  }
  onAddSuccess() {
    this.fetchData('add');
  }

  render(h: CreateElement) {
    const listViewerProps = {
      props: {
        context: this,
        state: this.articleListState
      },
      on: {
        onFetchData: () => this.fetchData('add')
      }
    };
    return (
      <el-card class="employee-list" v-loading={this.loading}>
        <list-viewer ref="data_viewer" {...listViewerProps} />
        <create-dialog ref="activity_create" onSaveSuccess={this.onCreateSuccess} />
        <add-link ref="article_add_link" onSaveSuccess={this.onAddSuccess} />
        <hot-edit ref="hot-edit" />
      </el-card>
    );
  }
}
