import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { leadsState } from '@/store/modules/leads/state';

export const actions: ActionTree<leadsState, RootState> = {
  /*
 加载leads列表
  */
  async getLeadsList({ commit }, arg) {
    const res = await fetchApi.setParam('/appointment/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_LEADS_LIST', res);
  },
  /*
  leads详情
   */
  async getLeadsDetail({ commit }, arg) {
    const res = await fetchApi.setParam('/appointment/get', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_LEADS_DETAIL_STATE', res);
  },
  /*
  校验导入的leads数据
   */
  async uploadLeadsVerify({ commit }, arg) {
    const res = await fetchApi.setParam('/reserve/importLeadsVerify', arg).setRejectHandler(handleReject).doRequest();
    res.records = res.logList;
    commit('SET_LEADS_DATA', res);
  }
};
