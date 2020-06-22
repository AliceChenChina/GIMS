import {shallowMount, createLocalVue} from '@vue/test-utils';
import ElementUI from 'element-ui';
import Pagination from '../../src/components/common/DynamicFilter.vue';

describe('DynamicFilter组件测试', function() {
  const comps = [
    [
      {
        labelName: '京东用户名',
        tagName: 'el-input',
        modelName: 'jdpin',
        props: {
          clearable: true,
          placeholder: '京东用户名'
        }
      },
      {
        labelName: '预约类型',
        tagName: 'el-select',
        modelName: 'appointType',
        props: {
          clearable: true,
          placeholder: '请选择'
        },
        options: [
          {
            label: '产品',
            value: '1'
          },
          {
            label: '活动',
            value: '2'
          },
          {
            label: '服务',
            value: '3'
          }
        ]
      }
    ],
    [
      {
        labelName: '时间',
        tagName: 'el-date-picker',
        modelName: 'createTimeStart',
        props: {
          clearable: true,
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '',
        tagName: 'el-button-group',
        slotComps: [
          {
            tagName: 'el-button',
            innerText: '查询',
            props: {
              type: 'primary',
              icon: 'el-icon-search'
            }
          },
          {
            tagName: 'el-button',
            innerText: '重置',
            props: {
              type: 'primary',
              icon: 'el-icon-refresh-right'
            }
            // eventOn: {
            //   click: vm.doDefaultReset
            // }
          }
        ]
      }
    ]
  ];
  const model = {
      jdpin: '', // 京东用户名
      appointType: '', // 预约类型
      createTimeStart: '', // 时间
      createTimeEnd: ''
  };
  const propsData = {
    comps, model
  };
  const localVue = createLocalVue();
  localVue.use(ElementUI, {
    size: 'small'
  });

  it('测试分页组件事件', function() {
    const wrapper = shallowMount(Pagination, {localVue, propsData});
  });
});
