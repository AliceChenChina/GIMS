import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { orderState } from '@/store/modules/order/state';

export const actions: ActionTree<orderState, RootState> = {
  /*
   认申购订单代销，赎回查询
    */
  async getTradeProxy({ commit }, { type, arg }) {
    // api请求部分
    const res = await fetchApi.setParam('/bookingTrade/queryTradeProxy', arg).setRejectHandler(handleReject).doRequest();
    commit('COMMIT_ORDER_DATA', {
      tableData: res,
      type
    });
  },
  /*
  认申购订单直销，赎回查询
  */
  async getTradeIndent({ commit }, { type, arg }) {
    // api请求部分
    const res = await fetchApi.setParam('/tradeConfirm/query', arg).setRejectHandler(handleReject).doRequest();
    commit('COMMIT_ORDER_DATA', {
      tableData: res,
      type
    });
  },
  /*
 设置海外/保险订单
 */
  async getOverseaAndInsuranceList({ commit }, arg) {
    const res = await fetchApi.setParam('/trade/queryRealStateInsuranceList', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_OVERSEA_AND_INSURANCE_ORDER_DATA', res);
  }
};
