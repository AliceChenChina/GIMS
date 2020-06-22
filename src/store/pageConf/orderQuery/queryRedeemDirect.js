/*
赎回直销订单页面设置
 */
const argGroupKey = 'trade_indent_status';
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '订单编号',
          tagName: 'el-input',
          modelName: 'groupTradeId',
          dataKey: 'groupTradeId',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            clearable: true,
            placeholder: '订单编号'
          }
        },
        {
          labelName: '报单编号',
          tagName: 'el-input',
          modelName: 'tradeId',
          dataKey: 'tradeId',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            clearable: true,
            placeholder: '报单编号'
          }
        },
        {
          labelName: '产品信息',
          tagName: 'el-input',
          modelName: 'productInfo',
          dataKey: 'productName,productNameShort',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            clearable: true,
            placeholder: '产品名称、产品简称'
          }
        },
        {
          labelName: '客户名称',
          tagName: 'el-input',
          modelName: 'customerName',
          dataKey: 'customerName',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            clearable: true,
            placeholder: '客户名称'
          }
        }
      ],
      [
        {
          labelName: '京东用户名',
          tagName: 'el-input',
          modelName: 'pinCode',
          dataKey: 'pinCode',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            clearable: true,
            placeholder: '京东用户名'
          }
        },
        {
          labelName: '订单状态',
          tagName: 'el-select',
          modelName: 'statusStrs',
          dataKey: 'status',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            clearable: true,
            placeholder: '订单状态',
            'collapse-tags': true,
            multiple: true,
            filterable: true
          },
          options: vm.statusArgsWithElOptionsTag(argGroupKey)
        },
        {
          labelName: '产品销售类型',
          tagName: 'el-select',
          modelName: 'productSaleType',
          dataKey: 'productSaleType',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('product_sales_type')
        }
      ],
      [
        {
          labelName: '下单时间',
          tagName: 'el-date-picker',
          modelName: 'bookingTimeStart',
          dataKey: 'applyTime',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            placeholder: '开始时间',
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'bookingTimeEnd',
          dataKey: 'applyTime',
          powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
          props: {
            placeholder: '结束时间',
            'value-format': 'yyyy-MM-dd 00:00:00'
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
                click: vm.doExportOrder
              }
            },
            {
              tagName: 'el-button',
              innerText: '导出excel',
              props: {
                icon: 'el-icon-document'
              },
              eventOn: {
                click: vm.doExport
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    productInfo: '', // 产品名称
    groupTradeId: '', // 订单编号
    tradeId: '', // 报单编号
    customerName: '', // 客户名称
    pinCode: '', // 京东用户名
    statusStrs: '',
    orderColumn: '',
    order: '',
    tradeType: '30',
    bookingTimeStart: '', // 下单开始时间
    bookingTimeEnd: '', // 下单开始时间
    type: 6,
    productSaleType: ''
  },
  tableColumn: vm => [
    {
      label: '订单编号',
      dataKey: 'groupTradeId',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 180
      }
    },
    {
      label: '报单编号',
      dataKey: 'tradeId',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 180
      }
    },
    {
      label: '集团客户名称',
      dataKey: 'customerName',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 150
      }
    },
    {
      label: '集团京东用户名',
      dataKey: 'pinCode',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 120,
        formatter: row => row.customerDto.pinCode
      }
    },
    {
      label: '产品名称',
      dataKey: 'productName',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 220
      }
    },
    {
      label: '产品简称',
      dataKey: 'productNameShort',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 160
      }
    },
    {
      label: '产品销售类型',
      dataKey: 'productSaleType',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 100,
        formatter: row => vm.enumArgs['product_sales_type'][row.productSaleType]
      }
    },
    {
      label: '赎回份额（份）',
      dataKey: 'redeemShare',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 135,
        align: 'right',
        formatter: row => {
          return vm.$utils.number.formatMoney(row.redeemShare, 2, 0);
        }
      }
    },
    {
      label: '下单时间',
      dataKey: 'applyTime',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 156
      }
    },
    {
      label: '订单状态',
      dataKey: 'status',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 120,
        formatter: row => vm.enumArgs[argGroupKey][row.status]
      }
    },
    {
      label: '确认份额',
      dataKey: 'confirmShare',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 120,
        align: 'right',
        formatter: row => {
          if (row.confirmShare === null) return '-';
          return !isNaN(row.confirmShare) ? vm.$utils.number.formatMoney(row.confirmShare, 2, 0) : '-';
        }
      }
    },
    {
      label: '确认净值',
      dataKey: 'confirmNav',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 120,
        align: 'right',
        formatter: row => vm.$utils.number.keepFourDecimal(row.confirmNav)
      }
    },
    {
      label: '确认日期',
      dataKey: 'confirmTime',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 120,
        formatter: row => row.confirmTime ? row.confirmTime.toString().substring(0, 10) : '-'
      }
    },
    {
      label: '理财师',
      dataKey: 'salesName',
      powerKey: vm.$utils.Powers.orderQueryRedeemDirect,
      props: {
        width: 80
      }
    }
  ]
};
