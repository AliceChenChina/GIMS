export interface myconsumerState {
    visitListState: Object,
    myConsumerListState: Object,
    myConsumerInfoState: Object,
    preposeAddState: Object,
    manageAssetsListState: Object,
    totalAssetsListState: Object
}

export const stateData = {
    visitListState: {}, // 理财师客服管理客户拜访列表
    myConsumerListState: {}, // 我的客户列表
    myConsumerInfoState: {}, // 客户详细
    preposeAddState: {},
    manageAssetsListState: [], // 理财师的资产管理
    totalAssetsListState: [] // 客户总资产管理
};
