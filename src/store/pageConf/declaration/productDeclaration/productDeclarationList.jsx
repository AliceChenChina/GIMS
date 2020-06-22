 // 启动报单列表 -- 视图结构数据
export default {
  filterOptions: vm => {
    const selectOptions = [
      {
        label: 'X＜100万',
        value: '1'
      },
      {
        label: '100万≤X＜300万',
        value: '2'
      },
      {
        label: '300万≤X',
        value: '3'
      }
    ];
    const options = [
      [
        {
          labelName: '产品名称',
          tagName: 'el-input',
          modelName: 'productName',
          props: {
            clearable: true
          }
        },
        {
          labelName: '成立日期',
          tagName: 'el-date-picker',
          modelName: 'setupDateStart',
          props: {
            clearable: true,
            placeholder: '开始时间',
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'setupDateEnd',
          props: {
            clearable: true,
            placeholder: '结束时间',
            'value-format': 'yyyy-MM-dd 23:59:59'
          }
        },
        {
          labelName: '产品类型',
          tagName: 'el-select',
          modelName: 'productType',
          props: {
            clearable: true
          },
          options: vm.statusArgsWithElOptionsTag('product_type')
        },
        {
          labelName: '风险等级',
          tagName: 'el-select',
          modelName: 'riskLevel',
          props: {
            clearable: true
          },
          options: vm.statusArgsWithElOptionsTag('product_risk_level')
        }], [
        {
          labelName: '产品状态',
          tagName: 'el-select',
          modelName: 'productStatus',
          props: {
            clearable: true
          },
          options: vm.statusArgsWithElOptionsTag('product_status')
        },
        {
          labelName: '个人投资起点',
          tagName: 'el-select',
          modelName: 'minSubBalanceRange',
          props: {
            clearable: true
          },
          options: selectOptions
        },
        {
          labelName: '机构投资起点',
          tagName: 'el-select',
          modelName: 'orgMinSubBalanceRange',
          props: {
            clearable: true
          },
          options: selectOptions
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
            }
          ]
        }
      ]
    ];
    return options;
  },
  filterModel: {
    productName: '', // 产品名称
    productType: '', // 产品类型
    riskLevel: '', // 风险等级
    productStatus: '', // 产品状态
    setupDateStart: '', // 开始日期
    setupDateEnd: '', // 截止日期
    minSubBalanceRange: '', // 个人投资起点
    orgMinSubBalanceRange: '' // 机构投资起点
  },
  tableColumn: vm => [
    {
      label: '操作',
      props: {
        align: 'center',
        width: 60,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;',
              class: row.showBooking === 1 || row.showBuy === 1 ? 'able' : 'disable',
              on: {
                click: () => {
                  if (row.showBooking === 1 || row.showBuy === 1) {
                    clickEvent(row);
                  };
                  return false;
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.declaration, '报单')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '产品名称',
      dataKey: 'productName',
      props: {
        width: 200
      }
    },
    {
      label: '产品状态',
      dataKey: 'productStatus',
      props: {
        width: 140,
        formatter: row => vm.enumArgs['product_status'][`${row.productStatus.toString()}`]
      }
    },
    {
      label: '风险等级',
      props: {
        width: 120,
        formatter: row => vm.enumArgs['product_risk_level'][`${row.riskLevel.toString()}`]
      }
    },
    {
      label: '产品类型',
      dataKey: 'productType',
      props: {
        width: 100,
        formatter: row => vm.enumArgs['product_type'][`${row.productType.toString()}`]
      }
    },
    {
      label: '成立日期',
      dataKey: 'setupDate',
      props: {
        width: 140,
        formatter: row => row.setupDate ? row.setupDate.substring(0, 10) : '-'
      }
    },
    {
      label: '个人认购/追加最低金额',
      props: {
        width: 160,
        formatter: row => row.productStatus === '0' ? `${vm.$utils.number.keepInteger(row.minSubBalance)}万/${vm.$utils.number.keepInteger(row.minSubAddBalance)}万` : '-'
      }
    },
    {
      label: '机构认购/追加最低金额',
      props: {
        width: 160,
        formatter: row => {
          if (row.productStatus === '0') return '-';
          if (row.orgMinSubBalance === null || row.orgMinSubBalance === undefined) {
            if (row.orgMinSubAddBalance === null || row.orgMinSubAddBalance === undefined) {
              return '-';
            }
          }
          return `${vm.$utils.number.keepInteger(row.orgMinSubBalance)}万/${vm.$utils.number.keepInteger(row.orgMinSubAddBalance)}万`;
        }
      }
    },
    {
      label: '个人申购/追加最低金额',
      props: {
        width: 160,
        formatter: row => row.productStatus !== '0' ? `${vm.$utils.number.keepInteger(row.minPurBalance)}万/${vm.$utils.number.keepInteger(row.minPurAddBalance)}万` : '-'
      }
    },
    {
      label: '机构申购/追加最低金额',
      props: {
        width: 160,
        formatter: row => {
          if (row.productStatus !== '0') return '-';
          if (row.orgMinPurBalance === null || row.orgMinPurBalance === undefined) {
            if (row.orgMinPurAddBalance === null || row.orgMinPurAddBalance === undefined) {
              return '-';
            }
          }
          return `${vm.$utils.number.keepInteger(row.orgMinPurBalance)}万/${vm.$utils.number.keepInteger(row.orgMinPurAddBalance)}万`;
        }
      }
    },
    {
      label: '收益信息',
      props: {
        width: 220,
        formatter: row => {
          const h = vm.$createElement;
          let label;
          let val;
          if (row.productType === 'equity') {
            val = (row.investmentTrends ? row.investmentTrends : '-');
            label = '投资方向';
          };
          if (row.productType === 'secondary_market') {
            val = (row.netValue ? vm.$utils.number.keepFourDecimal(row.netValue) : row.netValue === 0 ? '0.0000' : '-');
            label = '单位净值';
          };
          if (row.productType === 'fixed_income') {
            if (row.incomeType === 1) {
              label = '业绩比较基准';
            }
            if (row.incomeType === 2) {
              label = '近七日年化';
            }
            if (row.incomeType === 3) {
              label = '预期年化';
            }
            val = vm.$utils.emptyableValue(row.incomeValue);
            if (row.incomeType !== 1 && row.incomeType !== 2 && row.incomeType !== 3) {
              label = '-';
               val = '-';
            }
          };
          return (
            <div>
              <span class="spanLeft">{ label }</span>|<span class="spanRight">{ val }</span>
            </div>
          );
        }
      }
    }
  ]
};
