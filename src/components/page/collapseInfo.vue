<template>
  <div class="collaseInfo line pt30 mt15">
    <template v-if="state.length > 0">
      <ul>
        <li v-for="(item,index) in state" :key="index" class="mb5">
          <div class="w100p pl40 pr120 flex jcsb bgC lh50 bdb1ccc">
            <span class="fwb">{{item.titleLeft}}</span>
            <span class="cRed fwb">{{item.titleRight}}</span>
          </div>
          <div class="c666">
            <ul class="collaseInfoContent">
              <li v-for="(contentItem, contentIndex) in item.contenData" :key="contentIndex" class="pt15 pb20 lh20 bdb1ccc20 pl60 pr120 ">
                <div class="">
                  {{contentItem.contentItemTitle}}
                </div>
                <div class="mt20 flex infoContent">
                  <div v-for="(spanItem, spanIndex) in contentItem.spanArr" :key="spanIndex" class="w25p">
                    <span class="w120 dsp_in_b">{{spanItem.labelName}}</span>
                    <span class="fw600 c333">{{spanItem.labelVal}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </template>
    <template v-else >
      <div class="c999 tac fz12">
        暂无数据
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'AssetInfoViewer',
    components: {
    },
    props: {
      state: {
        type: Array,
        default: () => { return []; }
      }
    },
    created() {
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

<style scoped>
  .collaseInfo >>> .el-collapse-item__header {
    background-color:rgb(241,238,244);
  }
  .collaseInfo >>> .el-collapse {
    border-top: none;
  }
  .collaseInfo >>> .el-collapse-item__arrow {
    color:#999999;
  }
  .collaseInfo >>> .el-collapse-item__wrap {
    border-bottom: none;
  }
  .collaseInfoContent li:last-child {
    border-bottom: none;
  }
</style>
