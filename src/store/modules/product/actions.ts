import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { productState } from '@/store/modules/product/state';

export const actions: ActionTree<productState, RootState> = {
  /*
 产品存续列表查询
  */
  async productDurationList({ commit }, arg) {
    if (!arg.productType) {
      arg.productType = 'ALL';
    }
    const res = await fetchApi.setParam('/duration/productList/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_DURATION_PRODUCT_DATA', res);
  },
  /*
  产品存续收益查询
   */
  async benefitsDetailQuery({ commit }, { type, arg }) {
    const res = await fetchApi.setParam('/customerIncome/queryPageList', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_BENEFITS_DATA', { type, data: res });
  },
  /*
  存续列表数据
   */
  async durationManageInfo({ commit }, arg) {
    const res = await fetchApi.setParam('/duration/product/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_DURATION_MANAGE_DATA', res);
  },
  /*
  产品信息
   */
  async getProductInfo({ commit, state }, { type, arg }) {
    let uri = '';
    switch (type) {
      case 'secondary_market':
        uri = '/product/getSecondaryMarket';
        break;
      case 'fixed_income':
        uri = '/product/getFixedIncome';
        break;
      case 'equity':
        uri = '/product/getEquity';
        break;
    }
    const res = await fetchApi.setParam(uri, arg).setRejectHandler(handleReject).doRequest();
    if (typeof (state.productInfoState as any)[type] === 'undefined') {
      // 初始化字段
      commit('SET_PRODUCT_FIELDS_STATE', type);
    }
    commit('SET_PRODUCT_INFO_DATA', { type, data: res });
  },
  /*
  查询附件列表
   */
  async attachFileQuery({ commit }, { type, arg }) {
    const res = await fetchApi.setParam('/product/attachFile/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_ATTACHMENT_TABLE_DATA', { type, data: res });
  },
  /*
  产品信息查询净值
   */
  async queryNetValue({ commit }, arg) {
    const res = await fetchApi.setParam('/productNetValue/queryNetValue', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_PRODUCT_INFO_NETVALUE_DATA', res);
  },
  /*
  产品收益趋势
   */
  async queryProductTrend({ commit }, arg) {
    const res = await fetchApi.setParam('/product/queryProductYieldRateList', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_PRODUCT_TREND_DATA', res);
  },
  /*
 投后报告
  */
  async queryInvestedReport({ commit }, arg) {
    const res = await fetchApi.setParam('/productNotice/queryProductReport', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_INVESTED_REPORT_DATA', res);
  },
  /*
  所有产品净值列表
   */
  async queryProductListNetValue({ commit }, arg) {
    const res = await fetchApi.setParam('/product/queryNetValue', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_PRODUCT_NET_VALUE_DATA', res);
  },
  /*
  产品列表
   */
  async queryProductList({ commit }, arg) {
    const res = await fetchApi.setParam('/product/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_PRODUCT_LIST_DATA', res);
  },
  /*
  产品列表选择
   */
  async queryProductSelectorList({ commit }, arg) {
    const res = await fetchApi.setParam('/product/query', arg).setRejectHandler(handleReject).doRequest();
    commit('COMMIT_PRODUCT_SELECTOR_DATA', res);
  },
  /*
  在售列表
   */
  async queryProdcutSellingList({ commit }, arg) {
    const res = await fetchApi.setParam('/product/sellingQuery', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_PRODUCT_SELLING_LIST_DATA', res);
  },
  /*
  产品报告列表
   */
  async getProductNoticeList({ commit, state }, { type, arg }) {
    const uri = '/productNotice/query';
    const res = await fetchApi.setParam(uri, arg).setRejectHandler(handleReject).doRequest();
    if (typeof (state.productNoticeViewerState as any)[type] === 'undefined') {
      // 初始化字段
      commit('SET_PRODUCT_NOTICE_LIST_VIEWER_STATE', type);
    }
    commit('SET_PRODUCT_NOTICE_LIST_DATA', { type, data: res });
  }
};
