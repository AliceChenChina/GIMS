<template>
  <div class="jdOrder">
    <el-form ref="ruleForm" :model="customerInfo" :rules="rules" label-width="100px" class="jdOrderForm">
      <el-form-item label="客户名称:">
        <el-input v-model="customerInfo.contact" readonly placeholder="请选择客户"></el-input>
        <div class="chooseCustormer">
          <el-button type="primary" @click="choose" size="mini">选择客户</el-button>
        </div>
        <div v-if="ifExitCustomerInfo && ifShowErrMsg" class="red fz12">
          {{errorMessage}}
        </div>
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo" label="客户来源:" prop="customerFrom">
        <el-select v-model="customerInfo.customerFrom" :disabled="ifChooseCustomerFrom && ifChooseNew">
          <el-option v-for="item in customerFromOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ifShowReferPin" label="推荐人京东用户名:" prop="referPin">
        <el-input v-model="customerInfo.referPin" :disabled="ifInputReferPin && ifChooseNew"></el-input>
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo" label="实名认证:" :class="isRed">
        {{ customerInfo.customerRealName }}
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo && ifShowRiskNameSpan" class="red">
        <div -mt22 fz12>注：该客户实名认证结果有误，请检查客户信息是否输入正确</div>
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo" label="风险评测:" :class="isriskLevelRed">
        {{ customerInfo.riskLevelName }}
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo && ifShowRiskLevelSpan" class="red">
        {{ customerInfo.riskLevelNameSpan }}
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo" label="私募资产证明:" :class="isPrivateCertificateRed">
        {{ customerInfo.privateStatusStr }}
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo && isPrivateCertificateShow" class="red">
        <div class="-mt22 fz12">{{privateText}}</div>
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo" label="资管资产证明:" :class="isAsseCertificatetRed">
        {{ customerInfo.assetStatusStr }}
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo && isAsseCertificatetShow" class="red">
        <div class="-mt22 fz12">{{assetText}}</div>
      </el-form-item>
      <el-form-item v-if="ifExitCustomerInfo && ifShowImg">
        <span>请将以下京东金融APP二维码分享给客户，完成以上所需合规认证项</span>
        <div>
          <img src="@/assets/img/compliance.png" />
        </div>
      </el-form-item>
    </el-form>
    <div class="nextStep">
      <el-button type="primary" :disabled="ifNextStep" @click="next">下一步</el-button>
    </div>
    <customerSelector ref="customer_selector" @onSelectionConfirm="selectionConfirmFn" />
  </div>
</template>

<script>
  import customerSelector from 'page/declaration/customerSelector';
  import { mapState } from 'vuex';
  export default {
    name: 'DeclarationChooseCustomer',
    components: {
      customerSelector
    },
    props: {
      referPin: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        productId: this.$route.query.productId,
        isLoading: false,
        controlStep: '',
        controlShow: '',
        customerInfo: {
          contact: '',
          customerFrom: '',
          referPin: '',
          customerRealName: '',
          riskLevelName: '',
          riskLevelNameSpan: '',
          assetCertificateName: '',
          privateStatusStr: '', // 私募资产证明
          assetStatusStr: '', // 资管资产证明
          customerId: ''
        },
        rules: {
          customerFrom: [{ required: true, message: '请输入客户来源', trigger: 'change' }],
          referPin: [{ required: true, message: '请输入推荐人京东用户名', trigger: 'blur' }]
        },
        errorMessage: '',
        ifShowErrMsg: false
      };
    },
    computed: {
      ...mapState({
        customerInfoState: state => state.declaration.customerInfoState,
        decalrationInfo: state => state.declaration.getDeclarationDataState.declarationInfo || {}
      }),
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      },
      customerFromOption() {
        return this.statusArgsWithElOptionsTag('source_type');
      },
      ifShowRiskNameSpan() {
        return this.customerInfoState.customerRealNameDto ? !(this.customerInfoState.customerRealNameDto.realNameStatus === 1) : false;
      },
      isRed() {
        return this.customerInfoState.customerRealNameDto ? this.customerInfoState.customerRealNameDto.realNameStatus === 1 ? '' : 'red' : 'red';
      },
      isriskLevelRed() {
        return this.customerInfoState.customerRiskRatingDto ? this.customerInfoState.customerRiskRatingDto.riskRatingStatus === 1 ? '' : 'red' : 'red';
      },
      isAsseCertificatetRed() {
        return this.customerInfoState.customerAssetCertificateDto ? (this.customerInfoState.customerAssetCertificateDto.assetStatusStr === '已认证' || this.customerInfoState.customerAssetCertificateDto.assetStatusStr === '已过期') ? '' : 'red' : 'red';
      },
      isAsseCertificatetShow() {
        if (this.decalrationInfo.isProxy !== 1 && this.decalrationInfo.assetCertificateLevel === 2) {
          if (this.customerInfoState.customerAssetCertificateDto && this.customerInfoState.customerAssetCertificateDto.assetStatusStr === '未认证') {
            return 'noAsset';
          }
          if (this.customerInfoState.customerAssetCertificateDto && this.customerInfoState.customerAssetCertificateDto.assetStatusStr === '已过期') {
            return 'outOfDate';
          }
        }
        return false;
      },
      assetText() {
        if (this.isAsseCertificatetShow && this.isAsseCertificatetShow === 'noAsset') {
          return '报单此产品需通过资管资产证明，请上传相应资产证明！';
        }
        if (this.isAsseCertificatetShow && this.isAsseCertificatetShow === 'outOfDate') {
          return '客户的资管资产证明已过期，请重新上传相应资产证明！';
        }
        return '';
      },
      isPrivateCertificateRed() {
        return this.customerInfoState.customerAssetCertificateDto ? (this.customerInfoState.customerAssetCertificateDto.privateStatusStr === '已认证' || this.customerInfoState.customerAssetCertificateDto.privateStatusStr === '已过期') ? '' : 'red' : 'red';
      },
      isPrivateCertificateShow() {
        if (this.decalrationInfo.isProxy !== 1 && this.decalrationInfo.assetCertificateLevel === 1) {
          if (this.customerInfoState.customerAssetCertificateDto && this.customerInfoState.customerAssetCertificateDto.privateStatusStr === '未认证') {
            return 'noAsset';
          }
          if (this.customerInfoState.customerAssetCertificateDto && this.customerInfoState.customerAssetCertificateDto.privateStatusStr === '已过期') {
            return 'outOfDate';
          }
        }
        return false;
      },
      privateText() {
        if (this.isPrivateCertificateShow && this.isPrivateCertificateShow === 'noAsset') {
          return '报单此产品需通过私募资产证明，请上传相应资产证明！';
        }
        if (this.isPrivateCertificateShow && this.isPrivateCertificateShow === 'outOfDate') {
          return '客户的私募资产证明已过期，请重新上传相应资产证明！';
        }
        return '';
      },
      ifChooseCustomerFrom() {
        if (!this.customerInfo || this.customerInfo === {}) {
          return false;
        }
        if (this.customerInfo.customerFrom === 1 || this.customerInfo.customerFrom === 2 || this.customerInfo.customerFrom === 3) {
          return true;
        }
        return false;
      },
      ifChooseNew() {
        if (this.customerInfoState.source !== 1 && this.customerInfoState.source !== 2 && this.customerInfoState.source !== 3) {
          return false;
        }
        return true;
      },
      ifShowReferPin() {
        if (this.customerInfo && this.customerInfo.customerFrom === 2) {
          return true;
        }
        return false;
      },
      ifInputReferPin() {
        return this.customerInfo ? !!this.customerInfo.referPin : false;
      },
      ifExitCustomerInfo() {
        return !!this.customerInfo.customerId;
      },
      ifShowRiskLevelSpan() {
        return this.customerInfo ? !!this.customerInfo.riskLevelNameSpan : false;
      },
      ifShowImg() {
        if (!this.customerInfoState.customerRealNameDto || !this.customerInfoState.customerRiskRatingDto || this.customerInfoState.customerRiskRatingDto.riskLevel <= 1) {
          return true;
        }
        // 直销
        if (this.decalrationInfo.isProxy !== 1) {
          if (this.isPrivateCertificateShow || this.isAsseCertificatetShow) {
            return true;
          }
        }
        return false;
      },
      ifNextStep() {
        if (this.ifShowErrMsg) {
          return true;
        }
        if (!this.customerInfo.customerFrom) {
          return true;
        }
        if (!this.customerInfoState.customerRealNameDto || this.customerInfoState.customerRealNameDto.realNameStatus !== 1) {
          return true;
        }
        // 直销
        if (this.decalrationInfo.isProxy !== 1) {
          if (this.isPrivateCertificateShow || this.isAsseCertificatetShow) {
            return true;
          }
        }
        if (!this.customerInfoState.customerRiskRatingDto || this.customerInfoState.customerRiskRatingDto.riskRatingStatus !== 1 || this.customerInfoState.customerRiskRatingDto.riskLevel <= 1) {
          return true;
        }
        return false;
      }
    },
    watch: {
      customerInfoState: {
        deep: true,
        handler() {
          this.iNitCustomerInfo();
        }
      }
    },
    created() {
      if (this.$route.query.productId === this.productId) {
        this.iNitCustomerInfo();
        return false;
      }
      this.$store.commit('declaration/INITE_CUSTOMER_INFO_STATE');
      this.iNitCustomerInfo();
    },
    activated() {
      if (this.$route.query.productId === this.productId) {
        return false;
      }
      this.productId = this.$route.query.productId;
      this.$store.commit('declaration/INITE_CUSTOMER_INFO_STATE');
      this.iNitCustomerInfo();
    },
    methods: {
      iNitCustomerInfo() {
        this.customerInfo.customerFrom = this.customerInfoState.source ? this.customerInfoState.source : '';
        this.customerInfo.referPin = this.customerInfoState.referPin ? this.customerInfoState.referPin : '';
        this.customerInfo.contact = this.customerInfoState.oriContact ? this.customerInfoState.oriContact : '';
        this.customerInfo.customerId = this.customerInfoState.customerId ? this.customerInfoState.customerId : '';
        // 实名认证
        const customerRealNameDto = this.customerInfoState.customerRealNameDto;
        this.customerInfo.customerRealName = customerRealNameDto ? customerRealNameDto.realNameStatus === 1 ? this.dealWithName(customerRealNameDto.customerName) : '认证错误' : '未认证';
        // 风险评测
        const customerRiskRatingDto = this.customerInfoState.customerRiskRatingDto;
        this.customerInfo.riskLevelName = customerRiskRatingDto ? customerRiskRatingDto.riskRatingStatus === 1 ? customerRiskRatingDto.riskLevelName : '未测评' : '未测评';
        this.customerInfo.riskLevelNameSpan = customerRiskRatingDto ? customerRiskRatingDto.riskLevel <= 1 ? '注：预约该产品需客户风险等级高于保守型，当前客户风险等级较低' : '' : '';
        // 资产证明
        const customerAssetCertificateDto = this.customerInfoState.customerAssetCertificateDto;
        this.customerInfo.assetCertificateName = customerAssetCertificateDto ? (customerAssetCertificateDto.assetStatus === 1 || customerAssetCertificateDto.privateStatus === 1) ? '已认证' : '未提交' : '未提交';
        this.customerInfo.privateStatusStr = customerAssetCertificateDto ? customerAssetCertificateDto.privateStatusStr ? customerAssetCertificateDto.privateStatusStr : '未认证' : '未认证';
        this.customerInfo.assetStatusStr = customerAssetCertificateDto ? customerAssetCertificateDto.assetStatusStr ? customerAssetCertificateDto.assetStatusStr : '未认证' : '未认证';
      },
      choose() {
        this.$refs.customer_selector.showDialog();
      },
      selectionConfirmFn(id, contact, customerId) {
        this.getCustomerUserInfo({ id: id });
        this.checkUserDeclaration({ customerId: customerId });
      },
      async getCustomerUserInfo(id) {
        this.isLoading = true;
        try {
          await this.$store.dispatch('declaration/getCustomerInfo', id);
        } catch (msg) {
          this.$message.error(msg);
        };
        this.isLoading = false;
      },
      async checkUserDeclaration(customerId) {
        this.isLoading = true;
        try {
          const result = await this.$fetch.setParam('/customerList/checkUserDeclaration', customerId).doRequest();
          if (result && result.code !== 0) {
            this.errorMessage = result.message;
            this.ifShowErrMsg = true;
          } else {
            this.ifShowErrMsg = false;
          }
        } catch (msg) {
          this.$message.error(msg);
        };
        this.isLoading = false;
      },
      statusArgsWithElOptionsTag(groupKey) {
        const options = Object.keys(this.enumArgs[groupKey]).map(key => {
          if (/^[^\u4e00-\u9fa5]+$/.test(key)) {
            return {
              label: this.enumArgs[groupKey][key],
              value: /^\d+$/.test(key) ? parseInt(key) : key
            };
          }
        });
        return options.filter(nodes => nodes);
      },
      dealWithName(customerName) {
        const len = customerName.length;
        const asterisk = '*';
        if (len === 2) {
          return customerName.substring(0, 1) + asterisk;
        } else if (len > 2) {
          const last = len - 1;
          return customerName.substring(0, 1) + asterisk + customerName.substring(last);
        }
      },
      async next() {
        const param = {
          customerId: this.customerInfoState.customerId,
          contact: this.customerInfoState.contact
        };
        this.isLoading = true;
        try {
          await this.$fetch.setParam('/bookingTrade/checkPlannerCustomer', param).doRequest();
          this.$emit('showNextStep', this.customerInfoState, this.customerInfo.customerFrom, this.customerInfo.referPin);
          this.$store.commit('declaration/SET_STATUS_STEP', 'forward');
        } catch (msg) {
          this.$message.error(msg);
        }
        this.isLoading = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .jdOrder{
    overflow: hidden;
  }
  .jdOrderForm {
    width: 70%;
  }
  .btns {
    text-align: center;
  }
  .chooseCustormer{
    position: absolute;
    left: 500px;
    top: 0;
    .choose {
      color: red;
    }
    .add {
      color: red;
    }
  }
  .red{
    color:red;
  }
  .nextStep {
    text-align: right;
  }
  .-mt22{
    margin-top: -22px;
  }
</style>
