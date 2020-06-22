<template>
  <el-card v-loading="isLoading" class="product-list box-card">
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
        orderColumn: '',
        shouldUpdateData: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.productListViewerState
      })
    },
    created() {
      this.$store.commit('product/SET_PRODUCT_LIST_VIEWER_STATE');
      this.fetchData();
    },
    activated(){
      if (this.shouldUpdateData) {
        this.fetchData();
        this.shouldUpdateData = false;
      }
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        return {
          ...state.filterModel,
          ...state.paginationState.getAjaxParam() };
      },
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
      async fetchData() {
        this.isLoading = true;
        const params = this.getLoadParam();
        params.order = this.order;
        params.orderColumn = this.orderColumn;
        await this.$store.dispatch('product/queryProductList', params);
        this.isLoading = false;
      },
      gotoProductEdit(productId, productType) {
        this.shouldUpdateData = true;
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
      },
      modifyProductType(row){
        this.shouldUpdateData = true;
        this.$router.push({
          name: 'modifyProductLabel',
          query: {
            productName: encodeURIComponent(row.productName),
            productNameShort: encodeURIComponent(row.productNameShort),
            isProxy: row.isProxy,
            productTypeName: encodeURIComponent(row.productTypeName),
            productId: row.productId,
            filingType: row.filingType || '',
            largeClassAssetsType: row.largeClassAssetsType || '',
            openingFrequency: row.openingFrequency || '',
            productLabel: row.productLabel || '',
            productSubLabel: row.productSubLabel || '',
            protocolBouncers: row.protocolBouncers || '',
            accountType: row.accountType || ''
          }
        });
      },
      async getStrongRelationType(productId){
        this.shouldUpdateData = true;
        if (!productId) {
          this.$message.error('此产品无productId！');
          return false;
        }
        this.$alert({
          msg: '确认关联关系设定为强关联吗？',
          onConfirm: async() => {
            try {
              this.loading = true;
              await this.$fetch.setParam('/product/updateStrongRelationType', { productId: productId }).doRequest();
              this.loading = false;
              // 重新加载数据
              this.$message.success('操作成功！');
              this.fetchData();
            } catch (msg) {
              this.loading = false;
              this.$message.error(msg);
            }
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  .product-list {
    .el-table__row {
      a {
        padding: 0 !important;
      }
    }
  }
</style>
