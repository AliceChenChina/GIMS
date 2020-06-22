<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :context="this"
      :state="viewData"
      @onFetchData="fetchData"
    />
  </el-card>
</template>
<script>
  import listViewer from  'common/ListViewerLevel2';
  import { mapState } from 'vuex';
  const newVar = {
    name: 'CommissionQueryList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        ifShow: false
      };
    },
    computed: {
      ...mapState({
        viewData: state => state.commission.commissionQueryListState
      })
    },
    mounted() {
      this.$store.commit('commission/COMMIT_COMMISSION_QUERY_LIST_VIEWER');
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('commission/commissionQueryList', { ...this.viewData.filterModel, ...this.viewData.paginationState.getAjaxParam() });
        this.isLoading = false;
      },
      // 导出excel数据
      doExport() {
        if (this.viewData.tableData.records.length === 0) {
          this.$message.error('无数据，无法导出');
          return;
        }
        const uri = '/finacial/exportList';
        const arg = this.$utils.jsonClone(this.viewData.filterModel);
        const query = this.$utils.queryString.stringify(arg);
        window.open(`${this.$fetch.getBasePath()}${uri}?${query}`);
      },
      hideAndShow(){
        this.hideAndShow = !this.hideAndShow
        console.log('this.hideAndShow', this.hideAndShow)
      }
    }
  };
  export default newVar;
</script>
<style lang="scss">
  .able {
    color: #F52020;
    cursor: pointer;
  }
  .disable {
    color: #cccccc;
    cursor: not-allowed;
  }
  .spanLeft, .spanRight {
    display: inline-block;
  }
  .spanLeft {
    width: 80px;
    text-align: left;
  }
  .spanRight {
    padding-left: 10px;
  }
</style>
