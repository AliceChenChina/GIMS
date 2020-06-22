/*
净值列表
 */
export default function netValue(type) {
  return {
    filterOptions(vm) {
      return [
        [
          {
            labelName: '净值日期',
            tagName: 'el-date-picker',
            modelName: 'startTime',
            props: {
              clearable: true,
              placeholder: '开始时间',
              'value-format': 'yyyy-MM-dd 00:00:00'
            }
          },
          {
            labelName: '-',
            tagName: 'el-date-picker',
            modelName: 'endTime',
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
      startTime: '',
      endTime: ''
    },
    tableColumn: vm => {
      let option = [
        {
          label: '净值日期',
          dataKey: 'netDate',
          props: {
            formatter: (row) => vm.$utils.dateFormat(row.netDate, 'yyyy-mm-dd')
          }
        },
        {
          label: '单位净值(元)',
          props: {
            align: 'right',
            formatter: (row) => vm.$utils.number.toDecimal(row.netValue, 4)
          }
        },
        {
          label: '累计净值(元)',
          props: {
            align: 'right',
            formatter: (row) => vm.$utils.number.toDecimal(row.netValueAccu, 4)
          }
        }
      ];
      const action = {
          label: '操作',
          dataKey: '',
          props: {
            align: 'center',
            width: 90,
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
                    vm.editNetValue(scope.row);
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
                    vm.deleteNetValue(scope.row);
                  }
                };
              }
            }
          ]
        };
      const number = {
          label: '序号',
          dataKey: '',
          props: {
            width: 60,
            align: 'left',
            formatter: (row, column, cellValue, index) => {
              const {currentPageNo, pageSize} = vm.paginationState;
              return (currentPageNo - 1) * pageSize + index + 1;
            }
          }
        };
      if (type === 'fromNetList') {
        option.unshift(action);
      };
      if (type === 'fromProductList') {
        option.unshift(number);
      };
      return option;
    }
  };
};
