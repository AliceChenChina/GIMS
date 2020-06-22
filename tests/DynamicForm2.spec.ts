import {shallowMount, createLocalVue} from '@vue/test-utils';
import ElementUI from 'element-ui';
import DynamicForm from 'common/DynamicForm.vue';
import { dynamicFormState } from '@/types/types';
import utils from '../src/utils/index';
import Vue from 'vue';

// 修改测试代码的时候，记得先清空snap文件
// todo ts类型修复
describe('DynamicForm组件测试', function() {
  const testValidator = () => {};
  const form: dynamicFormState= [
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
        formLabel: '输入框2',
        inputTag: 'el-input',
        modelKey: 'productName2',
        formRules: 'required'
      },
      {
        formLabel: '输入框area',
        inputTag: 'el-input',
        modelKey: 'productName3',
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
        // @ts-ignore
        formRules: [{ validator: testValidator, trigger: 'blur', required: false }],
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
      },
      {
        formLabel: '产品要素：',
        modelKey: 'attachList.productElement', // 浅拷贝引用修改原model vuex会报警
        inputTag: 'el-upload'
      },
      {
        formLabel: '产品要素2：',
        modelKey: 'attachList.productElement2', // 浅拷贝引用修改原model vuex会报警
        inputTag: 'el-upload',
        inputTagOptions: [
          {
            tagName: 'div',
            children: [{
              tagName: 'i',
              options: {
                attrs: {
                  class: 'el-icon-plus'
                }
              }
            }],
            options: {
              attrs: {
                class: 'el-upload__tip',
                slot: 'tip'
              }
            }
          }
        ]
      }
    ]
  ];
  const propsData = {
    form
  };
  const localVue = createLocalVue();
  localVue.use(ElementUI, {
    size: 'small'
  });

  Vue.prototype.$utils = utils;

  it('正确渲染动态组件', function() {
    const wrapper = shallowMount(DynamicForm, {localVue, propsData});
    expect(wrapper).toMatchSnapshot(); // pretty print
    expect(wrapper.findAll('el-row-stub').length).toBe(form.length); // 一共两行
    expect(wrapper.findAll('el-row-stub').at(0)
    // @ts-ignore
      .findAll('el-col-stub').length).toBe(form[0].length);
    expect(wrapper.vm.$data.localModel).toEqual({
      'closePeriod': '',
      'datePicker': '',
      'elSelect': '',
      'productName': '',
      'productName2': '',
      'productName3': '',
      "attachList": {
        "productElement": [],
        "productElement2": [],
      }
    });
    expect(wrapper.vm.$data.formRules).toEqual({
      "attachList.productElement": [],
      "attachList.productElement2": [],
      "closePeriod":  [
        {
          "message": "请填写单选框",
          "required": true,
          "trigger": "blur",
        },
      ],
      "datePicker":  [
        {
          "required": false,
          "trigger": "blur",
          "validator": testValidator
        },
      ],
      "elSelect":  [
        {
          "message": "请填写选择框",
          "required": true,
          "trigger": "blur",
        },
      ],
      "productName":  [
        {
          "message": "请填写输入框",
          "required": true,
          "trigger": "blur",
        },
      ],
      "productName2": [
        {
          "message": "请填写输入框2",
          "required": true,
          "trigger": "blur",
        },
      ],
      "productName3": [
        {
          "message": "请填写输入框area",
          "required": true,
          "trigger": "blur",
        },
      ],
    });
  });
  it('组件state为空时', function() {
    const wrapper = shallowMount(DynamicForm, {localVue, propsData});
    expect(wrapper).toMatchSnapshot();
  });
  it('测试改变model触发wathcer对本组件进行更新', function() {
    const wrapper = shallowMount(DynamicForm, {localVue, propsData: []});
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({
      model: {
        productName: 'test',
        productName2: '2'
      }
    });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$data.localModel.productName).toBe('test');
      expect(wrapper.vm.$data.localModel.productName2).toBe(2);
    })
  });

});
