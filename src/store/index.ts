// index.ts
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { mutations } from './mutations';
import { actions } from './actions';
import { RootState } from './types/index';
import { sysManager } from './modules/systemManager/index';
import { order } from './modules/order/index';
import { consumer } from './modules/consumer/index';
import { leads } from './modules/leads/index';
import { product } from './modules/product/index';
import { declaration } from './modules/declaration/index';
import { customerService } from './modules/customerService/index';
import { message } from './modules/message/index';
import { myConsumer } from './modules/myConsumer/index';
import { activity } from '@/store/modules/activity';
import { commission } from '@/store/modules/commission';
import { strategyRecommend } from '@/store/modules/strategyRecommend';
Vue.use(Vuex);
const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0', // a simple property
    argEnum: {}, // 全局枚举参数
    userInfo: {
      userId: 0,
      userName: '',
      deptId: 0,
      deptName: '',
      loginName: '',
      userPowerKey: new Set<string>() // 用户权限信息，xxx.xxx.xxx
    },
    powerListState: {
      powerId: 0,
      parentId: -1,
      label: '',
      powerKey: '',
      children: []
    }
  },
  mutations, // 公共mutations
  actions, // actions目前不区分模块
  modules: {
    sysManager,
    consumer,
    leads,
    product,
    order,
    declaration,
    customerService,
    message,
    myConsumer,
    activity,
    commission,
    strategyRecommend
  }
};
export default new Vuex.Store(store);
