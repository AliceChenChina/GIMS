<template>
  <el-card v-loading="loadingStatus[orderViewerType]" class="box-card">
    <el-tabs v-if="$route.name === 'orderQueryRedeem'" v-model="orderViewerType">
      <el-tab-pane label="代销订单" name="trade_redeem_proxy"></el-tab-pane>
      <el-tab-pane label="直销订单" name="trade_redeem_indent"></el-tab-pane>
    </el-tabs>
    <el-tabs v-else v-model="orderViewerType">
      <el-tab-pane label="代销订单" name="trade_proxy"></el-tab-pane>
      <el-tab-pane label="直销订单" name="trade_indent"></el-tab-pane>
    </el-tabs>
    <list-viewer
      ref="list_viewer"
      :state="getCurrentViewerState(orderViewerType)"
      :context="this"
      @onFetchData="onFetchData"
    ></list-viewer>
    <div v-if="orderViewerType === 'trade_proxy' || orderViewerType === 'trade_indent'" class="total-amount">
      <div style="top: -30px;position: absolute;width: 100%;">
        当前页面下单金额：<span style="color: red">{{ extendData.pageBookingBalance }}</span>元 / 筛选结果下单金额：<span style="color: red">{{ extendData.allPageBookingBalance }}</span>元
      </div>
    </div>
  </el-card>
</template>

<script>
  /*
  根据用户选择的tab类型，控制order-viewer组件里面加载的选项和数据
   */
  import listViewer from 'common/ListViewerLevel2';
  import { mapState } from 'vuex';

  export default {
    name: 'OrderQueryPage',
    components: {
      listViewer
    },
    data() {
      return {
        orderViewerType: this.$route.name === 'orderQueryRedeem' ? 'trade_redeem_proxy' : 'trade_proxy',
        loadingStatus: {
          trade_proxy: false,
          trade_indent: false,
          trade_redeem_proxy: false,
          trade_redeem_indent: false
        }
      };
    },
    // 绑定orderViewer中的分页器状态到orderViewerState当中
    // 根据查询类型切换state传递到orderViewer组件中，页面设置state提交了以后保存在store当中
    computed: {
      ...mapState({
        orderViewerState: state => state.order.orderViewerState
      }),
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      },
      extendData() {
        if (this.$route.name !== 'orderQueryRedeem') {
          if (this.orderViewerState[this.orderViewerType] && this.orderViewerState[this.orderViewerType].tableData.extendData) {
            return this.orderViewerState[this.orderViewerType].tableData.extendData;
          }
        }
        return {};
      }
    },
    watch: {
      $route: {
        deep: true,
        handler() {
          this.$route.name === 'orderQueryRedeem' ? this.orderViewerType = 'trade_redeem_proxy' : this.orderViewerType = 'trade_proxy';
        }
      }
    },
    mounted() {
    },
    methods: {
      getLoadParam() {
        const state = this.getCurrentViewerState(this.orderViewerType);
        const pageArg = {
          pageNumber: state.paginationState.currentPageNo,
          pageSize: state.paginationState.pageSize
        };
        return { ...state.filterModel, ...pageArg };
      },
      getCurrentViewerState(typeName) {
        if (typeName && !this.orderViewerState[typeName]) {
          // 若不存在state结构进行初始化
          this.$store.commit('order/SET_ORDER_VIEWER_STATE', this);
          // 加载第一页数据
          this.onFetchData(this.getLoadParam());
        }
        return this.orderViewerState[typeName];
      },
      changePram(param, status, status2) {
        if (Array.isArray(param[status]) ) {
          param[status] = param[status].join(',');
        }
        if (status2 && Array.isArray(param[status2])) {
          param[status2] = param[status2].join(',');
        }
        return param;
      },
      async onFetchData(arg) {
        // 根据类型加载数据
        if (!arg) {
          arg = this.getLoadParam();
        }
        if (this.orderViewerType === 'trade_proxy') {
          this.changePram(arg, 'orderStateStrs', 'orderSourceStrs');
        }
        if (this.orderViewerType === 'trade_indent' || this.orderViewerType === 'trade_redeem_indent') {
          this.changePram(arg, 'statusStrs');
        }
        if (this.orderViewerType === 'trade_redeem_proxy') {
          this.changePram(arg, 'redeemStateStrs', 'orderSourceStrs');
        }
        const type = this.orderViewerType; // 这里实际上起到一个闭包的作用，保存当前页面状态的orderViewerType
        // 直接引用this.loadingStatus[this.orderViewerType]的话，这个时候切换页面由于路由关系orderViewerType的值会改变，this.orderViewerType的值不是原来那个this.orderViewerType的值
        // await结束过后就会错误地赋值loading状态
        // await语法实际上是promise.then的语法糖，使用const保存一个变量在then回调里使用就可以形成闭包，不会导致orderViewerType原来的值丢失
        this.loadingStatus[type] = true;
        if (this.orderViewerType === 'trade_proxy' || this.orderViewerType === 'trade_redeem_proxy') {
          // 加载代销数据
          await this.$store.dispatch('order/getTradeProxy', { type: this.orderViewerType, arg });
        } else {
          // 直销数据
          await this.$store.dispatch('order/getTradeIndent', { type: this.orderViewerType, arg });
        }
        this.loadingStatus[type] = false;
      },
      doExportOrder() {
        // 清空筛选表单
        const filterModelState = this.getCurrentViewerState(this.orderViewerType).filterModel;
        const state = { ...filterModelState };
        const orderChannelArr = this.statusArgsWithElOptionsTag('order_channel_type');
        const orderChannelStatus = [];
        orderChannelArr.forEach(item => {
          orderChannelStatus.push(item.value);
        });
        Object.keys(state).forEach(key => {
          if (key === 'tradeType' || key === 'type' || key === 'businessCode') {
            return;
          }
          state[key] = '';
        });
        if (this.orderViewerType === 'trade_proxy') {
          const tradeStatusArr = this.statusArgsWithElOptionsTag('trade_proxy_order_status');
          const tradeStatus = [];
          tradeStatusArr.forEach(item => {
            tradeStatus.push(item.value);
          });
          state.orderStateStrs = tradeStatus;
          state.orderSourceStrs = orderChannelStatus;
        }
        if (this.orderViewerType === 'trade_indent' || this.orderViewerType === 'trade_redeem_indent') {
          const tradeStatusArr = this.statusArgsWithElOptionsTag('trade_indent_status');
          const tradeStatus = [];
          tradeStatusArr.forEach(item => {
            tradeStatus.push(item.value);
          });
          state.statusStrs = tradeStatus;
        }
        if (this.orderViewerType === 'trade_redeem_proxy') {
          const tradeStatusArr = this.statusArgsWithElOptionsTag('trade_proxy_redeem_status');
          const tradeStatus = [];
          tradeStatusArr.forEach(item => {
            tradeStatus.push(item.value);
          });
          state.redeemStateStrs = tradeStatus;
          state.orderSourceStrs = orderChannelStatus;
        }
        this.$store.commit('UPDATE_FILTER_MODEL', {
          modelState: filterModelState,
          data: state
        }
        );
        this.$refs.list_viewer.$refs.pager.setPageNo(1);
      },
      doExport() {
        let uri;
        const state = this.getCurrentViewerState(this.orderViewerType);
        if (this.orderViewerType === 'trade_proxy' || this.orderViewerType === 'trade_redeem_proxy') {
          uri = '/bookingTrade/exportTradeProxy';
        } else {
          uri = '/tradeConfirm/exportTradeIndent';
        }
        state.filterModel.empId = this.$store.state.userInfo.userId;
        const filterModel = JSON.parse(JSON.stringify(state.filterModel))
        if (filterModel.orderStateStrs && Array.isArray(filterModel.orderStateStrs)) {
          filterModel.orderStateStrs = filterModel.orderStateStrs.join(',');
        }
        if (filterModel.orderSourceStrs && Array.isArray(filterModel.orderSourceStrs)) {
          filterModel.orderSourceStrs = filterModel.orderSourceStrs.join(',');
        }
        if (filterModel.statusStrs && Array.isArray(filterModel.statusStrs)) {
          filterModel.statusStrs = filterModel.statusStrs.join(',');
        }
        if (filterModel.redeemStateStrs && Array.isArray(filterModel.redeemStateStrs)) {
          filterModel.redeemStateStrs = filterModel.redeemStateStrs.join(',');
        }
        const query = this.$utils.queryString.stringify(filterModel);
        window.open(`${this.$fetch.getBasePath()}${uri}?${query}`);
      },
      onCloseTab() {
        // 关闭标签回调
        if (this.$route.name === 'orderQueryRedeem') {
          this.$store.commit('order/CLEAR_ORDER_VIEWER_STATE', 'trade_redeem_proxy');
          this.$store.commit('order/CLEAR_ORDER_VIEWER_STATE', 'trade_redeem_indent');
        } else {
          this.$store.commit('order/CLEAR_ORDER_VIEWER_STATE', 'trade_proxy');
          this.$store.commit('order/CLEAR_ORDER_VIEWER_STATE', 'trade_indent');
        }
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
  .total-amount {
    color:#333333;font-size: 13px;display: inline-block;position:relative;width: 100%;
  }
</style>
