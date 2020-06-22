import { initPaginationAndTableState } from '@/store/mutations';
import Vue from 'vue';
import tradeVisitListQueryState from '@/store/pageConf/customerService/tradeVisitQuery';
import tradeVisitDetailState from '@/store/pageConf/customerService/tradeVisitDetail';
import { tradeVisitEditDetail, tradeVisitEditEdit } from '@/store/pageConf/customerService/tradeVisitEdit';

export const mutations = {
  /*
冷静期回访查询
 */
  COMMIT_TRADEVISITLIST_VIEWER_STATE(state, data) {
    state.tradeVisitListViewerState = initPaginationAndTableState(tradeVisitListQueryState);
  },
  /*
  冷静期回访列表
 */
  SET_TRADEVIST_LIST(state, data) {
    Vue.set(state.tradeVisitListViewerState, 'tableData', data);
  },
  /*
  冷静期回访查看
 */
  SET_TRADEVIST_Detail_STATE(state, data) {
    const argEnum = data.argEnum;
    const { basicView } = tradeVisitDetailState(argEnum, data);
    state.tradeVisitDetail = [...basicView];
  },
  /*
  冷静期回访编辑
 */
  SET_TRADEVIST_EDIT_STATE(state, data) {
    const argEnum = data.argEnum;
    const { basicView } = tradeVisitEditDetail(argEnum, data);
    state.tradeVisitEdit = [...basicView];
    Vue.set(state.tradeVisitEdit, 'edit', {
      fields: tradeVisitEditEdit,
      model: {}
    });
  }
};
