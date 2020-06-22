<template>
  <el-card>
    <list-viewer
      v-if="getMsgType"
      ref="unreadMessage_viewer"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
      @onSelectionChange="selectionChange"
      @onSortChange="handleSortChange"
    >
      <div slot="before-table" style="margin-bottom: 10px">
        <el-row>
          <el-button type="danger" @click="btnClick">标记为已读</el-button>
        </el-row>
      </div>
    </list-viewer>
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  import fetchApi from '@/api/fetchApi';
  export default {
    name: 'UnreadMessage',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        getMsgType: false,
        ids: [],
        msgType: []
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.message.messageListViewerState
      })
    },
    created() {
      this.getTemplateList();
    },
    mounted() {
      // 初始化筛选框的查询
      this.$store.commit('message/COMMIT_MESSAGETLIST_VIEWER_STATE');
      this.fetchData();
    },
    activated() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        // 获取ajax的arg值
        const params = this.getLoadParam();
        params.order = this.order;
        params.column = this.orderColumn;
        await this.$store.dispatch('message/getMessage', params);
        this.isLoading = false;
      },
      getLoadParam() {
        // 获取筛选框表单的内容
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      goLink(id) {
        // 去报单审核页面
        this.updateStatus([id]);
        this.$router.push({ name: 'declarationAuditList' });
      },
      async getTemplateList() {
        const res = await fetchApi.setParam('/message/getTemplateList', {}).doRequest();
        const newmap = res.map((item) => {
          return {
            label: item.title,
            value: item.msgType
          };
        });
        this.msgType = newmap;
        this.getMsgType = true;
      },
      selectionChange(array) {
        this.ids = array.map((item) => {
          return item.id;
        });
      },
      handleSortChange(event) {
        let order;
        if (event.order === 'descending') {
          order = 'desc';
        } else {
          order = 'asc';
        }
        this.orderColumn = event.prop;
        this.order = order;
        this.fetchData();
      },
      async btnClick() {
        if (this.ids.length) {
          try {
            await this.updateStatus(this.ids);
            this.$message.info('更改已读消息成功');
            this.fetchData();
          } catch (e) {
            this.$message.error(e);
          }
        } else {
          this.$message.error('请选择消息');
        }
      },
      async updateStatus(ids) {
        try {
          await fetchApi.setParam('/message/updateStatus', { ids, status: 2 }).doRequest();
        } catch (e) {
          throw new Error(e);
        }
      }
    }
  };
</script>

<style scoped>

</style>
