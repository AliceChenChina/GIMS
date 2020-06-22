<template>
  <div v-if="state.length > 0">
    <div v-for="(item,index) in state" :key="index" class="mb30" style="width: 70%">
      <div class="c333 fw600 lh20">{{item.title}}</div>
      <div class="mt10 lh20 flex jcsb pr30">
        <div class="c666 flex">
          <div v-for="(chilidItem,childIndex) in item.elements" :key="childIndex" class="mr60">
            <span class="mr10">{{chilidItem.eleName}}</span>
            <span>{{chilidItem.eleVal}}</span>
          </div>
        </div>
        <div class="cRed pointer" @click="goToProductInfo(item)" v-if="reportCheckPower">{{item.btnName}}</div>
      </div>
      <ul class="mt10 line infoContent" >
        <li v-for="(contentItem,contentIndex) in item.customerCapitalList" :key="contentIndex" class="flex jcsb lh50 pl30 pr30">
          <span class="c666">{{contentItem.customerName}}</span>
          <span class="c333 fw600">{{contentItem.amount ? $utils.number.formatMoney(contentItem.amount, 2, 0) : '-'}}</span>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="tac c999 fz12">
    暂无数据
  </div>
</template>

<script>
  import { Powers } from '@/utils/powers';
  export default {
    name: 'AssetInfoViewer',
    data() {
      return {
        reportCheckPower: false
      };
    },
    components: {
    },
    props: {
      state: {
        type: Array,
        default: () => { return []; }
      }
    },
    computed: {
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      }
    },
    created() {
      // 查看投后报告
      this.reportCheckPower = this.$power.userInfo.userPowerKey.has(Powers.reportCheck);
    },
    methods: {
      goToProductInfo(item) {
        this.$router.push({
          name: 'productInfo',
          query: {
            skuId: item.productId,
            type: item.productType,
            tapType: 'report'
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  .infoContent {
    li:nth-child(2n) {
      background-color:rgb(241,238,244);
    }
    li:last-child {
      border-bottom: 1px solid #F5F5F5;
    }
  }
</style>
