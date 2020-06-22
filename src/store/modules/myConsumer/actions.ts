import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { myconsumerState } from '@/store/modules/myConsumer/state';

export const actions: ActionTree<myconsumerState, RootState> = {
  /*
 加载理财师客户拜访列表
  */
  async getMyConsumerVisitList({ commit }, arg) {
    const res = await fetchApi.setParam('/customerVisit/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_VISIT_LIST', res);
  },
  /*
加载我的客户列表
 */
  async getMyConsumerList({ commit }, arg) {
    const res = await fetchApi.setParam('/customerList/v2/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_MY_CONSUMER_LIST', res);
  },
  /*
新增客户时验证
 */
  async preposeAddCustomer({ commit }, arg) {
    const res = await fetchApi.setParam('/customerList/preposeAddCustomer', arg).setRejectHandler(handleReject).doRequest();
    commit('GET_PREPOSE_ADD_STATE', res);
  },
  /*
新增客户有pin时验证
 */
  async preposeEditCustomer({ commit }, arg) {
    const res = await fetchApi.setParam('/customerList/preposeEditCustomer', arg).setRejectHandler(handleReject).doRequest();
    commit('GET_PREPOSE_ADD_STATE', res);
  },
  /*
  理财师客户管理 -- 获取京东客户详情
   */
  async getJdInfo({ commit }, arg) {
    const res = await fetchApi.setParam('/customerOverview/getCustomerDetail', arg).setRejectHandler(handleReject).doRequest();
    commit('GET_JD_INFO', res);
  },
  /*
  理财师客户管理 -- 获取联系方式
   */
  async getCustomerLinkInfo({ commit }, arg) {
    const res = await fetchApi.setParam('/customerLinkman/query', arg).setRejectHandler(handleReject).doRequest();
    commit('GET_CONSUMER_LINK_INFO', res);
  },
  /*
  理财师客户管理 -- 获取基础信息
   */
  async getConsumerBasicInfo({ commit }, arg) {
    const res = await fetchApi.setParam('/customerList/v2/get', arg).setRejectHandler(handleReject).doRequest();
    commit('GET_CONSUMER_BASIC_INFO', res);
  },
  async getManageAssetsList({ commit }, arg) {
    const res = await fetchApi.setParam('/customerList/queryEmpManageAssetsList', arg).setRejectHandler(handleReject).doRequest();
    commit('GET_MANAGE_ASSETS_LIST_DATA', res);
  },
  async getTotalAssetsList({ commit }, arg) {
    const res = await fetchApi.setParam('/bookingTrade/v2/queryCustomerHoldList', arg).setRejectHandler(handleReject).doRequest();
    commit('GET_TOTAL_ASSETS_LIST_DATA', res);
  }
};
