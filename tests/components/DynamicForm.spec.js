import {shallowMount, createLocalVue} from '@vue/test-utils';
import ElementUI from 'element-ui';
import DynamicForm from '../../src/components/common/DynamicForm.vue';

describe('DynamicFilter组件测试', function() {
  const form = {
    title: '基本信息',
    items: [
      // 行，列格式
      [
        {
          formLabel: '输入框',
          inputTag: 'el-input',
          modelKey: 'productName',
          inputProps: {
            clearable: true,
            placeholder: '跟进天数'
          },
          inputEvents: {},
          formRules: 'required'
        },
        {
          formLabel: '输入框area',
          inputTag: 'el-input',
          modelKey: 'productName',
          inputProps: {
            type: 'textarea', // 奇数行放textarea
            rows: 2
          },
          formRules: 'required'
        },
        {
          formLabel: '单选框',
          inputTag: 'el-radio-group',
          inputTagOptions: [
            {
              label: '线上测试',
              value: 1
            },
            {
              label: '线下测试',
              value: 2
            }
          ], // slot
          modelKey: 'closePeriod',
          inputProps: {},
          formRules: 'required'
        }
      ],
      [
        {
          formLabel: '日期框',
          inputTag: 'el-date-picker',
          modelKey: 'datePicker',
          inputProps: {},
          inputEvents: {},
          formRules: 'required'
        },
        {
          formLabel: '选择框',
          inputTag: 'el-select',
          modelKey: 'elSelect',
          inputTagOptions: [
            {
              label: '选择1',
              value: 1
            },
            {
              label: '选择2',
              value: 2
            }
          ],
          inputProps: {},
          inputEvents: {},
          formRules: 'required'
        }
      ]
    ]
  };
  const propsData = {
    form
  };
  const localVue = createLocalVue();
  localVue.use(ElementUI, {
    size: 'small'
  });

  it('测试分页组件事件', function() {
    const wrapper = shallowMount(DynamicForm, {localVue, propsData});
    expect(wrapper.findAll('el-row-stub').length).toBe(2); // 一共两行
    expect(wrapper.findAll('el-col-stub').length).toBe(4); // 一共四个元素
    // todo 事件测试
  });
});
