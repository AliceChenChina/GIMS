import { ListViewerState, ListViewer } from '@/types/types';
import WorkdayCalendarVueClass from '@/components/page/sysManager/workdayCalendar';

export const workdayCalendarState: ListViewerState<WorkdayCalendarVueClass & ListViewer> = {
  filterOptions(vm: WorkdayCalendarVueClass & ListViewer) {
    return [
      [
        {
          labelName: '年份',
          tagName: 'el-input',
          modelName: 'year',
          props: {
            type: 'number',
            clearable: true,
            placeholder: '年份'
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
            },
            {
              tagName: 'el-button',
              innerText: '查看日历',
              props: {
                icon: 'el-icon-date'
              },
              eventOn: {
                click: vm.showCalendarView
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
              innerText: '新建',
              props: {
                type: 'primary',
                icon: 'el-icon-plus'
              },
              eventOn: {
                click: vm.addDay
              }
            },
            {
              tagName: 'el-button',
              innerText: '按年添加',
              props: {
                icon: 'el-icon-plus'
              },
              eventOn: {
                click: vm.addYear
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    year: new Date().getFullYear()
  },
  tableColumn: vm => [
    {
      label: '操作',
      modelName: '',
      dataKey: '',
      props: {
        align: 'center',
        width: 88,
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
                vm.editDay(scope.row);
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
                vm.removeDay(scope.row);
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
        width: 70,
        formatter: (row: any, column: any, cellValue: any, index: any) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '日期',
      dataKey: 'day',
      props: {
        width: 150,
        formatter: (row: any) => row.day.substring(0, 10)
      }
    },
    {
      label: '工作日',
      dataKey: 'work',
      props: {
        width: 200,
        formatter: (row: any) => parseInt(row.work) === 1 ? '是' : '否'
      }
    },
    {
      label: '备注',
      dataKey: 'remark'
    }
  ],
  tableData: {
    records: [], // any类型为后端返回的接口数据内容
    totalRecordCount: 0
  }
};
