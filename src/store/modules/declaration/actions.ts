import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { declarationState } from '@/store/modules/declaration/state';

export const actions: ActionTree<declarationState, RootState> = {
  /*
  报单管理 -- 赎回申请审核列表
   */
  async getRedeemApplyList({ commit }, arg) {
    const res = await fetchApi.setParam('/redeemTrade/queryAudit', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_REDEEM_APPLY_LIST', res);
  },
  /*
 报单管理 -- 启动报单列表
  */
  async startDeclarationList({ commit }, arg) {
    const res = await fetchApi.setParam('/distributeManage/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_START_DECLARATION_LIST', res);
  },
  /*
报单管理 -- 启动历史列表
 */
  async startHistoryList({ commit }, arg) {
    const res = await fetchApi.setParam('/distributeManage/history', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_START_HISTORY_LIST', res);
  },
  /*
报单管理 -- 报单历史列表、我的报单
*/
  async declarationList({ commit }, arg) {
    const res = await fetchApi.setParam('/bookingTrade/query', arg.param).setRejectHandler(handleReject).doRequest();
    commit('SET_DECLARATION_LIST', {
      type: arg.type,
      res: res
    });
  },
  /*
报单管理 -- 产品报单
*/
  async productDeclarationList({ commit }, arg) {
    const res = await fetchApi.setParam('/booking/queryProductBooking', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_PRODUCT_DECLARATION_LIST', res);
  },
  /*
报单管理 -- 报单审核
*/
  async declarationAuditList({ commit }, arg) {
    const res = await fetchApi.setParam('/bookingTrade/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_DECLARATION_AUDIT_LIST', res);
  },
  /*
  报单管理 -- 全部报单
  */
  async allDeclarationList({ commit }, arg) {
    const res = await fetchApi.setParam('/bookingTrade/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_ALL_DECLARATION_LIST', res);
  },
  /*
报单管理 -- 全部赎回
*/
  async allRedeemApplyList({ commit }, arg) {
    const res = await fetchApi.setParam('/bookingTrade/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_ALL_REDEEM_LIST', res);
  },
  /*
报单管理 -- 启动报单报单数据
*/
  async getStartDeclarationData({ commit }, param) {
    const res = await fetchApi.setParam('/product/get', param).setRejectHandler(handleReject).doRequest();
    commit('SET_START_DECLARATION__FORM_LIST', res);
  },
  /*
报单管理 -- 启动报单--获取开放时间
*/
  async getStartDeclarationOpenData({ commit }, param) {
    const res = await fetchApi.setParam('/distributeManage/getBookingStart', param).setRejectHandler(handleReject).doRequest();
    commit('SET_START_DECLARATION__OPEN_DATA', res);
  },
  /*
报单管理 -- 报单详情
*/
  async getDeclarationInfo({ commit }, param) {
    const res = await fetchApi.setParam('/bookingTrade/getInfo', param).setRejectHandler(handleReject).doRequest();
    commit('SET_DECLARATION_INFO_STATE', res);
  },
  /*
报单管理 -- 编辑份额
*/
  async getEditShareData({ commit }, param) {
    const res = await fetchApi.setParam('/redeemTrade/getInfo', param).setRejectHandler(handleReject).doRequest();
    commit('SET_EDIT_FORM_DATA', res);
  },
  /*
报单管理 -- 赎回详情
*/
  async getRedeemInfo({ commit }, param) {
    const res = await fetchApi.setParam('/redeemTrade/getInfo', param).setRejectHandler(handleReject).doRequest();
    commit('SET_REDEEM_INFO_STATE', res);
  },
  /*
报单管理 -- 赎回申请审核
*/
  async getRedeemAudit({ commit }, param) {
    const res = await fetchApi.setParam('/redeemTrade/getInfo', param).setRejectHandler(handleReject).doRequest();
    commit('SET_REDEEM_AUDIT_STATE', res);
  },
  /*
报单管理 -- 审核详情
*/
  async getAuditInfo({ commit }, param) {
    const res = await fetchApi.setParam('/bookingTrade/getInfo', param).setRejectHandler(handleReject).doRequest();
    commit('GET_AUDIT_INFO_DATA', res);
  },
  /*
报单管理 -- 选择报单订单
*/
  async getChooseDeclarationOrder({ commit }, param) {
    const res = await fetchApi.setParam('/bookingTrade/auditQueryTradeProxy', param).setRejectHandler(handleReject).doRequest();
    commit('SET_CHOOSE_DECLARATION_ORDER_LIST', res);
  },
  /*
报单管理 -- 产品报单信息
*/
  async getDeclarationData({ commit }, param) {
    const res = await fetchApi.setParam('/product/get', param).setRejectHandler(handleReject).doRequest();
    commit('SET_DECLARATION_INFO', res);
  },
  /*
报单管理 -- 产品报单信息
*/
  async getBookingStartInfo({ commit }, param) {
    const res = await fetchApi.setParam('/distributeManage/getBookingStart', param).setRejectHandler(handleReject).doRequest();
    commit('SET_START_BOOKING_INFO', res);
  },
  /*
报单管理 -- 获取客户列表
*/
  async getCustomerList({ commit }, param) {
    const res = await fetchApi.setParam('/customerList/v2/query', param).setRejectHandler(handleReject).doRequest();
    commit('SET_CUSTOMER_LIST', res);
  },
  /*
报单管理 -- 获取客户信息
*/
  async getCustomerInfo({ commit }, param) {
    const res = await fetchApi.setParam('/customerList/v2/get', param).setRejectHandler(handleReject).doRequest();
    commit('GET_CUSTOMER_INFO', res);
  }
};
