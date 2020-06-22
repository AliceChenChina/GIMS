import fetchApi from '@/api/fetchApi';
import Vue from 'vue';

export function handleReject(reject, res) {
  // 弹出错误提示
  Vue.prototype.$message.error(`读取数据时发生错误：${res.message}。请关闭标签后重试。`);
  reject(res.message);
}

export const actions = {
  /*
  查询参数变量
   */
  async queryArgAll({ commit }, arg) {
    const res = await fetchApi.setParam('/getArgAll', arg).setRejectHandler(handleReject).doRequest();
    commit('SET_CONTRACT_ARG', res);
  },
  /*
  获取当前登陆的用户信息，权限
   */
  async getUserInfo({ commit }) {
    const uri = '/getUserInfo';
    const res = await fetchApi.setParam(uri, {}).setRejectHandler(handleReject).doRequest();
    // 返回的res是json字符串
    commit('SET_USER_INFO', window.JSON.parse(res));
  },
  /*
 权限树列表
  */
  async getPowerList({ commit }) {
    const res = await fetchApi.setParam('/systemSetting/power/list', { parentId: -1 }).setRejectHandler(handleReject).doRequest();
    commit('SET_POWER_LIST_DATA', res.data);
  }
};
