<template>
  <el-card v-loading="isLoading" class="box-card">
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'ProductInfoTrend',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.productTrendViewerState
      })
    },
    created() {
      this.$store.commit('product/SET_PRODUCT_TREND_VIEWER_STATE');
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        return {
          productId: this.$route.query.skuId,
          ...state.filterModel,
          ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('product/queryProductTrend', this.getLoadParam());
        this.isLoading = false;
      }
    }
  };
</script>

<style scoped>

</style>
