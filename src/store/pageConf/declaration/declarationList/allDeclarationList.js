 // 报单管理--全部报单列表，视图结构数据
export default {
  filterOptions: vm => {
    const options = [
      [
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
          labelName: '产品简称',
          tagName: 'el-input',
          modelName: 'productNameShort',
          props: {
            clearable: true,
            placeholder: ''
          }
        },
        {
          labelName: '理财师',
          tagName: 'el-input',
          modelName: 'salesName',
          props: {
            clearable: true,
            placeholder: ''
          }
        },
        {
          labelName: '报单方式',
          tagName: 'el-select',
          modelName: 'bookingWay',
          props: {
            clearable: true,
            placeholder: '报单方式'
          },
          options: vm.statusArgsWithElOptionsTag('booking_way')
        }
      ],
      [
        {
          labelName: '报单状态',
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
    customerName: '', // 客户名称
    productNameShort: '', // 产品简称
    salesName: '', // 理财师
    statusStrs: '', // 单状态
    bookingWay: '' // 报单方式
  },
  tableColumn: vm => [
    {
      label: '操作',
      props: {
        align: 'center',
        fixed: 'right',
        width: 200,
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
            if (text === '查看') {
              return 'able';
            };
            if (text === '退单') {
              if (row.productDto.isProxy !== 1) {
                if (row.status === 2 || row.status === 11 || row.status === 12) {
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
                if (row.status === 3 && row.editFlag === 1) {
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
                  if (text === '查看') {
                    clickEvent(row);
                    return true;
                  };
                  if (text === '退单') {
                    if (row.productDto.isProxy !== 1) {
                      if (row.status === 2 || row.status === 11 || row.status === 12) {
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
                      if (row.status === 3 && row.editFlag === 1) {
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
            getHref(vm.chargeBack, '退单'),
            getHref(vm.check, '查看')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '报单编号',
      dataKey: 'tradeId',
      props: {
        width: 140
      }
    },
    {
      label: '集团订单编号',
      dataKey: 'groupTradeId',
      props: {
        width: 140
      }
    },
    {
      label: '客户名称',
      props: {
        width: 120,
        formatter: row => row.customerRealNameDto ? row.customerRealNameDto.customerName || '-' : '-'
      }
    },
    {
      label: '客户来源',
      dataKey: 'salesSourceStr',
      props: {
        width: 100
      }
    },
    {
      label: '产品简称',
      props: {
        width: 140,
        formatter: row => row.productDto ? row.productDto.productNameShort || '-' : '-'
      }
    },
    {
      label: '报单方式',
      props: {
        width: 100,
        formatter: row => vm.enumArgs['booking_way'][`${row.bookingWay.toString()}`]
      }
    },
    {
      label: '报单金额（元）',
      props: {
        width: 120,
        align: 'right',
        formatter: row => {
          return vm.$utils.emptyableValue(row.bookingBalance, (val) => {
            return vm.$utils.number.formatMoney(val, 2, false);
          });
        }
      }
    },
    {
      label: '报单时间',
      dataKey: 'bookingTime',
      props: {
        width: 150
      }
    },
    {
      label: '报单状态',
      props: {
        width: 120,
        formatter: row => vm.enumArgs['trade_indent_status'][`${row.status.toString()}`]
      }
    },
    {
      label: '理财师',
      dataKey: 'salesName',
      props: {
        width: 100
      }
    },
    {
      label: '分享理财师',
      dataKey: 'shareInfo',
      props: {
        width: 100
      }
    },
    {
      label: '确认份额',
      props: {
        width: 120,
        align: 'right',
        formatter: row => row.tradeType && row.tradeType === '30' ? vm.$utils.number.formatMoney(row.confirmAmount, 2, 0) : vm.$utils.number.formatMoney(row.confirmShare, 2, false)
      }
    },
    {
      label: '确认净值',
      props: {
        width: 120,
        align: 'right',
        formatter: row => row.productType === 'secondary_market' ? vm.$utils.number.keepFourDecimal(row.confirmNav) : '1.0000'
      }
    },
    {
      label: '份额确认日期',
      dataKey: 'confirmTime',
      props: {
        width: 160
      }
    }
  ]
};
