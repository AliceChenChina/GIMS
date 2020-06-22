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
  import listViewer from 'common/ListViewerLevel2';
  import { ActivityResultWrapper } from '@/api/ResultWrapper';
  import FetchApiFactory from '@/api/fetchApi';
  import { Powers } from '@/utils/powers';
  import { mapState } from 'vuex';
  const newVar = {
    name: 'UserApplyList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        ifShow: false,
        ifSales: false
      };
    },
    computed: {
      ...mapState({
        viewData: state => state.strategyRecommend.userApplyListState
      })
    },
    created() {
      // 运营查看，或者 无运营查看&&无理财师查看
      if(this.$power.hasPower(Powers.userApplyNoSales) || (!this.$power.hasPower(Powers.userApplyNoSales) && (!this.$power.hasPower(Powers.userApplySales)))){
        this.ifSales = false;
      }
      // 理财师查看
      if(!this.$power.hasPower(Powers.userApplyNoSales) && this.$power.hasPower(Powers.userApplySales)){
        this.ifSales = true;
      }
      const resultWrapper = new ActivityResultWrapper();
      this.requestInstance = FetchApiFactory.getFetchInstance('/userTestResult', false, resultWrapper);
    },
    mounted() {
      this.$store.commit('strategyRecommend/COMMIT_USER_APPLY_LIST_VIEWER');
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('strategyRecommend/userApplyQueryList', { ...this.viewData.filterModel, ...this.viewData.paginationState.getAjaxParam() });
        this.isLoading = false;
      },
      // 导出excel数据
      doExport() {
        if (this.viewData.tableData.records.length === 0) {
          this.$message.error('无数据，无法导出');
          return;
        }
        const uri = '/userTestResult/export';
        const param = this.viewData.filterModel;
        if(this.ifSales){
          param.recommender = this.$store.state.userInfo.userId;
        }else{
          param.recommender = '';
        }
        const arg = this.$utils.jsonClone(param);
        const query = this.$utils.queryString.stringify(arg);
        window.open(`${window.location.origin}${uri}?${query}`);
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
