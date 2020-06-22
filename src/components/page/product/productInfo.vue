<template>
  <el-tabs v-model="type" type="border-card">
    <el-tab-pane label="基本信息" name="base">
      <product-base-info ref="base_info" />
    </el-tab-pane>
    <el-tab-pane label="附件" name="attach">
      <product-attachment ref="attach" />
    </el-tab-pane>
    <el-tab-pane label="净值">
      <product-net-value ref="netvalue" />
    </el-tab-pane>
    <el-tab-pane label="收益走势">
      <product-trend ref="trend" />
    </el-tab-pane>
    <el-tab-pane label="投后报告" v-if="reportCheckPower">
      <invested-report ref="report" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import productBaseInfo from './productInfo/productBaseInfo';
  import productAttachment from './productInfo/productAttachment';
  import productNetValue from './productInfo/productNetValue';
  import productTrend from './productInfo/productTrend';
  import investedReport from './productInfo/investedReport';
  import { Powers } from '@/utils/powers';
  export default {
    name: 'ProductInfo',
    components: {
      productBaseInfo,
      productAttachment,
      productNetValue,
      productTrend,
      investedReport
    },
    data() {
      return {
        type: 'base',
        skuId: this.$route.query.skuId,
        reportCheckPower: false
      };
    },
    mounted() {
      // 投后报告权限
      this.reportCheckPower = this.$power.userInfo.userPowerKey.has(Powers.reportCheck);
    },
    async activated() {
      try {
        await this.$power.checkPower(Powers.viewProduct);
      } catch (e) {
        this.$bus.$emit('close_current_tags');
      }
      const skuId = this.$route.query.skuId;
      if (skuId && this.skuId !== skuId) {
        this.skuId = skuId;
        this.$refs.base_info.fetchData();
        this.$refs.attach.fetchData();
        this.$refs.netvalue.fetchData();
        this.$refs.trend.fetchData();
        this.$refs.report.fetchData();
      }
      if (this.$route.query.netvalue) {
        this.type = '2';
      } else if (this.$route.query.tapType) {
        this.type = '4';
      } else {
        this.type = 'base';
      }
    }
  };
</script>

<style scoped>

</style>
