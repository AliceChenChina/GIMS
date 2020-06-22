<template>
  <el-card v-loading="isLoading" class="box-card">
    <div>
      <el-button type="primary" @click="getCustomerComplianceInfo('')">当前页全部去合规</el-button>
      <el-button type="primary" @click="addCustomer">新增客户</el-button>
    </div>
    <list-viewer
      :context="this"
      :state="viewData"
      @onFetchData="fetchData"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  const newVar = {
    name: 'MyConsumerList',
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
        viewData: state => state.myConsumer.myConsumerListState
      })
    },
    mounted() {
      this.$store.commit('myConsumer/COMMIT_MY_CONSUMER_LIST_STATE');
      this.fetchData();
    },
    activated() {
      if (this.shouldUpdateData) {
        this.fetchData();
        this.shouldUpdateData = false;
      }
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('myConsumer/getMyConsumerList', { ...this.viewData.filterModel, ...this.viewData.paginationState.getAjaxParam() });
        this.isLoading = false;
      },
      edit(row) {
        const userPin = row.pinCode ? row.pinCode : '';
        const customerId = row.customerId ? row.customerId : '';
        const id = row.id ? row.id : '';
        const relationType = row.relationType;
        this.shouldUpdateData = true;
        this.$router.push({
          name: 'myConsumerInfo',
          query: {
            status: 'edit',
            userPin: userPin,
            id: id,
            customerId: customerId,
            relationType: relationType
          }
        });
      },
      check(row) {
        const userPin = row.pinCode ? row.pinCode : '';
        const customerId = row.customerId ? row.customerId : '';
        const id = row.id ? row.id : '';
        const relationType = row.relationType;
        this.shouldUpdateData = true;
        this.$router.push({
          name: 'myConsumerInfo',
          query: {
            status: 'check',
            userPin: userPin,
            id: id,
            customerId: customerId,
            relationType: relationType
          }
        });
      },
      getCustomerComplianceInfo(row) {
        // 全部获取合规页面就拼接当前页面userId字符串
        let userId = '';
        const { records } = this.viewData.tableData;
        if (!row) {
          userId = records.map(record => record.customerId).join(',');
        } else {
          userId = row.customerId;
        }
        this.$alert({
          msg: '确认获取合规信息吗',
          onConfirm: async() => {
            const uri = '/customerOverview/getCustomerComplianceInfo';
            this.isLoading = true;
            await this.$fetch.setParam(uri, { userId }).doRequest();
            this.isLoading = false;
            // 重新加载数据
            this.fetchData();
            this.$message.success('获取客户合规信息完成！');
          }
        });
      },
      addCustomer() {
        this.shouldUpdateData = true;
        this.$router.push({
          name: 'myConsumerInfo',
          query: {
            status: 'add'
          }
        });
      }
    }
  };
  export default newVar;
</script>
