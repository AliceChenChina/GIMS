/*
客户列表界面
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
            label: '-',
            value: '0'
          },
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
          },
          {
            label: '-',
            value: '4'
          }
        ]
      },
      {
        labelName: '首次触达时间',
        tagName: 'el-date-picker',
        modelName: 'arriveTimeStart',
        props: {
          clearable: true,
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'arriveTimeEnd',
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
      },
      {
        labelName: '是否成单',
        tagName: 'el-select',
        modelName: 'tradeFlag',
        props: {
          clearable: true,
          placeholder: '请选择'
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
      }
    ]
  ],
  filterModel: {
    customerInfo: '', // 客户信息
    isDjTrade: '', // 东家成交客户
    source: '', // 客户初始来源
    salesName: '', // 绑定理财师
    relationship: '', // 关联关系
    customerFrom: '', // 客户来源
    arriveTimeStart: '', // 首次触达时间开始
    arriveTimeEnd: '', // 首次触达时间结束
    assetStatus: '', // 资管资产证明
    privateStatus: '', // 私募资产证明
    tradeFlag: '' // 是否成单
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 280,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          return (
            <div>
              <el-button type="text" size="mini" onClick={ () => { vm.gotoConsumerDetail(row,'myConsumerList'); } }>查看</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.editConsumer(row); } }>编辑</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.getCustomerComplianceInfo(row.customerId); } }>去合规</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.gimsCallback(row); } }>GIMS回收</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.gimsAllocate(row); } }>GIMS分配</el-button>
            </div>
          );
        }
      }
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
      label: '京东用户名',
      dataKey: 'pinCode',
      props: {
        width: 160
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
      label: '是否成单',
      dataKey: 'tradeFlagStr',
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
      label: '客户初始来源',
      dataKey: 'sourceStr',
      props: {
        width: 100
      }
    },
    {
      label: '理财师姓名',
      dataKey: 'salesName',
      props: {
      }
    },
    {
      label: '关联关系',
      dataKey: 'relationshipStr',
      props: {
      }
    },
    {
      label: '客户来源',
      dataKey: 'customerFromStr',
      props: {
      }
    },
    {
      label: '首次触达时间',
      dataKey: 'arriveTime',
      props: {
        width: 146
      }
    }
  ]
};
