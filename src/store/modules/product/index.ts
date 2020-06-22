import { Module } from 'vuex';
import { mutations } from './mutations';
import { stateData, productState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/product/actions';

const namespaced: boolean = true;
export const product: Module<productState, RootState> = {
  namespaced,
  state: stateData,
  mutations,
  actions
};
