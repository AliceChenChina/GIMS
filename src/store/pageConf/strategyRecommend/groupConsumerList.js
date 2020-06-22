
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '客户信息',
          tagName: 'el-input',
          modelName: 'userName',
          props: {
            clearable: true,
            placeholder: '客户姓名/京东用户名'
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
                icon: 'el-icon-refresh-right'
              },
              eventOn: {
                click: vm.doDefaultReset
              }
            }
          ]
        }
      ]
    ];
    return options;
  },
  filterModel: {
    userName: '' // 客户信息
  },
  tableColumn: vm =>{
    let mainData = [
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
        label: '京东用户名',
        dataKey: 'pinCode',
        props: {
          width: 160
        }
      },
      {
        label: '客户姓名',
        dataKey: 'customerName'
      },
      {
        label: '联系电话',
        dataKey: 'phone'
      },
      {
        label: '是否实名认证',
        dataKey: 'realNameFlag'
      },
      {
        label: '风险等级',
        dataKey: 'riskLevel'
      },
      {
        label: '私募资产证明',
        dataKey: 'privateStatusStr',
        props: {
          width: 100
        }
      },
      {
        label: '资管资产证明',
        dataKey: 'assetStatusStr',
        props: {
          width: 100
        }
      },
      {
        label: '东家成交客户',
        dataKey: 'djTrade'
      },
      {
        label: '客户来源',
        dataKey: 'source'
      },
      {
        label: '关联关系',
        dataKey: 'relationType'
      }
    ]
    const handle = {
        label: '操作',
        dataKey: '',
        props: {
          align: 'center',
          width: 100,
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            const status = vm.status === 'check'
            const h = vm.$createElement;
            return (
              <div>
                <el-button type="text" size="mini" disabled={status} onClick={ () => { vm.delete(row); } }>删除</el-button>
              </div>
            );
          }
        }
      };
    if (vm.status === 'edit') {
      mainData.unshift(handle);
    }
   return mainData;

  }
};
