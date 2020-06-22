import { initPaginationAndTableState, _setEmptyTableDataState } from '@/store/mutations';
import Vue from 'vue';
import commissionQueryListState from '@/store/pageConf/commission/commissionQueryList';

export const mutations = {
  // 业绩佣金列表
  COMMIT_COMMISSION_QUERY_LIST_VIEWER(state) {
    state.commissionQueryListState = initPaginationAndTableState(commissionQueryListState);
  },
  // 业绩佣金列表
  SET_COMMISSION_QUERY_LIST(state, data) {
    Vue.set(state.commissionQueryListState, 'tableData', data);
  }
};
