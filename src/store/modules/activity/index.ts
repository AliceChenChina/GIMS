import { Module } from 'vuex';
import { mutations } from './mutations';
import { activityStateData } from './state';
import { RootState } from '@/store/types';
import { ActivityState } from '@/store/modules/activity/types';
import { actions } from '@/store/modules/activity/actions';

const namespaced: boolean = true;
export const activity: Module<ActivityState, RootState> = {
  namespaced,
  state: activityStateData,
  mutations,
  actions
};
