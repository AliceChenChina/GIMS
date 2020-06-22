<template>
  <div v-loading="isLoading">
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
  </div>
</template>

<script>
  import listViewer from 'common/ListViewerLevel2';
  import { mapState } from 'vuex';
  export default {
    name: 'CustomerList',
    components: {
      listViewer
    },
    props: {
      from: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isLoading: false,
        shouldUpdateData: false,
        showEdit: false,
        choosedProductList: []
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.strategyRecommend.customerListViewerState
      })
    },
    mounted() {
      this.$store.commit('strategyRecommend/COMMIT_CUSTOMER_LIST');
      // this.fetchData();
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
        return {...state.filterModel, ...state.paginationState.getAjaxParam()};
      },
      async fetchData() {
        this.isLoading = true;
        const param = this.getLoadParam();
        param.customerRelationStatus = param.customerRelationStatus === '' ? '3' : param.customerRelationStatus ;
        console.log('pppp', param)
        await this.$store.dispatch('strategyRecommend/getCustomeDatarList', param);
        this.isLoading = false;
      },
      select(row) {
        this.$emit('confirm', row);
      }
    }
  }
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
