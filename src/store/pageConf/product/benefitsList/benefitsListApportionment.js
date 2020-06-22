/*
收益分配明细
 */
// const argGroupKey = 'product_type';
export default {
  tableColumn: vm => [
    {
      label: '',
      props: {
        type: 'selection',
        selectable: (row) => row.isPush === 0
      }
    },
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 100,
        fixed: 'right',
        formatter: (row) => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;cursor:pointer;',
              class: row.isPush === 0 ? 'op' : 'edit-disabled',
              on: {
                click: () => {
                  if (row.isPush === 0) {
                    clickEvent(row);
                  }
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.edit, '编辑'),
            getHref(vm.delete, '删除')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '客户名称',
      dataKey: 'userName',
      props: {}
    },
    {
      label: '京东用户名',
      dataKey: 'userPin',
      props: {
        width: 180
      }
    },
    {
      label: '身份证号',
      dataKey: 'identificationNo',
      props: {
        width: 180
      }
    },
    {
      label: '理财师',
      dataKey: 'planner',
      props: {
      }
    },
    {
      label: '本金（万元）',
      dataKey: 'holdVol',
      props: {
        width: 130,
        align: 'right',
        formatter: row => {
          if (row.holdVol === null) return '-';
          return !isNaN(row.holdVol) ? vm.$utils.number.formatMoney(row.holdVol, 2, 0) : '-';
        }
      }
    },
    {
      label: '剩余本金（万元）',
      dataKey: 'retainPrincipal',
      props: {
        align: 'right',
        width: 150,
        formatter: row => {
          if (row.retainPrincipal === null) return '-';
          return !isNaN(row.retainPrincipal) ? vm.$utils.number.formatMoney(row.retainPrincipal, 2, 0) : '-';
        }
      }
    },
    {
      label: '成立日期',
      dataKey: 'setupDate',
      props: {
        width: 150
      }
    },
    {
      label: '起息时间',
      dataKey: 'calDate',
      props: {
        width: 120
      }
    },
    {
      label: '分配日期',
      dataKey: 'incomeDate',
      props: {
        width: 120
      }
    },
    {
      label: '本金分配百分比',
      dataKey: 'quitPercent',
      props: {
        width: 120,
        align: 'right'
      }
    },
    {
      label: '退出本金（万元）',
      dataKey: 'allocatePrincipal',
      props: {
        align: 'right',
        width: 120,
        formatter: row => {
          if (row.allocatePrincipal === null) return '-';
          return !isNaN(row.allocatePrincipal) ? vm.$utils.number.formatMoney(row.allocatePrincipal, 2, 0) : '-';
        }
      }
    },
    {
      label: '分配金额（元)',
      dataKey: 'payAmount',
      props: {
        width: 120,
        align: 'right'
      }
    }
  ]
};
