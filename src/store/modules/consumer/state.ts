export interface consumerState {
  consumerViewerState: Object,
  consumerDetail: Array<any>,
  employeeSelectorViewerState: Object,
  pfundAssetProofListState: Object,
  consumerHoldingListState: Object,
  customerSalesCompareListState: Object
}

export const stateData = {
  consumerViewerState: {}, // 客户管理state
  consumerDetail: [],
  employeeSelectorViewerState: {},
  pfundAssetProofListState: {}, // 资产证明分级
  consumerHoldingListState: {}, // 客户持仓
  customerSalesCompareListState: {} // 客户归属校验
};
