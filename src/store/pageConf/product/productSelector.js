/*
选择理财师设置
 */
export default {
  filterOptions(vm) {
    return [
      [
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
          labelName: '产品风险等级',
          tagName: 'el-select',
          modelName: 'riskLevel',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('product_risk_level')
        },
        {
          labelName: '产品状态',
          tagName: 'el-select',
          modelName: 'productStatus',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('product_status')
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
                size: 'mini',
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
                size: 'mini',
                icon: 'el-icon-refresh-right'
              },
              eventOn: {
                click: vm.doDefaultReset
              }
            }
          ]
        }
      ],
      [
        {
          labelName: '产品简称',
          tagName: 'el-input',
          modelName: 'productShortName',
          props: {
            clearable: true,
            placeholder: '产品简称'
          }
        },
        {
          labelName: '成立日期',
          tagName: 'el-date-picker',
          modelName: 'setupStart',
          props: {
            clearable: true,
            placeholder: '开始时间',
            'value-format': 'yyyy-MM-dd'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'setupEnd',
          props: {
            clearable: true,
            placeholder: '结束时间',
            'value-format': 'yyyy-MM-dd'
          }
        }
      ]
    ];
  },
  filterModel: {
    productId: '',
    productName: '',
    productShortName: '',
    setupStart: '', // 成立日期
    setupEnd: '',
    contractEndDateStart: '', // 到期日期
    contractEndDateEnd: '',
    riskLevel: '',
    productStatus: '',
    auditStatus: ''
  },
  tableColumn: vm => [
    {
      label: '',
      props: {
        type: 'selection',
        selectable: (row, index) => {
          if (Object.keys(vm.onSelectList).length === 0) return true;
          // 只能单选
          return !!vm.onSelectList[row.productId];
        }
      }
    },
    {
      label: '产品名称',
      dataKey: 'productName'
    },
    {
      label: '产品简称',
      dataKey: 'productNameShort'
    },
    {
      label: '产品状态',
      dataKey: 'productStatusName',
      props: {
        align: 'center'
      }
    },
    {
      label: '审核状态',
      dataKey: 'auditStatusName'
    },
    {
      label: '产品等级',
      dataKey: 'riskLevelName'
    },
    {
      label: '成立日期',
      dataKey: 'setupDate',
      props: {
        formatter(row) {
          return row.setupDate && row.setupDate.split(' ')[0];
        }
      }
    }
  ]
};
