<template>
  <div v-loading="isLoading" class="box-card">
    <template v-if="state.length > 0">
      <div>
        <div class="c666 pt5">客户总资产(元)</div>
        <div class="fz20 c333 lh28 fw600 mt15">{{tatoalAmount}}</div>
      </div>
      <collapse-info
        :state="state"
      />
    </template>
    <template v-else>
      <div class="c999 tac fz12 bdb1ccc lh60">
        暂无数据
      </div>
    </template>
  </div>
</template>

<script>
  import CollapseInfo from 'page/collapseInfo';
  import { mapState } from 'vuex';
  export default {
    name: 'TotalAssetsList',
    components: {
      CollapseInfo
    },
    data() {
      return {
        isLoading: false,
        tatoalAmount: '-'
      };
    },
    props: {
      pinCode: {
        type: String,
        default: () => { return ''; }
      }
    },
    computed: {
      ...mapState({
        state: state => state.myConsumer.totalAssetsListState
      })
    },
    mounted() {
      this.getDatas();
    },
    activated() {
      if (!this.pinCode) {
        return false;
      }
      this.getDatas();
    },
    methods: {
      getDatas() {
        const param = { pinCode: this.pinCode };
        this.getTotalAssetsAmount(param)
        this.fetchData(param);
      },
      async fetchData(param) {
        this.isLoading = true;
        await this.$store.dispatch('myConsumer/getTotalAssetsList', param);
        this.isLoading = false;
      },
      async getTotalAssetsAmount(param) {
        const res = await this.$fetch.setParam('/bookingTrade/v2/queryCustomerHoldInfo', param).doRequest();
        this.tatoalAmount = res.holdingAmount ? this.$utils.number.formatMoney(res.holdingAmount, 2, false) : '0';
      }
    }
  };
</script>
