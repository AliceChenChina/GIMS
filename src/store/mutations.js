import Vue from 'vue';

const _setPaginationState = (state) => {
  // 初始化分页器state
  Vue.set(state, 'paginationState', {
    pageSize: 10, // 默认请求10条数据,
    currentPageNo: 1,
    getAjaxParam: () => {
      // 获取接口分页请求格式
      return {
        pageNumber: state.paginationState.currentPageNo,
        pageSize: state.paginationState.pageSize
      };
    }
  });
  return state;
};

const _setEmptyTableDataState = (state) => {
  // 初始化空表格
  Vue.set(state, 'tableData', []);
  return state;
};

/*
初始化listViewer State结构
conf为配置
返回加工完的state
 */
const initPaginationAndTableState = (state) => {
  const rtState = { ...state };
  _setPaginationState(rtState);
  _setEmptyTableDataState(rtState);
  rtState.filterModel = { ...state.filterModel };
  return rtState;
};

const mutations = {
  SET_USER_INFO(state, data) {
    data.userId = parseInt(data.userId);
    data.deptId = parseInt(data.deptId);
    const powerKeys = data.userPowerKey.split(',');
    delete data.userPowerKey;
    state.userInfo = { ...state.userInfo, ...data };
    powerKeys.forEach(key => {
      state.userInfo.userPowerKey.add(key);
    });
  },
  SET_CONTRACT_ARG(state, data) {
    // 设置文字枚举值
    data.forEach(item => {
        if (!state.argEnum[item.argGroup]) {
          Vue.set(state.argEnum, item.argGroup, {});
        }
        const group = state.argEnum[item.argGroup];
        // 双向取值：arg['somekey'] = value 等于 arg['value'] = somekey
        group[group[item.argText] = item.argCode.toString()] = item.argText;
      }
    );
  },
  /*
 更新分页
  */
  UPDATE_PAGINATION_STATE(state, { paginationState, data }) {
    paginationState.pageSize = data.pageSize;
    paginationState.currentPageNo = data.pageNumber;
  },
  /*
 改变筛选栏绑定的数据
  */
  UPDATE_FILTER_MODEL(state, { modelState, data }) {
    // todo 返回新的state更好？
    Object.keys(modelState).forEach(dataKey => {
      if (modelState[dataKey] !== data[dataKey]) {
        // 不一样，更新数据
        modelState[dataKey] = data[dataKey];
      }
    });
  },
  SET_POWER_LIST_DATA(state, data) {
    // 构建权限管理树
    function buildTree(node) {
      const powerChildren = data.filter((item) => item.parentId === node.powerId);
      const children = powerChildren.map(child => buildTree(child));
      return {
        powerId: node.powerId,
        label: node.powerCaption,
        parentId: node.parentId,
        powerKey: node.powerKey,
        children
      };
    }
    state.powerListState = buildTree({
      powerCaption: '功能菜单', // 权限名称
      powerId: 0,
      powerKey: '',
      parentId: -1
    });
  }
};

export { initPaginationAndTableState, mutations, _setEmptyTableDataState };
