import {shallowMount, createLocalVue} from '@vue/test-utils';
import ElementUI from 'element-ui';
import Pagination from '../../src/components/common/DynamicElComponent.vue';

describe('DynamicElComponent组件测试', function() {

  const localVue = createLocalVue();
  localVue.use(ElementUI, {
    size: 'small'
  });

  it('测试是否正确渲染动态Element UI组件', function() {
    const comp = {
      tagName: 'el-row',
      options: {},
      children: [
        {
          tagName: 'el-button',
          options: {
            props: {
              innerText: '',
              type: 'primary',
              icon: 'el-icon-search'
            },
            on: {
              click: () => {
              }
            }
          },
          children: '按钮2'
        },
        {
          tagName: 'el-button',
          options: {
            props: {
              innerText: '',
              type: 'primary',
              icon: 'el-icon-search'
            },
            on: {
              click: () => {
              }
            }
          },
          children: '按钮2'
        },
        {
          tagName: 'el-select',
          options: {
            props: {
              innerText: '',
              type: 'primary',
              icon: 'el-icon-search',
              value: '测试2'
            },
            on: {
              click: () => {
              },
              input: e => {
              }
            }
          },
          children: [
            {
              tagName: 'el-option',
              options: {
                props: {
                  value: '测试1',
                  label: 1
                }
              }
            },
            {
              tagName: 'el-option',
              options: {
                props: {
                  value: '测试2',
                  label: 2
                }
              }
            }
          ]
        }
      ]
    };
    // 应该有一个el-row，一个el-row里面有两个按钮，一个下拉选择框，下拉框有两个选项
    const propsData = {comp};
    const wrapper = shallowMount(Pagination, {localVue, propsData});
    expect(wrapper.findAll('el-row-stub').length).toBe(1);
    expect(wrapper.findAll('el-button-stub').length).toBe(2);
    expect(wrapper.findAll('el-select-stub').length).toBe(1);
    expect(wrapper.findAll('el-option-stub').length).toBe(2);
  });
});
