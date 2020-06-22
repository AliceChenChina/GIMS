<template>
  <el-card v-loading="isLoading" class="box-card">
    <list-viewer
      :state="viewerState"
      :context="this"
      :list-type="false"
      @onFetchData="fetchData"
    >
      <template #before-table>
        <div class="remark">
          1、请选择大小在2M以内的excel格式的表格；<br>

          2、导入时请严格按照模板导入；<br>

          3、导入后请进行校验，校验成功后再进行入库分配<br>

          4、未按照导入模板添加的数据，校验结果页会标红显示；<br>
        </div>
        <div v-show="!isLeadsRight && recordsLength" class="err" style="text-align: center;padding-bottom: 15px">
          <h3>导入信息通过校验存在错误，不会入库</h3>
        </div>
      </template>
      <template #after-pagination>
        <div class="op">
          <el-button type="danger" :disabled="!isLeadsRight" size="large" @click="submitLeads">导入leads</el-button>
        </div>
      </template>
    </list-viewer>
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'LeadsImport',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        fileUploadEle: {}
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.leads.leadsDetailViewerState
      }),
      isLeadsRight() {
        if (!this.viewerState || !this.viewerState.tableData) return false;
        return this.viewerState.tableData.allRight;
      },
      recordsLength() {
        return this.viewerState.tableData && this.viewerState.tableData.records && this.viewerState.tableData.records.length;
      }
    },
    mounted() {
      this.$store.commit('leads/SET_LEADS_IMPORT_STATE');
      this.fetchData();
      this.upload = this.$upload.getUploadInstance('leads_upload');
      this.upload.setUploadHandler(this.doUpload);
      this.upload.setTypeLimit(['xls', 'xlsx']);
      this.upload.setTypeLimitErrorHandler(this.onTypesError);
    },
    methods: {
      onTypesError(validTypes) {
        this.$message.error(`只有${validTypes.join(',')}文件类型可以上传`);
      },
      openUploadSelecotr() {
        this.upload.triggerUpload(); // 打开文件上传框
      },
      downloadTemplate() {
        window.open(this.$fetch.getBasePath() + '/reserve/downloadTemplate');
      },
      async doUpload(file) {
        const form = new FormData();
        form.append('file', file);
        try {
          this.isLoading = true;
          await this.$store.dispatch('leads/uploadLeadsVerify', form);
          this.fileUploadEle.value = '';
          this.isLoading = false;
        } catch (e) {
          this.$message.error(e);
          this.fileUploadEle.value = '';
          this.isLoading = false;
        }
        this.upload.clearFile();
      },
      async submitLeads() {
        // 提交导入leads结果
        if (!this.isLeadsRight) return false;
        const uri = '/reserve/importLeads';
        const param = {
          importLeadsId: this.viewerState.tableData.leadsImportId
        };
        try {
          this.isLoading = true;
          await this.$fetch.setParam(uri, param).doRequest();
          this.$message.success('入库分配成功！');
          this.isLoading = false;
        } catch (msg) {
          this.$message.error(msg);
          this.isLoading = false;
        }
      },
      gotoLeadsDetail(index, row) {
        this.$router.push({
          name: 'leadsDetail',
          params: {
            id: row.id
          }
        });
      },
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        // await this.$store.dispatch('getLeadsList', this.getLoadParam());
        this.isLoading = false;
      }
    }
  };
</script>

<style scoped lang="scss">
  .remark{
    padding: 10px 0 10px 0px;
    color:#D9001B;
    margin-bottom: 10px;
  }
  .op {
    padding-top: 30px;
    padding-right: 30px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }
</style>
