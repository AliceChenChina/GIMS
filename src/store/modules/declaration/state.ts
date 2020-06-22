export interface declarationState {
  redeemApplyListState: Object,
  startDeclarationListState: Object,
  startHistoryListState: {},
  productDeclarationListState: Object,
  declarationAuditListState: Object,
  declarationListState: Object,
  allDeclarationListState: Object,
  allRedeemApplyListState: Object,
  startDeclarationFormState: Object,
  declarationInfoState: Array<any>,
  editShareState: Object,
  redeemInfoState: Array<any>,
  auditInfoState: Object,
  chooseDeclarationOrderState: Object,
  getDeclarationDataState: Object,
  customerSelectorViewerState: Object,
  customerInfoState: Object,
  declarationFormState: Object,
  declarationStepStatus: Number,
  redeemAuditState: Array<any>
}

export const declarationStateData = {
  redeemApplyListState: {}, // 报单管理--赎回申请审核列表
  startDeclarationListState: {}, // 启动报单列表
  startHistoryListState: {}, // 启动历史
  productDeclarationListState: {}, // 产品报单列表
  declarationAuditListState: {}, // 报单审核
  declarationListState: {}, // 报单列表 -- 我的报单，报单历史
  allDeclarationListState: {}, // 全部报单
  allRedeemApplyListState: {}, // 全部赎回
  startDeclarationFormState: {}, // 启动报单表单
  declarationInfoState: [], // 报单详情
  editShareState: {}, // 编辑份额
  redeemInfoState: [], // 赎回详情
  auditInfoState: {}, // 赎回审核详情
  chooseDeclarationOrderState: {}, // 选择报单订单
  getDeclarationDataState: {}, // 产品报单头信息
  customerSelectorViewerState: {}, // 选择客户
  customerInfoState: {}, // 报单中获取客户信息
  declarationFormState: {}, // 报单中表单提交
  declarationStepStatus: 0,
  redeemAuditState: [] // 赎回申请审核
};
