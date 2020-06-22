/*
赎回代销订单页面设置
 */
const argGroupKey = 'trade_proxy_redeem_status';
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '订单编号',
          tagName: 'el-input',
          modelName: 'bizOrderId',
          dataKey: 'bizOrderId',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
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
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
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
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '产品名称、产品简称'
          }
        },
        {
          labelName: '客户名称',
          tagName: 'el-input',
          modelName: 'userName',
          dataKey: 'userName',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '客户名称'
          }
        },
        {
          labelName: '京东用户名',
          tagName: 'el-input',
          modelName: 'userPin',
          dataKey: 'userPin',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '京东用户名'
          }
        }
      ],
      [
        {
          labelName: '产品销售类型',
          tagName: 'el-select',
          modelName: 'productSaleType',
          dataKey: 'productSaleType',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('product_sales_type')
        },
        {
          labelName: '渠道',
          tagName: 'el-input',
          modelName: 'channel',
          dataKey: 'channel',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '渠道'
          }
        },
        {
          labelName: '媒介',
          tagName: 'el-input',
          modelName: 'medium',
          dataKey: 'medium',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '媒介'
          }
        },
        {
          labelName: '活动',
          tagName: 'el-input',
          modelName: 'activity',
          dataKey: 'activity',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '活动'
          }
        },
        {
          labelName: '下单时间',
          tagName: 'el-date-picker',
          dataKey: 'createdTime',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '开始时间',
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'bookingTimeStart',
            endTime: 'bookingTimeEnd',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            'default-time': ['00:00:00', '23:59:59']
          }
        },
      ],
      [
        {
          labelName: '订单状态',
          tagName: 'el-select',
          modelName: 'redeemStateStrs',
          dataKey: 'redeemState',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '订单状态',
            multiple: true,
            filterable: true,
            'collapse-tags': true
          },
          options: vm.statusArgsWithElOptionsTag(argGroupKey)
        },
        {
          labelName: '下单渠道',
          tagName: 'el-select',
          modelName: 'orderSourceStrs',
          dataKey: 'orderSource',
          powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
          props: {
            clearable: true,
            placeholder: '下单渠道',
            multiple: true,
            filterable: true,
            'collapse-tags': true
          },
          options: vm.statusArgsWithElOptionsTag('order_channel_type')
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
    bizOrderId: '', // 订单编号
    tradeId: '', // 报单编号
    userName: '', // 客户名称
    userPin: '', // 京东用户名
    redeemStateStrs: '',
    orderColumn: '',
    order: '',
    bookingTimeStart: '', // 下单开始时间
    bookingTimeEnd: '', // 下单开始时间
    businessCode: 24, // 赎回状态
    orderSourceStrs: '', // 下单渠道
    productSaleType: '',
    channel: '',
    medium: '',
    activity: '',
  },
  tableColumn: vm => [
    {
      label: '订单编号',
      dataKey: 'bizOrderId',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 180
      }
    },
    {
      label: '报单编号',
      dataKey: 'tradeId',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 180
      }
    },
    {
      label: '客户名称',
      dataKey: 'userName',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 150
      }
    },
    {
      label: '京东用户名',
      dataKey: 'userPin',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 120
      }
    },
    {
      label: '产品名称',
      dataKey: 'productName',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 220
      }
    },
    {
      label: '产品简称',
      dataKey: 'productNameShort',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 160
      }
    },
    {
      label: '产品销售类型',
      dataKey: 'productSaleType',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 100,
        formatter: row =>row.productSaleType === null ? '-' : vm.enumArgs['product_sales_type'][row.productSaleType]
      }
    },
    {
      label: '赎回份额（份）',
      dataKey: 'applyRedeemVol',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 135,
        align: 'right',
        formatter: row => vm.$utils.number.formatMoney(row.applyRedeemVol, 2, 0)
      }
    },
    {
      label: '下单时间',
      dataKey: 'createdTime',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 156
      }
    },
    {
      label: '下单渠道',
      dataKey: 'orderSource',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 150,
        formatter: row => row.orderSource === null ? '-' : vm.enumArgs['order_channel_type'][row.orderSource]
      }
    },
    {
      label: '渠道',
      dataKey: 'channel',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 100
      }
    },
    {
      label: '媒介',
      dataKey: 'medium',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 100
      }
    },
    {
      label: '活动',
      dataKey: 'activity',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 100
      }
    },
    {
      label: '订单状态',
      dataKey: 'redeemState',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 130,
        formatter: row => row.redeemState === null ? '-' : vm.enumArgs[argGroupKey][row.redeemState]
      }
    },
    {
      label: '确认金额',
      dataKey: 'confirmRedeemAmount',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 120,
        align: 'right',
        formatter: row => row.confirmRedeemAmount ? vm.$utils.number.formatMoney(row.confirmRedeemAmount, 2, 0) : '-'
      }
    },
    {
      label: '确认份额',
      dataKey: 'confirmRedeemVol',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 120,
        align: 'right',
        formatter: row => {
          if (row.confirmRedeemVol === null) return '-';
          return !isNaN(row.confirmRedeemVol) ? vm.$utils.number.formatMoney(row.confirmRedeemVol, 2, 0) : '-';
        }
      }
    },
    {
      label: '确认净值',
      dataKey: 'redemptNav',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 120,
        align: 'right',
        formatter: row => vm.$utils.number.keepFourDecimal(row.redemptNav)
      }
    },
    {
      label: '确认日期',
      dataKey: 'confirmRedeemTime',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 120,
        formatter: row => row.confirmRedeemTime ? row.confirmRedeemTime.toString().substring(0, 10) : '-'
      }
    },
    {
      label: '理财师',
      dataKey: 'accountant',
      powerKey: vm.$utils.Powers.orderQueryRedeemProxy,
      props: {
        width: 80
      }
    }
  ]
};
