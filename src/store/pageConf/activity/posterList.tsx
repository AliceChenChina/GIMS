import { ListViewer, ListViewerState } from '@/types/types';
import posterList from '@/components/page/activity/posterList';
import { ActivityStatus } from '@/store/modules/activity/types';

const posterListColumns: ListViewerState<ListViewer & posterList> = {
  filterOptions(vm: ListViewer & posterList) {
    return [
      [
        {
          labelName: '海报名称',
          tagName: 'el-input',
          modelName: 'cfgName',
          props: {
            clearable: true,
            placeholder: '海报名称'
          }
        },
        {
          labelName: '活动状态',
          tagName: 'el-select',
          modelName: 'onlineStatus',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: [
            {
              label: '下线',
              value: '0'
            },
            {
              label: '在线',
              value: '1'
            },
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
                click: vm.doQueryWithDayCheck
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
              innerText: '新建海报',
              props: {
                type: 'primary',
                icon: 'el-icon-plus'
              },
              eventOn: {
                click: vm.createActivity
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    cfgName: '',
    onlineStatus: ''
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 180,
        fixed: 'right',
        formatter: (row: any) => {
          const h = vm.$createElement;
          function handleClick(fn: Function, params: any) {
            return () => fn(params);
          }
          const btns = [
            (<el-button type="text" onClick={handleClick(vm.editActivityBase, row)}>编辑</el-button>),
            (<el-button type="text" onClick={handleClick(vm.delActivity, row)}>删除</el-button>)
          ];
          switch (row.onlineStatus) {
            case 0:
              btns.push((<el-button type="text" onClick={handleClick(vm.setActivityOnline, row)}>上线</el-button>));
              return btns;
            case 1:
              btns.push((<el-button size="mini" type="text" onClick={handleClick(vm.setActivityOffline, row)}>下线</el-button>));
              return btns;
          }
        }
      }
    },
    {
      label: '海报ID',
      dataKey: 'id',
      props: {
        width: 70
      }
    },
    {
      label: '海报名称',
      dataKey: 'cfgName',
      props: {
        width: 150
      }
    },
    {
      label: '创建人',
      dataKey: 'createdUserName',
      props: {
        width: 120
      }
    },
    {
      label: '创建时间',
      dataKey: 'createdTimeStr',
      props: {
        width: 150
      }
    },
    {
      label: '二维码链接',
      dataKey: 'linkUrl',
      props: {
        width: 150
      }
    },
    {
      label: '是否生成专属链接',
      dataKey: 'linkShow',
      props: {
        width: 120,
        formatter(row: any) {
          switch (row.linkShow) {
            case 0:
              return '否';
            case 1:
              return '是';
          }
        }
      }
    },
    {
      label: '有效期',
      dataKey: 'startTimeStr',
      props: {
        width: 300,
        formatter(row: any) {
          return (row.startTimeStr) && row.endTimeStr ? `${row.startTimeStr}至${row.endTimeStr}` : '-'
        }
      }
    },
    {
      label: '当前状态',
      dataKey: 'onlineStatus',
      props: {
        formatter(row: any) {
          switch (row.onlineStatus) {
            case 1:
              return '在线';
            case 0:
              return '下线';
          }
        }
      }
    }
  ],
  tableData: {
    records: [], // any类型为后端返回的接口数据内容
    totalRecordCount: 0
  }
};

export { posterListColumns };
