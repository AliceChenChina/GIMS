
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
            size: 'small'
          }
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
      ]
    ];
    return options;
  },
  filterModel: {
    customerInfo: '', // 客户信息
    customerRelationStatus: '3', // 关联关系
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 200,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          return (
            <div>
              <el-button type="text" size="mini" onClick={ () => { vm.select(row); } }>选择</el-button>
            </div>
          );
        }
      }
    },
    {
      label: '京东用户名',
      dataKey: 'pinCode',
      props: {
        width: 140
      }
    },
    {
      label: '客户姓名',
      dataKey: 'customerName'
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
      label: '风险等级',
      dataKey: 'riskLevel',
      props: {
        formatter: row => row.riskLevel ? vm.enumArgs['risk_level'][`${row.riskLevel.toString()}`] : '-'
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
