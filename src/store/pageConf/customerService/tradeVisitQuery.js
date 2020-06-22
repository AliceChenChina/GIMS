/*
冷静期回访列表
 */
const callbackStatus = {
  1: '待回访',
  2: '客户确认',
  3: '客户撤单',
  4: '回访异常'
};
function handelArg(oldarry) {
  const keys = Object.keys(oldarry);
  let newArray = [];
  newArray = keys.map((item) => {
    return {
      label: oldarry[item],
      value: item
    };
  });
  return newArray;
}

export default {
  filterOptions(vm) {
    return [
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
          labelName: '产品名称',
          tagName: 'el-input',
          modelName: 'productName',
          props: {
            clearable: true,
            placeholder: '产品名称'
          }
        },
        {
          labelName: '回访状态',
          tagName: 'el-select',
          modelName: 'callbackStatus',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: handelArg(callbackStatus)
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
  },
  filterModel: {
    customerName: '', // 客户名称
    productName: '', // 产品名称
    callbackStatus: '' // 回访状态
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: ' ',
      props: {
        align: 'center',
        width: 153,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          let isCallBack;
          if (row.callbackStatus === 1 || row.callbackStatus === 4) {
            const currentTime = new Date().getTime();
            const coolPeriodEndTime = new Date(row.coolPeriodEnd).getTime();
            isCallBack = currentTime > coolPeriodEndTime || currentTime === coolPeriodEndTime;
          }
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;',
              class: text === '回访' && !isCallBack ? 'disable' : 'able',
              on: {
                click: () => {
                  if (text === '回访') {
                    if (!isCallBack) {
                      return;
                    }
                    clickEvent(row.id);
                  }
                  if (text === '查看') {
                    clickEvent(row.id);
                  }
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.gotoTradeVisitEdit, '回访'),
            getHref(vm.gotoTradeVisitDetail, '查看')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '序号',
      dataKey: ' ',
      props: {
        width: 45,
        formatter: (row, col, cellval, index) => {
          const { currentPageNo, pageSize } = vm.viewerState.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '订单编号',
      dataKey: 'groupTradeId',
      props: {
        width: 140
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
      label: '客户名称',
      dataKey: 'customerName',
      props: {
        width: 120
      }
    },
    {
      label: '产品简称',
      dataKey: 'productName',
      props: {
        width: 200
      }
    },
    {
      label: '产品是否代销',
      dataKey: 'channel',
      props: {
        width: 120,
        formatter: (row, col, cellval, index) => {
          if (cellval === '01') {
            return '否';
          } else {
            return '是';
          }
        }
      }
    },
    {
      label: '订单金额(元)',
      dataKey: 'bookingBalance',
      props: {
        width: 100,
        align: 'right',
        formatter: row => vm.$utils.number.formatMoney(row.bookingBalance, 2, 0)
      }
    },
    {
      label: '支付确认时间',
      dataKey: 'paymentDate',
      props: {
        width: 100,
        formatter: (row, col, cellval, index) => {
          return vm.$utils.date.format(cellval, 'yyyy-MM-dd');
        }
      }
    },
    {
      label: '订单状态',
      dataKey: 'orderStatus',
      props: {
        width: 150,
        formatter: (row, col, cellval, index) => {
          cellval = cellval.toString();
          if (row.channel === '01') {
            return vm.enumArgs['trade_indent_status'][cellval];
          } else {
            return vm.enumArgs['trade_proxy_order_status'][cellval];
          }
        }
      }
    },
    {
      label: '可回访时间',
      dataKey: 'coolPeriodEnd',
      props: {
        width: 150
      }
    },
    {
      label: '回访状态',
      dataKey: 'callbackStatus',
      props: {
        width: 120,
        formatter: (row, col, cellval, index) => {
          cellval = cellval.toString();
          return callbackStatus[cellval];
        }
      }
    },
    {
      label: '回访时间',
      dataKey: 'callbackTime',
      props: {
        width: 150,
        sortable: 'custom'
      }
    },
    {
      label: '回访人',
      dataKey: 'callbackWaiterName',
      props: {
        width: 120
      }
    }
  ]
};
