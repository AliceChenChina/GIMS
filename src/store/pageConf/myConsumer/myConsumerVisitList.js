/* 理财师客户模块列表 */
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '客户拜访主题',
          tagName: 'el-input',
          modelName: 'title',
          props: {
            clearable: true,
            placeholder: '客户拜访主题'
          }
        },
        {
          labelName: '拜访方式',
          tagName: 'el-select',
          modelName: 'visitWay',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('visit_way')
        },
        {
          labelName: '拜访日期',
          tagName: 'el-date-picker',
          modelName: 'startTime',
          props: {
            clearable: true,
            placeholder: '开始日期',
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'endTime',
          props: {
            clearable: true,
            placeholder: '结束日期',
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
    title: '', // 客户拜访主题
    visitWay: '', // 拜访方式
    startTime: '', // 开始日期
    endTime: '' // 结束日期
  },
  tableColumn: vm => [
    {
      label: '序号',
      dataKey: ' ',
      props: {
        width: 45,
        formatter: (row, col, cellval, index) => {
          const { currentPageNo, pageSize } = vm.viewerState.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '客户拜访主题',
      dataKey: 'title',
      props: {
        width: 200
      }
    },
    {
      label: '联系人',
      dataKey: 'customerSalesDto',
      props: {
        width: 200,
        formatter: (row, col, cellval, index) => {
            if (cellval) {
              const options = {
                style: 'color: #F52020;cursor:pointer',
                on: {
                  click: () => {
                    vm.goCustomerOverview({ id: cellval.id, pinCode: row.customerObj.pinCode, customerId: cellval.id, relationType: row.customerSalesDto.type });
                  }
                }
              };
              return vm.$createElement('span', options, cellval.contact);
            } else {
              return '';
            }
        }
      }
    },
    {
      label: '拜访开始时间',
      dataKey: 'startTime',
      props: {
        width: 200
      }
    },
    {
      label: '拜访结束时间',
      dataKey: 'endTime',
      props: {
        width: 200
      }
    },
    {
      label: '拜访方式',
      dataKey: 'visitWay',
      props: {
        width: 140,
        formatter(row, col, cellval, index) {
          return vm.enumArgs['visit_way'][cellval] ? vm.enumArgs['visit_way'][cellval] : '-';
        }
      }
    },
    {
      label: '备注',
      dataKey: 'remark'
    },
    {
      label: '操作',
      dataKey: ' ',
      props: {
        width: 100,
        formatter: (row, col, cellval, index) => {
          const editOption = {
            style: 'padding: 0 5px;color: #F52020;cursor:pointer;',
            on: {
              click: () => {
                  vm.editVisit(row.id);
              }
            }
          };
          const removeOption = {
            style: 'padding: 0 5px;color: #F52020;cursor:pointer;',
            on: {
              click: () => {
                  vm.remove(row.id);
              }
            }
          };
          const links = [
            vm.$createElement('a', editOption, '编辑'),
            vm.$createElement('a', removeOption, '删除')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    }
  ]
};
