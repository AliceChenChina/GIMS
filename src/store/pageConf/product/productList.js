/*
产品库
 */
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '产品信息',
          tagName: 'el-input',
          modelName: 'productInfo',
          props: {
            clearable: true,
            placeholder: '产品skuid/产品名称/产品简称/备案编号'
          }
        },
        {
          labelName: '产品类型',
          tagName: 'el-select',
          modelName: 'productType',
          options: [
            ...vm.statusArgsWithElOptionsTag('product_type')
          ],
          props: {
            clearable: true
          }
        },
        {
          labelName: '产品销售类型',
          tagName: 'el-select',
          modelName: 'productSaleType',
          options: [
            ...vm.statusArgsWithElOptionsTag('product_sales_type')
          ],
          props: {
            clearable: true
          }
        },
      ],
      [
        {
          labelName: '风险等级',
          tagName: 'el-select',
          modelName: 'riskLevel',
          options: [
            ...vm.statusArgsWithElOptionsTag('product_risk_level')
          ],
          props: {
            clearable: true
          }
        },
        {
          labelName: '产品状态',
          tagName: 'el-select',
          modelName: 'productStatus',
          options: [
            ...vm.statusArgsWithElOptionsTag('product_status')
          ],
          props: {
            clearable: true
          }
        },
        {
          labelName: '关联关系',
          tagName: 'el-select',
          modelName: 'ytRelationType',
          props: {
            clearable: true,
          },
          options: [
            ...vm.statusArgsWithElOptionsTag('relation_type')
          ],
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
    orderColumn: '',
    productId: '',
    productInfo: '',
    productType: '',
    productShortName: '',
    productCode: '',
    riskLevel: '',
    productStatus: '',
    ytRelationType: '',
    productSaleType: ''
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 240,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          // loginRole 1 理财师 2 运营 3 管理员
          return (
            <div>
              <el-button type="text" size="mini" disabled={row.ytRelationType !== 1}  onClick={ () => { vm.getStrongRelationType(row.productId); } }>设为强关联</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.gotoProductEdit(row.productId, row.productType); } }>编辑</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.modifyProductType(row); } }>修改产品类型</el-button>
            </div>
          );
        }
      }
    },
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
      label: '产品skuid',
      dataKey: 'groupProductId',
      props: {
        sortable: 'custom',
        width: 120
      }
    },
    {
      label: '产品名称',
      dataKey: 'productName',
      props: {
        width: 120,
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
        width: 120,
        sortable: 'custom'
      }
    },
    {
      label: '备案编号',
      dataKey: 'regCode',
      props: {
        sortable: 'custom',
        width: 120,
      }
    },
    {
      label: '产品类型',
      dataKey: 'productTypeName',
      props: {
        sortable: 'custom',
        width: 120,
      }
    },
    {
      label: '产品销售类型',
      dataKey: 'productSaleType',
      props: {
        sortable: 'custom',
        width: 120,
        formatter: row => row.productSaleType === null ? '-' : vm.enumArgs['product_sales_type'][row.productSaleType]
      }
    },
    {
      label: '好赚产品类型',
      dataKey: 'accountType',
      props: {
        sortable: 'custom',
        width: 120,
        formatter: row => row.accountType === null ? '-' : vm.enumArgs['account_type'][row.accountType]
      }
    },
    {
      label: '产品风险等级',
      dataKey: 'riskLevelName',
      props: {
        sortable: 'custom',
        width: 120,
      }
    },
    {
      label: '产品状态',
      dataKey: 'productStatusName',
      props: {
        align: 'left',
        sortable: 'custom',
        width: 120,
      }
    },
    {
      label: '产品审核状态',
      dataKey: 'auditStatusName',
      props: {
        align: 'left',
        sortable: 'custom',
        width: 120,
      }
    },
    {
      label: '云通产品名称',
      dataKey: 'ytProductName',
      props: {
        width: 120,
        sortable: 'custom'
      }
    },
    {
      label: '关联关系',
      dataKey: 'ytRelationType',
      props: {
        sortable: 'custom',
        width: 120,
        formatter: row => row.ytRelationType === null ? '-' : vm.enumArgs['relation_type'][row.ytRelationType]
      }
    }
  ]
};
