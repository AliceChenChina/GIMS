<template>
  <el-card v-loading="isLoading" class="box-card">
    <el-row style="margin-bottom: 20px;">
      <el-button type="danger" @click="uploadVisible = true">添加附件</el-button>
    </el-row>
    <el-tabs v-model="type">
      <el-tab-pane label="产品要素" name="productElement"></el-tab-pane>
      <el-tab-pane label="签约指南" name="productSign"></el-tab-pane>
      <el-tab-pane label="营销资料" name="productMarketing"></el-tab-pane>
    </el-tabs>
    <list-viewer
      ref="attach_viewer"
      :state="getCurrentViewerState()"
      :context="this"
      @onFetchData="fetchData"
    />
    <!-- 编辑弹出框 -->
    <el-dialog v-loading="dialogLoading" title="编辑" :visible.sync="uploadVisible" width="30%">
      <el-form ref="form" :model="uploadForm" :rules="rules" label-width="100px">
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="uploadForm.fileName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openChoose">选择文件</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUpload">保 存</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'LeadsQuery',
    components: {
      listViewer
    },
    data() {
      return {
        uploadForm: {
          fileName: ''
        },
        rules: {
          fileName: [
            { required: true, message: '请输入文件名', trigger: 'blur' }
          ]
        },
        upload: {},
        dialogLoading: false,
        isLoading: false,
        uploadVisible: false,
        skuId: this.$route.query.skuId,
        type: 'productElement' // 产品要素
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.attachmentViewerState
      })
    },
    watch: {
      type() {
        this.fetchData();
      }
    },
    created() {
      this.$store.commit('product/SET_ATTACHMENT_VIEWER_STATE', this.type);
      this.upload = this.$upload.getUploadInstance('benefits_upload');
      this.upload.setUploadHandler(this.uploadHandler);
      this.upload.setTypeLimit(['bmp', 'jpg', 'jpeg', 'gif', 'png', 'mp4', 'rm', 'rmvb', 'avi', '3gp', 'mkv', 'wmv', 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'txt', 'rar', 'zip', '7z']);
      this.upload.setTypeLimitErrorHandler(this.onTypesError);
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      onTypesError(validTypes) {
        this.$message.error(`只有${validTypes.join(',')}文件类型可以上传`);
      },
      getCurrentViewerState() {
        if (typeof this.viewerState[this.type] === 'undefined') {
          this.$store.commit('product/SET_ATTACHMENT_VIEWER_STATE', this.type);
        }
        return this.viewerState[this.type];
      },
      getLoadParam() {
        const state = this.getCurrentViewerState();
        return {
          objId: this.skuId,
          module: this.type,
          ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('product/attachFileQuery', {
          type: this.type,
          arg: this.getLoadParam()
        });
        this.isLoading = false;
      },
      async uploadHandler(file) {
        const uri = '/fileUpload/upload';
        const form = new FormData();
        form.append('file', file);
        form.append('skuId', this.skuId);
        this.dialogLoading = true;
        try {
          const res = await this.$fetch.setParam(uri, form).doRequest();
          this.uploadForm = res;
          this.dialogLoading = false;
          this.uploadForm.fileName = res.fileName;
          this.upload.clearFile();
        } catch (msg) {
          this.upload.clearFile();
          this.dialogLoading = false;
          this.$message.error(msg);
        }
      },
      async saveUpload() {
        const uri = '/product/attachFile/save';
        let arg = {
          objId: this.skuId,
          module: this.type,
          fileName: this.uploadForm.fileName,
          remark: '',
          isFile: true, // 是否上传
          fileCatalog: ''
        };
        arg = { ...this.uploadForm, ...arg };
        // arg.module = this.type;
        // arg.objId = this.type;
        this.dialogLoading = true;
        try {
          await this.$fetch.setParam(uri, arg).doRequest();
          this.$message.success('保存完成！');
          this.uploadVisible = false;
        } catch (msg) {
          this.$message.error(msg);
        }
        this.dialogLoading = false;
        // 重新加载数据
        this.fetchData();
      },
      openChoose() {
        this.upload.triggerUpload();
      },
      downloadAttachment(attachment) {
        const basePath = this.$fetch.getBasePath();
        const url = `${basePath}/file/download?directory=${attachment.filePath}&downloadFile=${attachment.fileId}${attachment.fileNameExt}&fileName=${attachment.fileName}`;
        window.open(url);
      },
      deleteProductNotice(attachment) {
        const uri = '/product/attachFile/delete';
        this.$alert({
          msg: '确认删除这个附件吗',
          onConfirm: async() => {
            this.isLoading = true;
            try {
              await this.$fetch.setParam(uri, { id: attachment.id }).doRequest();
              this.$message.success('操作成功！');
            } catch (msg) {
              this.$message.error(msg);
            }
            this.isLoading = false;
            // 重新加载数据
            this.fetchData();
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
