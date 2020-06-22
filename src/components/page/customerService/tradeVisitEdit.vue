<template>
  <el-dialog class="tradeVisitEdit" title="编辑回访" :visible.sync="editDialogVisible">
    <div v-loading="loading">
      <info-detail-viewer
        :state="tradeVisitEdit"
      />
      <template v-for="(row, index) in getForms">
        <div :key="index" class="menu-anchor-info mtb15">
          <span>{{ row.title }}</span>
        </div>
        <dynamic-form
          class="tradeVisitEditForm"
          :form="row.formItems"
          :model="formModel"
          @onFormChange="handleFormChange"
        />
      </template>
      <el-row class="save bottom-op" justify="center">
        <el-button type="danger" size="large" @click="confirm">保存</el-button>
      </el-row>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import DynamicForm from 'common/DynamicForm';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  export default {
    name: 'TradeVisitEdit',
    components: {
      InfoDetailViewer,
      DynamicForm
    },
    data() {
      return {
        loading: false,
        id: '',
        formModel: {
          callbackStatus: 2,
          remark: ''
        },
        dialogVisible: false, // 大图是否显示
        dialogImageUrl: '', // 当前预览image大图url
        editDialogVisible: false // 回访编辑页面的显示和隐藏
      };
    },
    computed: {
      ...mapState({
        tradeVisitEdit: state => state.customerService.tradeVisitEdit
      }),
      getForms() {
        if (!this.tradeVisitEdit['edit']) return [];
        const vm = this;
        const attachments = {
          title: '附件',
          formItems: [
            [
              {
                formLabel: '',
                modelKey: 'fileList',
                inputTag: 'el-upload',
                inputProps: {
                  'list-type': 'picture-card',
                  beforeUpload(file) {
                    // 图片上传前格式，大小限制
                    const fileTypeArrys = ['image/bmp', 'image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
                    if (!fileTypeArrys.includes(file.type)) {
                      this.$message.error(`文件${file.name}格式不正确`);
                      return false;
                    }
                    const maxSize = 1024 * 1024 * 10;
                    if (file.size > maxSize) {
                      this.$message.error('请上传小于10M的图片');
                      return false;
                    }
                    return file;
                  },
                  onPreview(file) {
                    // todo onPreview事件
                    const fileData = file.response.data;
                    const url = `/djjf-web/file/download?directory=${fileData.filePath}&downloadFile=${fileData.fileId}${fileData.fileNameExt}&fileName=${fileData.fileName}`;
                    vm.dialogImageUrl = url;
                    vm.dialogVisible = true;
                  }
                },
                inputTagOptions: [
                  {
                    tagName: 'div',
                    children: [{
                      tagName: 'i',
                      options: {
                        attrs: {
                          class: 'el-icon-plus'
                        }
                      }
                    }],
                    options: {
                      attrs: {
                        class: 'el-upload__tip',
                        slot: 'tip'
                      }
                    }
                  }
                ]
              }
            ]
          ]
        };
        return [...this.tradeVisitEdit['edit'].fields(this), attachments];
      }
    },
    methods: {
      async fetch(id) {
        this.loading = true;
        await this.$store.dispatch('customerService/getTradeVisitEdit', { id });
        this.loading = false;
      },
      handleFormChange(value) {
        // 表单改变事件
        this.formModel = { ...this.formModel, ...value };
      },
      async submitForm() {
        const tempData = this.$utils.jsonClone(this.formModel);
        const submitData = { remark: tempData.remark, callbackStatus: tempData.callbackStatus };
        submitData.id = this.id;
        submitData.attachList = [];
        if (typeof tempData.fileList !== 'undefined') {
          submitData.attachList = tempData.fileList.map(file => {
            return {
              ...file.response.data,
              module: 'tradeVisit'
            };
          });
        }
        try {
          await this.$fetch.setParam('/tradeVisit/callVisit', submitData).doRequest();
          this.$message.success('保存成功！');
          this.editDialogVisible = false;
          this.$emit('onUpDate');
        } catch (msg) {
          this.$message.error(msg);
        }
      },
      confirm() {
        this.$confirm('确认这个回访结果吗?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.submitForm();
        });
      },
      open(id) {
        this.formModel = {
          callbackStatus: 2,
          remark: ''
        };
        this.id = id;
        this.fetch(this.id);
        this.editDialogVisible = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .menu-anchor-info{
    font-size: 16px;
    color: #EB5954;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    span{
      padding: 5px;
      border-bottom: 2px solid #EB5954;
      display: inline-block;
      margin-bottom: -2px;
    }
    &:after {
      display: block;
      background: #bbbabc;
      height: 3px;
      margin-top: 8px;
    }
  }

  .bottom-op {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    height: 60px;
    width: 100%;
    background: #fff;
  }

  .tradeVisitEdit{
    /deep/.content-info-content{
      width: 200px!important;
    }
    /deep/.desc-item .tiltle-content div{
      text-align: left;
    }
  }

  .tradeVisitEditForm{
    /deep/.el-form-item__label{
      width: auto!important;
      font-size: 12px!important;
    }
    /deep/.el-radio__label{
      font-size: 12px!important;
    }
    /deep/.el-form-item__content{
      margin-left: 110px!important;
    }
  }

  .mtb15{
    margin-bottom: 15px;
  }
</style>
