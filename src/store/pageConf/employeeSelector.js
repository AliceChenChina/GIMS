/*
选择理财师设置
 */
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '员工姓名',
          tagName: 'el-input',
          modelName: 'name',
          props: {
            clearable: true,
            placeholder: '员工姓名'
          }
        },
        {
          labelName: '账户名称',
          tagName: 'el-input',
          modelName: 'loginName',
          props: {
            clearable: true,
            placeholder: '账户名称'
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
      ]
    ];
  },
  filterModel: {
    name: '',
    loginName: '',
    mobile: '',
    deptNames: ''
  },
  tableColumn: vm => [
    {
      label: '',
      props: {
        type: 'selection',
        selectable: (row, index) => {
          if (Object.keys(vm.onSelectList).length === 0) return true;
          // 只能单选
          return !!vm.onSelectList[row.empId];
        }
      }
    },
    {
      label: '员工名称',
      dataKey: 'name'
    },
    {
      label: '联系电话',
      dataKey: 'mobile'
    },
    {
      label: '部门名称',
      dataKey: 'deptNames'
    },
    {
      label: '账户名称',
      dataKey: 'loginName'
    },
    {
      label: '状态',
      dataKey: 'status',
      props: {
        formatter: row => {
          if (parseInt(row.status) === 1) {
            return '在职';
          }
          if (parseInt(row.status) === 2) {
            return '离职';
          }
          return '-';
        }
      }
    }
  ]
};
