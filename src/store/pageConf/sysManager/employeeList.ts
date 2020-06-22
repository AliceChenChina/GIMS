import { ListViewerState, ListViewer } from '@/types/types';
import EmployeeListVueClass from '@/components/page/sysManager/EmployeeList';

export const employeeListState: ListViewerState<EmployeeListVueClass & ListViewer> = {
  filterOptions(vm: EmployeeListVueClass & ListViewer) {
    return [
      [
        {
          labelName: '用户名',
          tagName: 'el-input',
          modelName: 'loginName',
          props: {
            clearable: true,
            placeholder: '用户名'
          }
        },
        {
          labelName: '姓名',
          tagName: 'el-input',
          modelName: 'name',
          props: {
            clearable: true,
            placeholder: '姓名'
          }
        },
        {
          labelName: '手机号',
          tagName: 'el-input',
          modelName: 'mobile',
          props: {
            type: 'number',
            clearable: true,
            placeholder: '手机号'
          }
        },
        {
          labelName: '状态',
          tagName: 'el-select',
          modelName: 'status',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: [
            {
              label: '在职',
              value: 1
            },
            {
              label: '离职',
              value: 2
            }
          ]
        },
        {
          labelName: '',
          tagName: 'el-button-group',
          modelName: '',
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
      ],
      [
        {
          labelName: '',
          tagName: 'el-button-group',
          modelName: '',
          slotComps: [
            {
              tagName: 'el-button',
              innerText: '添加',
              props: {
                type: 'primary'
              },
              eventOn: {
                click: vm.addUser
              }
            },
            {
              tagName: 'el-button',
              innerText: '下载理财师名片',
              props: {
              },
              eventOn: {
                click: vm.downloadCreditCard
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    loginName: '',
    name: '',
    mobile: '',
    status: ''
  },
  tableColumn: vm => [
    {
      label: '',
      dataKey: '',
      props: {
        type: 'selection',
        selectable: (row: any, index: number) => {
          return true;
        }
      }
    },
    {
      label: '操作',
      modelName: '',
      dataKey: '',
      props: {
        align: 'center',
        width: 220,
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
          eventOn(scope: any) {
            return {
              click() {
                vm.editUser(scope.row);
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
          eventOn(scope: any) {
            return {
              click() {
                vm.delUser(scope.row);
              }
            };
          }
        },
        {
          tagName: 'el-button',
          innerText: '设置角色',
          props: {
            type: 'text',
            size: 'mini'
          },
          eventOn(scope: any) {
            return {
              click() {
                vm.editRole(scope.row);
              }
            };
          }
        },
        {
          tagName: 'el-button',
          innerText: '重置密码',
          props: {
            type: 'text',
            size: 'mini'
          },
          eventOn(scope: any) {
            return {
              click() {
                vm.resetUserPwd(scope.row);
              }
            };
          }
        }
      ]
    },
    {
      label: '用户名',
      dataKey: 'loginName',
      props: {
        sortable: 'custom',
        width: 120
      }
    },
    {
      label: '姓名',
      dataKey: 'name',
      props: {
        sortable: 'custom',
        width: 120
      }
    },
    {
      label: '京东用户名',
      dataKey: 'pinCode',
      props: {
        sortable: 'custom',
        width: 120
      }
    },
    {
      label: '部门名称',
      dataKey: 'deptNames',
      props: {
        sortable: 'custom',
        width: 140
      }
    },
    {
      label: '角色',
      dataKey: 'roleName',
      props: {
        sortable: 'custom',
        width: 100
      }
    },
    {
      label: '职务',
      dataKey: 'duty',
      props: {
        sortable: 'custom',
        width: 100
      }
    },
    {
      label: '职级',
      dataKey: 'isAreaManager',
      props: {
        sortable: 'custom',
        width: 100,
        formatter: (row: any) => row.isAreaManager === 1 ? '上级' : row.isAreaManager === 0 ? '普通成员' : '-'
      }
    },
    {
      label: '手机号',
      dataKey: 'mobile',
      props: {
        sortable: 'custom',
        width: 140
      }
    },
    {
      label: '资质证书',
      dataKey: 'hasQualification',
      props: {
        sortable: 'custom',
        width: 120,
        formatter: (row: any) => row.hasQualification === 1 ? '有' : '无'
      }
    },
    {
      label: '状态',
      dataKey: 'status',
      props: {
        width: 80,
        sortable: 'custom',
        formatter: (row: any) => row.status === 1 ? '在职' : '离职'
      }
    }
  ],
  tableData: {
    records: [], // any类型为后端返回的接口数据内容
    totalRecordCount: 0
  }
};
