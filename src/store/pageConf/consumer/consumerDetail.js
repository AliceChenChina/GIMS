export default function(data) {
  const main = {
    basicView: [
      {
        type: 'basic',
        title: '基本信息',
        rows: [
          [
            {
              label: '客户初始来源: ',
              value: data.sourceStr
            },
            {
              label: '是否成单: ',
              value: data.tradeFlagStr
            },
            {
              label: '东家成交客户: ',
              value: data.djTradeFlagStr
            }
          ],
          [{
            label: '客户类型: ',
            value: data.customerTypeStr
          },
            {
              label: '理财师姓名: ',
              value: data.salesName
            },
            {
            label: '关联关系: ',
            value: data.relationshipStr
          }],
          [
            {
              label: '客户来源: ',
              value: data.customerFromStr
            },
            {
              label: '首次触达时间: ',
              value: data.arriveTime
            },
            {
              label: ' ',
              value: ' '
            }
          ]
        ]
      },
      {
        type: 'basic',
        title: '京东信息',
        rows: [
          [
            {
              label: '京东用户名: ',
              value: data.pinCode
            },
            {
              label: '客户姓名: ',
              value: data.customerName
            },
            {
              label: '客户手机号: ',
              value: data.mobilephone
            }
          ],
          [
            {
              label: '是否实名认证: ',
              value: data.realNameFlagStr
            },
            {
              label: '风险测评: ',
              value: data.riskLevelStr
            },
            {
              label: '私募资产证明: ',
              value: data.privateStatusStr
            }
          ],
          [
            {
              label: '资管资产证明: ',
              value: data.assetStatusStr
            },
            {
              label: '证件类型: ',
              value: data.identificationStr
            },
            {
              label: '证件号码: ',
              value: data.identificationNo
            }
          ]
        ]
      }
    ],
    tableView: [
      {
        type: 'table',
        title: '跟进记录',
        tableColumn: (vm) => [
          {
            label: '跟进开始时间',
            dataKey: 'startTime',
            props: {
              // width: 100
            }
          },
          {
            label: '跟进结束时间',
            dataKey: 'endTime',
            props: {
              // width: 100
            }
          },
          {
            label: '跟进主题',
            dataKey: 'title',
            props: {
              // width: 100
            }
          },
          {
            label: '跟进方式',
            dataKey: 'visitWayStr'
          },
          {
            label: '跟进情况',
            dataKey: 'remark',
            props: {
              // width: 100
            }
          },
          {
            label: '跟进理财师',
            dataKey: 'salesName',
            props: {
              // width: 100
            }
          },
          {
            label: '跟进理财师类型',
            dataKey: 'salesTypeStr',
            props: {
              // width: 100
            }
          }
        ],
        tableData: data.customerVisitDtoList
      },
      {
        type: 'table',
        title: 'leads信息',
        tableColumn: vm => [
          {
            label: '操作',
            dataKey: '',
            props: {
              align: 'center',
              width: 50,
              fixed: 'right'
            },
            slotComps: [
              {
                tagName: 'el-button',
                innerText: '查看',
                props: {
                  type: 'text',
                  size: 'mini'
                },
                eventOn(scope) {
                  return {
                    click() {
                      vm.check(scope.row);
                    }
                  };
                }
              }
            ]
          },
          {
            label: '预约类型',
            dataKey: 'appointTypeStr',
            props: {
              width: 140
            }
          },
          {
            label: '预约业务线',
            dataKey: 'appointWayStr',
            props: {
              width: 140
            }
          },
          {
            label: '预约业务线子类',
            dataKey: 'productKindStr',
            props: {
              width: 150
            }
          },
          {
            label: '预约产品名称',
            dataKey: 'productName',
            props: {
              width: 400
            }
          },
          {
            label: '预约活动名称',
            dataKey: 'activityName',
            props: {
              width: 400
            }
          },
          {
            label: '预约服务名称',
            dataKey: 'serviceName',
            props: {
              width: 230
            }
          },
          {
            label: '预约时间',
            dataKey: 'createTime',
            props: {
              width: 160
            }
          }
        ],
        tableData: data.userAppointmentDtoList
      },
      {
        type: 'table',
        title: '绑定理财师信息',
        tableColumn: vm => [
          {
            label: '分配时间',
            dataKey: 'assignTime',
            props: {
              // width: 170
            }
          },
          {
            label: '原绑定理财师',
            dataKey: 'oriSalesUser.name',
            props: {
              // width: 100,
              formatter: row => row.oriSalesUser ? row.oriSalesUser.name || '-' : '-'
            }
          },
          {
            label: '现绑定理财师',
            dataKey: 'salesUser.name',
            props: {
              // width: 100,
              formatter: row => row.salesUser ? row.salesUser.name || '-' : '-'
            }
          },
          {
            label: '操作原因',
            dataKey: 'reasonStr',
            props: {
              // width: 100
            }
          },
          {
            label: '操作人',
            dataKey: 'creatorUser.name',
            props: {
              // width: 150,
              formatter: row => row.creatorUser ? row.creatorUser.name || '-' : '-'
            }
          },
          {
            label: '备注',
            dataKey: 'remark',
            props: {
              // width: 100
            }
          }
        ],
        tableData: data.customerSalesLogDtoList
      }
    ]
  };
  if (data.customerFrom === 2) {
    const referPin = {
        label: '推荐人京东用户名: ',
        value: data.referPin
      };
    main.basicView[0].rows[2].splice(2, 0, referPin);
  }
  return main;
}
