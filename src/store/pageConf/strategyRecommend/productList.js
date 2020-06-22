
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '',
          tagName: 'el-input',
          modelName: 'productInfo',
          props: {
            clearable: true,
            placeholder: '请输入产品名称/产品简称/skuid',
            size: 'small'
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
    return options;
  },
  filterModel: {
    productInfo: '', // 产品名称，简称或skuId
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 200,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          return (
            <div>
              <el-button type="text" size="mini" onClick={ () => { vm.select(row); } }>选择</el-button>
            </div>
          );
        }
      }
    },
    {
      label: '序号',
      props: {
        width: 120,
        align: 'center',
        formatter: (row, column, cellValue, index) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '产品名称',
      dataKey: 'productNameShort'
    },
    {
      label: '产品状态',
      dataKey: 'productStatusStr'
    },
    {
      label: '收益类型',
      props:{
        formatter: (row) => {
          return row.appProductAttributeVO1 ? row.appProductAttributeVO1.name : '-';
        }
      }
    },
    {
      label: '收益',
      props: {
        formatter: (row) => {
          return row.appProductAttributeVO1 ? row.appProductAttributeVO1.value : '-';
        }
      }
    },
    {
      label: '起投金额',
      props: {
        formatter: (row) => {
          return row.appProductAttributeVO3 ? row.appProductAttributeVO3.value : '-';
        }
      }
    },
    {
      label: '产品期限类型',
      props: {
        formatter: (row) => {
          return row.appProductAttributeVO2 ? row.appProductAttributeVO2.name : '-';
        }
      }
    },
    {
      label: '产品期限',
      props: {
        formatter: (row) => {
          return row.appProductAttributeVO2 ? row.appProductAttributeVO2.value : '-';
        }
      }
    }
  ]
};
