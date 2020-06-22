<template>
  <el-dialog v-loading="isLoading" title="查看净值" :visible.sync="netCheckVisible" :close-on-click-modal="false" width="730px">
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
    <net-edit ref="net_edit" @onEditSuccess="handleSuccess" />
  </el-dialog>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import netEdit from '../productNetValueEdit';
  import { mapState } from 'vuex';
  export default {
    name: 'ProductInfoNetValue',
    components: {
      listViewer, netEdit
    },
    data() {
      return {
        isLoading: false,
        netCheckVisible: false,
        productId: '',
        productName: ''
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.productInfoNetValueViewerState,
        productInfoState: state => state.product.productInfoState
      }),
      type() {
        return this.$route.query.type;
      },
      isProxy() {
        if (!this.productInfoState[this.type]) return '';
        return this.productInfoState[this.type].model.isProxy;
      }
    },
    methods: {
      async show(param = {}) {
        this.productId = param.productId;
        this.productName = param.productName;
        this.netCheckVisible = true;
        const type = 'fromNetList';
        this.$store.commit('product/SET_PRODUCT_INFO_NETVALUE_VIEWER_STATE', type);
        await this.fetchData();
      },
      getLoadParam() {
        const state = this.viewerState;
        return {
          orderColumn: 'netDate',
          order: 'desc',
          productId: this.productId,
          ...state.filterModel,
          ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('product/queryNetValue', this.getLoadParam());
        this.isLoading = false;
      },
      editNetValue(product) {
        product.productName = this.productName;
        this.$refs.net_edit.setForm(product);
        this.$refs.net_edit.createNetValueVisible = true;
      },
      deleteNetValue(product) {
        if (parseInt(this.isProxy) === 1) {
          this.$message.error('代销产品不能删除');
          return;
        }
        const uri = '/productNetValue/delete';
        this.$alert({
          msg: '确认删除这条数据吗？',
          onConfirm: async() => {
            try {
              this.isLoading = true;
              await this.$fetch.setParam(uri, { id: product.id }).doRequest();
              this.fetchData();
              this.isLoading = false;
              this.$message.success('删除成功！');
            } catch (msg) {
              this.isLoading = false;
              this.$message.error(msg);
            }
          }
        });
      },
      handleSuccess() {
        this.fetchData();
      }
    }
  };
</script>

<style scoped>

</style>
