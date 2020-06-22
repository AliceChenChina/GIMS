import { initPaginationAndTableState, _setEmptyTableDataState } from '@/store/mutations';
import Vue from 'vue';
import declarationListState from '@/store/pageConf/declaration/declarationList/index';
import allDeclarationList from '@/store/pageConf/declaration/declarationList/allDeclarationList';
import allRedeemApplyList from '@/store/pageConf/declaration/redeem/allRedeemApplyList';
import startDeclarationInfo from '@/store/pageConf/declaration/startDeclaration/startDeclarationForm.jsx';
import editShareForm from '@/store/pageConf/declaration/declarations/editShareForm';
import declarationInfo from '@/store/pageConf/declaration/declarationInfo';
import redeemInfo from '@/store/pageConf/declaration/redeem/redeemInfo';
import redeemAudit from '@/store/pageConf/declaration/redeem/redeemAudit';
import redeemApplyListState from '@/store/pageConf/declaration/redeem/redemApplyList';
import startDeclarationListState from '@/store/pageConf/declaration/startDeclaration/startDeclarationList';
import startHistoryListState from '@/store/pageConf/declaration/startDeclaration/startHistoryList';
import productDeclarationListState from '@/store/pageConf/declaration/productDeclaration/productDeclarationList.jsx';
import declarationAuditListState from '@/store/pageConf/declaration/declarationAudit/declarationAudit';
import chooseDeclarationOrder from '@/store/pageConf/declaration/redeem/chooseDeclarationOrder';
import customerSelector from '@/store/pageConf/declaration/customerSelector';
import declarationForm from '@/store/pageConf/declaration/declarations/declarationForm';

export const mutations = {
  // 报单管理 -- 赎回申请审核列表--视图数据
  COMMIT_REDEEM_APPLY_VIEWER_STATE(state, vm) {
    const tradeStatusArr = vm.statusArgsWithElOptionsTag('trade_indent_status');
    const tradeStatus = [];
    tradeStatusArr.forEach(item => {
      tradeStatus.push(item.value);
    });
    redeemApplyListState.filterModel.statusStrs = tradeStatus;
    state.redeemApplyListState = initPaginationAndTableState(redeemApplyListState);
  },
  // 报单管理 -- 赎回申请审核列表--设置请求的数据
  SET_REDEEM_APPLY_LIST(state, data) {
    Vue.set(state.redeemApplyListState, 'tableData', data);
  },
  // 报单管理 -- 启动报单列表 -- 视图数据
  COMMIT_START_DECLARATION_LIST_VIEWER_STATE(state) {
    state.startDeclarationListState = initPaginationAndTableState(startDeclarationListState);
  },
  // 报单管理 -- 启动报单列表 -- 设置请求的数据
  SET_START_DECLARATION_LIST(state, data) {
    Vue.set(state.startDeclarationListState, 'tableData', data);
  },
  // 报单管理 -- 启动历史列表 -- 视图数据
  COMMIT_START_HISTORY_LIST_VIEWER_STATE(state) {
    state.startHistoryListState = initPaginationAndTableState(startHistoryListState);
  },
  // 报单管理 -- 启动历史列表 -- 设置请求的数据
  SET_START_HISTORY_LIST(state, data) {
    Vue.set(state.startHistoryListState, 'tableData', data);
  },
  // 报单管理 -- 报单历史列表,我的报单 -- 视图数据
  COMMIT_DECLARATION_LIST_VIEWER(state, vm) {
    const type = vm.type;
    const { historyList, myList, stateFactory } = declarationListState;
    let viewState = {};
    switch (type) {
      case 'my' :
        viewState = { ...stateFactory(myList) };
        break;
      case 'history' :
        viewState = { ...stateFactory(historyList) };
        break;
    };
    const tradeStatusArr = vm.statusArgsWithElOptionsTag('trade_indent_status');
    const tradeStatus = [];
    tradeStatusArr.forEach(item => {
      tradeStatus.push(item.value);
    });
    viewState.filterModel.statusStrs = tradeStatus;
    Vue.set(state.declarationListState, type, initPaginationAndTableState(viewState));
  },
  // 报单管理 -- 报单历史列表 -- 设置请求的数据
  SET_DECLARATION_LIST(state, data) {
    Vue.set(state.declarationListState[data.type], 'tableData', data.res);
  },
  // 报单管理 -- 产品报单 -- 视图数据
  COMMIT_PRODUCT_DECLARATION_LIST_VIEWER(state) {
    state.productDeclarationListState = initPaginationAndTableState(productDeclarationListState);
  },
  // 报单管理 -- 产品报单 -- 设置请求的数据
  SET_PRODUCT_DECLARATION_LIST(state, data) {
    Vue.set(state.productDeclarationListState, 'tableData', data);
  },
  // 报单管理 -- 报单审核 -- 视图数据
  COMMIT_DECLARATION_AUDIT_LIST_VIEWER(state, vm) {
    const tradeStatusArr = vm.statusArgsWithElOptionsTag('trade_indent_status');
    const tradeStatus = [];
    tradeStatusArr.forEach(item => {
      tradeStatus.push(item.value);
    });
    declarationAuditListState.filterModel.statusStrs = tradeStatus;
    state.declarationAuditListState = initPaginationAndTableState(declarationAuditListState);
  },
  // 报单管理 -- 报单审核 -- 设置请求的数据
  SET_DECLARATION_AUDIT_LIST(state, data) {
    Vue.set(state.declarationAuditListState, 'tableData', data);
  },
  /*
  设置产品编辑，查看字段信息
   */
  // 报单管理 -- 全部报单 -- 视图数据
  COMMIT_ALL_DECLARATION_LIST_VIEWER(state, vm) {
    const tradeStatusArr = vm.statusArgsWithElOptionsTag('trade_indent_status');
    const tradeStatus = [];
    tradeStatusArr.forEach(item => {
      tradeStatus.push(item.value);
    });
    allDeclarationList.filterModel.statusStrs = tradeStatus;
    state.allDeclarationListState = initPaginationAndTableState(allDeclarationList);
  },
  // 报单管理 -- 全部报单 -- 设置请求的数据
  SET_ALL_DECLARATION_LIST(state, data) {
    Vue.set(state.allDeclarationListState, 'tableData', data);
  },
  // 报单管理 -- 全部赎回 -- 视图数据
  COMMIT_ALL_REDEEM_LIST_VIEWER(state, vm) {
    const tradeStatusArr = vm.statusArgsWithElOptionsTag('trade_indent_status');
    const tradeStatus = [];
    tradeStatusArr.forEach(item => {
      tradeStatus.push(item.value);
    });
    allRedeemApplyList.filterModel.statusStrs = tradeStatus;
    state.allRedeemApplyListState = initPaginationAndTableState(allRedeemApplyList);
  },
  // 报单管理 -- 全部赎回 -- 设置请求的数据
  SET_ALL_REDEEM_LIST(state, data) {
    Vue.set(state.allRedeemApplyListState, 'tableData', data);
  },
  // 报单管理 -- 启动报单表单 -- 视图数据
  COMMIT_START_DECLARATION__FORM_VIEWER(state) {
    Vue.set(state.startDeclarationFormState, 'infoView', startDeclarationInfo);
  },
  // 报单管理 -- 编辑份额 -- 视图数据
  COMMIT_EDIT_SHARE_VIEWER(state, type) {
    const stateFactory = editShareForm;
    switch (type) {
      case 'editShare' :
        Vue.set(state.editShareState, 'fields', stateFactory('declaration'));
        break;
      case 'addShare' :
        Vue.set(state.editShareState, 'fields', stateFactory('declaration'));
        break;
      case 'editRedeemShare' :
        Vue.set(state.editShareState, 'fields', stateFactory('redeem'));
        break;
      case 'addRedeemShare' :
        Vue.set(state.editShareState, 'fields', stateFactory('redeem'));
        break;
    };
    Vue.set(state.editShareState, 'model', {});
  },
  // 报单管理 -- 启动报单表单
  SET_START_DECLARATION__FORM_LIST(state, data) {
    if (data) {
     const stateData = {
        productName: data.productName,
       productNameShort: data.productNameShort,
       isProxy: data.isProxy,
       productTypeName: data.productTypeName,
        commisionRate: data.commisionRate,
        commisionConvert: data.commisionConvert,
        productStatus: data.productStatus
      };
      Vue.set(state.startDeclarationFormState, 'data', stateData);
    }
  },
  // 报单管理 -- 启动报单表单
  SET_START_DECLARATION__OPEN_DATA(state, data) {
    if (data) {
      state.startDeclarationFormState.data.openStart = data.openStart;
      state.startDeclarationFormState.data.openEnd = data.openEnd;
      state.startDeclarationFormState.data.tradeType = data.tradeType;
    }
  },
  // 报单管理 -- 编辑份额--获取数据
  SET_EDIT_FORM_DATA(state, data) {
    if (data) {
      state.editShareState.model = data;
    }
  },
  /*
 设置报单详情
  */
  GET_DECLARATION_VIEW_STATE(state, data) {
    Vue.set(state.declarationInfoState, 'declarationInfoView', declarationInfo);
  },
  /*
 设置报单详情
  */
  SET_DECLARATION_INFO_STATE(state, data) {
    Vue.set(state.declarationInfoState, 'data', data);
  },
  /*
 设置报单详情
  */
  SET_REDEEM_INFO_STATE(state, data) {
    state.redeemInfoState = redeemInfo(data);
  },
  /*
设置报单审核
 */
  SET_REDEEM_AUDIT_STATE(state, data) {
    state.redeemAuditState = redeemAudit(data);
  },
  /*
 得到赎回审核信息
  */
  GET_AUDIT_INFO_DATA(state, data) {
    state.auditInfoState = data;
  },
  // 报单管理 -- 选择报单订单 -- 视图数据
  COMMIT_CHOOSE_DECLARATION_ORDER_VIEWER_STATE(state) {
    state.chooseDeclarationOrderState = initPaginationAndTableState(chooseDeclarationOrder);
  },
  // 报单管理 -- 选择报单订单 -- 设置请求的数据
  SET_CHOOSE_DECLARATION_ORDER_LIST(state, data = {}) {
    Vue.set(state.chooseDeclarationOrderState, 'tableData', data);
  },
  // 报单管理 -- 产品报单头信息
  SET_DECLARATION_INFO(state, data) {
    Vue.set(state.getDeclarationDataState, 'declarationInfo', data);
  },
  // 报单管理 -- 启动报单数据
  SET_START_BOOKING_INFO(state, data) {
    Vue.set(state.getDeclarationDataState, 'startBookingInfo', data);
  },
  // 报单管理 -- 选择客户
  COMMIT_CUSTOMER_SELECTOR(state) {
    state.customerSelectorViewerState = initPaginationAndTableState(customerSelector);
  },
  // 报单管理 -- 报单审核 -- 设置请求的数据
  SET_CUSTOMER_LIST(state, data) {
    Vue.set(state.customerSelectorViewerState, 'tableData', data);
  },
  // 报单管理 -- 清除客户信息数据
  INITE_CUSTOMER_INFO_STATE(state, data) {
    state.customerInfoState = {};
  },
  // 报单管理 -- 获取客户的信息
  GET_CUSTOMER_INFO(state, data) {
    state.customerInfoState = data;
  },
  // 报单管理 -- 报单表单
  COMMIT_DECLARATION_FORM_VIEWER(state) {
    Vue.set(state.declarationFormState, 'fields', declarationForm.createFormDatas);
    Vue.set(state.declarationFormState, 'initData', declarationForm.initData);
    Vue.set(state.declarationFormState, 'declarationHeadInfo', declarationForm.declarationHeadInfo);
  },
// 报单管理 -- 控制步骤
  SET_STATUS_STEP(state, data) {
    if (data === 'terminal') state.declarationStepStatus = 3;
    if (data === 'back') state.declarationStepStatus = 0;
    if (data === 'forward') state.declarationStepStatus = 1;
    if (data === 'inite') state.declarationStepStatus = 0;
  }
};
