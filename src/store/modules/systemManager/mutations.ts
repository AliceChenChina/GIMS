import { MutationTree } from 'vuex';
import { initPaginationAndTableState } from '@/store/mutations';
import { sysManagerState } from './state';
import { deptItem, powerItem } from '@/store/modules/systemManager/types';
import { employeeListState } from '@/store/pageConf/sysManager/employeeList';
import { getRoleListState } from '@/store/pageConf/sysManager/roleList';
import Vue from 'vue';
import { argListColumns } from '@/store/pageConf/sysManager/argList';
import { workdayCalendarState } from '@/store/pageConf/sysManager/workday';

export const mutations: MutationTree<sysManagerState> = {
  SET_DEPARTMENT_DATA(state, deptsArray: Array<deptItem>) {
    // 构建部门树
    // parentId上级对应id为depId
    function buildTree(deptItem: deptItem) {
      const deptItemsWithParentId = deptsArray.filter(deptArrayItem => deptArrayItem.parentId === deptItem.deptId);
      for (const deptItem of deptItemsWithParentId) {
        buildTree(deptItem);
      }
      deptItem.children = deptItemsWithParentId;
      return deptItem;
    }
    state.deptTreeData = buildTree(deptsArray[0]);
  },
  SET_EMPLOYEE_LIST_VIEWER_STATE(state) {
    state.employeeListState = initPaginationAndTableState(employeeListState);
  },
  SET_EMPLOYEE_LIST_DATA(state, data) {
    Vue.set(state.employeeListState, 'tableData', data);
  },
  SET_ROLELIST_VIEWER_STATE(state, type) {
    // todo 两个type切换的时候重新commit
    let originData: Array<any> = [];
    if (state.roleListState.tableData.records && state.roleListState.tableData.records.length > 0) {
      originData = state.roleListState.tableData.records;
    }
    state.roleListState = initPaginationAndTableState(getRoleListState(type));
    if (originData.length) {
      state.roleListState.tableData.records = originData;
    }
    state.roleListState.paginationState!.pageSize = 100;
  },
  SET_ROLELIST_DATA(state, data) {
    Vue.set(state.roleListState, 'tableData', data);
  },
  SET_ARG_LIST_VIEWER_LIST(state) {
    state.argListState = initPaginationAndTableState(argListColumns);
  },
  SET_ARG_LIST_DATA(state, data) {
    Vue.set(state.argListState, 'tableData', data);
  },
  SET_WORKDAY_CALENDAR_VIEWER_STATE(state) {
    state.workdayCalendarState = initPaginationAndTableState(workdayCalendarState);
  },
  SET_WORKDAY_CALENDAR_DATA(state, data) {
    Vue.set(state.workdayCalendarState, 'tableData', data);
  }
};
