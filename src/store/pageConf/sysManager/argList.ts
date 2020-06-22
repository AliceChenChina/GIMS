import { ListViewer, ListViewerState } from '@/types/types';
import ArgList from '@/components/page/sysManager/argList';

const argListColumns: ListViewerState<ListViewer & ArgList> = {
  filterOptions(vm: ListViewer & ArgList) {
    return [
      [
        {
          labelName: '字典组',
          tagName: 'el-input',
          modelName: 'argGroup',
          props: {
            clearable: true,
            placeholder: '字典组'
          }
        },
        {
          labelName: '字典编码',
          tagName: 'el-input',
          modelName: 'argCode',
          props: {
            clearable: true,
            placeholder: '字典编码'
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
                type: 'primary',
                icon: 'el-icon-plus'
              },
              eventOn: {
                click: vm.addArgItem
              }
            },
            {
              tagName: 'el-button',
              innerText: '导入历史订单',
              props: {
                icon: 'el-icon-upload'
              },
              eventOn: {
                click: vm.importNetValue
              }
            },
            {
              tagName: 'el-button',
              innerText: '导入历史客户',
              props: {
                icon: 'el-icon-upload'
              },
              eventOn: {
                click: vm.importHistoryCustomer
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    argGroup: '',
    argCode: ''
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 80,
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
                vm.editArgItem(scope.row);
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
                vm.delArgItem(scope.row);
              }
            };
          }
        }
      ]
    },
    {
      label: '字典组',
      dataKey: 'argGroup',
      props: {
      }
    },
    {
      label: '字典编码',
      dataKey: 'argCode',
      props: {
      }
    },
    {
      label: '字典文本',
      dataKey: 'argText',
      props: {
      }
    }
  ],
  tableData: {
    records: [], // any类型为后端返回的接口数据内容
    totalRecordCount: 0
  }
};

export { argListColumns };
