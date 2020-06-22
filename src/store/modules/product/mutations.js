import { initPaginationAndTableState } from '@/store/mutations';
import Vue from 'vue';
import durationList from '@/store/pageConf/product/durationList';
import benefitsList from '@/store/pageConf/product/benefitsList';
import durationMange from '@/store/pageConf/product/durationManage';
import productFields from '@/store/pageConf/product/fields';
import attachment from '@/store/pageConf/product/tables/attachment';
import productInfoNetValue from '@/store/pageConf/product/tables/netvalue';
import productList from '@/store/pageConf/product/productList';
import productSellingList from '@/store/pageConf/product/sellingList';
import productNetValue from '@/store/pageConf/product/netValue';
import productTrend from '@/store/pageConf/product/tables/trend';
import investedReport from '@/store/pageConf/product/tables/report.jsx';
import setProductNotice from '@/store/pageConf/product/noticeList';
import productSelectorState from '@/store/pageConf/product/productSelector';
import modifyProductLabelInfoData from '@/store/pageConf/product/modifyProductLabelInfoData';
import modifyProductLabelForm from '@/store/pageConf/product/modifyProductLabelForm';
import myConsumerAddForm from "@/store/pageConf/myConsumer/myConsumerAddForm";
export const mutations = {
  /*
 产品存续列表
  */
  SET_DURATION_VIEWER_STATE(state) {
    state.durationListViewerState = initPaginationAndTableState(durationList);
  },
  /*
  产品存续列表数据
   */
  SET_DURATION_PRODUCT_DATA(state, data) {
    Vue.set(state.durationListViewerState, 'tableData', data);
  },
  /*
  付息明细和收益明细
   */
  SET_BENEFITS_VIEWER_STATE(state, type) {
    if (type === 'interest') {
      // 付息明细
      Vue.set(state.benefitsListViewerState, type, initPaginationAndTableState(benefitsList.benefitsListInterest));
    } else {
      // 分配明细
      Vue.set(state.benefitsListViewerState, type, initPaginationAndTableState(benefitsList.benefitsListApportionment));
    }
  },
  /*
  设置付息明细和收益明细数据
   */
  SET_BENEFITS_DATA(state, { type, data }) {
    Vue.set(state.benefitsListViewerState[type], 'tableData', data);
  },
  /*
  存续列表视图
   */
  SET_DURATION_MANAGE_VIEWER_STATE(state) {
    state.durationMangeViewerState = initPaginationAndTableState(durationMange);
  },
  /*
  存续列表数据
   */
  SET_DURATION_MANAGE_DATA(state, data) {
    Vue.set(state.durationMangeViewerState, 'tableData', data);
  },
  /*
  设置产品编辑，查看字段信息
   */
  SET_PRODUCT_FIELDS_STATE(state, type) {
    const { secondaryMarket, fixed, stock } = productFields;
    switch (type) {
      case 'secondary_market':
        Vue.set(state.productInfoState, 'secondary_market', {
          fields: secondaryMarket,
          model: {}
        });
        break;
      case 'equity':
        Vue.set(state.productInfoState, 'equity', {
          fields: stock,
          model: {}
        });
        break;
      case 'fixed_income':
        Vue.set(state.productInfoState, 'fixed_income', {
          fields: fixed,
          model: {}
        });
        break;
      default:
        break;
    }
  },
  /*
  设置产品信息
   */
  SET_PRODUCT_INFO_DATA(state, { type, data }) {
    state.productInfoState[type].model = data;
  },
  SET_MODIFY_PRODUCT_LABEL_VIEW(state) {
    Vue.set(state.modifyProductLabelState, 'infoData', modifyProductLabelInfoData);
  },
  // 编辑产品标签表单
  COMMIT_MODIFY_PRODUCT_LABEL_FORM_VIEWER(state) {
    Vue.set(state.modifyProductLabelState, 'fields', modifyProductLabelForm.createFormDatas);
    Vue.set(state.modifyProductLabelState, 'initData', modifyProductLabelForm.initData);
  },
  SET_MODIFY_PRODUCT_LABEL_FORM_DATA(state, data) {
    state.modifyProductLabelState.model = data;
  },
  SET_ATTACHMENT_VIEWER_STATE(state, type) {
    Vue.set(state.attachmentViewerState, type, {});
    state.attachmentViewerState[type] = initPaginationAndTableState(attachment);
  },
  SET_ATTACHMENT_TABLE_DATA(state, { type, data }) {
    Vue.set(state.attachmentViewerState[type], 'tableData', data);
  },
  /*
  产品基础信息里的净值
   */
  SET_PRODUCT_INFO_NETVALUE_VIEWER_STATE(state, type) {
    state.productInfoNetValueViewerState = initPaginationAndTableState(productInfoNetValue(type));
  },
  SET_PRODUCT_INFO_NETVALUE_DATA(state, data) {
    Vue.set(state.productInfoNetValueViewerState, 'tableData', data);
  },
  SET_PRODUCT_LIST_VIEWER_STATE(state, data) {
    state.productListViewerState = initPaginationAndTableState(productList);
  },
  SET_PRODUCT_LIST_DATA(state, data) {
    Vue.set(state.productListViewerState, 'tableData', data);
  },
  SET_PRODUCT_SELLING_LIST_VIEWER_STATE(state, data) {
    state.productSellingListViewerState = initPaginationAndTableState(productSellingList);
  },
  SET_PRODUCT_SELLING_LIST_DATA(state, data) {
    Vue.set(state.productSellingListViewerState, 'tableData', data);
  },
  SET_PRODUCT_NET_VALUE_VIEWER_STATE(state, data) {
    state.productNetValueViewerState = initPaginationAndTableState(productNetValue);
  },
  SET_PRODUCT_NET_VALUE_DATA(state, data) {
    Vue.set(state.productNetValueViewerState, 'tableData', data);
  },
  SET_PRODUCT_TREND_VIEWER_STATE(state) {
    state.productTrendViewerState = initPaginationAndTableState(productTrend);
  },
  SET_PRODUCT_TREND_DATA(state, data) {
    Vue.set(state.productTrendViewerState, 'tableData', data);
  },
  SET_INVESTED_REPORT_VIEWER_STATE(state) {
    state.investReportViewerState = initPaginationAndTableState(investedReport);
  },
  SET_INVESTED_REPORT_DATA(state, data) {
    Vue.set(state.investReportViewerState, 'tableData', data);
  },
  /*
  产品报告列表
   */
  SET_PRODUCT_NOTICE_LIST_VIEWER_STATE(state, type) {
    Vue.set(state.productNoticeViewerState, type, initPaginationAndTableState(setProductNotice(type)));
  },
  /*
  产品报告数据
   */
  SET_PRODUCT_NOTICE_LIST_DATA(state, { type, data }) {
    Vue.set(state.productNoticeViewerState[type], 'tableData', data);
  },
  /*
 产品选择弹框页面
  */
  COMMIT_PRODUCT_SELECTOR(state) {
    state.productSelectorViewerState = initPaginationAndTableState(productSelectorState);
  },
  /*
 产品选择框数据
  */
  COMMIT_PRODUCT_SELECTOR_DATA(state, data) {
    Vue.set(state.productSelectorViewerState, 'tableData', data);
  }
};
