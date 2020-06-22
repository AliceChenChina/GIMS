import { Module } from 'vuex';
import { mutations } from './mutations';
import { stateData, strategyRecommendState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/strategyRecommend/actions';

const namespaced: boolean = true;
export const strategyRecommend: Module<strategyRecommendState, RootState> = {
  namespaced,
  state: stateData,
  mutations,
  actions
};
