import {shallowMount, createLocalVue} from '@vue/test-utils';
import ElementUI from 'element-ui';
import Pagination from '../../src/components/common/Pagination.vue';

describe('Pagination测试', function() {
  const state = {
  };
  const localVue = createLocalVue();
  localVue.use(ElementUI, {
    size: 'small'
  });
  it('测试分页组件事件', function() {
    const propsData = {
      state
    };
    const wrapper = shallowMount(Pagination, {localVue, propsData});
    // 当页面每页显示条数改变时，重置页码到第一页
    wrapper.vm.onSizeChange(50);
    // element ui组件改变时，更新内部页码状态
    wrapper.vm._updateCurrentPageNo(11);
    // 设置当前页码为11页
    wrapper.vm.setPageNo(11);
    // expected为emit产生的事件列表
    const expected = [
      [{"pageNumber": 1, "pageSize": 50}],
      [{"pageNumber": 11, "pageSize": 50}],
      [{"pageNumber": 11, "pageSize": 50}]
    ];
    expect(wrapper.emitted().onPageChange).toEqual(expected);
  });
});
