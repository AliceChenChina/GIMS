<template>
  <el-card v-loading="isLoading" class="box-card">
    <list-viewer
      ref="list_viewer"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    >
      <template #before-filter>
        <div class="op-btn">
          <el-button type="primary" @click="exportData">数据导出</el-button>
        </div>
      </template>
    </list-viewer>
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import listViewer from 'common/ListViewer';
  export default {
    name: 'DurationManage',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        skuId: this.$route.query.skuId
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.durationMangeViewerState
      })
    },
    created() {
      this.$store.commit('product/SET_DURATION_MANAGE_VIEWER_STATE', this.$route.query.type);
    },
    activated() {
      if (this.$route.query.skuId !== this.skuId) {
        this.skuId = this.$route.query.skuId;
        this.fetchData();
      }
    },
    async mounted() {
      await this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('product/durationManageInfo', this.getLoadParam());
        this.isLoading = false;
      },
      exportData() {
        if (this.viewerState.tableData.records.length === 0) {
          this.$message.error('无数据，无法导出');
          return;
        }
        const uri = '/duration/exportProduct/list';
        const arg = { ...this.viewerState.filterModel };
        arg.productId = this.skuId;
        const query = this.$utils.queryString.stringify(arg);
        window.open(`${this.$fetch.getBasePath()}${uri}?${query}`);
      },
      getLoadParam() {
        const state = this.viewerState;
        return {
          productId: this.skuId,
          ...state.filterModel,
          ...state.paginationState.getAjaxParam() };
      }
    }
  };
</script>

<style scoped>

</style>
