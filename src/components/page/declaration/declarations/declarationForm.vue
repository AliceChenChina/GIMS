<template>
  <div v-loading="isLoading">
    <info-detail-viewer
      v-if="!controlSucessShow"
      :state="view"
    />
    <dynamic-form
      v-if="!controlSucessShow"
      ref="dy_form"
      :form="getForms"
      :model="formModel"
      @onFormChange="handleFormChange"
    />
    <div v-if="controlSucessShow">
      <div class="tac mt120"><img class="imgSize" src="@/assets/img/successIcon.png" /></div>
      <p class="tac mt15 c333 fw500 fz16">提交成功，等待审核</p>
      <div class="tac mt50 mb200"><el-button type="primary" @click="checkDeclarationHistory">我知道了</el-button></div>
    </div>
    <el-row v-if="!controlSucessShow" class="save bottom-op" justify="center">
      <el-button type="primary" @click="goForward">上一步</el-button>
      <el-button type="primary" @click="submitForm(getParam())">提交</el-button>
    </el-row>
  </div>
</template>

<script>
  import DynamicForm from 'common/DynamicForm';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'DeclarationForm',
    components: {
      DynamicForm,
      InfoDetailViewer
    },
    props: {
      tradeType: {
        type: String,
        default: '10'
      },
      productId: {
        type: String,
        default: ''
      },
      customerInfo: {
        type: Object,
        default: () => ({})
      },
      startId: {
        type: Number,
        default: 0
      },
      isProxy: {
        type: Number,
        default: 0
      },
      customerFrom: {
        type: Number,
        default: 1
      },
      referPin: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isLoading: false,
        formModel: {},
        controlSucessShow: false
      };
    },
    computed: {
      ...mapState({
        declarationFormState: state => state.declaration.declarationFormState
      }),
      getForms() {
        const targetForm = this.declarationFormState.fields(this);
        return targetForm;
      },
      formStoreModel() {
        if (this.declarationFormState) {
          return this.declarationFormState.initData;
        }
        return {};
      },
      view() {
        if (this.declarationFormState.declarationHeadInfo) {
          return this.declarationFormState.declarationHeadInfo(this.customerInfo);
        }
        return {};
      }
    },
    watch: {
      formStoreModel: {
        deep: true,
        handler() {
          this.formModel = { ...this.formStoreModel }; // 提交的格式里面有数组，需要进行深拷贝
          if (this.formStoreModel.productType === 'secondary_market') {
            this.formStoreModel.confirmNav = this.$utils.number.keepFourDecimal(this.formStoreModel.confirmNav);
          } else {
            this.formStoreModel.confirmNav = '1.0000';
          }
          // this.$utils.jsonClone
          this.formModel = window.JSON.parse(window.JSON.stringify(this.formStoreModel));
        }
      }
    },
    created() {
      this.$store.commit('declaration/COMMIT_DECLARATION_FORM_VIEWER');
    },
    methods: {
      handleFormChange(value) {
        this.formModel = { ...this.formModel, ...value };
        const bookingBalance = isNaN(parseFloat(this.formModel.bookingBalance)) ? 0 : parseFloat(this.formModel.bookingBalance);
        const feeBalance = isNaN(parseFloat(this.formModel.feeBalance)) ? 0 : parseFloat(this.formModel.feeBalance);
        this.formModel.paymentBlance = this.$utils.number.formatMoney((bookingBalance + feeBalance), 2, '.', '', 0);
      },
      handleImg(arr, fileCatalog) {
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
      getParam() {
        const submitCopyData = JSON.parse(JSON.stringify(this.formModel));
        submitCopyData.tradeType = this.tradeType;
        if (this.isProxy !== 1) {
          submitCopyData.paymentFile = this.handleImg(submitCopyData.paymentFileList, 'payment')[0];
          // submitCopyData.paymentFile.
          submitCopyData.bankcardFile = this.handleImg(submitCopyData.bankcardFileList, 'bankcard')[0];
          submitCopyData.identificationFile = this.handleImg(submitCopyData.identificationFileList, 'identification')[0];
          submitCopyData.otherFiles = this.handleImg(submitCopyData.otherFilesList, 'other');
        }
        submitCopyData.productId = this.productId;
        submitCopyData.customerId = this.customerInfo.customerId;
        submitCopyData.customerFrom = this.customerFrom;
        submitCopyData.referPin = this.referPin;
        submitCopyData.pinCode = this.customerInfo.pinCode ? this.customerInfo.pinCode : '';
        submitCopyData.customerName = this.customerInfo.customerRealNameDto.customerName;
        submitCopyData.startId = this.startId;
        submitCopyData.paymentBlance = submitCopyData.paymentBlance ? submitCopyData.paymentBlance.replace(/,/g, '') : '';
        return submitCopyData;
      },
      submitForm(submitData) {
        this.$refs.dy_form.getFormValidate()(async valid => {
          if (!valid) {
            this.$message.error('有未通过的验证！');
            return false;
          }
          this.isLoading = true;
          try {
            await this.$fetch.setParam('/bookingTrade/saveBooingInfo', submitData).doRequest();
            this.controlSucessShow = true;
            this.$store.commit('declaration/SET_STATUS_STEP', 'terminal');
          } catch (msg) {
            this.$message.error(msg);
          }
          this.isLoading = false;
        });
      },
      goForward() {
        this.$emit('showNextStep', '', this.customerFrom, this.referPin);
        this.$store.commit('declaration/SET_STATUS_STEP', 'back');
      },
      checkDeclarationHistory() {
        this.$store.commit('declaration/INITE_CUSTOMER_INFO_STATE');
        this.$store.commit('declaration/SET_STATUS_STEP', 'inite');
        this.$emit('close');
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
  .imgSize {
    width: 80px;
    height: 80px;
  }
  .save {
    text-align: right;
  }
  /deep/ .el-form {
    margin-top: 10px;
  }
  /deep/ .desc-item .tiltle-content {
    font-size: 14px;
  }
  /deep/ .title-info {
    margin-top: 0;
  }
  /deep/ .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
</style>
