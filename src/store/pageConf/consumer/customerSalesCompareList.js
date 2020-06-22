
import utils from '@/utils';
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '客户信息',
          tagName: 'el-input',
          modelName: 'customerInfo',
          props: {
            clearable: true,
            placeholder: '请输入客户姓名或者京东用户名'
          }
        },
        {
          labelName: '东家成交客户',
          tagName: 'el-select',
          modelName: 'isDjTrade',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ]
        },
        {
          labelName: '关系是否一致',
          tagName: 'el-select',
          modelName: 'isEquals',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ]
        },
        {
          labelName: '',
          tagName: 'el-button-group',
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
          labelName: '首次触达时间',
          tagName: 'el-date-picker',
          props: {
            clearable: true,
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'firstTouchTimeStart',
            endTime: 'firstTouchTimeEnd',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            'default-time': ['00:00:00', '23:59:59']
          }
        }
      ]
    ];
    return options;
  },
  filterModel: {
    customerInfo: '', // 客户信息
    isDjTrade: '', // 是否是东家成交客户
    isEquals: '', // 关系是否一致
    firstTouchTimeStart: '', // 首次触达时间
    firstTouchTimeEnd: '' // 首次触达时间 <el-button type="text" size="mini" onClick={ () => { row.isEquals === 1 ? '' : vm.compareGims(row)} } className={ row.isEquals === 1 ? 'disabled' : 'able'}>与GIMS一致</el-button>
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 260,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          return (
            <div class="btns">
              <el-button type="text" size="mini" onClick={ () => { vm.check(row); } }>查看</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.updateSystem(row); } }>更新</el-button>
              <el-button type="text" size="mini" onClick={() => { row.isEquals === 1 ? '' : vm.compareGims(row) }} class={row.isEquals === 1 ? 'disabled' : 'able'}>与GIMS一致</el-button>
              <el-button type="text" size="mini" onClick={ () => { row.isEquals === 1 ? '' : vm.compareNewSystem(row); } } class={ row.isEquals === 1 ? 'disabled' : 'able'}>与京音系统一致</el-button>
            </div>
          );
        }
      }
    },
    {
      label: '京东用户名',
      dataKey: 'pinCode',
      props: {
        width: 120
      }
    },
    {
      label: '客户姓名',
      dataKey: 'trueName',
      props: {
      }
    },
    {
      label: '东家成交客户',
      dataKey: 'isDjTrade',
      props: {
        formatter: (row) => {
          return utils.getTrueOrFalse(row.isDjTrade);
        }
      }
    },
    {
      label: '首次触达时间',
      dataKey: 'firstTouchTime',
      props: {
        width: 160
      }
    },
    {
      label: '理财师姓名',
      dataKey: 'salesName',
      props: {
      }
    },
    {
      label: '关联关系',
      dataKey: 'typeStr',
      props: {
      }
    },
    {
      label: '京音系统归属理财师',
      dataKey: 'agentName',
      props: {
        width: 140
      }
    },
    {
      label: '关系是否一致',
      dataKey: 'isEquals',
      props: {
        formatter: (row) => {
          return utils.getTrueOrFalse(row.isEquals);
        }
      }
    },
    {
      label: '数据更新时间',
      dataKey: 'lastUpdate',
      props: {
        width: 160
      }
    }
  ]
};
