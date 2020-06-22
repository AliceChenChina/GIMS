import { Module } from 'vuex';
import { mutations } from './mutations';
import { leadsData, leadsState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/leads/actions';

const namespaced: boolean = true;
export const leads: Module<leadsState, RootState> = {
  namespaced,
  state: leadsData,
  mutations,
  actions
};
