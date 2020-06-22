
export default {
  filterOptions: vm => {
    const recommendSourceOption = [{
      label: '后台推荐',
      value: '1'
    },{
      label: 'App推荐',
      value: '2'
    }];
    const options = [
      [
        {
          labelName: '客户姓名',
          tagName: 'el-input',
          modelName: 'userName',
          props: {
            clearable: true,
            placeholder: '',
            size: 'small'
          }
        },
        {
          labelName: '推荐状态',
          tagName: 'el-select',
          modelName: 'recommendStatus',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('recommend_status')
        },
        {
          labelName: '推荐形式',
          tagName: 'el-select',
          modelName: 'recommendForm',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('recommend_form')
        },
        {
          labelName: '推荐来源',
          tagName: 'el-select',
          modelName: 'recommendSource',
          props: {
            clearable: true,
            placeholder: ''
          },
          options: recommendSourceOption
        }
      ],
      [
        {
          labelName: '编辑时间',
          tagName: 'el-date-picker',
          props: {
            clearable: true,
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'startTime',
            endTime: 'endTime',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            'default-time': ['00:00:00', '23:59:59']
          }
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
                icon: 'el-icon-refresh-left'
              },
              eventOn: {
                click: vm.doDefaultReset
              }
            },
            {
              tagName: 'el-button',
              innerText: '新增推荐',
              props: {
                type: 'primary',
                icon: 'el-icon-add',
              },
              eventOn: {
                click: vm.add
              }
            }
          ]
        }
      ]
    ];
    // disabled: vm.loginRole.loginRole === 99
    return options;
  },
  filterModel: {
    startTime: '',
    endTime: '',
    userName: '', // 客户姓名
    recommendStatus: '', // 推荐状态
    recommendForm: '', // 推荐形式
    recommendSource: '', // 推荐来源
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 200,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          return (
            <div>
              <el-button type="text" size="mini" onClick={ () => { vm.check(row, 'check'); } }>查看</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.check(row, 'edit'); } }>编辑</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.delete(row); } }>删除</el-button>
            </div>
          );
        }
      }
    },
    {
      label: '序号',
      props: {
        width: 120,
        align: 'center',
        formatter: (row, column, cellValue, index) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '推荐客户',
      props: {
        width: 140,
        formatter: row => {
          if (!row.recommendType) {
            return '-';
          }
          if (row.recommendType === 1) {
            return row.recommendCustomer ? row.recommendCustomer : '-';
          }
          if (row.recommendType === 2) {
            return row.userNameList ? row.userNameList : '-';
          }
        }
      }
    },
    {
      label: '推荐类型',
      dataKey: 'recommendType',
      props: {
        width: 140,
        formatter: row => {
          if (!row.recommendType) {
            return '-';
          }
          if (row.recommendType === 1) {
            return '按组推荐';
          }
          if (row.recommendType === 2) {
            return '指定用户推荐';
          }
          if (row.recommendType === 3) {
            return '按人群推荐';
          }
        }
      }
    },
    {
      label: '推荐产品',
      dataKey: 'proName',
      props: {
        width: 200
      }
    },
    {
      label: '推荐角色',
      dataKey: 'recommendRole',
      props: {
        formatter: row => row.recommendRole ? vm.enumArgs['recommend_role'][`${row.recommendRole.toString()}`] : '-'
      }
    },
    {
      label: '推荐形式',
      dataKey: 'recommendForm',
      props: {
        formatter: row => row.recommendForm ? vm.enumArgs['recommend_form'][`${row.recommendForm.toString()}`] : '-'
      }
    },
    {
      label: '状态',
      dataKey: 'recommendStatus',
      props: {
        formatter: row => row.recommendStatus ?  vm.enumArgs['recommend_status'][`${row.recommendStatus.toString()}`] : '-'
      }
    },
    {
      label: '推荐来源',
      dataKey: 'recommendSource',
      props: {
        formatter: row => row.recommendSource ? row.recommendSource === 1 ? '后台推荐' : row.recommendSource === 2 ? 'App推荐' : '-' : '-'
      }
    },
    {
      label: '上线时间',
      dataKey: 'onlineTime',
      props: {
        width: 160
      }
    },
    {
      label: '下线时间',
      dataKey: 'offlineTime',
      props: {
        width: 160
      }
    },
    {
      label: '编辑时间',
      dataKey: 'formattedCreatedTime',
      props: {
        width: 160
      }
    }
  ]
};
