import { ListViewer, ListViewerState } from '@/types/types';
import ActivityList from '@/components/page/activity/activity';
import { ActivityStatus } from '@/store/modules/activity/types';

const activityListColumns: ListViewerState<ListViewer & ActivityList> = {
  filterOptions(vm: ListViewer & ActivityList) {
    return [
      [
        {
          labelName: '活动标题',
          tagName: 'el-input',
          modelName: 'activityTitle',
          props: {
            clearable: true,
            placeholder: '活动标题'
          }
        },
        {
          labelName: '备注名称',
          tagName: 'el-input',
          modelName: 'remarkName',
          props: {
            clearable: true,
            placeholder: '备注名称'
          }
        },
        {
          labelName: '活动链接',
          tagName: 'el-input',
          modelName: 'activityLink',
          props: {
            clearable: true,
            placeholder: '活动链接'
          }
        },
        {
          labelName: '活动状态',
          tagName: 'el-select',
          modelName: 'activityStatus',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: [
            {
              label: '草稿',
              value: ActivityStatus.draft
            },
            {
              label: '在线',
              value: ActivityStatus.online
            },
            {
              label: '下线',
              value: ActivityStatus.offline
            }
          ]
        }
      ],
      [
        {
          labelName: '有效时间',
          tagName: 'el-date-picker',
          modelName: 'startTime',
          props: {
            type: 'datetime',
            clearable: true,
            placeholder: '选择时间',
            'value-format': 'yyyy-MM-dd HH:mm:ss'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'endTime',
          props: {
            type: 'datetime',
            clearable: true,
            placeholder: '选择时间',
            'value-format': 'yyyy-MM-dd HH:mm:ss'
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
              innerText: '新建活动',
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
    activityTitle: '',
    remarkName: '',
    activityLink: '',
    startTime: '',
    endTime: '',
    activityStatus: '',
    dataType: 1
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
            (<el-button type="text" onClick={handleClick(vm.editActivityBase, row)}>编辑规则</el-button>),
            (<el-button type="text" onClick={handleClick(vm.editActivityDetail, row)}>编辑页面</el-button>)
          ];
          switch (row.activityStatus) {
            case ActivityStatus.draft:
              btns.push((<el-button type="text" onClick={handleClick(vm.delActivity, row)}>删除</el-button>));
              return btns;
            case ActivityStatus.offline:
              btns.push((<el-button type="text" onClick={handleClick(vm.setActivityOnline, row)}>上线</el-button>));
              return btns;
            case ActivityStatus.online:
              btns.push((<el-button size="mini" type="text" onClick={handleClick(vm.setActivityOffline, row)}>下线</el-button>));
              return btns;
          }
        }
      }
    },
    {
      label: '活动ID',
      dataKey: 'id',
      props: {
        width: 70
      }
    },
    {
      label: '备注名称',
      dataKey: 'remarkName',
      props: {
        width: 150
      }
    },
    {
      label: '活动标题',
      dataKey: 'activityTitle',
      props: {
        width: 190
      }
    },
    {
      label: '活动链接地址',
      dataKey: 'activityLink',
      props: {
        width: 440
      }
    },
    {
      label: '活动有效时间',
      dataKey: 'validTime',
      props: {
        width: 300
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
      label: '创建人',
      dataKey: 'createdUserName',
      props: {
        width: 100
      }
    },
    {
      label: '活动状态',
      dataKey: 'activityStatus',
      props: {
        formatter(row: any) {
          switch (row.activityStatus) {
            case ActivityStatus.draft:
              return '草稿';
            case ActivityStatus.online:
              return '在线';
            case ActivityStatus.offline:
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

export { activityListColumns };
