import { ListViewer, ListViewerState, tableColumnFunction } from '@/types/types';
import EmployeeListVueClass from '@/components/page/sysManager/EmployeeList';
import RoleListVueClass from '@/components/page/sysManager/roleListPage';
import PowerListVueClass from '@/components/page/sysManager/powerList';
import { RoleItem } from '@/components/page/sysManager/model/RoleItem';

const roleListColumns: ListViewerState<ListViewer> = {
  tableColumn: vm => [
    {
      label: '序号',
      dataKey: '',
      props: {
        width: 70,
        formatter: (row: any, column: any, cellValue: any, index: any) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '角色名称',
      dataKey: 'name',
      props: {
        sortable: true
      }
    },
    {
      label: '角色描述',
      dataKey: 'remark',
      props: {
        sortable: true
      }
    }
  ],
  tableData: {
    records: [], // any类型为后端返回的接口数据内容
    totalRecordCount: 0
  }
};

type EmployeeListInstance = EmployeeListVueClass & RoleListVueClass & ListViewer;
type PowerListInstance = PowerListVueClass & RoleListVueClass & ListViewer;

export type roleListStateType = EmployeeListInstance & PowerListInstance;

export const getRoleListState = (type: string): ListViewerState<roleListStateType> => {
  if (type === 'emp_list') {
    // 选择角色列表
    return {
      tableColumn: (vm: EmployeeListInstance) => {
        const columnList = (roleListColumns.tableColumn as tableColumnFunction<EmployeeListInstance>)(vm);
        columnList.unshift({
          label: '',
          dataKey: '',
          props: {
            type: 'selection',
            selectable: (row: RoleItem) => {
              if (Object.keys(vm.onSelectList).length === 0) return true;
              return vm.onSelectList.some((roleItem) => roleItem.roleId === row.roleId);
            }
          }
        });
        return columnList;
      },
      tableData: roleListColumns.tableData
    };
  } else {
    const filterOptionsAndModel = {
      filterOptions(vm: ListViewer) {
        return [
          [
            {
              labelName: '角色名称',
              tagName: 'el-input',
              modelName: 'roleName',
              props: {
                clearable: true,
                placeholder: '角色名称'
              }
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
          ]
        ];
      },
      filterModel: {
        roleName: ''
      }
    };
    const columnListFactory = (roleListColumns.tableColumn as tableColumnFunction<EmployeeListInstance | PowerListInstance>);
    if (type === 'power_list') {
      // 角色授权菜单
      return {
        filterOptions: (vm: PowerListInstance) => {
          const options = filterOptionsAndModel.filterOptions(vm);
          options[0][1].slotComps!.push({
            tagName: 'el-button',
            innerText: '保存',
            props: {
              icon: 'el-icon-check'
            },
            eventOn: {
              click: vm.saveRolePower || {}
            }
          });
          return options;
        },
        filterModel: filterOptionsAndModel.filterModel,
        tableColumn: (vm: EmployeeListInstance) => columnListFactory(vm),
        tableData: roleListColumns.tableData,
        tableProps: {
          'highlight-current-row': true
        }
      };
    }
    // 角色管理内容
    return {
      filterOptions: (vm: PowerListInstance) => {
        const options = filterOptionsAndModel.filterOptions(vm);
        options[0][1].slotComps!.push({
          tagName: 'el-button',
          innerText: '新建',
          props: {
            icon: 'el-icon-plus'
          },
          eventOn: {
            click: vm.addRoleItem || {}
          }
        });
        return options;
      },
      filterModel: filterOptionsAndModel.filterModel,
      tableColumn: (vm: EmployeeListInstance) => {
        const columnList = columnListFactory(vm);
        columnList.unshift({
          label: '操作',
          dataKey: '',
          props: {
            align: 'center',
            width: 120,
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
                    vm.editRoleItem(scope.row);
                  }
                };
              }
            },
            {
              tagName: 'el-button',
              innerText: '查看',
              props: {
                type: 'text',
                size: 'mini'
              },
              eventOn(scope: any) {
                return {
                  click() {
                    vm.roleItemDetail(scope.row);
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
                    vm.delRoleItem(scope.row);
                  }
                };
              }
            }
          ]
        });
        return columnList;
      },
      tableData: roleListColumns.tableData
    };
  }
};
