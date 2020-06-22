/*
基金经理
 */
export default function(vm) {
  return [
    {
      label: '操作',
      props: {
        align: 'center',
        width: 120,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;',
              class: vm.status === 'check' ? 'disable' : 'able',
              on: {
                click: () => {
                  if (vm.status === 'check') {
                    return false;
                  }
                  clickEvent(row);
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.editLink, '编辑'),
            getHref(vm.deleteLink, '删除')
          ];
          return vm.$createElement('div', {}, links);
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
          return index + 1;
        }
      }
    },
    {
      label: '联系人',
      dataKey: 'name',
      props: {
        width: 100
      }
    },
    {
      label: '联系地址',
      dataKey: 'linkAddreess',
      props: {
        width: 140
      }
    },
    {
      label: '手机',
      dataKey: 'mobilephone',
      props: {
        width: 140
      }
    },
    {
      label: '固定电话',
      dataKey: 'telphone'
    },
    {
      label: '电子邮件',
      dataKey: 'email'
    },
    {
      label: '备注',
      dataKey: 'remark',
      props: {
        width: 130
      }
    }
  ];
}
