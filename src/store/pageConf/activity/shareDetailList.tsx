import { ListViewer, ListViewerState } from '@/types/types';
import ShareDetailList from '@/components/page/activity/shareDetailList';

const shareDetailListColumns: ListViewerState<ListViewer & ShareDetailList> = {
  filterOptions(vm: ListViewer & ShareDetailList) {
    return [
      [
        {
          labelName: '理财师名字',
          tagName: 'el-input',
          modelName: 'sharerName',
          props: {
            clearable: true,
            placeholder: '理财师名字'
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
              innerText: '导出',
              props: {
                icon: 'el-icon-download'
              },
              eventOn: {
                click: () => { vm.doExport(); }
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    sharerName: ''
  },
  tableColumn: vm => [
    {
      label: '理财师姓名',
      dataKey: 'sharerName',
      props: {
        width: 150
      }
    },
    {
      label: '最近分享时间',
      dataKey: 'lastestShareTime',
      props: {
        width: 150
      }
    },
    {
      label: '分享次数',
      dataKey: 'shareTimes',
      props: {
        width: 100
      }
    },
    {
      label: '客户访问次数',
      dataKey: 'visitTimes',
      props: {
        width: 100
      }
    },
    {
      label: '预约次数',
      dataKey: 'appointTimes',
      props: {
        width: 100
      }
    },
    {
      label: '成交次数',
      dataKey: 'tradeTimes',
      props: {
        width: 100
      }
    },
    {
      label: '成交金额',
      dataKey: 'tradeMoney',
      props: {
        width: 100
      }
    },
    {
      label: '资产证明人数',
      dataKey: 'assetProofTimes',
      props: {
        width: 100
      }
    },
    {
      label: '分享人pin',
      dataKey: 'sharePin',
      props: {
        width: 150
      }
    },
    {
      label: '是否是理财师',
      dataKey: 'sharerIsSales',
      props: {
        'min-width': 100,
        formatter: row => row.sharerIsSales === 1 ? '是' : '否'
      }
    }
  ],
  tableData: {
    records: [], // any类型为后端返回的接口数据内容
    totalRecordCount: 0
  }
};

export { shareDetailListColumns };
