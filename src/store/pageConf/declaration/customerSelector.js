/*
选择理财师设置
 */
export default {
  filterOptions(vm) {
    const customerTypeOption = [{
      value: 1,
      label: '个人'
    }, {
      value: 2,
      label: '机构'
    }];
    return [
      [
        {
          labelName: '联系人',
          tagName: 'el-input',
          modelName: 'contact',
          props: {
            clearable: true
          }
        },
        {
          labelName: '客户类型',
          tagName: 'el-select',
          modelName: 'customerType',
          props: {
            clearable: true
          },
          options: customerTypeOption
        },
        {
          labelName: '手机号码',
          tagName: 'el-input',
          modelName: 'mobilephone',
          props: {
            clearable: true
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
    contact: '',
    customerType: '',
    mobilephone: ''
  },
  tableColumn: vm => [
    {
      label: '',
      props: {
        type: 'selection'
      }
    },
    {
      label: '联系人',
      dataKey: 'contact',
      props: {
        width: 160
      }
    },
    {
      label: '客户类型',
      dataKey: 'customerType',
      props: {
        formatter: row => row.customerType ? row.customerType === '1' ? '个人' : row.customerType === '2' ? '机构' : '-' : '-'
      }
    },
    {
      label: '联系方式',
      dataKey: 'mobilePhone',
      props: {
        width: 160
      }
    },
    {
      label: '京东用户名',
      dataKey: 'pinCode',
      props: {
        width: 160
      }
    },
    {
      label: '固定电话',
      dataKey: 'telphone'
    },
    {
      label: '电子邮件',
      dataKey: 'telphone'
    },
    {
      label: '联系地址',
      dataKey: 'address'
    }
  ]
};
