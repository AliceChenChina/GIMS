import { Module } from 'vuex';
import { mutations } from './mutations';
import { declarationStateData, declarationState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/declaration/actions';

const namespaced: boolean = true;
export const declaration: Module<declarationState, RootState> = {
  namespaced,
  state: declarationStateData,
  mutations,
  actions
};
