export interface productState {
  durationListViewerState: Object,
  benefitsListViewerState: Object,
  durationMangeViewerState: Object,
  productInfoState: object, // 产品编辑，查看state
  attachmentViewerState: Object,
  productInfoNetValueViewerState: Object, // 产品基础信息里的净值列表
  productListViewerState: Object,
  productSellingListViewerState: Object,
  productNetValueViewerState: Object, // 产品净值管理
  productNoticeViewerState: Object, // 产品报告管理
  productSelectorViewerState: Object,
  productTrendViewerState: Object,
  investReportViewerState: Object,
  modifyProductLabelState: Object, // 修改产品标签的信息
}

export const stateData = {
  durationListViewerState: {},
  benefitsListViewerState: {},
  durationMangeViewerState: {},
  productInfoState: {}, // 产品编辑，查看state
  attachmentViewerState: {},
  productInfoNetValueViewerState: {}, // 产品基础信息里的净值列表
  productListViewerState: {},
  productSellingListViewerState: {},
  productNetValueViewerState: {}, // 产品净值管理
  productNoticeViewerState: {}, // 产品报告管理
  productSelectorViewerState: {},
  productTrendViewerState: {},
  investReportViewerState: {},
  modifyProductLabelState: Object
};
