import { Module } from 'vuex';
import { mutations } from './mutations';
import { sysManagerState, sysManagerStateData } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/systemManager/actions';

const namespaced: boolean = true;
export const sysManager: Module<sysManagerState, RootState> = {
  namespaced,
  state: sysManagerStateData,
  mutations,
  actions
};
