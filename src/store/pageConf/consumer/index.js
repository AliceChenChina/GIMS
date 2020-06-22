import consumerList from './consumerList';
import visitList from './visitList';
import noAssignList from './noAssignList';

/*
包装类，添加公用筛选器属性（客户列表和跟进情况）
 */
const stateFactory = (state) => {
  // 需要返回一个新函数，如果直接通过工厂函数修改数据，vue没办法跟踪工厂函数内部数据的变化，导致无法更新视图
  state.filterOptions = (vm) => {
    // 第一行
    let firstRow = [
      {
        labelName: '客户信息',
        tagName: 'el-input',
        modelName: 'customerInfo',
        props: {
          clearable: true,
          placeholder: '客户姓名/京东用户名'
        }
      },
      {
        labelName: '东家成交客户',
        tagName: 'el-select',
        modelName: 'isDjTrade',
        props: {
          clearable: true,
          placeholder: ''
        },
        options: [
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ]
      },
      {
        labelName: '理财师姓名',
        tagName: 'el-input',
        modelName: 'salesName',
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '',
        tagName: 'el-button-group',
        slotComps: [
          {
            tagName: 'el-button',
            innerText: '高级筛选',
            props: {
              icon: 'el-icon-arrow-down'
            },
            eventOn: {
              click: vm.switchFilter // 显示高级筛选按钮
            }
          },
          {
            tagName: 'el-button',
            innerText: '查询',
            props: {
              type: 'primary',
              icon: 'el-icon-search'
            },
            eventOn: {
              click: vm.doQuery
            }
          },
          {
            tagName: 'el-button',
            innerText: '重置',
            props: {
              icon: 'el-icon-refresh-left'
            },
            eventOn: {
              click: vm.doDefaultReset

            }
          }
        ]
      }
    ];
    if (state === noAssignList) {
      // 待分配列表不用公用的firstRow
      firstRow = state.filterOptionsBase(vm)[0];
    } else if (state === consumerList) {
      // 客户列表
      firstRow.splice(2, 0, {
        labelName: '客户初始来源',
          tagName: 'el-select',
          modelName: 'source',
          props: {
          clearable: true,
            placeholder: ''
        },
        options: [
          {
            label: '公司获取',
            value: '1'
          },
          {
            label: '非公司获取',
            value: '0'
          }
        ]
      });
    } else {
      // 待分配客户列表
      firstRow.splice(2, 0, {
        labelName: '是否显示虚拟理财师客户',
        tagName: 'el-select',
        modelName: 'showInventedPlanner',
        props: {
          clearable: true,
          placeholder: ''
        },
        options: [
          {
            label: '显示',
            value: '1'
          },
          {
            label: '不显示',
            value: '0'
          }
        ]
      });
    }
    if (vm.hasmore) {
      firstRow[4].slotComps[0].props.icon = 'el-icon-arrow-up';
      // 需要进行对象拷贝不然可能会出现无法修改绑定值问题
      return [firstRow, vm.$utils.jsonClone(state.filterOptionsMore[0]), vm.$utils.jsonClone(state.filterOptionsMore[1])]; // 展开公用基础选项和更多
    }
    firstRow[4].slotComps[0].props.icon = 'el-icon-arrow-down';
    return [firstRow]; // 展开公用基础选项
  };
  return state;
};

export default {
  consumerList,
  visitList,
  noAssignList,
  stateFactory
};
