import { ListViewer, ListViewerState } from '@/types/types';
import articleList from '@/components/page/activity/articleList';
import { ActivityStatus } from '@/store/modules/activity/types';

const articleListColumns: ListViewerState<ListViewer & articleList> = {
  filterOptions(vm: ListViewer & articleList) {
    return [
      [
        {
          labelName: '文章名称',
          tagName: 'el-input',
          modelName: 'activityTitle',
          props: {
            clearable: true,
            placeholder: '文章名称'
          }
        },
        {
          labelName: '当前状态',
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
                click: vm.doResetArticle
              }
            },
            {
              tagName: 'el-button',
              innerText: '新建文章规则',
              props: {
                type: 'primary',
                icon: 'el-icon-plus'
              },
              eventOn: {
                click: vm.createActivity
              }
            },
            {
              tagName: 'el-button',
              innerText: '外部文章链接',
              props: {
              },
              eventOn: {
                click: vm.addArticleLink
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    activityTitle: '',
    activityStatus: '',
    dataType: 2
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 240,
        fixed: 'right',
        formatter: (row: any) => {
          const h = vm.$createElement;
          function handleClick(fn: Function, params: any) {
            return () => fn(params);
          }
          const btns = [
            (<el-button type="text" onClick={handleClick(vm.editActivityDetail, row)}>编辑页面</el-button>),
            (<el-button type="text" onClick={handleClick(vm.editActivityBase, row)}>编辑规则</el-button>)
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
      label: '文章ID',
      dataKey: 'id',
      props: {
        width: 70
      }
    },
    {
      label: '文章名称',
      dataKey: 'activityTitle',
      props: {
        width: 150
      }
    },
    {
      label: '链接地址',
      dataKey: 'activityLink',
      props: {
        width: 150
      }
    },
    {
      label: '浏览条件',
      dataKey: 'viewPermissions',
      props: {
        width: 120,
        formatter: row => row.viewPermissions ? vm.$store.state.argEnum['view_permission'][`${row.viewPermissions.toString()}`] : '-'
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
      label: '产品类型',
      dataKey: 'productType',
      props: {
        width: 120,
        formatter: row => row.productType ? vm.$store.state.argEnum['article_product_type'][`${row.productType.toString()}`] : '-'
      }
    },
    {
      label: '标签',
      dataKey: 'labels',
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
      label: '有效期',
      dataKey: 'validTime',
      props: {
        width: 300
      }
    },
    {
      label: '当前状态',
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

export { articleListColumns };
