<template>
  <selector
    ref="selector"
    :loading="isLoading"
    title="选择 - 客户"
    :state="viewerState"
    :context="this"
    width="90%"
    @onFetchData="fetchData"
    @onSelectionChange="selectionChange"
    @onSelectionConfirm="confirmSelection"
    class="selector"
  />
</template>

<script>
  import selector from 'common/Selector';
  import { ActivityResultWrapper } from '@/api/ResultWrapper';
  import FetchApiFactory from '@/api/fetchApi';
  import { mapState } from 'vuex';
  export default {
    name: 'CustomerSelector',
    components: {
      selector
    },
    data() {
      return {
        isLoading: false,
        onSelectList: []
      };
    },
    created() {
      const resultWrapper = new ActivityResultWrapper();
      this.requestInstance = FetchApiFactory.getFetchInstance('/userGroup', false, resultWrapper);
    },
    mounted() {
      this.$store.commit('strategyRecommend/COMMIT_CUSTOMER_SELECTOR');
    },
    computed: {
      ...mapState({
        viewerState: state => state.strategyRecommend.customerSelectorViewerState
      })
    },
    methods: {
      showDialog() {
        // 筛选栏数据清空
       this.reset();
        this.$refs.selector.showDialog();
      },
      selectionChange(selectionList) {
        this.onSelectList = selectionList;
      },
      async confirmSelection(value) {
        if (this.onSelectList.length === 0) {
          this.$message.error('请选择至少一个用户！');
          return;
        }
        const row = this.onSelectList;
        const param = {
          oprType: '2',
          parentGroupId: this.$route.query.id,
          users: []
        }
        row.forEach(item => {
          param.users.push({ userId: item.customerId, userPin: item.pinCode })
        })
        this.addUser(param);
        // this.$refs.selector.dialogVisible = false;
        // this.$emit('onSelectionConfirm', id, contact, customerId);
        // this.onSelectList = [];
      },
      async addUser(param) {
        console.log('param222', param);
        this.isLoading = true;
        try {
          await this.requestInstance.setParam('/insertData', param).doRequest();
          this.$refs.selector.dialogVisible = false;
          this.$emit('onSelectionConfirm');
          this.onSelectList = [];
        } catch (msg) {
          this.$message.error(msg);
        };
        this.isLoading = false;
      },
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      reset(){
        Object.keys(this.viewerState.filterModel).forEach(key => {
          this.viewerState.filterModel[key] = '';
          this.viewerState.filterModel.customerRelationStatus = '3';
        });
        this.fetchData();
      },
      async fetchData() {
        this.isLoading = true;
        const param = this.getLoadParam();
        param.customerRelationStatus = param.customerRelationStatus === '' ? '3' : param.customerRelationStatus ;
        await this.$store.dispatch('strategyRecommend/getCustomerList', param);
        this.isLoading = false;
      },
    }
  };
</script>

<style scoped>
  .selector /deep/  .custom-el-filter .el-custom-filter {
    max-width:180px
  }
.selector /deep/ .el-input .el-input__inner{
  width:100%;
}

</style>
