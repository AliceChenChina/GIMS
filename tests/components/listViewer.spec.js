import {shallowMount} from '@vue/test-utils';
import ListViewer from '../../src/components/common/ListViewer.vue';
import DynamicFilter from '../../src/components/common/DynamicFilter.vue';
import DynamicTable from '../../src/components/common/DynamicTable.vue';
import Pagination from '../../src/components/common/Pagination.vue';

describe('ListViewer测试', function() {
  const state = {
    /*
    这里不用vm参数也可以，外层调用的地方使用bind替换this
     */
    filterOptions(vm) {
      return [
        [
          {
            labelName: '输入框1',
            tagName: 'el-input',
            modelName: 'testinput1',
            props: {
              clearable: true,
              placeholder: '输入框1'
            }
          },
          {
            labelName: '下拉框',
            tagName: 'el-select',
            modelName: 'testselect',
            props: {
              placeholder: '请选择',
              clearable: true
            },
            options: [
              {
                label: 'test',
                value: 'testvalue'
              }
            ]
          }
        ]
      ];
    },
    filterModel: {
      testinput1: '',
      testselect: ''
    },
    tableColumn: vm => {
      return [
        {
          label: '订单编号',
          dataKey: 'plOrderId',
          props: {
            width: 140
          }
        },
        {
          label: '报单编号',
          dataKey: 'tradeId',
          props: {
            width: 140
          }
        }
      ];
    },
    // orderData: {
    //   records: [],
    //   totalRecordCount: 0
    // },
    tableData: {
      records: [],
      totalRecordCount: 0
    },
    statusArgs: [],
    paginationState: {}
  };
  it('传入state能渲染出DynamicFilter,DynamicTable,Pagination三个组件', function() {
    const propsData = {
      state
    };
    const wrapper = shallowMount(ListViewer, {propsData});
    expect(wrapper.find('dynamic-filter-stub').is(DynamicFilter)).toBe(true);
    expect(wrapper.find('dynamic-table-stub').is(DynamicTable)).toBe(true);
    expect(wrapper.find('pagination-stub').is(Pagination)).toBe(true);
  });
  it('compute测试', function() {
    const propsData = {
      state
    };
    const wrapper = shallowMount(ListViewer, {propsData});
    expect(wrapper.vm.recordsData).toEqual([])
  });
});
