/*
产品库
 */

const getDtoObject = (object, key, formatter) => {
  try {
    if (formatter instanceof Function) {
      return formatter(object[key]);
    }
    return object[key];
  } catch (e) {
    return '';
  }
};

export default {
  filterOptions(vm) {
    return [
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
          labelName: '标题',
          tagName: 'el-input',
          modelName: 'title',
          props: {
            clearable: true
          }
        }
      ]
    ];
  },
  filterModel: {
    submiterName: '',
    productName: '', // 产品名称
    title: '' // 产品标题
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 145,
        fixed: 'right'
      },
      slotComps: [
        {
          tagName: 'el-button',
          innerText: '编辑',
          props: {
            type: 'text',
            size: 'mini'
          },
          eventOn(scope) {
            return {
              click() {
                vm.editProductNotice(scope.row);
              }
            };
          }
        },
        {
          tagName: 'el-button',
          innerText: '删除',
          props: {
            type: 'text',
            size: 'mini'
          },
          eventOn(scope) {
            return {
              click() {
                vm.deleteProductNotice(scope.row);
              }
            };
          }
        }
      ]
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
      dataKey: 'product.productName', // 排序用的key
      props: {
        formatter: row => getDtoObject(row.productDto, 'productName')
      }
    },
    {
      label: '标题',
      dataKey: 'title'
    },
    {
      label: '提交日期',
      dataKey: 'submitTime',
      props: {
      }
    }
  ]
};
