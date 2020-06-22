import { MutationTree } from 'vuex';
import { initPaginationAndTableState } from '@/store/mutations';
import { activityListColumns } from '@/store/pageConf/activity/activityList';
import { posterListColumns } from '@/store/pageConf/activity/posterList';
import { articleListColumns } from '@/store/pageConf/activity/articleList';
import Vue from 'vue';
import { ActivityState } from '@/store/modules/activity/types';
import { shareListColumns } from '@/store/pageConf/activity/shareList';
import { shareDetailListColumns } from '@/store/pageConf/activity/shareDetailList';

export const mutations: MutationTree<ActivityState> = {
  SET_ACTIVITY_LIST_VIEWER_STATE(state) {
    state.activityListState = initPaginationAndTableState(activityListColumns);
  },
  SET_ACTIVITY_LIST_DATA(state, data) {
    Vue.set(state.activityListState, 'tableData', data);
  },
  SET_POSTER_LIST_VIEWER_STATE(state) {
    state.posterListState = initPaginationAndTableState(posterListColumns);
  },
  SET_POSTER_LIST_DATA(state, data) {
    Vue.set(state.posterListState, 'tableData', data);
  },
  SET_ARTICLE_LIST_VIEWER_STATE(state) {
    state.articleListState = initPaginationAndTableState(articleListColumns);
  },
  SET_ARTICLE_POSTER_LIST_DATA(state, data) {
    Vue.set(state.articleListState, 'tableData', data);
  },
  SET_SHARE_LIST_VIEWER_STATE(state) {
    state.shareListState = initPaginationAndTableState(shareListColumns);
  },
  SET_SHARE_LIST_VIEWER_DATA(state, data) {
    Vue.set(state.shareListState, 'tableData', data);
  },
  SET_SHARE_DETAIL_LIST_VIEWER_STATE(state) {
    state.shareDetailListState = initPaginationAndTableState(shareDetailListColumns);
  },
  SET_SHARE_DETAIL_LIST_VIEWER_DATA(state, data) {
    Vue.set(state.shareDetailListState, 'tableData', data);
  }
};
