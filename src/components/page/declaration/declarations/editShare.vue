<template>
  <el-dialog :title="title" :visible.sync="editDialogVisible">
    <dynamic-form
      ref="dy_form"
      :form="getForms"
      :model="formModel"
      @onFormChange="handleFormChange"
    />
    <el-row class="save bottom-op" justify="center" style="text-align: right">
      <el-button type="danger" size="large" @click="cancel">取消</el-button>
      <el-button type="danger" size="large" @click="submitForm(getParam())">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  import DynamicForm from 'common/DynamicForm';
  import { mapState } from 'vuex';
  import queryString from 'query-string';
  export default {
    name: 'EditShare',
    components: {
      DynamicForm
    },
    data() {
      return {
        isLoading: false,
        formModel: {},
        tradeId: '',
        title: '',
        editDialogVisible: false,
        type: ''
      };
    },
    computed: {
      ...mapState({
        editShareState: state => state.declaration.editShareState
      }),
      formStoreModel() {
        if (this.editShareState.model) {
          const model = this.editShareState.model;
          const storeModel = window.JSON.parse(window.JSON.stringify(this.editShareState.model));
          storeModel.confirmNav = model.confirmNav ? model.confirmNav : '';
          storeModel.redeemAmountFileList = this.handleInitImg(model.redeemAmountFileList);
          storeModel.shareFileList = this.handleInitImg(model.shareFileList);
          storeModel.applyTime = model.applyTime ? model.applyTime.substring(0, 10) : '';
          return storeModel;
        }
        return {};
      },
      getForms() {
        if (this.editShareState.fields) {
          const targetForm = this.editShareState.fields(this);
          return targetForm;
        }
        return {};
      }
    },
    watch: {
      formStoreModel: {
        deep: true,
        handler() {
          if (this.formStoreModel.productType === 'secondary_market') {
            this.formStoreModel.confirmNav = this.formStoreModel.confirmNav ? this.$utils.number.keepFourDecimal(this.formStoreModel.confirmNav) : '';
          } else {
            this.formStoreModel.confirmNav = '1.0000';
          }
          // this.$utils.jsonClone
          this.formModel = window.JSON.parse(window.JSON.stringify(this.formStoreModel));
        }
      }
    },
    methods: {
      show({ tradeId = '', type = 'editShare', title = '' } = {}) {
        this.tradeId = tradeId;
        this.title = title;
        this.editDialogVisible = true;
        this.type = type;
        this.$store.commit('declaration/COMMIT_EDIT_SHARE_VIEWER', type);
        this.fetchData();
      },
      handleFormChange(value) {
        this.formModel = { ...this.formModel, ...value };
      },
      handleInitImg(imgArr) {
        if (!imgArr || imgArr.length === 0) {
          return [];
        }
        const newImgArr = imgArr.map(file => {
          const query = {
            directory: file.filePath,
            downloadFile: `${file.fileId}${file.fileNameExt}`,
            fileName: file.fileName
          };
          return {
            uid: file.fileId,
            module: file.module,
            url: `/djjf-web/file/download?${queryString.stringify(query)}`,
            status: 'success',
            name: file.fileName,
            size: file.fileSize,
            response: {
              data: file
            }
          };
        });
        return newImgArr;
      },
      getParam() {
        let submitCopyData = JSON.parse(JSON.stringify(this.formModel));
        submitCopyData.confirmTime = this.formatDate(submitCopyData.confirmTime, 'yyyy-MM-dd hh:mm:ss');
        if (this.type === 'editShare' || this.type === 'addShare') {
          submitCopyData.confirmFileList = this.handleImg(submitCopyData.shareFileList);
        } else {
          submitCopyData.confirmFileList = this.handleImg(submitCopyData.redeemAmountFileList);
        }
        submitCopyData = { ...submitCopyData, ...{ tradeId: this.tradeId } };
        return submitCopyData;
      },
      handleImg(arr, fileCatalog = null) {
        if (!arr || (arr && arr.length === 0)) {
          return [];
        }
        const newArr = arr.map(item => {
          const response = item.response.data;
          item = { ...item, ...response };
          item.fileCatalog = fileCatalog;
          item.module = 'trade';
          delete item.response;
          return item;
        });
        return newArr;
      },
      submitForm(submitData) {
        this.$refs.dy_form.getFormValidate()(async valid => {
          if (!valid) {
            this.$message.error('有未通过的验证！');
            return false;
          }
          this.isLoading = true;
          try {
            if (this.type === 'editShare' || this.type === 'addShare') {
              await this.$fetch.setParam('/tradeConfirm/commitShare', submitData).doRequest();
            } else {
              await this.$fetch.setParam('/tradeConfirm/commitBalance', submitData).doRequest();
            }
            this.$message.success('保存成功！');
            this.$emit('onUpdate');
            this.editDialogVisible = false;
          } catch (msg) {
            this.$message.error(msg);
          }
          this.isLoading = false;
        });
      },
      formatDate(date, fmt) {
        if (!date) return '';
        const currentDate = new Date(date);
        const o = {
          'M+': currentDate.getMonth() + 1, // 月份
          'd+': currentDate.getDate(), // 日
          'h+': currentDate.getHours(), // 小时
          'm+': currentDate.getMinutes(), // 分
          's+': currentDate.getSeconds(), // 秒
          'q+': Math.floor((currentDate.getMonth() + 3) / 3) // 季度
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (const k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
        return fmt;
      },
      async fetchData() {
        await this.$store.dispatch('declaration/getEditShareData', {
          tradeId: this.tradeId
        });
        this.$nextTick(() => {
          if (this.type === 'editShare') {
            // 編輯份額
            if (this.formModel.shareFileList.length >= 1) {
              document.getElementsByClassName('uploadshareFileList')[0].childNodes[1].style.display = 'none';
            } else {
              document.getElementsByClassName('uploadshareFileList')[0].childNodes[1].style.display = 'inline-block';
            }
          } else {
            // 補錄
            if (this.formModel.redeemAmountFileList.length >= 1) {
              document.getElementsByClassName('uploadshareFileList')[0].childNodes[1].style.display = 'none';
            } else {
              document.getElementsByClassName('uploadshareFileList')[0].childNodes[1].style.display = 'inline-block';
            }
          }
        });
      },
      cancel() {
        this.editDialogVisible = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  /*.box-card .el-card__body{*/
  /*  width: 500px;*/
  /*}*/
  .menu-anchor-info{
    font-size: 16px;
    color: #EB5954;
    font-weight: bold;
    padding-bottom: 30px;
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
</style>
