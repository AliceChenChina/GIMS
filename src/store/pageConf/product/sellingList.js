/*
在售产品
 */
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '产品名称',
          tagName: 'el-input',
          modelName: 'productName'
        },
        {
          labelName: '上架日期',
          tagName: 'el-date-picker',
          modelName: 'upLineTimeStart',
          props: {
            clearable: true,
            placeholder: '开始时间',
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'upLineTimeEnd',
          props: {
            clearable: true,
            placeholder: '结束时间',
            'value-format': 'yyyy-MM-dd 23:59:59'
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
                icon: 'el-icon-refresh-left'
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
    productName: '',
    upLineTimeStart: '', // 上架日期起
    upLineTimeEnd: ''
  },
  tableColumn: vm => [
    {
      label: '序号',
      dataKey: '',
      props: {
        width: 60,
        align: 'left',
        formatter: (row, column, cellValue, index) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '产品名称',
      dataKey: 'productName',
      props: {
        formatter: (row) => {
          const options = {
            style: 'color:red;padding: 0 5px;cursor:pointer;',
            on: {
              click: () => vm.gotoProductInfo(row.productId, row.productType)
            }
          };
          return vm.$createElement('a', options, row.productName);
        },
        sortable: 'custom'
      }
    },
    {
      label: '产品简称',
      dataKey: 'productNameShort',
      props: {
        sortable: 'custom'
      }
    },
    {
      label: '产品类型',
      dataKey: 'productType',
      props: {
        sortable: 'custom',
        formatter: row => vm.enumArgs['product_type'][row.productType]
      }
    },
    {
      label: '上架日期',
      dataKey: 'upLineTime',
      props: {
        sortable: 'custom'
      }
    },
    {
      label: '产品风险等级',
      dataKey: 'riskLevel',
      props: {
        formatter: row => vm.enumArgs['product_risk_level'][row.riskLevel],
        sortable: 'custom'
      }
    },
    {
      label: '产品状态',
      dataKey: 'productStatus',
      props: {
        formatter: row => vm.enumArgs['product_status'][row.productStatus],
        sortable: 'custom'
      }
    }
  ]
};
