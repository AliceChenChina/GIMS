<template>
  <el-card v-loading="loading[category]" class="box-card">
    <el-tabs v-model="category">
      <el-tab-pane label="持仓研报管理" name="holding_report">
      </el-tab-pane>
      <el-tab-pane label="产品公告管理" name="product_notice">
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" @click="addProductNotice">
      {{ categoryCode === 4 ? '添加研报' : '添加公告' }}
    </el-button>
    <list-viewer
      :state="getCurrentViewerState"
      :context="this"
      @onFetchData="fetchData"
    />
    <product-edit
      ref="product_edit"
      :category="categoryCode"
      @onChooseProduct="showProductSelect"
      @onSaveSuccess="handleSaveSuccess"
    />
    <product-selector ref="product_selector"
                      @onSelectionConfirm="selectionConfirmFn"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import productSelector from 'common/productSelector';
  import productEdit from './productNoticeEdit';
  import { mapState } from 'vuex';
  export default {
    name: 'ProductNoticeList',
    components: {
      listViewer,
      productSelector,
      productEdit
    },
    data() {
      return {
        category: 'holding_report',
        loading: {
          holding_report: false,
          product_notice: false
        },
        order: 'desc',
        orderColumn: ''
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.productNoticeViewerState
      }),
      getCurrentViewerState() {
        return this.viewerState[this.category];
      },
      categoryCode() {
        if (this.category === 'holding_report') {
          return 4;
        }
        return 3;
      }
    },
    watch: {
      category() {
        if (!this.getCurrentViewerState) {
          this.$store.commit('product/SET_PRODUCT_NOTICE_LIST_VIEWER_STATE', this.category);
          this.fetchData();
        }
      }
    },
    created() {
      this.$store.commit('product/SET_PRODUCT_NOTICE_LIST_VIEWER_STATE', this.category);
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      addProductNotice() {
        this.$refs.product_edit.editVisible = true;
        this.$refs.product_edit.dialogTitle = '添加报告';
      },
      editProductNotice(row) {
        this.$refs.product_edit.editVisible = true;
        this.$refs.product_edit.setForm(row);
      },
      deleteProductNotice(row) {
        const uri = '/productNotice/delete';
        this.$alert({
          msg: '确认删除这条记录吗',
          onConfirm: async() => {
            const type = this.category;
            try {
              this.loading[type] = true;
              await this.$fetch.setParam(uri, { id: row.id }).doRequest();
              this.loading[type] = false;
              // 重新加载数据
              this.$message.success('操作成功！');
              this.fetchData();
            } catch (msg) {
              this.loading[type] = false;
              this.$message.error(msg);
            }
          }
        });
      },
      showProductSelect() {
        this.$refs.product_selector.showDialog();
      },
      downloadReport(row) {
        const basePath = this.$fetch.getBasePath();
        let file = row.attachFileListDto;
        if (!file || file.length < 1) {
          this.$message.error('没有附件可以下载');
          return;
        }
        file = file[0];
        const url = `${basePath}/file/download?directory=${file.filePath}&downloadFile=${file.fileId}${file.fileNameExt}&fileName=${file.fileName}`;
        window.open(url);
      },
      handleSaveSuccess() {
        this.fetchData();
      },
      selectionConfirmFn(selectionList) {
        this.$refs.product_edit.setProduct(selectionList[Object.keys(selectionList)[0]]);
      },
      getLoadParam() {
        const state = this.getCurrentViewerState;
        return {
          category: this.categoryCode,
          ...state.filterModel,
          ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        const type = this.category;
        this.loading[type] = true;
        const params = this.getLoadParam();
        await this.$store.dispatch('product/getProductNoticeList', { type: this.category, arg: params });
        this.loading[type] = false;
      }
    }
  };
</script>

<style scoped>

</style>
