import { Module } from 'vuex';
import { mutations } from './mutations';
import { stateData, orderState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/order/actions';

const namespaced: boolean = true;
export const order: Module<orderState, RootState> = {
  namespaced,
  state: stateData,
  mutations,
  actions
};
