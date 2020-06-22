import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { commissionState } from '@/store/modules/commission/state';

export const actions: ActionTree<commissionState, RootState> = {
    /*
     业绩佣金列表
      */
    async commissionQueryList({ commit }, arg) {
       const res = await fetchApi.setParam('/finacial/query', arg).setRejectHandler(handleReject).doRequest();
        commit('SET_COMMISSION_QUERY_LIST', res);
    },
};
