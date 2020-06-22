import { Module } from 'vuex';
import { mutations } from './mutations';
import { commissionStateData, commissionState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/commission/actions';

const namespaced: boolean = true;
export const commission: Module<commissionState, RootState> = {
  namespaced,
  state: commissionStateData,
  mutations,
  actions
};
