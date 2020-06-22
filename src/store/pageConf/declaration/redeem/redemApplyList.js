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
          labelName: '下单时间',
          tagName: 'el-date-picker',
          modelName: 'createdTimeStart',
          props: {
            clearable: true,
            placeholder: '开始时间',
            'value-format': 'yyyy-MM-dd 00:00:00',
            style: 'width:110px'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'createdTimeEnd',
          props: {
            clearable: true,
            placeholder: '结束时间',
            'value-format': 'yyyy-MM-dd 23:59:59',
            style: 'width:110px'
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
    statusStrs: '', // 单状态
    createdTimeStart: '', // 下单开始时间
    createdTimeEnd: '' // 下单结束时间
  },
  tableColumn: vm => [
    {
      label: '操作',
      props: {
        align: 'center',
        width: 150,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;',
              class: text === '审核' && row.status !== 1 ? 'disable' : 'able',
              on: {
                click: () => {
                  if (text === '审核') {
                    if (row.status !== 1) {
                      return false;
                    }
                    clickEvent(index, row);
                  }
                  if (text === '导出附件') {
                    clickEvent(row);
                  }
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.redeemAudit, '审核'),
            getHref(vm.doExport, '导出附件')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '赎回订单编号',
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
      label: '京东用户名',
      dataKey: 'customerDto',
      props: {
        width: 100,
        formatter: row => row.customerDto ? row.customerDto.pinCode || '-' : '-'
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
      label: '赎回份额(份)',
      dataKey: 'redeemShare',
      props: {
        width: 140,
        align: 'right',
        formatter: row => {
          return vm.$utils.emptyableValue(row.redeemShare, (val) => {
            return vm.$utils.number.formatMoney(val, 2, 0);
          });
        }
      }
    },
    {
      label: '证件号',
      dataKey: 'identityNo',
      props: {
        width: 160
      }
    },
    {
      label: '下单时间',
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
      label: '归属理财师',
      dataKey: 'salesName',
      props: {
        width: 100
      }
    },
    {
      label: '审核人',
      dataKey: 'auditorName',
      props: {
        width: 100
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
