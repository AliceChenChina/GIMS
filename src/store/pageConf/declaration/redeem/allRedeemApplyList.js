// 报单管理--赎回申请审核列表，视图结构数据
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '产品简称',
          tagName: 'el-input',
          modelName: 'productNameShort',
          props: {
            clearable: true,
            placeholder: ''
          }
        },
        {
          labelName: '客户名称',
          tagName: 'el-input',
          modelName: 'customerName',
          props: {
            clearable: true,
            placeholder: ''
          }
        },
        {
          labelName: '订单状态',
          tagName: 'el-select',
          modelName: 'statusStrs',
          props: {
            clearable: true,
            placeholder: '报单状态',
            multiple: true,
            filterable: true,
            'collapse-tags': true
          },
          options: vm.statusArgsWithElOptionsTag('trade_indent_status')
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
                click: vm.doReset
              }
            }
          ]
        }
      ]
    ];
    return options;
  },
  filterModel: {
    productNameShort: '', // 产品简称
    customerName: '', // 客户名称
    statusStrs: '' // 订单状态
  },
  tableColumn: vm => [
    {
      label: '操作',
      props: {
        align: 'center',
        width: 130,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          let btnText = '补录份额';
          row.btnName = 2;
          if (row.productDto.isProxy !== 1) {
            if (row.status === 12) {
              btnText = '补录份额';
            }
            if (row.status === 3) {
              row.btnName = 1;
              btnText = '编辑份额';
            }
          }
          const getClass = (row, text) => {
            if (text === '退单') {
              if (row.productDto.isProxy !== 1) {
                if (row.status === 2 || row.status === 12) {
                  return 'able';
                }
              }
              return 'disable';
            };
            if (text === '补录份额') {
              if (row.productDto.isProxy !== 1) {
                if (row.status === 12) {
                  return 'able';
                }
              }
              return 'disable';
            };
            if (text === '编辑份额') {
              if (row.productDto.isProxy !== 1) {
                if (row.status === 3 && row.productType === 'secondary_market') {
                  return 'able';
                }
              }
              return 'disable';
            };
          };
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;',
              class: getClass(row, text),
              on: {
                click: () => {
                  if (text === '退单') {
                    if (row.productDto.isProxy !== 1) {
                      if (row.status === 2 || row.status === 12) {
                        clickEvent(row);
                        return true;
                      }
                    }
                    return false;
                  };
                  if (text === '补录份额') {
                    if (row.productDto.isProxy !== 1) {
                      if (row.status === 12) {
                        clickEvent(row);
                        return true;
                      }
                    }
                    return false;
                  };
                  if (text === '编辑份额') {
                    if (row.productDto.isProxy !== 1) {
                      if (row.status === 3 && row.productType === 'secondary_market') {
                        clickEvent(row);
                        return true;
                      }
                    }
                    return false;
                  };
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.editShare, btnText),
            getHref(vm.chargeBack, '退单')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '赎回报单编号',
      dataKey: 'tradeId',
      props: {
        width: 200
      }
    },
    {
      label: '客户名称',
      dataKey: 'customerName',
      props: {
        width: 100
      }
    },
    {
      label: '产品简称',
      dataKey: 'productDto',
      props: {
        width: 140,
        formatter: row => row.productDto ? row.productDto.productNameShort || '-' : '-'
      }
    },
    {
      label: '产品是否代销',
      props: {
        width: 100,
        formatter: row => row.productDto ? row.productDto.isProxy === 1 ? '是' : '否' : '-'
      }
    },
    {
      label: '赎回份额(份)',
      dataKey: 'redeemShare',
      props: {
        align: 'right',
        width: 140,
        // formatter: (row) => row.$utils.number.toDecimal(row.nav, 4)
        formatter: row => row.redeemShare ? vm.$utils.number.formatMoney(row.redeemShare, 2, false) : '-'
      }
    },
    {
      label: '确认份额',
      props: {
        align: 'right',
        width: 120,
        formatter: row => row.tradeType && row.tradeType === '30' ? vm.$utils.number.formatMoney(row.confirmShare, 2, 0) : row.confirmShare
      }
    },
    {
      label: '确认净值',
      props: {
        align: 'right',
        width: 120,
        formatter: row => row.productType === 'secondary_market' ? vm.$utils.number.keepFourDecimal(row.confirmNav) : '1.0000'
      }
    },
    {
      label: '报单时间',
      dataKey: 'createdTime',
      props: {
        width: 150
      }
    },
    {
      label: '订单状态',
      dataKey: 'status',
      props: {
        width: 100,
        formatter: row => vm.enumArgs['trade_indent_status'][`${row.status.toString()}`]
      }
    },
    {
      label: '确认金额(元)',
      props: {
        align: 'right',
        width: 100,
        formatter: row => row.confirmAmount ? vm.$utils.number.formatMoney(row.confirmAmount, 2, false) : '-'
      }
    },
    {
      label: '确认日期',
      props: {
        width: 150,
        formatter: row => row.confirmTime ? row.confirmTime.substring(0, 10) : '-'
      }
    }
  ]
};
