/*
代销订单页面设置
 */
const argGroupKey = 'trade_proxy_order_status';
export default {
  /*
  这里不用vm参数也可以，外层调用的地方使用bind替换this
   */
  filterOptions(vm) {
    return [
      [
        {
          labelName: '订单编号',
          tagName: 'el-input',
          modelName: 'plOrderId',
          dataKey: 'plOrderId',
          powerKey: vm.$utils.Powers.orderQueryProxy,
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
          powerKey: vm.$utils.Powers.orderQueryProxy,
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
          powerKey: vm.$utils.Powers.orderQueryProxy,
          props: {
            clearable: true,
            placeholder: '产品名称/简称'
          }
        },
        {
          labelName: '产品销售类型',
          tagName: 'el-select',
          modelName: 'productSaleType',
          dataKey: 'productSaleType',
          powerKey: vm.$utils.Powers.orderQueryProxy,
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('product_sales_type')
        },
        {
          labelName: '客户名称',
          tagName: 'el-input',
          modelName: 'userName',
          dataKey: 'userName',
          powerKey: vm.$utils.Powers.orderQueryProxy,
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
          powerKey: vm.$utils.Powers.orderQueryProxy,
          props: {
            clearable: true,
            placeholder: '京东用户名'
          }
        }
      ],
      [
        {
          labelName: '渠道',
          tagName: 'el-input',
          modelName: 'channel',
          dataKey: 'channel',
          powerKey: vm.$utils.Powers.orderQueryProxy,
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
          powerKey: vm.$utils.Powers.orderQueryProxy,
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
          powerKey: vm.$utils.Powers.orderQueryProxy,
          props: {
            clearable: true,
            placeholder: '活动'
          }
        },
        {
          labelName: '下单时间',
          tagName: 'el-date-picker',
          dataKey: 'createdTime',
          powerKey: vm.$utils.Powers.orderQueryProxy,
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
        {
          labelName: '汇款时间',
          tagName: 'el-date-picker',
          dataKey: 'successTime',
          powerKey: vm.$utils.Powers.orderQueryProxy,
          props: {
            clearable: true,
            placeholder: '开始时间',
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'successTimeStart',
            endTime: 'successTimeEnd',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            'default-time': ['00:00:00', '23:59:59']
          }
        }
      ],
      [
        {
          labelName: '分享者',
          tagName: 'el-input',
          modelName: 'shareInfo',
          dataKey: 'shareInfo',
          powerKey: vm.$utils.Powers.orderQueryProxy,
          props: {
            clearable: true,
            placeholder: '分享者姓名/京东用户名'
          }
        },
        {
          labelName: '订单状态',
          tagName: 'el-select',
          modelName: 'orderStateStrs',
          dataKey: 'orderState',
          powerKey: vm.$utils.Powers.orderQueryProxy,
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
          powerKey: vm.$utils.Powers.orderQueryProxy,
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
    shareInfo: '', // 分享者
    plOrderId: '', // 订单编号
    tradeId: '', // 报单编号
    userName: '', // 客户名称
    userPin: '', // 京东用户名
    productInfo: '', // 产品简称、产品名称
    orderStateStrs: '', // 订单状态
    orderSourceStrs: '', // 下单渠道
    orderColumn: '',
    order: '',
    bookingTimeStart: '',
    bookingTimeEnd: '',
    successTimeStart: '',
    successTimeEnd: '',
    channel: '',
    medium: '',
    activity: '',
    productSaleType: ''
  },
  tableColumn: vm => {
    return [
      {
        label: '订单编号',
        dataKey: 'plOrderId',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 140
        }
      },
      {
        label: '报单编号',
        dataKey: 'tradeId',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 140
        }
      },
      {
        label: '客户名称',
        dataKey: 'userName',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 120
        }
      },
      {
        label: '京东用户名',
        dataKey: 'userPin',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 120
        }
      },
      {
        label: '产品名称',
        dataKey: 'productName',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 220
        }
      },
      {
        label: '产品简称',
        dataKey: 'productNameShort',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 160
        }
      },
      {
        label: '产品销售类型',
        dataKey: 'productSaleType',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 100,
          formatter: row => vm.enumArgs['product_sales_type'][row.productSaleType]
        }
      },
      {
        label: '订单金额（元）',
        dataKey: 'applyAmount',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 135,
          align: 'right',
          formatter: row => vm.$utils.number.formatMoney(row.applyAmount, 2, 0)
        }
      },
      {
        label: '下单时间',
        dataKey: 'createdTime',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 150
        }
      },
      {
        label: '下单渠道',
        dataKey: 'orderSource',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 150,
          formatter: row => row.orderSource === null ? '-' : vm.enumArgs['order_channel_type'][row.orderSource]
        }
      },
      {
        label: '渠道',
        dataKey: 'channel',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 100
        }
      },
      {
        label: '媒介',
        dataKey: 'medium',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 100
        }
      },
      {
        label: '活动',
        dataKey: 'activity',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 100
        }
      },
      {
        label: '汇款时间',
        dataKey: 'successTime',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 150
        }
      },
      {
        label: '订单状态',
        dataKey: 'orderState',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 100,
          formatter: row => vm.enumArgs[argGroupKey][row.orderState]
        }
      },
      {
        label: '确认份额',
        dataKey: 'confirmedVol',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 120,
          align: 'right',
          formatter: row => {
            if (row.confirmedVol === null) return '-';
            return !isNaN(row.confirmedVol) ? vm.$utils.number.formatMoney(row.confirmedVol, 2, 0) : '-';
          }
        }
      },
      {
        label: '确认净值',
        dataKey: 'calcNav',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 150,
          align: 'right',
          formatter: row => vm.$utils.number.keepFourDecimal(row.calcNav)
        }
      },
      {
        label: '确认金额',
        dataKey: 'confirmAmount',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 120,
          align: 'right',
          formatter: row => vm.$utils.number.formatMoney(row.confirmAmount, 2, 0)
        }
      },
      {
        label: '份额确认日期',
        dataKey: 'fundShareTime',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 150,
          formatter: row => row.fundShareTime ? row.fundShareTime.toString().substring(0, 10) : '-'
        }
      },
      {
        label: '理财师',
        dataKey: 'salesName',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 150,
          formatter: (row) => {
            if (row.tradeDto) {
              return row.tradeDto.salesName || '-';
            }
            return '-';
          }
        }
      },
      {
        label: '分享者',
        dataKey: 'shareInfo',
        powerKey: vm.$utils.Powers.orderQueryProxy,
        props: {
          width: 160
        }
      }
    ];
  }
};
