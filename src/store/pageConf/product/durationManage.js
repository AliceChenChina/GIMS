/*
存续列表
 */
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '客户姓名',
          tagName: 'el-input',
          modelName: 'customerName',
          props: {
            clearable: true,
            placeholder: '客户姓名'
          }
        },
        {
          labelName: '京东用户名',
          tagName: 'el-input',
          modelName: 'userPin',
          props: {
            clearable: true,
            placeholder: '京东用户名'
          }
        },
        {
          labelName: '理财师',
          tagName: 'el-input',
          modelName: 'plannerName',
          props: {
            clearable: true,
            placeholder: '理财师'
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
  },
  filterModel: {
    customerName: '', // 客户姓名
    plannerName: '', // 理财师姓名
    userPin: '' // 客户pin
  },
  tableColumn: vm => {
    const colArr = [
      {
        label: '客户名称',
        dataKey: 'customerName',
        props: {
        }
      },
      {
        label: '京东用户名',
        dataKey: 'userPin',
        props: {
        }
      },
      {
        label: '身份证号',
        dataKey: 'identificationNo',
        props: {
        }
      },
      {
        label: '持仓份额',
        dataKey: 'durationShare',
        props: {
          align: 'right',
          formatter: row => vm.$utils.number.formatMoney(row.durationShare, 2, 0)
        }
      },
      {
        label: '持仓金额',
        dataKey: 'durationAmount',
        props: {
          align: 'right',
          formatter: row => vm.$utils.number.formatMoney(row.durationAmount, 2, 0)
        }
      },
      {
        label: '理财师',
        dataKey: 'plannerName',
        props: {
        }
      }
    ];
    if (vm.$route.query.type === '类固收') {
      colArr.push({
        label: '确认日期',
        dataKey: 'calDateStr',
        props: {
          width: 140
        }
      });
    }
    return colArr;
  }
};
