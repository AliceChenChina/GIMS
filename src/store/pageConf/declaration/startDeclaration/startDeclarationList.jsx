 // 启动报单列表 -- 视图结构数据
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '产品名称',
          tagName: 'el-input',
          modelName: 'productName',
          props: {
            clearable: true
          }
        },
        {
          labelName: '产品类型',
          tagName: 'el-select',
          modelName: 'productType',
          props: {
            clearable: true
          },
          options: vm.statusArgsWithElOptionsTag('product_type')
        },
        {
          labelName: '风险等级',
          tagName: 'el-select',
          modelName: 'riskLevel',
          props: {
            clearable: true
          },
          options: vm.statusArgsWithElOptionsTag('product_risk_level')
        },
        {
          labelName: '产品状态',
          tagName: 'el-select',
          modelName: 'productStatus',
          props: {
            clearable: true
          },
          options: vm.statusArgsWithElOptionsTag('product_status')
        },
        {
          labelName: '启动状态',
          tagName: 'el-select',
          modelName: 'openStatus',
          props: {
            clearable: true
          },
          options: [
            {
              label: '开放',
              value: 'open'
            },
            {
              label: '即将开放',
              value: 'soon'
            },
            {
              label: '关闭',
              value: 'closed'
            }
          ]
        },
        {
          labelName: '是否代销',
          tagName: 'el-select',
          modelName: 'isProxy',
          props: {
            clearable: true
          },
          options: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ]
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
    return options;
  },
  filterModel: {
    isProxy: '', // 是否代销
    productName: '', // 产品名称
    productType: '', // 产品类型
    riskLevel: '', // 风险等级
    productStatus: '', // 产品状态
    openStatus: '' // 启动状态
  },
  tableColumn: vm => [
    {
      label: '操作',
      props: {
        align: 'center',
        width: 180,
        fixed: 'right',
        formatter: row => {
          // 后台联调要改
          const h = vm.$createElement;
          return (
            <div class='href-container'>
              <a hidden={!(row.openStatus === 0)} onClick={(item) => vm.goToDeclarationForm(row, 'add')}
              >启动报单</a>
              <a class='mr10' hidden={!(row.openStatus === 1 || row.openStatus === 2)} onClick={(item) => vm.goToDeclarationForm(row, 'edit')}
              >编辑报单</a>
              <a hidden={!(row.openStatus === 1)} onClick={(item) => vm.closeDeclaration(row)}
              >关闭报单</a>
            </div>
          );
        }
      }
    },
    {
      label: '产品名称',
      dataKey: 'productName',
      props: {
        width: 300
      }
    },
    {
      label: '产品状态',
      dataKey: 'productStatus',
      props: {
        width: 120,
        formatter: row => vm.enumArgs['product_status'][`${row.productStatus.toString()}`]
      }
    },
    {
      label: '是否代销',
      dataKey: 'isProxy',
      props: {
        width: 120,
        formatter: row => row.isProxy === 1 ? '是' : row.isProxy === 0 ? '否' : '-'
      }
    },
    {
      label: '风险等级',
      dataKey: 'riskLevelName',
      props: {
        width: 120
      }
    },
    {
      label: '产品类型',
      dataKey: 'productType',
      props: {
        width: 100,
        formatter: row => vm.enumArgs['product_type'][`${row.productType.toString()}`]
      }
    },
    {
      label: '报单开放状态',
      dataKey: 'openStatusStr',
      props: {
        width: 200
      }
    },
    {
      label: '已报单金额（元）',
      dataKey: 'sumBookingBalance',
      props: {
        align: 'right',
        width: 140,
        formatter: row => vm.$utils.number.formatMoney(row.sumBookingBalance, 2, false)
      }
    },
    {
      label: '已报单客户数',
      dataKey: 'countCustomer',
      props: {
        align: 'right',
        width: 120,
        formatter: row => row.countCustomer ? row.countCustomer : '0'
      }
    },
    {
      label: '已报单理财师数',
      dataKey: 'countSales',
      props: {
        align: 'right',
        width: 120,
        formatter: row => row.countSales ? row.countSales : '0'
      }
    },
    {
      label: '折标系数',
      dataKey: 'commisionConvert',
      props: {
        align: 'right',
        width: 120,
        formatter: row => {
          if (!row.commisionConvert && row.commisionConvert !== 0) {
            return '-';
          }
          return row.commisionConvert;
        }
      }
    },
    {
      label: '提成比例',
      dataKey: 'commisionRate',
      props: {
        align: 'right',
        width: 120,
        formatter: row => {
          if (!row.commisionRate && row.commisionRate !== 0) {
            return '-';
          }
          return row.commisionRate + '%';
        }
      }
    }
  ]
};
