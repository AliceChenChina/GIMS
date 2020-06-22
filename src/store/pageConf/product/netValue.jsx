/*eslint-disable*/
/*
产品净值管理
 */

const getDtoObject = (object, key, formatter) => {
  try {
    if (formatter instanceof Function) {
      return formatter(object[key]);
    }
    return object[key];
  } catch (e) {
    return '-';
  }
};

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
            },
            {
              tagName: 'el-button',
              innerText: '下载净值模板',
              props: {
                icon: 'el-icon-download'
              },
              eventOn: {
                click: vm.downloadTemplate
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    productName: ''
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 180,
        fixed: 'right',
        formatter: row => {
          const h = vm.$createElement; // vue-cli配置transform-vue-jsx插件和vue文件会冲突，暂时手动注入一下h
          return (
            <div>
              <a
                class={['product-list-href', row.isProxy !== 1 ? 'enabled':'']}
                onClick={() => row.isProxy !== 1 ? vm.newNetValue(row) : ''}
              >新建净值</a>
              <a
                class={['product-list-href', row.isProxy !== 1 ? 'enabled':'']}
                onClick={() => row.isProxy !== 1 ? vm.importNetValue(row) : ''}
              >导入净值</a>
              <a
                class={ ['product-list-href', 'enabled'] }
                onClick={ () => vm.gotoProductInfoWithNetVal(row.productId, row.productName) }
              >查看</a>
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
        width: 250,
        sortable: 'custom'
      }
    },
    {
      label: '产品类型',
      dataKey: 'productType',
      props: {
        width: 100,
        sortable: 'custom',
        formatter: row => vm.enumArgs['product_type'][row.productType]
      }
    },
    {
      label: '净值日期',
      dataKey: 'productNetValueEntity.netDate', // 排序用的key
      props: {
        width: 100,
        formatter: row => getDtoObject(row.productNetValueDto, 'netDate').substring(0, 10),
        sortable: 'custom'
      }
    },
    {
      label: '单位净值',
      dataKey: 'productNetValueEntity.netValue',
      props: {
        align: 'right',
        width: 100,
        formatter: row => getDtoObject(row.productNetValueDto, 'netValue', (value) => vm.$utils.number.toDecimal(value, 4)),
        sortable: 'custom'
      }
    },
    {
      label: '累计净值',
      dataKey: 'productNetValueEntity.netValueAccu',
      props: {
        align: 'right',
        width: 100,
        formatter: row => getDtoObject(row.productNetValueDto, 'netValueAccu', (value) => vm.$utils.number.toDecimal(value, 4)),
        sortable: 'custom'
      }
    },
    {
      label: '复权累计净值',
      dataKey: 'productNetValueEntity.swaNav',
      props: {
        align: 'right',
        width: 120,
        formatter: row => getDtoObject(row.productNetValueDto, 'swaNav', (value) => vm.$utils.number.toDecimal(value, 4)),
        sortable: 'custom'
      }
    },
    {
      label: '近一个月涨幅',
      dataKey: 'productNetValueEntity.recentlyOneMonth',
      props: {
        width: 120,
        formatter: row => getDtoObject(row.productNetValueDto, 'recentlyOneMonth', (value) => vm.$utils.number.deciToPer(value)),
        sortable: 'custom'
      }
    },
    {
      label: '近三个月涨幅',
      dataKey: 'productNetValueEntity.recentlyThreeMonth',
      props: {
        width: 120,
        formatter: row => getDtoObject(row.productNetValueDto, 'recentlyThreeMonth', (value) => vm.$utils.number.deciToPer(value)),
        sortable: 'custom'
      }
    },
    {
      label: '近六个月涨幅',
      dataKey: 'productNetValueEntity.recentlySixMonth',
      props: {
        width: 120,
        formatter: row => getDtoObject(row.productNetValueDto, 'recentlySixMonth', (value) => vm.$utils.number.deciToPer(value)),
        sortable: 'custom'
      }
    },
    {
      label: '近一年涨幅',
      dataKey: 'productNetValueEntity.recentlyOneYear',
      props: {
        width: 120,
        formatter: row => getDtoObject(row.productNetValueDto, 'recentlyOneYear', (value) => vm.$utils.number.deciToPer(value)),
        sortable: 'custom'
      }
    },
    {
      label: '今年以来涨幅',
      dataKey: 'productNetValueEntity.thisYear',
      props: {
        width: 120,
        formatter: row => getDtoObject(row.productNetValueDto, 'thisYear', (value) => vm.$utils.number.deciToPer(value)),
        sortable: 'custom'
      }
    },
    {
      label: '成立以来涨幅',
      dataKey: 'productNetValueEntity.total',
      props: {
        width: 120,
        formatter: row => getDtoObject(row.productNetValueDto, 'total', (value) => vm.$utils.number.deciToPer(value)),
        sortable: 'custom'
      }
    }
  ]
};
