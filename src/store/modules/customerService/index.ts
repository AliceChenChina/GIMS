import { Module } from 'vuex';
import { mutations } from './mutations';
import { tradeData, tradeState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/customerService/actions';

const namespaced: boolean = true;
export const customerService: Module<tradeState, RootState> = {
  namespaced,
  state: tradeData,
  mutations,
  actions
};
