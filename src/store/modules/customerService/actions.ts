import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { tradeState } from '@/store/modules/customerService/state';

export const actions: ActionTree<tradeState, RootState> = {
  /*
 加载冷静期回访列表
  */
  async getTradeVisitList({ commit }, arg) {
    const res = await fetchApi.setParam('/tradeVisit/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_TRADEVIST_LIST', res);
  },
  /*
  冷静期回访查看页面
   */
  async getTradeVisitDetail({ commit, state, rootState }, arg) {
    const res = await fetchApi.setParam('/tradeVisit/getVisit', arg).setRejectHandler(handleReject).doRequest();
    res.argEnum = rootState.argEnum;
    commit('SET_TRADEVIST_Detail_STATE', res);
  },
  /*
  冷静期回访编辑页面
   */
  async getTradeVisitEdit({ commit, state, rootState }, arg) {
    const res = await fetchApi.setParam('/tradeVisit/getVisit', arg).setRejectHandler(handleReject).doRequest();
    res.argEnum = rootState.argEnum;
    commit('SET_TRADEVIST_EDIT_STATE', res);
  }
};
