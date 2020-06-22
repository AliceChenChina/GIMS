<template>
  <el-card v-loading="isLoading" class="box-card">
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
      v-if="controlShow"
    />
    <div v-if="!controlShow" class="tac c999">
      暂无权限
    </div>
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'InvestedReport',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        controlShow: true
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.investReportViewerState
      })
    },
    created() {
      this.$store.commit('product/SET_INVESTED_REPORT_VIEWER_STATE');
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        return {
          productId: this.$route.query.skuId,
          ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        const res = await this.$fetch.setParam('/productNotice/queryProductReport', this.getLoadParam()).doRequest();
        if (res === '暂无权限') {
          this.controlShow = false;
        } else {
          this.controlShow = true;
          this.$store.commit('product/SET_INVESTED_REPORT_DATA', res);
        }
        this.isLoading = false;
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
      }
    }
  };
</script>

<style scoped>

</style>
