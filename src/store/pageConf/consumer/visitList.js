/*
赎回直销订单页面设置
高级选项通过base设定
 */
export default {
  filterOptions: {},
  filterOptionsMore: [
    [
      {
        labelName: '关联关系',
        tagName: 'el-select',
        modelName: 'relationship',
        props: {
          clearable: true,
          placeholder: ''
        },
        options: [
          {
            label: '绑定',
            value: '1'
          },
          {
            label: '专属',
            value: '2'
          }
        ]
      },
      {
        labelName: '客户来源',
        tagName: 'el-select',
        modelName: 'customerFrom',
        props: {
          clearable: true,
          placeholder: ''
        },
        options: [
          {
            label: '自行拓客',
            value: '1'
          },
          {
            label: '老客推荐',
            value: '2'
          },
          {
            label: '公司分配',
            value: '3'
          }
        ]
      },
      {
        labelName: '分配天数',
        tagName: 'el-input',
        modelName: 'followDateLength',
        props: {
          clearable: true,
          placeholder: '分配天数'
        }
      },
      {
        labelName: '分配时间',
        tagName: 'el-date-picker',
        modelName: 'createdTimeStart',
        props: {
          clearable: true,
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'createdTimeEnd',
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
    customerInfo: '', // 客户信息
    isDjTrade: '', // 东家成交客户
    salesName: '', // 理财师姓名
    relationship: '', // 关联关系
    customerFrom: '', // 客户来源
    showInventedPlanner: '', // 是否显示虚拟理财师客户
    followDateLength: '', // 跟进天数
    createdTimeStart: '', // 分配时间开始时间
    createdTimeEnd: '', // 分配时间结束时间
    assetStatus: '', // 资管资产证明
    privateStatus: '' // 私募资产证明
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 120,
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
                vm.gotoConsumerDetail(scope.row,'visitList');
              }
            };
          }
        },
        {
          tagName: 'el-button',
          innerText: '转分配',
          props: {
            type: 'text',
            size: 'mini'
          },
          eventOn(scope) {
            return {
              click() {
                vm.recycleAndAllocateCustomer(scope.row);
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
      dataKey: 'customerName',
      props: {
        width: 150
      }
    },
    {
      label: '京东用户名',
      dataKey: 'pinCode',
      props: {
        width: 160
      }
    },
    {
      label: '客户手机号',
      dataKey: 'mobilephone',
      props: {
        width: 120
      }
    },
    {
      label: '客户类型',
      dataKey: 'customerTypeStr',
      props: {
        width: 100
      }
    },
    {
      label: '是否实名认证',
      dataKey: 'realNameFlagStr',
      props: {
        width: 100
      }
    },
    {
      label: '风险等级',
      dataKey: 'riskLevelStr',
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
      dataKey: 'djTradeFlagStr',
      props: {
        width: 100
      }
    },
    {
      label: '理财师姓名',
      dataKey: 'salesName',
      props: {
        width: 100,
        align: 'left'
      }
    },
    {
      label: '关联关系',
      dataKey: 'relationshipStr',
      props: {
        width: 100,
        align: 'left'
      }
    },
    {
      label: '客户来源',
      dataKey: 'customerFromStr',
      props: {
        width: 100
      }
    },
    {
      label: '分配时间',
      dataKey: 'createdTime',
      props: {
        width: 150
      }
    },
    {
      label: '分配天数',
      dataKey: 'followDateLength',
      props: {
        width: 100
      }
    }
  ]
};
