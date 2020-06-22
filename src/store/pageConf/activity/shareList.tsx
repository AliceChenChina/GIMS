import { ListViewer, ListViewerState } from '@/types/types';
import ShareList from '@/components/page/activity/shareList';

const shareListColumns: ListViewerState<ListViewer & ShareList> = {
  filterOptions(vm: ListViewer & ShareList) {
    return [
      [
        {
          labelName: '分享内容',
          tagName: 'el-input',
          modelName: 'shareTitle',
          props: {
            clearable: true,
            placeholder: '分享内容'
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
    shareTitle: ''
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 120,
        fixed: 'right',
        formatter: (row: any) => {
          const h = vm.$createElement;
          return <el-button type="text" onClick={() => { vm.gotoDetailList(row); }}>查看详情</el-button>;
        }
      }
    },
    {
      label: '分享内容',
      dataKey: 'shareTitle',
      props: {
        width: 250
      }
    },
    {
      label: '类型',
      dataKey: 'shareType',
      props: {
        width: 150
      }
    },
    {
      label: '产品类型',
      dataKey: 'articleProductType',
      props: {
        width: 150
      }
    },
    {
      label: '标签',
      dataKey: 'articleLabel',
      props: {
        width: 120
      }
    },
    {
      label: '来源',
      dataKey: 'articleSource',
      props: {
        width: 120
      }
    },
    {
      label: '分享次数',
      dataKey: 'shareTimes',
      props: {
        width: 120
      }
    },
    {
      label: '客户访问次数',
      dataKey: 'visitTimes',
      props: {
        width: 120
      }
    },
    {
      label: '预约次数',
      dataKey: 'appointTimes',
      props: {
        width: 120
      }
    },
    {
      label: '成交次数',
      dataKey: 'tradeTimes',
      props: {
        width: 120
      }
    },
    {
      label: '成交金额',
      dataKey: 'tradeMoney',
      props: {
        width: 120
      }
    },
    {
      label: '资产证明人数',
      dataKey: 'assetProofTimes',
      props: {
        'min-width': 150
      }
    }
  ],
  tableData: {
    records: [], // any类型为后端返回的接口数据内容
    totalRecordCount: 0
  }
};

export { shareListColumns };
