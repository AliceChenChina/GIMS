import { initPaginationAndTableState } from '@/store/mutations';
import Vue from 'vue';
import userGroupListState from '@/store/pageConf/strategyRecommend/userGroupList';
import groupConsumerState from '@/store/pageConf/strategyRecommend/groupConsumerList';
import customerSelector from '@/store/pageConf/strategyRecommend/customerSelector';
import strategyListState from '@/store/pageConf/strategyRecommend/strategyList';
import productListState from '@/store/pageConf/strategyRecommend/productList';
import customerListViewerState from '@/store/pageConf/strategyRecommend/customerList';
import strategySalesListState from '@/store/pageConf/strategyRecommend/strategySalesList';
import userApplyListState from '@/store/pageConf/strategyRecommend/userApplyList';


export const mutations = {
  /*
 设置分组列表
  */
  COMMIT_USER_GROUP_LIST_VIEWER(state, data) {
    state.userGroupListState = initPaginationAndTableState(userGroupListState);
  },
  /*
  分组列表
   */
  SET_USER_GROUP_LIST_DATA(state, data) {
    Vue.set(state.userGroupListState, 'tableData', data);
  },
  /*
 组内客户列表
  */
  COMMIT_GROUP_CONSUMER__VIEWER(state, data) {
    state.groupConsumerState = initPaginationAndTableState(groupConsumerState);
  },
  /*
  组内客户列表
   */
  SET_GROUP_CONSUMER_DATA(state, data) {
    Vue.set(state.groupConsumerState, 'tableData', data);
  },
  // 选择客户
  COMMIT_CUSTOMER_SELECTOR(state) {
    state.customerSelectorViewerState = initPaginationAndTableState(customerSelector);
  },
  SET_CUSTOMER_LIST(state, data) {
    Vue.set(state.customerSelectorViewerState, 'tableData', data);
},
  // 理财师策略列表
  COMMIT_STRATEGY_SALES_LIST_VIEWER(state) {
    state.strategySalesListState = initPaginationAndTableState(strategySalesListState);
  },
  SET_STRATEGY_SALES_LIST(state, data) {
    Vue.set(state.strategySalesListState, 'tableData', data);
    Vue.set(state.loginRole, 'loginRole', data.loginRole);
  },
  // 运营策略列表
  COMMIT_STRATEGY_LIST_VIEWER(state) {
    state.strategyListState = initPaginationAndTableState(strategyListState);
  },
  SET_STRATEGY_LIST(state, data) {
    Vue.set(state.strategyListState, 'tableData', data);
  },
  // 客户列表
  COMMIT_CUSTOMER_LIST(state) {
    state.customerListViewerState = initPaginationAndTableState(customerListViewerState);
  },
  SET_CUSTOMER_DATA_LIST(state, data) {
    Vue.set(state.customerListViewerState, 'tableData', data);
  },
  // 选择产品
  COMMIT_PRODUCT_LIST_VIEWER(state) {
    state.productListState = initPaginationAndTableState(productListState);
  },
  SET_PRODUCT_LIST(state, data) {
    Vue.set(state.productListState, 'tableData', data);
  },
  /*
设置分组列表
 */
  COMMIT_USER_APPLY_LIST_VIEWER(state, data) {
    state.userApplyListState = initPaginationAndTableState(userApplyListState);
  },
  /*
  分组列表
   */
  SET_USER_APPLY_LIST_DATA(state, data) {
    Vue.set(state.userApplyListState, 'tableData', data);
  },
};
