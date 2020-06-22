// 报单管理--赎回申请审核列表，视图结构数据
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
            placeholder: '客户名称'
          }
        },
        {
          labelName: '产品简称',
          tagName: 'el-input',
          modelName: 'productNameShort',
          props: {
            clearable: true,
            placeholder: '产品简称'
          }
        },
        {
          labelName: '理财师',
          tagName: 'el-input',
          modelName: 'salesName',
          props: {
            clearable: true,
            placeholder: '理财师'
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
          labelName: '报单时间',
          tagName: 'el-date-picker',
          modelName: 'bookingTimeStart',
          props: {
            clearable: true,
            placeholder: '开始时间',
            'value-format': 'yyyy-MM-dd 00:00:00',
            style: 'max-width:170px'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'bookingTimeEnd',
          props: {
            clearable: true,
            placeholder: '结束时间',
            'value-format': 'yyyy-MM-dd 23:59:59',
            style: 'max-width:170px'
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
      statusStrs: [], // 单状态
      bookingTimeStart: '', // 查询开始时间
      bookingTimeEnd: '', // 查询结证件束时间
      bookingWay: '' // 报单方式
  },
  tableColumn: vm => [
    {
      label: '操作',
      props: {
        align: 'center',
        fixed: 'right',
        width: 140,
        formatter: (row, column, cellValue, index) => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;',
              class: row.status === 1 ? text === '审核' ? 'able' : 'disable' : (text === '审核' ? 'disable' : 'able'),
              on: {
                click: () => {
                  if (row.status === 1) {
                    if (text === '审核') {
                      clickEvent(row);
                    } else {
                      return false;
                    }
                  }
                  if (text === '审核') {
                    return false;
                  }
                  clickEvent(row);
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.auditDeclaration, '审核'),
            getHref(vm.exportReport, '生成喜报')
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
      dataKey: 'customerName',
      props: {
        width: 140
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
      label: '产品是否代销',
      props: {
        width: 100,
        formatter: row => row.productDto ? row.productDto.isProxy === 1 ? '是' : '否' : '-'
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
        formatter: row => vm.$utils.number.formatMoney(row.bookingBalance, 2, false)
      }
    },
    {
      label: '费用(元)',
      props: {
        width: 120,
        align: 'right',
        formatter: row => vm.$utils.number.formatMoney(row.feeBalance, 2, false)
      }
    },
    {
      label: '汇款金额(元)',
      props: {
        width: 120,
        align: 'right',
        formatter: row => vm.$utils.number.formatMoney(row.paymentBlance, 2, false)
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
      label: '证件类型',
      props: {
        formatter: row => row.customerRealNameDto ? row.customerRealNameDto.identification ? vm.enumArgs['identity_type_jd'][`${row.customerRealNameDto.identification.toString()}`] : '-' : '-'
      }
    },
    {
      label: '证件号码',
      props: {
        width: 150,
        formatter: row => row.customerRealNameDto ? row.customerRealNameDto.identificationNo || '-' : '-'
      }
    },
    {
      label: '银行开户行',
      dataKey: 'bankBranch',
      props: {
        width: 180
      }
    },
    {
      label: '银行账号',
      dataKey: 'bankAccount',
      props: {
        width: 160
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
      label: '审核人',
      dataKey: 'auditorName',
      props: {
        width: 120
      }
    },
    {
      label: '审核时间',
      dataKey: 'auditTime',
      props: {
        width: 150
      }
    }
  ]
};
