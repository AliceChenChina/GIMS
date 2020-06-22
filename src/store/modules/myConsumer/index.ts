import { Module } from 'vuex';
import { mutations } from './mutations';
import { stateData, myconsumerState } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/myConsumer/actions';

const namespaced: boolean = true;
export const myConsumer: Module<myconsumerState, RootState> = {
    namespaced,
    state: stateData,
    mutations,
    actions
};
