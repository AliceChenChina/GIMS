import { ActionTree } from 'vuex';
import FetchApiFactory from '@/api/fetchApi';
import { strategyRecommendState } from '@/store/modules/strategyRecommend/state';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { ActivityResultWrapper } from '@/api/ResultWrapper';
const resultWrapper = new ActivityResultWrapper();
const requestInstance = FetchApiFactory.getFetchInstance('/userGroup', false, resultWrapper);
const requestInstanceUser = FetchApiFactory.getFetchInstance('/userTestResult', false, resultWrapper);
const requestInstanceStrategy = FetchApiFactory.getFetchInstance('/strategyRecommend', false, resultWrapper);
const requestInstanceProduct = FetchApiFactory.getFetchInstance('/product', false, resultWrapper);
export const actions: ActionTree<strategyRecommendState, RootState> = {
  // 用户分组列表
async getUserGroupList({ commit }, arg: any) {
  const res = await requestInstance.setParam('/queryGroupList', arg).setRejectHandler(handleReject).doRequest();
  const res1 = { pageNumber: 1, pageSize: res.length, size: 0, totalRecordCount: res.length, totalPageCount: 1, records: res}
  commit('SET_USER_GROUP_LIST_DATA', res1);
},
  // 组内客户列表
  async getGroupConsumerList({ commit }, arg: any) {
    const res = await requestInstance.setParam('/queryGroupCustomerList', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_GROUP_CONSUMER_DATA', res);
  },
    // 策略列表
    async getStrategyList({ commit }, arg: any) {
        const res = await requestInstanceStrategy.setParam('/query/recommend', arg).setRejectHandler(handleReject).doRequest();
        commit('SET_STRATEGY_LIST', res);
    },
    // 理财师策略列表
    async getSalestrategyList({ commit }, arg: any) {
        const res = await requestInstanceStrategy.setParam('/query/recommend', arg).setRejectHandler(handleReject).doRequest();
        commit('SET_STRATEGY_SALES_LIST', res);
    },
  // 获取客户列表
 async getCustomerList({ commit }, param) {
  const res = await FetchApiFactory.setParam('/customerList/v2/query', param).setRejectHandler(handleReject).doRequest();
  commit('SET_CUSTOMER_LIST', res);
},
    // 获取客户列表
    async getCustomeDatarList({ commit }, param) {
        const res = await FetchApiFactory.setParam('/customerList/v2/query', param).setRejectHandler(handleReject).doRequest();
        commit('SET_CUSTOMER_DATA_LIST', res);
    },
  // 获取产品列表
    async getProductList({ commit }, param) {
        const res = await requestInstanceProduct.setParam('/query', param).setRejectHandler(handleReject).doRequest();
        commit('SET_PRODUCT_LIST', res);
    },
// 用户申请列表
async userApplyQueryList({ commit }, arg: any) {
    const res = await requestInstanceUser.setParam('/queryPageList', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_USER_APPLY_LIST_DATA', res);
}
};
