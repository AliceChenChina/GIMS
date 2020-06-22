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
    name: 'ProductSelector',
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
        viewerState: state => state.strategyRecommend.productListState
      })
    },
    mounted() {
      this.$store.commit('strategyRecommend/COMMIT_PRODUCT_LIST_VIEWER');
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
        await this.$store.dispatch('strategyRecommend/getProductList', this.getLoadParam());
        this.isLoading = false;
      },
      select(row) {
        this.$emit('onSelectionConfirm', this.from, row);
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
