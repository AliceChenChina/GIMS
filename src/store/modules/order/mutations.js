import queryOrderState from '../../../store/pageConf/orderQuery';
import overseaAndInsuranceOrderList from '../../../store/pageConf/orderQuery/overseaAndInsuranceOrderList';
import { initPaginationAndTableState } from '@/store/mutations';
import Vue from 'vue';


export const mutations = {
  SET_ORDER_VIEWER_STATE(state, vm) {
    function initMultiSelectValue(status) {
      let tradeStatusArr = [];
      const tradeStatus = [];
      if (status === 'trade_proxy') {
        tradeStatusArr = vm.statusArgsWithElOptionsTag('trade_proxy_order_status');
      }
      if (status === 'trade_indent' || status === 'trade_redeem_indent') {
        tradeStatusArr = vm.statusArgsWithElOptionsTag('trade_indent_status');
      }
      if (status === 'trade_redeem_proxy') {
        tradeStatusArr = vm.statusArgsWithElOptionsTag('trade_proxy_redeem_status');
      }
      if (status === 'order_channel_type') {
        tradeStatusArr = vm.statusArgsWithElOptionsTag('order_channel_type');
      }
      tradeStatusArr.forEach(item => {
        tradeStatus.push(item.value);
      });
      return tradeStatus;
    }
    const tradeStatusArr = initMultiSelectValue(vm.orderViewerType);
    const orderSourceStrsArr = initMultiSelectValue('order_channel_type');
    // 初始化state结构
    const { queryTradeProxy, queryTradeIndent, queryRedeemIndent, queryRedeemProxy } = queryOrderState;
    const { orderViewerState } = state;
    if (orderViewerState[vm.orderViewerType]) return;
    Vue.set(orderViewerState, vm.orderViewerType, {});
    const currentViewerState = orderViewerState[vm.orderViewerType];
    let filterOptions, filterModel, tableColumn;
    switch (vm.orderViewerType) {
      case 'trade_proxy':
        // 代销订单
        filterOptions = queryTradeProxy.filterOptions;
        filterModel = queryTradeProxy.filterModel;
        filterModel.orderStateStrs = tradeStatusArr;
        filterModel.orderSourceStrs = orderSourceStrsArr;
        tableColumn = queryTradeProxy.tableColumn;
        // 根据type设置类型枚举值
        break;
      case 'trade_indent':
        // 直销订单
        filterOptions = queryTradeIndent.filterOptions;
        filterModel = queryTradeIndent.filterModel;
        filterModel.statusStrs = tradeStatusArr;
        tableColumn = queryTradeIndent.tableColumn;
        break;
      case 'trade_redeem_proxy':
        // 代销赎回订单
        filterOptions = queryRedeemProxy.filterOptions;
        filterModel = queryRedeemProxy.filterModel;
        filterModel.redeemStateStrs = tradeStatusArr;
        filterModel.orderSourceStrs = orderSourceStrsArr;
        tableColumn = queryRedeemProxy.tableColumn;
        break;
      case 'trade_redeem_indent':
        // 直销赎回订单
        filterOptions = queryRedeemIndent.filterOptions;
        filterModel = queryRedeemIndent.filterModel;
        filterModel.statusStrs = tradeStatusArr;
        tableColumn = queryRedeemIndent.tableColumn;
        break;
    }
    Vue.set(currentViewerState, 'filterOptions', filterOptions); // 搜索条件过滤器
    Vue.set(currentViewerState, 'filterModel', filterModel); // 搜索条件绑定的数据
    Vue.set(currentViewerState, 'tableColumn', tableColumn); // 表格列设置
    orderViewerState[vm.orderViewerType] = initPaginationAndTableState(currentViewerState);
  },
  /*
  设置交易管理数据
   */
  COMMIT_ORDER_DATA(state, { type, tableData }) {
    const { orderViewerState } = state;
    // 认申购代销订单设置state
    Vue.set(orderViewerState[type], 'tableData', tableData);
  },
  /*
 清理orderViewerState，删除加载的表格数据
  */
  CLEAR_ORDER_VIEWER_STATE(state, type) {
    const { orderViewerState } = state;
    delete orderViewerState[type];
  },
  /*
 设置海外/保险订单
  */
  COMMIT_OVERSEA_AND_INSURANCE_ORDER_LIST(state, data) {
    state.overseaAndInsuranceOrderList = initPaginationAndTableState(overseaAndInsuranceOrderList);
  },
  /*
  设置海外/保险订单
   */
  SET_OVERSEA_AND_INSURANCE_ORDER_DATA(state, data) {
    const res = data ? data.data : {};
    Vue.set(state.overseaAndInsuranceOrderList, 'tableData', res);
  }
};
