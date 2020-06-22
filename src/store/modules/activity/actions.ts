import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { ActivityState } from '@/store/modules/activity/types';
import FetchApiFactory from '@/api/fetchApi';
import { ActivityResultWrapper } from '@/api/ResultWrapper';
import Vue from 'vue';

function handleReject(reject: Function, res: any) {
  // 弹出错误提示
  if (res.errorCode === '00001') {
    window.location.href = '/#/login'; // 退出
  }
  Vue.prototype.$message.error(`读取数据时发生错误：${res.errorMessage}。请关闭标签后重试。`);
  reject(res.message);
}

const resultWrapper = new ActivityResultWrapper();
const requestInstance = FetchApiFactory.getFetchInstance('/activity', false, resultWrapper);
const requestInstancePoster = FetchApiFactory.getFetchInstance('/cmsCfg', false, resultWrapper);

export const actions: ActionTree<ActivityState, RootState> = {
  async getActivityList({ commit }, arg: any) {
    const res = await requestInstance.setParam('/listPage', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_ACTIVITY_LIST_DATA', res);
  },
  async getPosterList({ commit }, arg: any) {
    const res = await requestInstancePoster.setParam('/listPage', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_POSTER_LIST_DATA', res);
  },
  async getArticleList({ commit }, arg: any) {
    const res = await requestInstance.setParam('/listPage', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_ARTICLE_POSTER_LIST_DATA', res);
  },
  async queryShareStatisticList({ commit }, arg: any) {
    const requestInstance = FetchApiFactory.getFetchInstance('/share', false, resultWrapper);
    const res = await requestInstance.setParam('/queryShareStatisticList', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_SHARE_LIST_VIEWER_DATA', res);
  },
  async queryShareDetailList({ commit }, arg: any) {
    const requestInstance = FetchApiFactory.getFetchInstance('/share', false, resultWrapper);
    const res = await requestInstance.setParam('/queryShareDetailList', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_SHARE_DETAIL_LIST_VIEWER_DATA', res);
  }
};
