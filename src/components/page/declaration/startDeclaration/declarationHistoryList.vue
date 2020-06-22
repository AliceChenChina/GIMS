<template>
  <el-card>
    <list-viewer
      v-loading="isLoading"
      :context="this"
      :state="getViewData()"
      @onFetchData="fetchData"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  import { Powers } from '@/utils/powers';
  export default {
    name: 'DeclarationHistoryList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        productId: this.$route.query.productId || ''
      };
    },
    computed: {
      type() {
        switch (this.$route.name) {
        case 'myDeclarationList':
          return 'my';
        case 'declarationHistoryList':
          return 'history';
        default:
          return 'my';
        }
      },
      ...mapState({
        declarationListState: state => state.declaration.declarationListState
      }),
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      }
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_DECLARATION_LIST_VIEWER', this);
      this.fetchData();
    },
    activated() {
      if (this.$route.query.productId === this.productId) {
        return false;
      }
      this.productId = this.$route.query.productId;
      this.$store.commit('declaration/COMMIT_DECLARATION_LIST_VIEWER', this);
      this.fetchData();
    },
    methods: {
      // 根据$route.name 来得到不同的视图数据
      getViewData() {
        return this.declarationListState[this.type] ? this.declarationListState[this.type] : {};
      },
      // 获取请求接口的参数
      getParams() {
        let params = {};
        const fixedParams = { ...this.declarationListState[this.type].filterModel, ...this.declarationListState[this.type].paginationState.getAjaxParam() };
        switch (this.$route.name) {
        case 'myDeclarationList':
          params = { ...fixedParams, ...{ type: 1 } };
          return params;
        case 'declarationHistoryList':
          params = { ...fixedParams, ...{ type: 0 }, ...{ productId: this.productId } };
          return params;
        default:
          params = { ...fixedParams, ...{ type: 1 } };
          return params;
        }
      },
      // 调取接口
      async fetchData() {
        this.isLoading = true;
        const param = this.getParams();
        if (Array.isArray(param.statusStrs)) {
          param.statusStrs = param.statusStrs.join(',');
        }
        await this.$store.dispatch('declaration/declarationList', {
          type: this.type,
          param: param
        });
        this.isLoading = false;
      },
      // 查看
      async check(row) {
        if (this.$route.name === 'myDeclarationList') {
          await this.$power.checkPower(Powers.declarationCheck);
        }
        this.$router.push({
          name: 'declarationInfo',
          query: {
            tradeId: row.tradeId
          }
        });
      },
      // 查看产品详情
      goProductOverview(row) {
        this.$router.push({
          name: 'productInfo',
          query: {
            skuId: row.productId,
            type: row.productType
          }
        });
      },
      // 导出excel数据
      doExport() {
        const filterModel = this.getViewData().filterModel;
        const filterModelString = JSON.parse(JSON.stringify(filterModel));
        filterModelString.customerName = encodeURIComponent(this.handleUndefine(filterModelString.customerName));
        filterModelString.productName = encodeURIComponent(this.handleUndefine(filterModelString.productName));
        filterModelString.statusStrs = Array.isArray(filterModelString.statusStrs) ? filterModelString.statusStrs.join(',') : filterModelString.statusStrs;
        const filterModelStringArr = ['tkn=' + window.localStorage.getItem('token'), 'bookingWay=' + this.handleUndefine(filterModelString.bookingWay), 'tradeType=' + this.handleUndefine(filterModelString.tradeType), 'statusStrs=' + this.handleUndefine(filterModelString.statusStrs), 'bookingTimeStart=' + this.handleUndefine(filterModelString.bookingTimeStart), 'bookingTimeEnd=' + this.handleUndefine(filterModelString.bookingTimeEnd), 'customerName=' + filterModelString.customerName, 'productName=' + filterModelString.productName];
        window.open(this.$fetch.getBasePath() + '/bookingTrade/exportMyBookingTrade?' + filterModelStringArr.join('&'));
      },
      // 处理undefined
      handleUndefine(data) {
        return data === undefined ? '' : data;
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
/deep/ .el-custom-filter{
  max-width: 160px;
}
</style>
