
export default {
  filterOptions: vm => {
    const options = [
      [
        {
          labelName: '客户查询',
          tagName: 'el-input',
          modelName: 'userPin',
          props: {
            clearable: true,
            placeholder: '客户姓名/京东用户名'
          }
        },
        {
          labelName: '上传日期',
          tagName: 'el-date-picker',
          props: {
            clearable: true,
            placeholder: '开始时间',
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'querybeginSubmitTime',
            endTime: 'queryEndSubmitTime',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            'default-time': ['00:00:00', '23:59:59']
          }
        },
        {
          labelName: '审核日期',
          tagName: 'el-date-picker',
          props: {
            clearable: true,
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'querybeginAuditTime',
            endTime: 'queryEndAuditTime',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            'default-time': ['00:00:00', '23:59:59']
          }
        }
      ],
      [
        {
          labelName: '失效日期',
          tagName: 'el-date-picker',
          props: {
            clearable: true,
            type: 'daterange',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            startTime: 'querybeginExpireTime',
            endTime: 'queryEndExpireTime',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            'default-time': ['00:00:00', '23:59:59']
          }
        },
        {
          labelName: '渠道',
          tagName: 'el-input',
          modelName: 'channel',
          props: {
            clearable: true
          }
        },
        {
          labelName: '媒介',
          tagName: 'el-input',
          modelName: 'medium',
          props: {
            clearable: true
          }
        },
        {
          labelName: '审核状态',
          tagName: 'el-select',
          modelName: 'auditStatus',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('EmauditStatus')
        }
        ],
      [
        {
          labelName: '数据状态',
          tagName: 'el-select',
          modelName: 'status',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('StatusEnum')
        },
        {
          labelName: '提交方式',
          tagName: 'el-select',
          modelName: 'submitWay',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.statusArgsWithElOptionsTag('SubmitWayEnum')
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
            },
            {
              tagName: 'el-button',
              innerText: '导出excel',
              props: {
                icon: 'el-icon-refresh-right'
              },
              eventOn: {
                click: vm.doExport
              }
            }
          ]
        }
      ]
    ];
    return options;
  },
  filterModel: {
    dateTime: '',
    userPin: '',
    querybeginSubmitTime: '',
    queryEndSubmitTime: '',
    querybeginAuditTime: '',
    queryEndAuditTime: '',
    querybeginExpireTime: '',
    queryEndExpireTime: '',
    channel: '',
    medium: '',
    auditStatus: '',
    status: '',
    submitWay: ''
  },
  tableColumn: vm => [
    {
      label: '客户姓名',
      dataKey: 'userName',
      props: {
        width: 100
      }
    },
    {
      label: '京东用户名',
      dataKey: 'userPin',
      props: {
        width: 130
      }
    },
    {
      label: '上传时间',
      dataKey: 'submitTime',
      props: {
        width: 160
      }
    },
    {
      label: '审核时间',
      dataKey: 'auditTime',
      props: {
        width: 160
      }
    },
    {
      label: '失效时间',
      dataKey: 'expireTime',
      props: {
        width: 160
      }
    },
    {
      label: '驳回原因',
      dataKey: 'rejectReasonsDesc',
      props: {
        width: 160
      }
    },
    {
      label: '客户初始来源',
      dataKey: 'customerSource',
      props: {
        width: 90
      }
    },
    {
      label: '渠道',
      dataKey: 'channel',
      props: {
        width: 100
      }
    },
    {
      label: '媒介',
      dataKey: 'medium',
      props: {
        width: 100
      }
    },
    {
      label: '活动',
      dataKey: 'activity',
      props: {
        width: 100
      }
    },
    {
      label: '分享理财师',
      dataKey: 'sharePin',
      props: {
        width: 100
      }
    },
    {
      label: '审核状态',
      dataKey: 'auditStatusDesc',
      props: {
        width: 140
      }
    },
    {
      label: '提交方式',
      dataKey: 'submitWaydesc',
      props: {
        width: 100
      }
    },
    {
      label: '数据状态',
      dataKey: 'statusDesc'
    }
  ]
};
