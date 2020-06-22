
export default {
  filterOptions: vm => {
    const productTypeOptions = [
      {
        label: '国内保险',
        value: '国内保险'
      },
      {
        label: '海外保险',
        value: '海外保险'
      },
    {
      label: '海外房产',
        value: '海外房产'
    },
      {
        label: '海外股权',
        value: '海外股权'
      },
      {
        label: '海外基金',
        value: '海外基金'
      },
      {
        label: '海外移民',
        value: '海外移民'
      }
    ]
    const options = [
      [
        {
          labelName: '',
          tagName: 'el-button-group',
          slotComps: [
            {
              tagName: 'el-button',
              innerText: '下载订单模板',
              props: {
                icon: 'el-icon-document'
              },
              eventOn: {
                click: vm.downloadTemplate
              }
            },
            {
              tagName: 'el-button',
              innerText: '上传订单',
              props: {
                icon: 'el-icon-upload'
              },
              eventOn: {
                click: vm.importOrder
              }
            },
            {
              tagName: 'el-button',
              innerText: '确认导入订单',
              props: {
                type: 'primary',
                icon: 'el-icon-check'
              },
              eventOn: {
                click: vm.confirmOrder
              }
            }
          ]
        }
      ],
      [],
      [
        {
          labelName: '项目简称',
          tagName: 'el-input',
          modelName: 'productName_short',
          dataKey: 'productNameShort',
          powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
          props: {
            clearable: true
          }
        },
        {
          labelName: '大类资产',
          tagName: 'el-select',
          modelName: 'productType',
          dataKey: 'productType',
          powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: productTypeOptions
        },
        {
          labelName: '产品小标签',
          tagName: 'el-input',
          modelName: 'productLabel',
          dataKey: 'productLabel',
          powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
          props: {
            clearable: true
          }
        },
        {
          labelName: '客户信息',
          tagName: 'el-input',
          modelName: 'customerInfo',
          dataKey: 'investor,jdpin',
          powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
          props: {
            clearable: true,
            placeholder: '客户名称/京东用户名'
          }
        },
        {
          labelName: '理财师',
          tagName: 'el-input',
          modelName: 'empName',
          dataKey: 'empName',
          powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
          props: {
            clearable: true
          }
        }
        ],
      [
        {
          labelName: '打款日期',
          tagName: 'el-date-picker',
          dataKey: 'paymentDate',
          powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
          props: {
            clearable: true,
            placeholder: '开始时间',
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'paymentDateStart',
            endTime: 'paymentDateEnd',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            'default-time': ['00:00:00', '23:59:59']
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
                click: vm.doDefaultReset
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
    productName_short: '',
    productType: '',
    paymentDateStart: '',
    paymentDateEnd: '',
    productLabel: '',
    customerInfo: '',
    empName: ''
  },
  tableColumn: vm => [
    {
      label: '',
      props: {
        type: 'selection',
        selectable: (row) => row.confirmFlag === 0
      }
    },
    {
      label: '操作',
      props: {
        align: 'center',
        width: 150,
        fixed: 'right',
        formatter: row => {
          const h = vm.$createElement;
          return (
            <div>
              <a class='mr10 red' hidden={ row.confirmFlag !== 1 } onClick={(item) => vm.edit(row)}
              >编辑</a>
              <a class='red' onClick={(item) => vm.delete(row)}
              >删除</a>
            </div>
          );
        }
      }
    },
    {
      label: '验证信息',
      dataKey: 'errorMsg',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 150,
        color: 'red',
        formatter: row => {
          const h = vm.$createElement;
          return (
            <div class = { row.errorMsg ? 'red' : ''}>
              { row.errorMsg ? row.errorMsg : '-' }
            </div>
          );
        }
      }
    },
    {
      label: '项目id',
      dataKey: 'projectId',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 100
      }
    },
    {
      label: '项目简称',
      dataKey: 'productNameShort',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 150
      }
    },
    {
      label: '大类资产',
      dataKey: 'productType',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 120
      }
    },
    {
      label: '产品小标签',
      dataKey: 'productLabel',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 120
      }
    },
    {
      label: '客户名称',
      dataKey: 'investor',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 120
      }
    },
    {
      label: '京东用户名',
      dataKey: 'jdpin',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 140
      }
    },
    {
      label: '客户来源',
      dataKey: 'source',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 90,
        formatter: row => row.source ? vm.enumArgs['source_type'][`${row.source.toString()}`] : '-'
      }
    },
    {
      label: '证件类型',
      dataKey: 'identification',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 90
      }
    },
    {
      label: '证件号码',
      dataKey: 'identificationNo',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 150
      }
    },
    {
      label: '开户银行',
      dataKey: 'bankName',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 100
      }
    },
    {
      label: '银行账号',
      dataKey: 'bankAccount',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 130
      }
    },
    {
      label: '打款日期',
      dataKey: 'paymentDate',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 100
      }
    },
    {
      label: '订单金额（万元）',
      dataKey: 'orderAmount',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        align: 'right',
        width: 120
      }
    },
    {
      label: '费用（万元）',
      dataKey: 'fee',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        align: 'right',
        width: 120
      }
    },
    {
      label: '项目币种',
      dataKey: 'currency',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
    },
    {
      label: '人民币金额（万元）',
      dataKey: 'cnyAmount',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        align: 'right',
        width: 130
      }
    },
    {
      label: '所属机构',
      dataKey: 'deptName',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
      props: {
        width: 120
      }
    },
    {
      label: '理财师',
      dataKey: 'empName',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
    },
    {
      label: '房号',
      dataKey: 'roomNo',
      powerKey: vm.$utils.Powers.overseaAndInsuranceOrderList,
    }
  ]
};
