export interface tradeState {
  tradeVisitListViewerState: Object,
  tradeVisitDetail: Array<any>,
  tradeVisitEdit: Array<any>
}

export const tradeData = {
  tradeVisitListViewerState: {}, // 冷静期回访列表
  tradeVisitDetail: [], // 冷静期回访查看详情
  tradeVisitEdit: [] // 冷静期回访编辑详情
};
