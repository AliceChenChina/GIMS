<template>
  <el-card>
    <info-detail-viewer
      v-loading="loading"
      :state="mapVm(consumerDetail)"
    />
    <div class="title-info mb10">
      <span>持仓信息</span>
    </div>
    <TotalAssetsList :pinCode="$route.query.pinCode"/>
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  import TotalAssetsList from 'page/myConsumer/totalAssetsList';
  export default {
    name: 'ConsumerDetail',
    components: {
      InfoDetailViewer,
      TotalAssetsList
    },
    data() {
      return {
        loading: false,
        userId: ''
      };
    },
    computed: {
      ...mapState({
        consumerDetail: state => state.consumer.consumerDetail
      })
    },
    created() {
      this.userId = this.$route.query.userId;
      this.fetchData();
    },
    activated() {
      if (this.$route.query.userId !== this.userId) {
        this.userId = this.$route.query.userId;
        this.fetchData();
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;
        await this.$store.dispatch('consumer/getCustomerDetail', { userId: this.userId });
        this.loading = false;
      },
      check(row) {
        // 查看leads详情
        this.$router.push({
          name: 'leadsDetail',
          query: {
            id: row.id
          }
        });
      },
      mapVm() {
        return this.consumerDetail.map(item => {
          const descItem = { ...item };
          if (descItem.type === 'table') {
            // 绑定vm实例
            if (descItem.tableColumn instanceof Function) {
              descItem.tableColumn = descItem.tableColumn(this);
            }
          }
          return descItem;
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  .desc-item {
    padding: 10px 0;
    .title-info{
      font-size: 20px;
      color: #EB5954;
      font-weight: bold;
      line-height: 20px;
      &:after {
        display: block;
        background-color: #bbbabc;
        height: 2px;
        margin-top: 8px;
      }
    }
    .tiltle-content-row {
      min-height: 60px;
      align-items: center;
    }
    .tiltle-content {
      font-size: 14px;
      color: #666666;
      div {
        display: inline-block;
      }
      .content-info-content {
        margin-left: 10px;
      }
    }
  }
  .title-info{
    font-size: 16px;
    color: #EB5954;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    span{
      padding: 5px;
      border-bottom: 2px solid #EB5954;
      display: inline-block;
      margin-bottom: -2px;
    }
    &:after {
      display: block;
      background: #bbbabc;
      height: 3px;
      margin-top: 8px;
    }
  }

</style>
