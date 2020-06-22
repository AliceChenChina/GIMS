
export default {
  filterOptions: vm => {
    const orderTypeOption = [{
      label: '直销订单',
      value: '0'
    },{
      label: '代销订单',
      value: '1'
    }];
    const row1 = [
      {
        labelName: '产品信息',
        tagName: 'el-input',
        modelName: 'productInfo',
        props: {
          clearable: true,
          placeholder: '产品名称/产品简称'
        }
      },
      {
        labelName: '客户信息',
        tagName: 'el-input',
        modelName: 'customerInfo',
        props: {
          clearable: true,
          placeholder: '姓名/pin'
        }
      },
      {
        labelName: '订单类型',
        tagName: 'el-select',
        modelName: 'orderType',
        props: {
          clearable: true,
          placeholder: ''
        },
        options: orderTypeOption
      },
      {
        labelName: '理财师姓名',
        tagName: 'el-input',
        modelName: 'salesName',
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '客户来源',
        tagName: 'el-select',
        modelName: 'customerSource',
        props: {
          clearable: true,
          placeholder: ''
        },
        options: [
          {
            label: '自行拓客',
            value: '1'
          },
          {
            label: '老客推荐',
            value: '2'
          },
          {
            label: '公司分配',
            value: '3'
          }
        ]
      }
    ]
    const row2 = [
      {
        labelName: '成立日期',
        tagName: 'el-date-picker',
        modelName: 'setupDateStart',
        props: {
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'setupDateEnd',
        props: {
          placeholder: '结束时间',
          'value-format': 'yyyy-MM-dd 23:59:59'
        }
      },
      {
        labelName: '下单时间',
        tagName: 'el-date-picker',
        modelName: 'bookingTimeStart',
        props: {
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'bookingTimeEnd',
        props: {
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
              icon: 'el-icon-refresh-right'
            },
            eventOn: {
              click: vm.doDefaultReset
            }
          },
          {
            tagName: 'el-button',
            innerText: '导出',
            props: {
              icon: 'el-icon-bottom'
            },
            eventOn: {
              click: vm.doExport
            }
          },
          {
            tagName: 'el-button',
            innerText: '高级筛选',
            props: {
              icon: vm.viewData.filterModel.showAdvanceFilter ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
            },
            eventOn: {
              click: () => {
                vm.$store.commit('UPDATE_FILTER_MODEL', {
                  modelState: vm.viewData.filterModel,
                  data: {
                    ...vm.viewData.filterModel,
                    showAdvanceFilter: !vm.viewData.filterModel.showAdvanceFilter
                  }
                });
              }
            }
          }
        ]
      }
    ]
    const row3 = [
      {
        labelName: '备案类型',
        tagName: 'el-select',
        modelName: 'filingType',
        options: vm.statusArgsWithElOptionsTag('filing_type'),
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '大类资产',
        tagName: 'el-select',
        modelName: 'largeClassAssetsType',
        options: vm.statusArgsWithElOptionsTag('large_class_assets_type'),
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '产品大标签',
        tagName: 'el-select',
        modelName: 'productLabel',
        options: vm.statusArgsWithElOptionsTag('product_label'),
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '产品小标签',
        tagName: 'el-input',
        modelName: 'productSubLabel',
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '主管名称',
        tagName: 'el-input',
        modelName: 'departmentHeadName',
        props: {
          clearable: true,
          placeholder: ''
        }
      },
    ];
    const row4 = [
      {
        labelName: '总经理名称',
        tagName: 'el-input',
        modelName: 'presidentName',
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '部门',
        tagName: 'el-input',
        modelName: 'deptName',
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '新客老客',
        tagName: 'el-select',
        modelName: 'isCustomerNewOrder',
        props: {
          clearable: true,
          placeholder: ''
        },
        options: [
          {
            label: '老客',
            value: '0'
          },
          {
            label: '新客',
            value: '2'
          }
        ]
      },
      {
        labelName: '汇款时间',
        tagName: 'el-date-picker',
        modelName: 'paymentTimeStart',
        props: {
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'paymentTimeEnd',
        props: {
          placeholder: '结束时间',
          'value-format': 'yyyy-MM-dd 23:59:59'
        }
      },
    ];
    const row5 = [{
      labelName: '记录生成时间',
      tagName: 'el-date-picker',
      modelName: 'recordDateStart',
      props: {
        placeholder: '开始时间',
        'value-format': 'yyyy-MM-dd 00:00:00'
      }
    },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'recordDateEnd',
        props: {
          placeholder: '结束时间',
          'value-format': 'yyyy-MM-dd 23:59:59'
        }},{
        labelName: '记录截止时间',
        tagName: 'el-date-picker',
        modelName: 'recordEndDateStart',
        props: {
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'recordEndDateEnd',
        props: {
          placeholder: '结束时间',
          'value-format': 'yyyy-MM-dd 23:59:59'
        }
      }]
    const row6 = [{
      labelName: '核算周期',
      tagName: 'el-date-picker',
      modelName: 'hesuanDateStart',
      props: {
        placeholder: '开始时间',
        'value-format': 'yyyy-MM-dd 00:00:00'
      }
    },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'hesuanDateEnd',
        props: {
          placeholder: '结束时间',
          'value-format': 'yyyy-MM-dd 23:59:59'
        }}]
    if (vm.viewData.filterModel.showAdvanceFilter) {
      return [row1, row2, row3, row4, row5, row6];
    }
    return [row1, row2];
  },
  filterModel: {
    productInfo: '',
    orderType: '',
    customerInfo: '',
    customerSource: '',
    salesName: '',
    deptName: '',
    setupDateStart: '',
    setupDateEnd: '',
    bookingTimeStart: '',
    bookingTimeEnd: '',
    paymentTimeStart: '',
    paymentTimeEnd: '',
    filingType: '',
    largeClassAssetsType: '',
    productLabel: '',
    productSubLabel: '',
    showAdvanceFilter: false,
    departmentHeadName: '',
    presidentName: '',
    recordDateStart: '',
    recordDateEnd: '',
    teamLeaderName: '',
    recordEndDateStart: '',
    recordEndDateEnd: '',
    isCustomerNewOrder: '',
    hesuanDateStart: '',
    hesuanDateEnd: ''
  },
  tableColumn: vm => {
    const getResult = (unite, day) => {
      if (!day && day !== 0) return '-';
      return unite === 1 ? `${day}天` : unite === 2 ? `${day}月` : `${day}`;
    };
    return [
      {
        label: '产品名称',
        dataKey: 'productName',
        props: {
          width: 160
        }
      },
      {
        label: '产品简称',
        dataKey: 'productNameShort',
        props: {
          width: 120
        }
      },
      {
        label: '备案类型',
        dataKey: 'filingType',
        props: {
          width: 100,
          formatter: row => row.filingType ?  vm.enumArgs['filing_type'][`${row.filingType.toString()}`] : '-'
        }
      },
      {
        label: '大类资产',
        dataKey: 'largeClassAssetsType',
        props: {
          width: 100,
          formatter: row => row.largeClassAssetsType ?  vm.enumArgs['large_class_assets_type'][`${row.largeClassAssetsType.toString()}`] : '-'
        }
      },
      {
        label: '产品大标签',
        dataKey: 'productLabel',
        props: {
          width: 100,
          formatter: row => row.productLabel ?  vm.enumArgs['product_label'][`${row.productLabel.toString()}`] : '-'
        }
      },
      {
        label: '产品小标签',
        dataKey: 'productSubLabel',
        props: {
          width: 100
        }
      },
      {
        label: '成立日期',
        dataKey: 'setupDate',
        props: {
          width: 160
        }
      },
      {
        label: '锁定期',
        dataKey: 'lockPeriod',
        props: {
          width: 100,
          align: 'right',
          formatter: row => {
            return getResult(row.lockPeriodUnit, row.lockPeriod);
          }
        }
      },
      {
        label: '开放间隔',
        dataKey: 'investmentInterval',
        props: {
          width: 100,
          align: 'right',
          formatter: row => {
            return getResult(row.investmentIntervalType, row.investmentInterval);
          }
        }
      },
      {
        label: '订单ID',
        dataKey: 'orderId',
        props: {
          width: 160
        }
      },
      {
        label: '订单类型',
        dataKey: 'orderType',
        props: {
          width: 100,
          formatter: row => row.orderType === 0 ? '直销订单' : row.orderType === 1 ? '代销订单' : '-'
        }
      },
      {
        label: '记录生成时间',
        dataKey: 'recordDate',
        props: {
          width: 160
        }
      },
      {
        label: '下单时间',
        dataKey: 'bookingTime',
        props: {
          width: 160
        }
      },
      {
        label: '汇款时间',
        dataKey: 'paymentTime',
        props: {
          width: 160
        }
      },
      {
        label: '确认时间',
        dataKey: 'confirmTime',
        props: {
          width: 145
        }
      },
      {
        label: '订单金额(元)',
        dataKey: 'bookingBalance',
        props: {
          width: 100,
          align: 'right'
        }
      },
      {
        label: '费用(元)',
        dataKey: 'feeBalance',
        props: {
          width: 100,
          align: 'right'
        }
      },
      {
        label: '持有份额(份)',
        dataKey: 'holdShare',
        props: {
          width: 100,
          align: 'right'
        }
      },
      {
      label: '存续金额(元)',
      dataKey: 'holdAmount',
      props: {
        width: 100,
        align: 'right'
      }
    },
      {
        label: '存续天数',
        dataKey: 'holdDays',
        props: {
          width: 100,
          align: 'right'
        }
      },
      {
        label: '记录截止时间',
        dataKey: 'recordEndDate',
        props: {
          width: 160
        }
      },
      {
        label: '核算天数',
        dataKey: 'hesuanDateNum',
        props: {
          width: 120
        }
      },
      {
        label: '客户姓名',
        dataKey: 'customerName',
        props: {
          width: 100
        }
      },
      {
        label: '京东用户名',
        dataKey: 'pinCode',
        props: {
          width: 100
        }
      },
      {
        label: '客户来源',
        dataKey: 'customerSource',
        props: {
          width: 120,
          formatter: row => row.customerSource ? vm.enumArgs['source_type'][`${row.customerSource.toString()}`] : '-'
        }
      },
      {
        label: '新客老客',
        dataKey: 'isCustomerNewOrder',
        props: {
          width: 120,
          formatter: row => row.isCustomerNewOrder === 2 ? '新客' : '老客'
        }
      },
      {
        label: '理财师姓名',
        dataKey: 'salesName',
        props: {
          width: 100,
          formatter: row => row.salesName || '自然流入'
        }
      },
      {
        label: '部门名称',
        dataKey: 'deptName',
        props: {
          width: 200
        }
      },
      {
        label: '主管姓名',
        dataKey: 'departmentHeadName',
        props: {
          width: 100
        }
      },
      {
        label: '职位',
        dataKey: 'duty',
        props: {
          width: 100
        }
      },
      {
        label: '主管绩效',
        dataKey: 'departmentHeadCoefficient',
        props: {
          width: 100
        }
      },
      {
        label: '总经理姓名',
        dataKey: 'presidentName',
        props: {
          width: 100
        }
      },
      {
        label: '总经理绩效',
        dataKey: 'presidentCoefficient',
        props: {
          width: 100
        }
      },
      {
        label: '佣金单位',
        dataKey: 'commissionRuleUnit',
        props: {
          width: 100,
          formatter: row => row.commissionRuleUnit === 1 ? '一次性' : row.commissionRuleUnit === 2 ? '年化' : '-'
        }
      },
      {
        label: '佣金获客',
        dataKey: 'commissionHkCoefficient',
        props: {
          width: 100,
          formatter: row => row.commissionHkCoefficient ? row.commissionHkCoefficient + '%' : '-'
        }
      },
      {
        label: '佣金转化',
        dataKey: 'commissionZhCoefficient',
        props: {
          width: 100,
          formatter: row => row.commissionZhCoefficient ? row.commissionZhCoefficient + '%' : '-'
        }
      },
      {
        label: '佣金团佣',
        dataKey: 'commissionTyCoefficient',
        props: {
          width: 100,
          formatter: row => row.commissionTyCoefficient ? row.commissionTyCoefficient + '%' : '-'
        }
      },
      {
        label: '佣金团佣留存',
        dataKey: 'commissionTylcCoefficient',
        props: {
          width: 100,
          formatter: row => row.commissionTylcCoefficient ? row.commissionTylcCoefficient + '%' : '-'
        }
      },
      {
        label: '佣金IC',
        dataKey: 'commissionIcCoefficient',
        props: {
          width: 100,
          formatter: row => row.commissionIcCoefficient ? row.commissionIcCoefficient + '%' : '-'
        }
      },
      {
        label: '佣金后端',
        dataKey: 'commissionBackCoefficient',
        props: {
          width: 100,
          formatter: row => row.commissionBackCoefficient ? row.commissionBackCoefficient + '%' : '-'
        }
      },
      {
        label: '业绩单位',
        dataKey: 'performanceRuleUnit',
        props: {
          width: 100,
          formatter: row => row.performanceRuleUnit === 1 ? '一次性' : row.performanceRuleUnit === 2 ? '年化' : '-'
        }
      },
      {
        label: '业绩系数',
        dataKey: 'performanceCoefficient',
        props: {
          width: 100
        }
      },
      {
        label: '收入一次性系数',
        dataKey: 'incomeYcxCoefficient',
        props: {
          width: 120,
          align: 'right',
          formatter: row => row.incomeYcxCoefficient ? row.incomeYcxCoefficient + '%' : '-'
        }
      },
      {
        label: '收入管理费系数',
        dataKey: 'incomeGlfCoefficient',
        props: {
          width: 120,
          align: 'right',
          formatter: row => row.incomeGlfCoefficient ? row.incomeGlfCoefficient + '%' : '-'
        }
      }
    ]
  }
};
