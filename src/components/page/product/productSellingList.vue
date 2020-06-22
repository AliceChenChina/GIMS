<template>
  <el-card v-loading="isLoading" class="product-selling-list">
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
      @onSortChange="handleSortChange"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'ProductList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        order: 'desc',
        orderColumn: ''
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.productSellingListViewerState
      })
    },
    created() {
      this.$store.commit('product/SET_PRODUCT_SELLING_LIST_VIEWER_STATE');
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      handleSortChange(event) {
        let order;
        if (event.order === 'descending') {
          order = 'desc';
        } else {
          order = 'asc';
        }
        switch (event.prop) {
        case 'riskLevelName':
          this.orderColumn = 'riskLevel';
          break;
        case 'productStatusName':
          this.orderColumn = 'productStatus';
          break;
        case 'auditStatusName':
          this.orderColumn = 'auditStatus';
          break;
        case 'productTypeName':
          this.orderColumn = 'productType';
          break;
        default:
          this.orderColumn = event.prop;
        }
        this.order = order;
        this.fetchData();
      },
      getLoadParam() {
        const state = this.viewerState;
        return {
          ...state.filterModel,
          ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        const params = this.getLoadParam();
        params.order = this.order;
        params.orderColumn = this.orderColumn;
        await this.$store.dispatch('product/queryProdcutSellingList', params);
        this.isLoading = false;
      },
      gotoProductEdit(productId, productType) {
        this.$router.push({
          name: 'productEdit',
          query: {
            skuId: productId,
            type: productType
          }
        });
      },
      gotoProductInfo(productId, productType) {
        this.$router.push({
          name: 'productInfo',
          query: {
            skuId: productId,
            type: productType
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  .product-selling-list {
    .el-table__row {
      a {
        padding: 0 !important;
      }
    }
  }
</style>
