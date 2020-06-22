import { initPaginationAndTableState, _setEmptyTableDataState } from '@/store/mutations';
import Vue from 'vue';
import leadsQueryState from '@/store/pageConf/leads/leadsQuery';
import leadsDetailState from '@/store/pageConf/leads/leadsDetail';
import leadsImportState from '@/store/pageConf/leads/importLeads';

export const mutations = {
  /*
  客户列表查询
   */
  COMMIT_LEADSLIST_VIEWER_STATE(state) {
    state.leadsQueryViewerState = initPaginationAndTableState(leadsQueryState)
    ;
  },
  SET_LEADS_LIST(state, data) {
    Vue.set(state.leadsQueryViewerState, 'tableData', data);
  },
  /*
  设置leads详情
   */
  SET_LEADS_DETAIL_STATE(state, data) {
    const basicView = leadsDetailState(data);
    Vue.set(state, 'leadsDetail', [basicView]);
  },
  SET_LEADS_IMPORT_STATE(state, data) {
    state.leadsDetailViewerState = _setEmptyTableDataState(leadsImportState);
  },
  /*
  设置leads导入数据
   */
  SET_LEADS_DATA(state, data) {
    Vue.set(state.leadsDetailViewerState, 'tableData', data);
  }
};
