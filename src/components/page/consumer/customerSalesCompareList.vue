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
  import { Powers } from '@/utils/powers';
  export default {
    name: 'CustomerSalesCompareList',
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
        viewerState: state => state.consumer.customerSalesCompareListState
      })
    },
    mounted() {
      this.$store.commit('consumer/COMMIT_CONSUMER_SALES_COMPARE_LIST_VIEWER');
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
        await this.$store.dispatch('consumer/getCustomerSalesCompareList', this.getLoadParam());
        this.isLoading = false;
      },
      async check(row) {
        await this.$power.checkPower(Powers.consumerCompareCheck);
        this.$router.push({
          name: 'consumerDetail',
          query: {
            userId: row.customerId || row.userId,
            pinCode: row.pinCode || row.pinCode
          }
        });
      },
      // 更新
      async updateSystem(row) {
        await this.$power.checkPower(Powers.consumerCompareUpdate);
        const param = { pinCode: row.pinCode };
        try {
          this.isLoading = true;
          await this.$fetch.setParam('/customerList/pullCrmCustomerSales', param).doRequest();
          this.isLoading = false;
          this.fetchData();
        } catch (msg) {
          this.isLoading = false;
          this.$message.error(msg);
        }
      },
      // 与GIMS一致
      async compareGims(row) {
        await this.$power.checkPower(Powers.consumerCompareGims);
        const param = { pinCode: row.pinCode, salesPin: row.salesPin };
        try {
          this.isLoading = true;
          await this.$fetch.setParam('/customerList/pushCrmCustomerSales', param).doRequest();
          this.isLoading = false;
          this.fetchData();
        } catch (msg) {
          this.isLoading = false;
          this.$message.error(msg);
        }
      },
      // 与新系统一致
      async compareNewSystem(row) {
        await this.$power.checkPower(Powers.consumerCompareNewSystem);
        const param = { pinCode: row.pinCode };
        try {
          this.isLoading = true;
          await this.$fetch.setParam('/customerList/sameWithNewCrm', param).doRequest();
          this.isLoading = false;
          this.fetchData();
        } catch (msg) {
          this.isLoading = false;
          this.$message.error(msg);
        }
      }
    }
  };
</script>
<style scoped lang="scss">
  /deep/ .el-button.able {
    color: rgb(235, 89, 84);
    cursor: pointer;
  }
  /deep/ .el-button.disabled {
    color: #cccccc;
    cursor: not-allowed;
  }
  /deep/ .custom-el-filter .el-custom-filter {
  max-width: 400px;
  }
  /deep/ .custom-el-filter .filter-item-wrapper > .el-input {
    width: 240px;
  }
</style>
