import {shallowMount, createLocalVue} from '@vue/test-utils';
import ElementUI from 'element-ui';
import DynamicForm from 'common/DynamicForm.vue';
import { dynamicFormState } from '@/types/types';
import utils from '../src/utils/index';
import Vue, { CreateElement, VNode } from 'vue';

// 修改测试代码的时候，记得先清空snap文件
describe('DynamicForm组件测试', function() {
  const localVue = createLocalVue();
  localVue.use(ElementUI, {
    size: 'small'
  });

  Vue.prototype.$utils = utils;

  it('正确渲染动态组件', function() {
    // todo 补测试
    // setTimeout(() => {
    //   this.comps[0].push({
    //     labelName: '测试',
    //     tagName: 'el-radio-group', // 组件标签名称，不一定是element ui的标签
    //     modelName: 'testKey', // 绑定的数据字段key
    //     props: {
    //     },
    //     options: (h: CreateElement): Array<VNode> => {
    //       return [
    //         (<el-radio label="步步高" />),
    //       (<el-radio label="步步高1" />),
    //       (<el-radio label="步步高2" />)
    //     ];
    //     }
    //   });
    // });
    // setTimeout(() => {
    //   this.comps[0].push({
    //     labelName: '测试',
    //     tagName: 'el-input', // 组件标签名称，不一定是element ui的标签
    //     modelName: 'testKey2', // 绑定的数据字段key
    //     props: {
    //     }
    //   });
    // });
    // setTimeout(() => {
    //   this.comps[1].push({
    //     labelName: '测试',
    //     tagName: 'el-select', // 组件标签名称，不一定是element ui的标签
    //     modelName: 'testKey3', // 绑定的数据字段key
    //     props: {
    //     },
    //     options: [
    //       {
    //         label: 'test1',
    //         value: 111
    //       },
    //       {
    //         label: 'test2',
    //         value: 222
    //       }
    //     ]
    //   });
    // });
    // setTimeout(() => {
    //   this.comps[1].push({
    //     labelName: '测试',
    //     tagName: 'el-date-picker', // 组件标签名称，不一定是element ui的标签
    //     modelName: 'testKey4', // 绑定的数据字段key
    //     props: {
    //     }
    //   });
    // });
  });

});
