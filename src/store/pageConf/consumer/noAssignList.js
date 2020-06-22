/*
赎回直销订单页面设置
 */
export default {
  filterOptions: {},
  filterOptionsBase(vm) {
    return [
      [
        {
          labelName: '客户信息',
          tagName: 'el-input',
          modelName: 'userInfo',
          props: {
            clearable: true,
            placeholder: '客户姓名/京东用户名'
          }
        },
        {
        labelName: '东家成交客户',
        tagName: 'el-select',
        modelName: 'tradeFlag',
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
          labelName: '是否黑金',
          tagName: 'el-select',
          modelName: 'heijinFlag',
          props: {
            clearable: true,
            placeholder: '是否黑金'
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
          labelName: '原理财师',
          tagName: 'el-input',
          modelName: 'formerPlanner',
          props: {
            clearable: true,
            placeholder: '客户姓名'
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
      ]
    ];
  },
  filterOptionsMore: [
    [
      {
        labelName: '待分配原因',
        tagName: 'el-select',
        modelName: 'pendingAllocationReason',
        props: {
          clearable: true,
          placeholder: '待分配原因'
        },
        options: [
          {
            label: '成单无跟进',
            value: '1'
          },
          {
            label: '预约无跟进',
            value: '2'
          },
          {
            label: '自动回收',
            value: '3'
          },
          {
            label: '人工回收',
            value: '4'
          },
          {
            label: '离职回收',
            value: '5'
          },
          {
            label: '无跟进',
            value: '6'
          },
          {
            label: '资产认证无跟进',
            value: '7'
          },
          {
            label: '在线客服',
            value: '8'
          },
          {
            label: '京音回收',
            value: '9'
          }
        ]
      },
      {
        labelName: '未分配天数',
        tagName: 'el-input',
        modelName: 'unAllocationDays',
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '待分配时间',
        tagName: 'el-date-picker',
        modelName: 'pendingAllocationStartTime',
        props: {
          clearable: true,
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'pendingAllocationEndTime',
        props: {
          clearable: true,
          placeholder: '结束时间',
          'value-format': 'yyyy-MM-dd 23:59:59'
        }
      }
    ],
    [
      {
        labelName: '私募资产证明',
        tagName: 'el-select',
        modelName: 'privateStatus',
        props: {
          clearable: true,
          placeholder: '请选择'
        },
        options: [
          {
            label: '未认证',
            value: '0'
          },
          {
            label: '已认证',
            value: '1'
          },
          {
            label: '已过期',
            value: '2'
          }
        ]
      },
      {
        labelName: '资管资产证明',
        tagName: 'el-select',
        modelName: 'assetStatus',
        props: {
          clearable: true,
          placeholder: '请选择'
        },
        options: [
          {
            label: '未认证',
            value: '0'
          },
          {
            label: '已认证',
            value: '1'
          },
          {
            label: '已过期',
            value: '2'
          }
        ]
      }
    ]
  ],
  filterModel: {
    userInfo: '', // 客户信息
    tradeFlag: '', // 东家成交客户
    heijinFlag: '', // 是否黑金
    formerPlanner: '', // 原理财师
    unAllocationDays: '', // 未分配天数
    pendingAllocationReason: '', // 待分配原因
    pendingAllocationStartTime: '', // 待分配开始时间
    pendingAllocationEndTime: '', // 待分配结束时间
    assetStatus: '', // 资管资产证明
    privateStatus: '' // 私募资产证明
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 85,
        fixed: 'right'
      },
      slotComps: [
        {
          tagName: 'el-button',
          innerText: '查看',
          props: {
            type: 'text',
            size: 'mini'
          },
          eventOn(scope) {
            return {
              click() {
                vm.gotoConsumerDetail(scope.row,'noAssignList');
              }
            };
          }
        },
        {
          tagName: 'el-button',
          innerText: '分配',
          props: {
            type: 'text',
            size: 'mini'
          },
          eventOn(scope) {
            return {
              click() {
                vm.allocateCustomer(scope.row);
              }
            };
          }
        }
      ]
    },
    {
      label: '序号',
      dataKey: '',
      props: {
        width: 60,
        align: 'left',
        formatter: (row, column, cellValue, index) => {
          const { currentPageNo, pageSize } = vm.getPaginationState();
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '客户姓名',
      dataKey: 'userName',
      props: {
        width: 150
      }
    },
    {
      label: '京东用户名',
      dataKey: 'userPin',
      props: {
        width: 160
      }
    },
    {
      label: '客户手机号',
      dataKey: 'mobile',
      props: {
        width: 120
      }
    },
    {
      label: '号码所在地',
      dataKey: 'mobileAddress',
      props: {
        width: 120
      }
    },
    {
      label: '是否黑金',
      dataKey: 'heijinFlag',
      props: {
        width: 90
      }
    },
    {
      label: '客户类型',
      dataKey: 'userType',
      props: {
      }
    },
    {
      label: '是否实名认证',
      dataKey: 'realNameFlag',
      props: {
      }
    },
    {
      label: '风险等级',
      dataKey: 'riskLevel',
      props: {
        width: 100
      }
    },
    {
      label: '私募资产证明',
      dataKey: 'privateStatusStr',
      props: {
        width: 100
      }
    },
    {
      label: '资管资产证明',
      dataKey: 'assetStatusStr',
      props: {
        width: 100
      }
    },
    {
      label: '东家成交客户',
      dataKey: 'tradeFlag',
      props: {
        width: 120
      }
    },
    {
      label: '原理财师',
      dataKey: 'formerPlanner',
      props: {
        width: 100
      }
    },
    {
      label: '待分配原因',
      dataKey: 'pendingAllocationReason',
      props: {
      }
    },
    {
      label: '待分配时间',
      dataKey: 'pendingAllocationTime',
      props: {
        width: 150
      }
    },
    {
      label: '未分配天数',
      dataKey: 'unAllocationDays',
      props: {
      }
    }
  ]
};
