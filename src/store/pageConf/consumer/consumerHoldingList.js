
import utils from '@/utils';
const setFaultVal = function(val) {
    if (val === -9999 || val === null) {
      return '处理中';
    }
    if (val === 0) return '0.00';
    return utils.number.formatMoney(val, 2, 0);
  };
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '京东用户名',
          tagName: 'el-input',
          modelName: 'customerInfo',
          props: {
            clearable: true,
            placeholder: '请输入京东用户名，多个用空格隔开'
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
                icon: 'el-icon-refresh-right'
              },
              eventOn: {
                click: vm.doDefaultReset
              }
            },
            {
              tagName: 'el-button',
              innerText: '导出excel',
              props: {
                icon: 'el-icon-refresh-right'
              },
              eventOn: {
                click: vm.doExport
              }
            }
          ]
        }
      ]
    ];
    return options;
  },
  filterModel: {
    customerInfo: ''
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 100,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          return (
            <div>
              <el-button type="text" size="mini" onClick={ () => { vm.check(row); } }>查看</el-button>
            </div>
          );
        }
      }
    },
    {
      label: '客户姓名',
      dataKey: 'customerName',
      props: {
        width: 120,
        align: 'center'
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
      label: '归属理财师',
      dataKey: 'salesName',
      props: {
        width: 120
      }
    },
    {
      label: '关联关系',
      dataKey: 'relationship',
      props: {
        width: 100
      }
    },
    {
      label: '总资产',
      dataKey: 'totalAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.totalAssets);
        }
      }
    },
    {
      label: '高端理财',
      dataKey: 'gdlcAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.gdlcAssets);
        }
      }
    },
    {
      label: '东家保险',
      dataKey: 'djbxAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.djbxAssets);
        }
      }
    },
    {
      label: '海外房产',
      dataKey: 'hwfcAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.hwfcAssets);
        }
      }
    },
    {
      label: '小金库',
      dataKey: 'xjkAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.xjkAssets);
        }
      }
    },
    {
      label: '基金',
      dataKey: 'fundAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.fundAssets);
        }
      }
    },
    {
      label: '银行＋',
      dataKey: 'bankPlusAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.bankPlusAssets);
        }
      }
    },
    {
      label: '小金保',
      dataKey: 'xjbAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.xjbAssets);
        }
      }
    },
    {
      label: '定期',
      dataKey: 'dqAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.dqAssets);
        }
      }
    },
    {
      label: '黄金',
      dataKey: 'goldAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.goldAssets);
        }
      }
    },
    {
      label: '工银小白',
      dataKey: 'gyxbAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.gyxbAssets);
        }
      }
    },
    {
      label: '小白精选',
      dataKey: 'xbjxAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.xbjxAssets);
        }
      }
    },
    {
      label: '京东智投',
      dataKey: 'jdztAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.jdztAssets);
        }
      }
    },
    {
      label: '京东钱包',
      dataKey: 'jdqbAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.jdqbAssets);
        }
      }
    },
    {
      label: '网贷',
      dataKey: 'wdAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.wdAssets);
        }
      }
    },
    {
      label: '民生金',
      dataKey: 'msjAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.msjAssets);
        }
      }
    }, {
      label: '妈妈理财',
      dataKey: 'mmlcAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.mmlcAssets);
        }
      }
    }, {
      label: '小爱梦想',
      dataKey: 'xamxAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.xamxAssets);
        }
      }
    },
    {
      label: '中产理财',
      dataKey: 'zclcAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.zclcAssets);
        }
      }
    },
    {
      label: '小金卡',
      dataKey: 'xjCardAssets',
      props: {
        width: 120,
        align: 'right',
        formatter(row) {
          return setFaultVal(row.xjCardAssets);
        }
      }
    }
  ]
};
