<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewerLevel2';
  import { mapState } from 'vuex';
  export default {
    name: 'ConsumerHoldingList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        shouldUpdateData: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.consumer.consumerHoldingListState
      })
    },
    mounted() {
      this.$store.commit('consumer/COMMIT_CONSUMER_HOLDING_LIST_VIEWER');
      this.fetchData();
    },
    activated() {
      if (this.shouldUpdateData) {
        this.fetchData();
        this.shouldUpdateData = false;
      }
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('consumer/getConsumerHoldingList', this.getLoadParam());
        this.isLoading = false;
      },
      check(row) {
        this.$router.push({
          name: 'consumerDetail',
          query: {
            userId: row.customerId || row.userId,
            pinCode: row.pinCode || row.pinCode
          }
        });
      },
      // 导出excel数据
      doExport() {
        if (!this.viewerState.filterModel.customerInfo) {
          this.$message.error('因性能限制，请按京东用户名查询结果后导出!');
          return false;
        }
        const uri = '/customerList/exportCustomerAssetsList';
        this.viewerState.filterModel.empId = this.$store.state.userInfo.userId;
        const arg = this.$utils.jsonClone(this.viewerState.filterModel);
        const query = this.$utils.queryString.stringify(arg);
        window.open(`${this.$fetch.getBasePath()}${uri}?${query}`);
      }
    }
  };
</script>
<style scoped lang="scss">
  .able {
    color: #F52020;
    cursor: pointer;
  }
  .disable {
    color: #cccccc;
    cursor: not-allowed;
  }
  /deep/ .custom-el-filter .el-custom-filter {
  max-width: 400px;
  }
  /deep/ .custom-el-filter .el-custom-filter input {
    width: 300px;
  }
</style>
