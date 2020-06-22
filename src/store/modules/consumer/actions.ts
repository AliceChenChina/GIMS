import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { consumerState } from '@/store/modules/consumer/state';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';

export const actions: ActionTree<consumerState, RootState> = {
  async queryConsumerList({ commit }, { type, arg }) {
    // api请求部分
    let res;
    switch (type) {
      case 'list':
        res = await fetchApi.setParam('/customerList/queryAllList', arg).setRejectHandler(handleReject).doRequest();
        break;
      case 'visit':
        res = await fetchApi.setParam('/customerList/queryCustomerVisitAll', arg).setRejectHandler(handleReject).doRequest();
        break;
      case 'no_assign':
        res = await fetchApi.setParam('/customerUnAllocation/queryPageList', arg).setRejectHandler(handleReject).doRequest();
        break;
    }
    commit('COMMIT_CONSUMER_LIST', {
      tableData: res,
      type
    });
  },
  /*
  获取客户详情
   */
  async getCustomerDetail({ commit }, arg) {
    const res = await fetchApi.setParam('/customerOverview/getCustomerDetail', arg).setRejectHandler(handleReject).doRequest();
    commit('COMMIT_CONSUMER_DETAIL', res);
  },
  /*
  获取员工列表
   */
  async getEmployee({ commit }, arg) {
    const res = await fetchApi.setParam('/systemSetting/employee/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_EMPLOYEE_DATA', res);
  },
/*
  资产证明分级
   */
async getPfundAssetProofList({ commit }, arg) {
  const res = await fetchApi.setParam('/pfundAssetProofDetail/query', arg).setRejectHandler(handleReject).doRequest();
  commit('SET_PFUND_ASSET_PROOF_DATA', res);
},
  /*
  客户持仓列表
   */
  async getConsumerHoldingList({ commit }, arg) {
    const res = await fetchApi.setParam('/customerList/queryCustomerAssetsList', arg).setRejectHandler(handleReject).doRequest();
    // const res = { pageNumber: 1, pageSize: 10, size: 0, totalRecordCount: 1084, totalPageCount: 109, records: [{customerName: '11', pinCode: '22'}] }
    commit('SET_CONSUMER_HOLDING_LIST_DATA', res);
  },
  /*
  客户归属校验
   */
  async getCustomerSalesCompareList({ commit }, arg) {
    const res = await fetchApi.setParam('/customerList/queryCustomerSalesCompare', arg).setRejectHandler(handleReject).doRequest();
    // const res = { pageNumber: 1, pageSize: 10, size: 0, totalRecordCount: 1084, totalPageCount: 109, records: [{customerName: '11', pinCode: '22'}] }
    commit('SET_CONSUMER_SALES_COMPARE_LIST_DATA', res);
  }
};
