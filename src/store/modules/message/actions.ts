import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { messageState } from '@/store/modules/message/state';

export const actions: ActionTree<messageState, RootState> = {
  async getMessage({ commit }, arg) {
    const res = await fetchApi.setParam('/message/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_MESSAGE_LIST', res);
  }
};
