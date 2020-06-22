<template>
  <el-card>
    <info-detail-viewer
      v-loading="loading"
      :state="redeemAuditState"
    />
    <div class="btns">
      <el-button type="success" @click="confirmAudit(2)">通过</el-button><el-button type="primary" @click="confirmAudit(13)">驳回</el-button><el-button @click="cancel">返回</el-button>
    </div>
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';

  export default {
    name: 'RedeemAudit',
    components: {
      InfoDetailViewer
    },
    data() {
      return {
        loading: false,
        tradeId: this.$route.query.tradeId,
        status: 2
      };
    },
    computed: {
      ...mapState({
        redeemAuditState: state => state.declaration.redeemAuditState
      })
    },
    async created() {
      await this.fetch(this.tradeId);
    },
    activated() {
      if (this.$route.query.tradeId === this.tradeId) {
        return false;
      }
      this.tradeId = this.$route.query.tradeId;
      this.fetch(this.tradeId);
    },
    methods: {
      async fetch(tradeId) {
        await this.$store.dispatch('declaration/getRedeemAudit', { tradeId });
      },
      conformDialog(content, succFn) {
        this.$alert({
          msg: content,
          onConfirm: async() => {
            succFn && succFn();
          }
        });
      },
      confirmAudit(status) {
        if (status === 2) {
          this.status = 2;
          this.conformDialog('确认要审核通过吗', this.audit);
        }
        if (status === 13) {
          this.status = 13;
          this.conformDialog('确认驳回吗', this.audit);
        }
      },
      async audit() {
        let param;
        if (this.status === 2) {
          param = { status: 2, tradeId: this.tradeId };
        }
        if (this.status === 13) {
          param = { status: 13, tradeId: this.tradeId };
        }
        this.loading = true;
        try {
          await this.$fetch.setParam('/redeemTrade/audit', param).doRequest();
          this.$message.success('操作成功');
          this.$bus.emit('close_current_tags');
        } catch (msg) {
          this.$message.error(msg);
        };
        this.loading = false;
      },
      cancel() {
        this.$bus.emit('close_current_tags');
      },
      matchBlocOrder() {
        this.$refs.product_selector.showDialog();
      },
      selectionConfirmFn(value) {
        this.queryParam.groupTradeId = value.plOrderId;
        this.queryParam.groupTradeIdDes = value.plOrderId + '|' + value.userName + '|' + value.productShowName + '|' + value.inputAmount + '元';
      }
    }
  };
</script>
<style lang="scss" scoped>
  .jdOrder{
    overflow: hidden;
  }
  .jdOrderForm {
    width: 50%;
    float:left
  }
  .jdOrderBtn{
    float:left
  }
  .btns {
    text-align: center;
  }
</style>
