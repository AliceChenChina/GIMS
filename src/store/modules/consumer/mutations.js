import { initPaginationAndTableState } from '@/store/mutations';
import Vue from 'vue';
import consumerState from '@/store/pageConf/consumer/index';
import consumerDetailState from '@/store/pageConf/consumer/consumerDetail';
import employeeSelectorState from '@/store/pageConf/employeeSelector';
import pfundAssetProofListState from '@/store/pageConf/consumer/pfundAssetProofList';
import consumerHoldingListState from '@/store/pageConf/consumer/consumerHoldingList';
import customerSalesCompareListState from '@/store/pageConf/consumer/customerSalesCompareList';

export const mutations = {
  /*
   设置客户列表页面结构
    */
  SET_CONSUMER_VIEWER(state, type) {
    const { consumerList, noAssignList, visitList, stateFactory } = consumerState;
    let viewerState;
    switch (type) {
      case 'list':
        viewerState = { ...stateFactory(consumerList) };
        break;
      case 'visit':
        viewerState = { ...stateFactory(visitList) };
        break;
      case 'no_assign':
        viewerState = { ...stateFactory(noAssignList) };
        break;
    }
    Vue.set(state.consumerViewerState, type, initPaginationAndTableState(viewerState));
  },
  CLEAR_CONSUMER_VIEWER(state, type) {
    delete state.consumerViewerState[type];
  },
  /*
  切换高级筛选按钮
   */
  SWITCH_CONSUMER_FILTER_STATE(state, { type, hasmore }) {
    const { consumerList, visitList, stateFactory, noAssignList } = consumerState;
    const currentState = state.consumerViewerState[type];
    switch (type) {
      case 'list':
        currentState.filterOptions = stateFactory(consumerList, hasmore).filterOptions;
        break;
      case 'visit':
        currentState.filterOptions = stateFactory(visitList, hasmore).filterOptions;
        break;
      case 'no_assign':
        currentState.filterOptions = stateFactory(noAssignList, hasmore).filterOptions;
        break;
    }
    Vue.set(state.consumerViewerState, type, currentState);
  },
  /*
  设置客户列表数据
   */
  COMMIT_CONSUMER_LIST(state, { type, tableData }) {
    Vue.set(state.consumerViewerState[type], 'tableData', tableData);
  },
  /*
  设置客户列表页详情数据
   */
  COMMIT_CONSUMER_DETAIL(state, data) {
    const { basicView, tableView } = consumerDetailState(data);
    state.consumerDetail = [...basicView, ...tableView];
  },
  /*
  理财师选择弹框页面
   */
  COMMIT_EMPLOYEE_SELECTOR(state) {
    state.employeeSelectorViewerState = initPaginationAndTableState(employeeSelectorState);
  },
  /*
  设置理财师数据
   */
  SET_EMPLOYEE_DATA(state, data) {
    Vue.set(state.employeeSelectorViewerState, 'tableData', data);
  },
  /*
 设置资产证明分级
  */
  COMMIT_PFUND_PROOF_LIST_VIEWER(state, data) {
    state.pfundAssetProofListState = initPaginationAndTableState(pfundAssetProofListState);
  },
  /*
  设置理财师数据
   */
  SET_PFUND_ASSET_PROOF_DATA(state, data) {
    Vue.set(state.pfundAssetProofListState, 'tableData', data);
  },
  /*
 设置客户持仓列表
  */
  COMMIT_CONSUMER_HOLDING_LIST_VIEWER(state, data) {
    state.consumerHoldingListState = initPaginationAndTableState(consumerHoldingListState);
  },
  /*
  设置客户持仓列表
   */
  SET_CONSUMER_HOLDING_LIST_DATA(state, data) {
    Vue.set(state.consumerHoldingListState, 'tableData', data);
  },
  /*
    设置客户归属校验
    */
  COMMIT_CONSUMER_SALES_COMPARE_LIST_VIEWER(state, data) {
  state.customerSalesCompareListState = initPaginationAndTableState(customerSalesCompareListState);
},
/*
设置客户归属校验
 */
SET_CONSUMER_SALES_COMPARE_LIST_DATA(state, data) {
  Vue.set(state.customerSalesCompareListState, 'tableData', data);
}
};
