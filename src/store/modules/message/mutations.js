import { initPaginationAndTableState } from '@/store/mutations';
import Vue from 'vue';
import messageListQueryState from '@/store/pageConf/messageList';
export const mutations = {
  /*
   冷静期回访查询初始化
 */
  COMMIT_MESSAGETLIST_VIEWER_STATE(state, data) {
    state.messageListViewerState = initPaginationAndTableState(messageListQueryState);
  },
  /*
  冷静期回访列表
 */
  SET_MESSAGE_LIST(state, data) {
    Vue.set(state.messageListViewerState, 'tableData', data);
  }
};
