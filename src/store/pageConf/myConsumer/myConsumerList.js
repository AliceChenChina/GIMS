
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
            placeholder: '客户姓名/京东用户名'
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
          labelName: '关联关系',
          tagName: 'el-select',
          modelName: 'customerRelationStatus',
          props: {
            clearable: true,
            placeholder: ''
          },
          options: [
            {
              label: '相关',
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
                click: vm.doDefaultReset
              }
            }
          ]
        }
      ],
      [
        {
          labelName: '相关权限',
          tagName: 'el-select',
          modelName: 'relaAuth',
          props: {
            clearable: true
          },
          options: vm.statusArgsWithElOptionsTag('rela_auth_type')
        },
        {
          labelName: '分配时间',
          tagName: 'el-date-picker',
          modelName: 'assignTimeStart',
          props: {
            clearable: true,
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'assignTimeEnd',
          props: {
            clearable: true,
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
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
        }
      ]
    ];
    return options;
  },
  filterModel: {
    customerInfo: '', // 客户信息
    djTrade: '', // 东家成交客户
    customerRelationStatus: '', // 关联关系
    source: '', // 客户来源
    relaAuth: '', // 相关权限
    assignTimeStart: '', // 创建时间
    assignTimeEnd: '', // 创建时间
    assetStatus: '', // 资管资产证明
    privateStatus: '' // 私募资产证明
  },
  tableColumn: vm => [
    {
      label: '操作',
      props: {
        align: 'center',
        width: 200,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;cursor:pointer;color:#EB5954',
              on: {
                click: () => {
                  clickEvent(row);
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.check, '查看'),
            getHref(vm.edit, '编辑'),
            getHref(vm.getCustomerComplianceInfo, '去合规')
          ];
          return vm.$createElement('div', {}, links);
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
          const { currentPageNo, pageSize } = vm.paginationState;
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
      label: '联系人',
      dataKey: 'contact',
      props: {
        width: 150
      }
    },
    {
      label: '联系方式',
      dataKey: 'mobilePhone',
      props: {
        width: 120
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
      dataKey: 'phone',
      props: {
        width: 120
      }
    },
    {
      label: '客户类型',
      dataKey: 'customerType',
      props: {
        width: 120,
        formatter: row => row.customerType ? vm.enumArgs['user_type'][`${row.customerType.toString()}`] : '-'
      }
    },
    {
      label: '是否实名认证',
      dataKey: 'realNameFlag',
      props: {
        width: 160,
        formatter: row => row.realNameFlag === 1 ? '是' : row.realNameFlag === 0 ? '否' : '-'
      }
    },
    {
      label: '风险等级',
      dataKey: 'riskLevel',
      props: {
        width: 120,
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
        width: 100,
        formatter: row => row.djTrade === 1 ? '是' : row.tradeFlag === 0 ? '否' : '-'
      }
    },
    {
      label: '客户来源',
      dataKey: 'source',
      props: {
        width: 120,
        formatter: row => row.source ? vm.enumArgs['source_type'][`${row.source.toString()}`] : '-'
      }
    },
    {
      label: '关联关系',
      dataKey: 'relationType',
      props: {
        width: 140,
        formatter: row => row.relationType === 0 ? '相关' : row.relationType === 1 ? '绑定' : row.relationType === 2 ? '专属' : '-'
      }
    },
    {
      label: '相关权限',
      dataKey: 'relaAuth',
      props: {
        width: 140,
        formatter: row => row.relaAuth ? vm.enumArgs['rela_auth_type'][`${row.relaAuth.toString()}`] : '-'
      }
    },
    {
      label: '分配时间',
      dataKey: 'assignTime',
      props: {
        width: 160
      }
    }
  ]
};
