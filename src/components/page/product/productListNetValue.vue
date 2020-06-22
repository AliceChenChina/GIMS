<template>
  <el-card v-loading="isLoading" class="box-card product-net-val">
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
      @onSortChange="handleSortChange"
    />
    <net-edit ref="net_edit" @onEditSuccess="handleSuccess" />
    <product-net-value-list ref="net_value_list" />
  </el-card>
</template>

<script>
  /*
  产品净值列表管理
   */
  import listViewer from 'common/ListViewer';
  import netEdit from './productNetValueEdit';
  import { mapState } from 'vuex';
  import { Powers } from '@/utils/powers';
  import productNetValueList from './productInfo/productNetValueList';

  export default {
    name: 'ProductInfoNetValueList',
    components: {
      listViewer,
      netEdit,
      productNetValueList
    },
    data() {
      return {
        isLoading: false,
        column: '',
        order: ''
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.productNetValueViewerState
      })
    },
    created() {
      this.$store.commit('product/SET_PRODUCT_NET_VALUE_VIEWER_STATE');
      this.upload = this.$upload.getUploadInstance('netvalue_upload');
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      handleSuccess() {
        this.fetchData();
      },
      handleSortChange(event) {
        let order;
        if (event.order === 'descending') {
          order = 'desc';
        } else {
          order = 'asc';
        }
        this.orderColumn = event.prop;
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
        await this.$store.dispatch('product/queryProductListNetValue', params);
        this.isLoading = false;
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
      gotoProductInfoWithNetVal(productId, productName) {
        const param = {
          productId: productId,
          productName: productName
        }
        this.$refs.net_value_list.show(param);
      },
      async downloadTemplate() {
        await this.$power.checkPower(Powers.downloadNetValueTemplate);
        window.open(this.$fetch.getBasePath() + '/productNetValue/downloadTemplate');
      },
      onTypesError(validTypes) {
        this.$message.error(`只有${validTypes.join(',')}文件类型可以上传`);
      },
      async newNetValue(row) {
        await this.$power.checkPower(Powers.addNetValue);
        this.$refs.net_edit.setForm(row);
        this.$refs.net_edit.createNetValueVisible = true;
      },
      async importNetValue(row) {
        await this.$power.checkPower(Powers.importNetValue);
        this.upload.setUploadHandler((file) => {
          return this.uploadNetValue(row.productId, file);
        });
        this.upload.setTypeLimit(['xls', 'xlsx']);
        this.upload.setTypeLimitErrorHandler(this.onTypesError);
        this.upload.triggerUpload();
      },
      async uploadNetValue(productId, file) {
        const uri = '/productNetValue/importProductNetValue';
        const form = new FormData();
        form.append('file', file);
        form.append('productId', productId);
        this.isLoading = true;
        try {
          await this.$fetch.setParam(uri, form).setRejectHandler((reject, res) => {
            // 直接返回错误对象
            reject(res);
          }).doRequest();
          this.isLoading = false;
          this.$message.success('导入成功！');
          this.upload.clearFile();
          this.fetchData();
        } catch (msg) {
          this.upload.clearFile();
          this.isLoading = false;
          const { data } = msg;
          if (!data) {
            this.$message.error(msg.message);
            return;
          }
          const { errorLogList } = data;
          this.$message.error(errorLogList.map(logItem => {
            return `行${logItem.rowNum}：${logItem.log}`;
          }).join('，'));
        }
      }
    }
  };
</script>

<style lang="scss">
  .product-list-href {
    padding: 0 5px;
    cursor:pointer;
  }
  .product-list-href {
    color: #999;
  }
  .product-list-href.enabled {
    color:red;
  }
  .product-net-val {
    .el-table__row {
      .is-left {
        a {
          padding: 0 !important;
        }
      }
    }
  }
</style>
