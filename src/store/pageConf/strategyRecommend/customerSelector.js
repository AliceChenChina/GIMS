
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '客户信息',
          tagName: 'el-input',
          modelName: 'customerInfo',
          props: {
            clearable: true,
            placeholder: '客户姓名/京东用户名',
            width: 200
          }
        },
        {
          labelName: '东家成交客户',
          tagName: 'el-select',
          modelName: 'djTrade',
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
      ],
      [
        {
          labelName: '是否实名',
          tagName: 'el-select',
          modelName: 'realNameFlag',
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
          labelName: '风险等级',
          tagName: 'el-select',
          modelName: 'riskLevel',
          props: {
            clearable: true,
            placeholder: ''
          },
          options: vm.statusArgsWithElOptionsTag('risk_level')
        },
        {
          labelName: '客户来源',
          tagName: 'el-select',
          modelName: 'source',
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
          labelName: '关联关系',
          tagName: 'el-select',
          modelName: 'customerRelationStatus',
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
            },
            {
              label: '绑定或专属',
              value: '3'
            }
          ]
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
                click: vm.reset
              }
            },
            {
              tagName: 'el-button',
              innerText: '添加进组',
              props: {
                type: 'primary',
                icon: 'el-icon-add'
              },
              eventOn: {
                click: vm.confirmSelection
              }
            }
          ]
        }
      ]
    ];
    return options;
  },
  filterModel: {
    customerInfo: '', // 客户信息
    djTrade: '', // 东家成交客户
    realNameFlag: '', // 是否实名
    riskLevel: '', // 风险等级
    customerRelationStatus: '3', // 关联关系
    source: '', // 客户来源
    assetStatus: '', // 资管资产证明
    privateStatus: '' // 私募资产证明
  },
  tableColumn: vm => [
    {
      label: '',
      props: {
        type: 'selection'
      }
    },
    {
      label: '京东用户名',
      dataKey: 'pinCode'
    },
    {
      label: '客户姓名',
      dataKey: 'customerName'
    },
    {
      label: '联系电话',
      dataKey: 'mobilePhone'
    },
    {
      label: '是否实名认证',
      dataKey: 'realNameFlag',
      props: {
        formatter: row => vm.$utils.getTrueOrFalse(row.realNameFlag)
      }
    },
    {
      label: '风险等级',
      dataKey: 'riskLevel',
      props: {
        formatter: row => row.riskLevel ? vm.enumArgs['risk_level'][`${row.riskLevel.toString()}`] : '-'
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
      dataKey: 'djTrade',
      props: {
        formatter: row => row.djTrade === 1 ? '是' : row.tradeFlag === 0 ? '否' : '-'
      }
    },
    {
      label: '客户来源',
      dataKey: 'source',
      props: {
        formatter: row => row.source ? vm.enumArgs['source_type'][`${row.source.toString()}`] : '-'
      }
    },
    {
      label: '关联关系',
      dataKey: 'relationType',
      props: {
        formatter: row => row.relationType === 0 ? '相关' : row.relationType === 1 ? '绑定' : row.relationType === 2 ? '专属' : '-'
      }
    }
  ]
};
