import {createLocalVue, shallowMount} from '@vue/test-utils';
import InfoDetailViewer from '../../src/components/common/InfoDetailViewer.vue';
import ElementUI from "element-ui";
import DynamicTable from '../../src/components/common/DynamicTable.vue';

describe('InfoDetailViewer测试', function() {
  const localVue = createLocalVue();
  localVue.use(ElementUI, {
    size: 'small'
  });
  it('是否正确输出basic类型信息', function() {
    const state = [
      {
        type: 'basic',
        title: '测试基本信息',
        rows: [
          [
            {
              label: '客户初始来源',
              value: '公司获取'
            },
            {
              label: '绑定理财师',
              value: '管理员'
            },
            {
              label: '理财师是否专属',
              value: '否'
            },
            {
              label: '首次触达时间',
              value: '2018-10-24 16:52:34'
            }
          ]
        ]
      },
      {
        type: 'basic',
        title: '京东信息',
        rows: [
          [
            {
              label: '京东用户名',
              value: 'jd_user9049'
            },
            {
              label: '客户姓名',
              value: '郇玺'
            },
            {
              label: '客户手机号:',
              value: '135****5618'
            },
            {
              label: '客户类型:',
              value: '个人'
            }
          ],
          [
            {
              label: '是否成单',
              value: '否'
            },
            {
              label: '是否成单',
              value: '否'
            },
            {
              label: '是否成单',
              value: '否'
            },
            {
              label: '是否成单',
              value: '否'
            }
          ]
        ]
      }
    ];
    const propsData = {
      state
    };
    const wrapper = shallowMount(InfoDetailViewer, {localVue, propsData});
    // 验证标题
    expect(wrapper.findAll('.desc-item .title-info').at(0).text()).toBe('测试基本信息'); // 第一个大块
    expect(wrapper.findAll('.desc-item .title-info').at(1).text()).toBe('京东信息'); // 第二个大块

    const totalContent = wrapper.findAll('.desc-item');
    expect(totalContent.length).toBe(2); // 两个大项目
    const firstContent = totalContent.at(0); // 第一个大项目
    const firstContentRows = firstContent.findAll('.tiltle-content-row');
    expect(firstContentRows.length).toBe(1); // 有一行
    const firstContentRow = firstContentRows.at(0); // 第一行
    const firstContentFirstRowCols = firstContentRow.findAll('.tiltle-content'); // 所有列
    expect(firstContentFirstRowCols.length).toBe(4); // 有四列
  });
  it('是否正确输出table类型信息', function() {
    const state = [
      {
        type: 'table',
        title: '测试表格',
        tableColumn: [
          {
            label: '京东用户名',
            dataKey: 'pinCode',
            props: {
              width: 100
            }
          },
          {
            label: '客户姓名',
            dataKey: 'customerName',
            props: {
              width: 100
            }
          },
          {
            label: '客户手机号',
            dataKey: 'mobilephone',
            props: {
              width: 100
            }
          }
        ],
        tableData: []
      }
    ];
    const propsData = {
      state
    };
    const wrapper = shallowMount(InfoDetailViewer, {localVue, propsData});
    const totalContent = wrapper.findAll('.desc-item');
    expect(totalContent.length).toBe(1); // 一个个大项目
    const firstContent = totalContent.at(0); // 第一个大项目
    expect(firstContent.find('.content-info dynamic-table-stub').is(DynamicTable)).toBe(true);
  });
  it('state为空', function() {
    const wrapper = shallowMount(InfoDetailViewer, {localVue});
    const totalContent = wrapper.findAll('.desc-item');
    expect(totalContent.length).toBe(0); // 一个个大项目
  });
});
