import { Module } from 'vuex';
import { mutations } from './mutations';
import { stateData, consumerState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/consumer/actions';

const namespaced: boolean = true;
export const consumer: Module<consumerState, RootState> = {
  namespaced,
  state: stateData,
  mutations,
  actions
};
