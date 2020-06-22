import { ActionTree } from 'vuex';
import fetchApi from '@/api/fetchApi';
import { RootState } from '@/store/types';
import { handleReject } from '@/store/actions';
import { sysManagerState } from '@/store/modules/systemManager/types';

export const actions: ActionTree<sysManagerState, RootState> = {
  async getDepartmentList({ commit, state }, arg) {
    const uri = '/systemSetting/department/query';
    const res = await fetchApi.setParam(uri, arg).setRejectHandler(handleReject).doRequest();
    commit('SET_DEPARTMENT_DATA', res.records);
  },
  async getRoleList({ commit, state }, arg) {
    const uri = '/systemSetting/role/query';
    const res = await fetchApi.setParam(uri, arg).setRejectHandler(handleReject).doRequest();
    commit('SET_ROLELIST_DATA', res);
  },
  /*
获取员工列表
 */
  async getSysEmployee({ commit }, arg) {
    const res = await fetchApi.setParam('/systemSetting/employee/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_EMPLOYEE_LIST_DATA', res);
  },
  async getRolePower({ commit }, arg) {
    const res = await fetchApi.setParam('/systemSetting/role/getRolePowerByRoleId', arg).setRejectHandler(handleReject).doRequest();
    return res;
  },
  async getSysArgList({ commit }, arg) {
    const res = await fetchApi.setParam('/systemSetting/arg/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_ARG_LIST_DATA', res);
  },
  async queryWorkday({ commit }, arg) {
    const res = await fetchApi.setParam('/systemSetting/workDay/query', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_WORKDAY_CALENDAR_DATA', res);
  },
  async queryWorkdayInCalendar({ commit }, arg) {
    const res = await fetchApi.setParam('/systemSetting/workDay/query', arg).setRejectHandler(handleReject).doRequest();
    return res.records;
  }
};
