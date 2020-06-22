Ø<template>
  <el-card>
    <info-detail-viewer
      v-loading="loading"
      :state="redeemInfo"
    />
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  export default {
    name: 'RedeemInfo',
    components: {
      InfoDetailViewer
    },
    data() {
      return {
        loading: false,
        tradeId: this.$route.query.tradeId
      };
    },
    computed: {
      ...mapState({
        redeemInfo: state => state.declaration.redeemInfoState
      })
    },
    async created() {
      await this.fetch(this.tradeId);
    },
    methods: {
      async fetch(tradeId) {
        this.loading = true;
        await this.$store.dispatch('declaration/getRedeemInfo', { tradeId });
        this.loading = false;
      }
    }
  };
</script>

<style scoped>

</style>
