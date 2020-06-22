<template>
  <el-dialog v-loading="isLoading" title="报单审核" :visible.sync="formDialogVisible" :close-on-click-modal="false" width="890px" @close="close">
    <info-detail-viewer
      v-loading="isLoading"
      :state="customerInfo"
    />
    <info-detail-viewer
      :state="declarationInfoTitle"
    />
    <div v-if="controlShow" class="jdOrder">
      <el-form ref="ruleForm" :model="queryParam" label-width="100px" class="jdOrderForm">
        <el-form-item label="匹配集团订单:" prop="groupTradeIdDes">
          <el-input v-model="queryParam.groupTradeIdDes" readonly placeholder="点击匹配集团订单..." @focus="matchBlocOrder"></el-input>
        </el-form-item>
      </el-form>
<!--      <el-button class="jdOrderBtn" @click="matchBlocOrder">匹配订单</el-button>-->
    </div>
    <info-detail-viewer
      v-if="formDialogVisible"
      :state="declarationInfo"
    />
    <choose-declaration-order ref="product_selector" :param="param" @onSelectionConfirm="selectionConfirmFn" />
    <div class="btns">
      <el-button type="success" @click="confirmAudit(8)">通过</el-button><el-button type="primary" @click="rejectDialogVisible = !rejectDialogVisible">驳回</el-button><el-button @click="close">取消</el-button>
    </div>
    <el-dialog title="驳回原因" :visible.sync="rejectDialogVisible" :close-on-click-modal="false" width="475px" :append-to-body="true" @close="cancelReject" class="rejectDialog">
      <div class="mb10">请选择驳回原因，原因将展示给用户</div>
      <div>
        <el-form ref="ruleRejectForm" :model="rejectParam" :rules="rules" label-width="10px">
          <el-form-item label=" " prop="auditRemark" >
            <el-select v-model="rejectParam.auditRemark" placeholder="请选择">
              <el-option v-for="(auditItem, index) in auditRemarkOptions" :key="index" :label="auditItem.label" :value="auditItem.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="rejectedReason" v-if="rejectParam.auditRemark === '其他'">
            <el-input type="textarea" placeholder="请输入内容" v-model="rejectParam.rejectedReason" maxlength="20" resize="none" :rows="5" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="btns">
        <el-button @click="cancelReject">取消</el-button><el-button type="primary" @click="confirmAudit(13)">确认</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  import chooseDeclarationOrder from 'page/declaration/declarationOrderList';
  import { getImgUrl } from '@/store/pageConf/declaration/utils';

  export default {
    name: 'RedeemAuditDetail',
    components: {
      InfoDetailViewer,
      chooseDeclarationOrder
    },
    data() {
      return {
        isLoading: false,
        customerInfo: [],
        declarationInfo: [],
        controlShow: '',
        declarationInfoTitle: [
          {
            type: 'basic',
            title: '报单信息',
            rows: []
          }
        ],
        tradeId: '',
        startId: '',
        queryParam: {
          tradeId: '',
          startId: '',
          status: 1,
          groupTradeId: '',
          groupTradeIdDes: '',
          auditRemark: '',
          rejectedReason: ''
        },
        rejectParam: {
          auditRemark: '',
          rejectedReason: ''
        }, // 驳回弹框的数据
        formDialogVisible: false,
        rejectDialogVisible: false, // 控制驳回弹框显示与隐藏
        rules: {
          auditRemark: [
            { required: true, message: '请选择驳回原因', trigger: 'change' }
          ],
          rejectedReason: [
            { required: true, message: '请填写其他驳回原因', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      ...mapState({
        auditInfo: state => state.declaration.auditInfoState
      }),
      param() {
        return {
          userPin: this.auditInfo ? this.auditInfo.customerDto ? this.auditInfo.customerDto.pinCode ? encodeURIComponent(this.auditInfo.customerDto.pinCode) : '' : '' : '',
          productId: this.auditInfo ? this.auditInfo.productDto ? this.auditInfo.productDto.groupProductId ? this.auditInfo.productDto.groupProductId : '' : '' : '',
          bookingTime: this.auditInfo ? this.auditInfo.bookingTime ? this.auditInfo.bookingTime : '' : ''
        };
      },
      auditRemarkOptions() {
        return this.statusArgsWithElOptionsTag('EmAuditRemark');
      },
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      }
    },
    watch: {
      auditInfo: {
        deep: true,
        handler() {
          const auditInfo = this.auditInfo;
          this.customerInfo = [
            {
              type: 'basic',
              title: '客户信息',
              rows: [
                [
                  {
                    label: '客户名称：',
                    value: auditInfo.customerName
                  },
                  {
                    label: '证件类型：',
                    value: auditInfo.customerRealNameDto ? auditInfo.customerRealNameDto.identification : '',
                    formatter: (value, h, context) => {
                      return context.enumArgs['identity_type_jd'][value];
                    }
                  },
                  {
                    label: '证件号：',
                    value: auditInfo.customerRealNameDto ? auditInfo.customerRealNameDto.identificationNo : ''
                  }
                ],
                [
                  {
                    label: '银行开户行：',
                    value: auditInfo.bankBranch
                  },
                  {
                    label: '银行账号：',
                    value: auditInfo.bankAccount
                  },
                  {
                    label: '客户来源：',
                    value: auditInfo.customerFromStr
                  }
                ]
              ]
            }
          ];
          this.declarationInfo = [
            {
              type: 'basic',
              title: '',
              rows: [
                [
                  {
                    label: '报单金额：',
                    value: this.$utils.number.formatMoney(auditInfo.bookingBalance, 2, false),
                    hasUnit: '元'
                  },
                  {
                    label: '费用信息：',
                    value: this.$utils.number.formatMoney(auditInfo.feeBalance, 2, false),
                    hasUnit: '元'
                  },
                  {
                    label: '报单日期：',
                    value: auditInfo.bookingTime,
                    formatDate: true
                  }
                ],
                [
                  {
                    label: '汇款金额：',
                    value: this.$utils.number.formatMoney(auditInfo.paymentBlance, 2, false),
                    formatter: (value, h) => {
                      return (<div style="color: red;">{value}</div>);
                    }
                  },
                  {
                    label: '汇款时间：',
                    value: auditInfo.paymentDate
                  },
                  {
                    label: ' ',
                    value: ' '
                  }
                ]
              ]
            }
          ];
          this.controlShow = this.auditInfo ? this.auditInfo.productDto ? this.auditInfo.productDto.isProxy === 1 ? 'ok' : '' : '' : '';
          if (!this.controlShow) {
            const certifys = [
              {
                label: '证件：',
                value: auditInfo.identificationFile ? auditInfo.identificationFile : [],
                formatter: (json, h) => {
                  const files = getImgUrl(json);
                  return (<imgView files={files} />);
                }
              },
              {
                label: '银行卡：',
                value: auditInfo.bankcardFile ? auditInfo.bankcardFile : [],
                formatter: (json, h) => {
                  const files = getImgUrl(json);
                  return (<imgView files={files} />);
                }
              },
              {
                label: '付款凭证：',
                value: auditInfo.paymentFile ? auditInfo.paymentFile : [],
                formatter: (json, h) => {
                  const files = getImgUrl(json);
                  return (<imgView files={files} />);
                }
              }
            ];
            const others = [
              {
                label: '其他附件：',
                value: auditInfo.otherFiles ? auditInfo.otherFiles : [],
                formatter: (json, h) => {
                  const files = getImgUrl(json);
                  return (<imgView files={files} />);
                }
              }
            ];
            if (this.auditInfo.otherFiles && JSON.parse(JSON.stringify(this.auditInfo.otherFiles)).length > 0) {
              this.declarationInfo[0].rows.splice(2, 0, certifys, others);
            } else {
              this.declarationInfo[0].rows.splice(2, 0, certifys);
            }
          }
        }
      }
    },
    methods: {
      async show(param = {}) {
        this.tradeId = param.tradeId;
        this.startId = param.startId;
        this.queryParam.tradeId = param.tradeId;
        this.queryParam.startId = param.startId;
        this.queryParam.groupTradeId = '';
        this.queryParam.groupTradeIdDes = '';
        this.queryParam.auditRemark = '';
        this.queryParam.rejectedReason = '';
        this.formDialogVisible = true;
        this.declarationInfo = [];
        await this.fetch(this.tradeId);
      },
      async fetch(tradeId) {
        this.isLoading = true;
        await this.$store.dispatch('declaration/getAuditInfo', { tradeId });
        this.isLoading = false;
      },
      // 确认通过
      confirm() {
        this.$alert({
          msg: '确认要审核通过吗？',
          onConfirm: async() => {
            this.audit(this.queryParam);
          }
        });
      },
      confirmAudit(status) {
        this.queryParam.status = status;
        // 通过
        if (status === 8) {
          if (this.auditInfo.productDto.isProxy === 1) {
            if (!this.queryParam.groupTradeId) {
              this.$message.error('订单未匹配！请先匹配集团订单！');
              return false;
            }
          }
          this.confirm();
        };
        // 退单
        if (status === 13) {
          this.$refs['ruleRejectForm'].validate((valid) => {
            if (!valid) {
              this.$message.error('验证未通过！');
              return false;
            }
            if (this.rejectParam.auditRemark !== '其他') {
              this.rejectParam.rejectedReason = '';
            }
            this.queryParam = { ...this.queryParam, ...this.rejectParam };
            this.queryParam.auditRemark = this.rejectParam.auditRemark;
            this.queryParam.rejectedReason = this.rejectParam.rejectedReason;
            this.queryParam.groupTradeId = '';
            this.queryParam.groupTradeIdDes = '';
            this.audit(this.queryParam);
          });
        }
      },
      async audit(param) {
        this.isLoading = true;
        try {
          await this.$fetch.setParam('/bookingTrade/audit', param).doRequest();
          if (this.$refs['ruleForm']) {
            this.$refs['ruleForm'].resetFields();
          }
          if (this.$refs['ruleRejectForm']) {
            this.$refs['ruleRejectForm'].resetFields();
          }
          this.rejectDialogVisible = false;
          this.formDialogVisible = false;
          this.$emit('onUpdate');
          this.$message.success('操作成功');
        } catch (msg) {
          this.$message.error(msg);
        };
        this.isLoading = false;
      },
      close() {
        if (this.$refs['ruleForm']) {
          this.$refs['ruleForm'].resetFields();
        }
        this.formDialogVisible = false;
      },
      matchBlocOrder() {
        this.$refs.product_selector.showDialog(this.param);
      },
      selectionConfirmFn(value) {
        this.queryParam.groupTradeId = value.plOrderId;
        this.queryParam.groupTradeIdDes = value.plOrderId + '|' + value.userName + '|' + value.productShowName + '|' + value.inputAmount + '元';
      },
      cancelReject() {
        this.$refs['ruleRejectForm'].resetFields();
        this.rejectDialogVisible = false;
      },
      // 加工返回dynamic-filter组件el-select里面用的配置数组
      statusArgsWithElOptionsTag(groupKey) {
        // map方法不会执行空数组
        const enumArgs = this.enumArgs[groupKey] || {};
        const options = Object.keys(enumArgs).map(key => {
          if (/^[^\u4e00-\u9fa5]+$/.test(key)) {
            return {
              label: enumArgs[key],
              value: /^\d+$/.test(key) ? parseInt(key) : key
            };
          }
        });
        return options.filter(nodes => nodes);
      }
    }
  };
</script>
<style lang="scss" scoped>
  /deep/ .desc-item .tiltle-content {
    font-size: 14px;
  }
  /deep/ .desc-item .tiltle-content .wrapper .content-info-title {
    width: 100px;
    min-width: 100px;
  }
  /deep/ .jdOrderForm .el-form-item__content {
    padding-left: 4px;
    width: 500px;
  }
  /deep/ .el-form-item__label {
    padding-right: 0;
  }
  /deep/ .el-dialog__body {
    padding-top: 0px;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
  .jdOrder {
    margin-top: 10px;
    margin-bottom: -25px;
  }
  .btns {
    text-align: right;
    margin-top: 70px;
  }
  /deep/ .el-select {
    width: 100%;
  }
</style>
