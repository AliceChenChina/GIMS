<template>
  <el-dialog v-loading="isLoading" title="产品报单" :visible.sync="formDialogVisible" :close-on-click-modal="false" width="890px" @close="close">
    <div class="steps">
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="选择客户"></el-step>
        <el-step title="填写报单信息"></el-step>
        <el-step title="提交审核"></el-step>
      </el-steps>
    </div>
    <div class="mt25 declarationMark" v-if="decalrationInfo.isProxy === 1">
      请在客户线上下单的3个自然日内（含下单日当天）完成报单，否则无法计入业绩。
    </div>
    <div class="mt25">
      <declarationChooseCustomer v-if="controlChooseCustomer" :refer-pin="referPin" @showNextStep="showNextStep" @close="close"/>
      <declarationForm v-if="controlDeclarationForm" :trade-type="tradeType" :customer-info="customerInfoState" :product-id="productId" :is-proxy="isProxy" :start-id="startId" :customer-from="customerFrom" :refer-pin="referPin" @showNextStep="showNextStep" @closeCurrentTag="closeCurrentTag" @close="close"/>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import declarationChooseCustomer from './declarationChooseCustomer';
  import declarationForm from './declarationForm';
  export default {
    name: 'CreateDeclaration',
    components: {
      declarationChooseCustomer,
      declarationForm
    },
    data() {
      return {
        isLoading: false,
        controlChooseCustomer: true,
        controlDeclarationForm: false,
        customerInfoState: {},
        customerFrom: '',
        referPin: '',
        formDialogVisible: false
      };
    },
    computed: {
      ...mapState({
        active: state => state.declaration.declarationStepStatus || 0,
        decalrationInfo: state => state.declaration.getDeclarationDataState.declarationInfo || {},
        startBookingInfo: state => state.declaration.getDeclarationDataState.startBookingInfo || {}
      }),
      isProxy() {
        return (this.decalrationInfo.isProxy === 0 || this.decalrationInfo.isProxy === 1) ? this.decalrationInfo.isProxy : 0;
      },
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      },
      tradeType() {
        return this.decalrationInfo.productStatus === '0' ? '10' : '20';
      }
    },
    methods: {
      async show(param = {}) {
        this.productId = param.productId;
        this.startId = param.startId;
        this.formDialogVisible = true;
        await this.fetch(this.productId, this.startId);
        this.$store.commit('declaration/SET_STATUS_STEP', 'inite');
        this.controlChooseCustomer = true;
        this.controlDeclarationForm = false;
      },
      close() {
        this.formDialogVisible = false;
        this.controlChooseCustomer = true;
        this.controlDeclarationForm = false;
        this.$store.commit('declaration/INITE_CUSTOMER_INFO_STATE');
        this.$store.commit('declaration/SET_STATUS_STEP', 'inite');
      },
      async fetch(productId, startId) {
        this.loading = true;
        await this.$store.dispatch('declaration/getDeclarationData', { productId });
        await this.$store.dispatch('declaration/getBookingStartInfo', { startId });
        this.loading = false;
      },
      showNextStep(value, customerFrom, referPin) {
        this.controlChooseCustomer = !this.controlChooseCustomer;
        this.controlDeclarationForm = !this.controlDeclarationForm;
        if (value) this.customerInfoState = value;
        if (customerFrom) this.customerFrom = customerFrom;
        if (customerFrom) this.referPin = referPin;
      },
      closeCurrentTag(value) {
        this.$bus.emit('close_current_tags');
      }
    }
  };
</script>
<style scoped>
.steps >>> .el-steps--simple {
  padding: 10px 8%;
  line-height: normal;
}
.steps >>> .el-step.is-simple .el-step__title {
  font-size: 14px;
}
  .steps >>> .el-step__title.is-success, .steps >>> .el-step__head.is-success {
    color: #EB5954;
    border-color: #EB5954;
  }
  .declarationMark {
    padding-left: 22px;
    background: url('~img/inconInfo.png') no-repeat 0 center;
    background-size: 17px 17px;
  }
</style>
