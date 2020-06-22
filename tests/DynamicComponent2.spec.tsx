import { shallowMount, createLocalVue, mount } from '@vue/test-utils';
import ElementUI from 'element-ui';
import DynamicForm from 'common/DynamicForm.vue';
import { dynamicFormState } from '@/types/types';
import utils from '../src/utils/index';
import Vue, { CreateElement } from 'vue';
import DynamicComponent, { DynamicCompTag } from '@/components/common/DynamicComponent';

// DynamicComponent组件可以任意渲染createElement对象或者直接渲染VNodes
const dyTags: DynamicCompTag= {
  tagName: 'el-button-group',
  options: {
    attrs: {
      style: 'color: red;'
    }
  },
  children: [
    {
      tagName: 'el-button',
      options: {
        on: {
          click: () => {
          }
        }
      },
      children: '测试点击'
    }
  ]
};

const dyTags2: DynamicCompTag = {
  tagName: 'p',
  options: {
    attrs: {
      style: 'color: red;'
    }
  },
  // children: '111'
  children: (h: CreateElement) => {
    return [
      (<h1>test</h1>)
    ]
  }
};

const dyTagsJsx = {
  tagName(h: CreateElement) {
    return (<div><p>test</p></div>)
  }
};

const propsData = {
  comp: dyTags
};

const localVue = createLocalVue();
localVue.use(ElementUI, {
  size: 'small'
});

Vue.prototype.$utils = utils;

const wrapper = mount(DynamicComponent, {localVue, propsData});
const wrapper2 = mount(DynamicComponent, {localVue, propsData: { comp: dyTags2 }});
const wrapper3 = mount(DynamicComponent, {localVue, propsData: { comp: dyTagsJsx }});
describe('DynamicComponent组件测试', function() {

  it('正确渲染动态组件', function() {
    expect(wrapper).toMatchSnapshot(); // pretty print
    expect(wrapper.findAll('.el-button-group').length).toBe(1);
    expect(wrapper.findAll('button').length).toBe(1);
  });


  it('children能够渲染jsx', function() {
    wrapper2.vm.$nextTick(() => {
      expect(wrapper2).toMatchSnapshot(); // pretty print
      expect(wrapper2.findAll('p').length).toBe(1);
      expect(wrapper2.findAll('h1').length).toBe(1);
    })
  });

  it('直接渲染jsx', function() {
    wrapper3.vm.$nextTick(() => {
      expect(wrapper2).toMatchSnapshot(); // pretty print
      expect(wrapper3.findAll('div').length).toBe(1);
      expect(wrapper3.findAll('p').length).toBe(1);
    })
  });

});
