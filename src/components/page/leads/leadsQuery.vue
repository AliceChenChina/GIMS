<template>
  <el-card v-loading="isLoading" class="box-card">
    <list-viewer
      ref="order_viewer"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    >
      <template #before-filter>
        <div class="op-btn">
          <el-button type="primary" @click="doExport">数据导出</el-button>
        </div>
      </template>
    </list-viewer>
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'LeadsQuery',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        showAdvanceFilter: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.leads.leadsQueryViewerState
      })
    },
    mounted() {
      this.$store.commit('leads/COMMIT_LEADSLIST_VIEWER_STATE');
      this.fetchData();
    },
    methods: {
      doExport() {
        if (this.viewerState.tableData.records.length === 0) {
          this.$message.error('无数据，无法导出');
          return;
        }
        const uri = '/appointment/export';
        const arg = this.$utils.jsonClone(this.viewerState.filterModel);
        const query = this.$utils.queryString.stringify(arg);
        delete arg.showAdvanceFilter;
        window.open(`${this.$fetch.getBasePath()}${uri}?${query}`);
      },
      gotoLeadsDetail(index, row) {
        this.$router.push({
          name: 'leadsDetail',
          query: {
            id: row.id
          }
        });
      },
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('leads/getLeadsList', this.getLoadParam());
        this.isLoading = false;
      }
    }
  };
</script>

<style scoped>

</style>
