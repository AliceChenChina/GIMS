import { CreateElement } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import ListViewer from 'common/ListViewer.vue';
import './sysManage.scss';
import { Action, Mutation, State } from 'vuex-class';
import { sysManagerState } from '@/store/modules/systemManager/types';
import { BindingOptions } from 'vuex-class/lib/bindings';
import { ListViewerState, Upload } from '@/types/types';
import ArgEdit, { argItem } from '@/components/page/sysManager/argEdit';
import FetchApiFactory from '@/api/fetchApi';
import { Powers } from '@/utils/powers';

const storeNameSpace: BindingOptions = { namespace: 'sysManager' };

@Component({
  components: {
    ListViewer, ArgEdit
  }
})
export default class ArgList extends Vue {
  @State('sysManager') sysManagerState!: sysManagerState;
  @Mutation('SET_ARG_LIST_VIEWER_LIST',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('getSysArgList', storeNameSpace) getSysArgList!: (arg: any) => Promise<void>;
  loading = false;
  upload: Upload = this.$upload.getUploadInstance('arg_file_upload');
  uploadType: 'net_value' | 'history_customer' = 'net_value';
  isLoading = false;
  name = 'ArgList';

  created() {
    this.setViewerState();
    this.upload.setUploadHandler(this.uploadFile);
    this.upload.setTypeLimit(['xls', 'xlsx']);
    this.upload.setTypeLimitErrorHandler(this.onTypesError);
  }

  mounted() {
    this.fetchData();
  }

  get tableViewerState(): ListViewerState<ArgList> {
    return this.sysManagerState.argListState;
  }

  getLoadParam() {
    const state = this.tableViewerState;
    return { ...state.filterModel, ...state.paginationState!.getAjaxParam() };
  }

  onTypesError(validTypes: Array<string>) {
    this.$message.error(`只有${validTypes.join(',')}文件类型可以上传`);
  }

  importNetValue() {
    this.uploadType = 'net_value';
    this.upload.triggerUpload();
  }

  importHistoryCustomer() {
    this.uploadType = 'history_customer';
    this.upload.triggerUpload();
  }

  async addArgItem() {
    await this.$power.checkPower(Powers.sysArgAdd);
    (this.$refs.arg_edit as ArgEdit).showEditDialog();
  }

  async editArgItem(argItem: argItem) {
    await this.$power.checkPower(Powers.sysArgEdit);
    (this.$refs.arg_edit as ArgEdit).showEditDialog(argItem);
  }

  async delArgItem(argItem: argItem) {
    await this.$power.checkPower(Powers.sysArgDel);
    this.$elAlert({
      msg: '确认要删除该条数据吗？',
      onConfirm: async() => {
        const uri = '/systemSetting/arg/delete';
        this.loading = true;
        try {
          this.loading = true;
          await this.$fetch.setParam(uri, { ids: argItem.id }).doRequest();
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

  async uploadFile(file: File) {
    let uri;
    const form = new FormData();
    form.append('file', file);
    if (this.uploadType === 'net_value') {
      uri = '/trade/importHistoryTrade';
    } else {
      uri = '/customerList/importHistoryCustomer';
    }
    try {
      await this.$fetch.setParam(uri, form).setRejectHandler((reject: any, res: any) => {
        reject(res);
      }).doRequest();
      this.isLoading = false;
      this.$message.success('导入成功！');
      this.upload.clearFile();
      this.fetchData();
    } catch (msg) {
      this.upload.clearFile();
      this.isLoading = false;
      const { data } = msg;
      if (!data) {
        this.$message.error((msg && msg.message) || '发生错误请重试');
        return;
      }
      const { errorLogList } = data;
      this.$message.error(errorLogList.map((logItem: any) => {
        return `行${logItem.rowNum}：${logItem.log}`;
      }).join('，'));
    }
  }

  async fetchData() {
    this.loading = true;
    await this.getSysArgList(this.getLoadParam());
    this.loading = false;
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
      <el-card class="employee-list" v-loading={this.loading}>
        <list-viewer ref="data_viewer" {...listViewerProps} />
        <arg-edit ref="arg_edit" onSaveSuccess={ () => this.fetchData() } />
      </el-card>
    );
  }
}
