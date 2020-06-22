<template>
  <el-card>
    <info-detail-viewer
      v-loading="loading"
      :state="view"
    />
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  export default {
    name: 'DeclarationInfo',
    components: {
      InfoDetailViewer
    },
    data() {
      return {
        loading: false,
        tradeId: this.$route.query.tradeId,
        view: []
      };
    },
    computed: {
      ...mapState({
        declarationInfo: state => state.declaration.declarationInfoState
      }),
      getData() {
        const getData = this.declarationInfo.data ? this.declarationInfo.data : {};
        getData.feeBalance = this.$utils.number.formatMoney(getData.feeBalance, 2, false);
        getData.bookingBalance = this.$utils.number.formatMoney(getData.bookingBalance, 2, false);
        getData.paymentBlance = this.$utils.number.formatMoney(getData.paymentBlance, 2, false);
        return getData;
      }
    },
    watch: {
      getData() {
        this.view = this.declarationInfo.declarationInfoView ? this.declarationInfo.declarationInfoView(this.getData) : [];
      }
    },
    async created() {
      this.$store.commit('declaration/GET_DECLARATION_VIEW_STATE');
      await this.fetch(this.tradeId);
    },
    activated() {
      if (this.$route.query.tradeId === this.tradeId) {
        return false;
      }
      this.tradeId = this.$route.query.tradeId;
      this.$store.commit('declaration/GET_DECLARATION_VIEW_STATE');
      this.fetch(this.tradeId);
    },
    methods: {
      async fetch(tradeId) {
        this.loading = true;
        await this.$store.dispatch('declaration/getDeclarationInfo', { tradeId });
        this.loading = false;
      }
    }
  };
</script>

<style scoped>

</style>
