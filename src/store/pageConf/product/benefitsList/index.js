import benefitsListInterest from './benefitsListInterest';
import benefitsListApportionment from './benefitsListApportionment';
const baseOptions = {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '客户姓名',
          tagName: 'el-input',
          modelName: 'userName',
          props: {
            clearable: true,
            placeholder: '客户姓名'
          }
        },
        {
          labelName: '理财师姓名',
          tagName: 'el-input',
          modelName: 'planner',
          props: {
            clearable: true,
            placeholder: '理财师姓名'
          }
        },
        {
          labelName: '客户pin',
          tagName: 'el-input',
          modelName: 'userPin',
          props: {
            clearable: true,
            placeholder: '客户pin'
          }
        },
        {
          labelName: '起息时间',
          tagName: 'el-date-picker',
          modelName: 'calDate',
          props: {
            clearable: true,
            placeholder: '起息时间',
            'value-format': 'yyyy-MM-dd 00:00:00'
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
            }
          ]
        }
      ],
      [],
      [
        {
          labelName: '',
          tagName: 'el-button-group',
          slotComps: [
            {
              tagName: 'el-button',
              innerText: '下载收益分配明模板',
              props: {
                icon: 'el-icon-document'
              },
              eventOn: {
                click: vm.downloadTemplate
              }
            },
            {
              tagName: 'el-button',
              innerText: '导入收益分配明细',
              props: {
                type: 'primary',
                icon: 'el-icon-upload'
              },
              eventOn: {
                click: vm.importIncomes
              }
            },
            {
              tagName: 'el-button',
              innerText: '确认并推送收益明细',
              props: {
                icon: 'el-icon-check'
              },
              eventOn: {
                click: vm.sendBenefitsList
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    userName: '',
    planner: '',
    userPin: '',
    calDate: ''
  }
};

export default {
  benefitsListInterest: {
    ...baseOptions,
    ...benefitsListInterest
  },
  benefitsListApportionment: {
    ...baseOptions,
    ...benefitsListApportionment
  }
};
