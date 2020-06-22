import { Module } from 'vuex';
import { mutations } from './mutations';
import { messageState, messageData } from './state';
import { RootState } from '@/store/types';
import { actions } from '@/store/modules/message/actions';

const namespaced: boolean = true;
export const message: Module<messageState, RootState> = {
    namespaced,
    state: messageData,
    mutations,
    actions
};
