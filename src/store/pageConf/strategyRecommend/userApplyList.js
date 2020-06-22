
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '客户信息',
          tagName: 'el-input',
          modelName: 'userInfo',
          props: {
            clearable: true,
            placeholder: '客户姓名/京东用户名',
            width: 200
          }
        },
        {
          labelName: '理财师是否已推荐',
          tagName: 'el-select',
          modelName: 'recommendFlag',
          props: {
            clearable: true,
            placeholder: ''
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
          labelName: '申请时间',
          tagName: 'el-date-picker',
          props: {
            clearable: true,
            placeholder: '开始时间',
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'applyStartTime',
            endTime: 'applyEndTime',
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
              innerText: '导出',
              props: {
                icon: 'el-icon-bottom'
              },
              eventOn: {
                click: vm.doExport
              }
            },
          ]
        }
      ]
    ];
    return options;
  },
  filterModel: {
    userInfo: '', // 客户信息
    recommendFlag: '', // 理财师是否已推荐
    applyStartTime: '', // 申请开始时间
    applyEndTime: '' // 申请结束时间
  },
  tableColumn: vm => {
    let result = [
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
        label: '申请客户',
        dataKey: 'userName'
      },
      {
        label: 'pin',
        dataKey: 'userPin'
      },
      {
        label: '预算',
        dataKey: 'budget'
      },
      {
        label: '感兴趣产品类型',
        dataKey: 'interestProductType'
      },
      {
        label: '申请时间',
        dataKey: 'applyTime'
      },
      {
        label: '理财师是否已推荐',
        dataKey: 'recommendFlag',
        props: {
          formatter: row => row.recommendFlag === 1 ? '是' : row.recommendFlag === 0 ? '否' : '-'
        }
      }
    ];
    const salesName = {
      label: '理财师姓名',
      dataKey: 'salesName',
    };
    if (!vm.ifSales) {
      // 运营
      result.splice(result.length-2,0,salesName);
    }
    return result;
  }
};
