/*
赎回直销订单页面设置
 */
export default {
  filterOptions(vm) {
    const row1 = [
      {
        labelName: '预约名称',
        tagName: 'el-input',
        modelName: 'appointmentName',
        props: {
          clearable: true,
          placeholder: '预约名称'
        }
      },
      {
        labelName: '客户信息',
        tagName: 'el-input',
        modelName: 'customerInfo',
        props: {
          clearable: true,
          placeholder: '客户姓名/京东用户名'
        }
      },
      {
        labelName: '来源渠道',
        tagName: 'el-input',
        modelName: 'channel',
        props: {
          clearable: true,
          placeholder: ''
        }
      },
      {
        labelName: '',
        tagName: 'el-button-group',
        slotComps: [
          {
            tagName: 'el-button',
            innerText: '高级筛选',
            props: {
              icon: vm.viewerState.filterModel.showAdvanceFilter ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
            },
            eventOn: {
              click: () => {
                vm.$store.commit('UPDATE_FILTER_MODEL', {
                  modelState: vm.viewerState.filterModel,
                  data: {
                    ...vm.viewerState.filterModel,
                    showAdvanceFilter: !vm.viewerState.filterModel.showAdvanceFilter
                  }
                });
              }
            }
          },
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
    ];
    const row2 = [
      {
        labelName: '预约类型',
        tagName: 'el-select',
        modelName: 'appointType',
        props: {
          clearable: true,
          placeholder: '请选择'
        },
        options: [
          {
            label: '产品',
            value: '1'
          },
          {
            label: '活动',
            value: '2'
          },
          {
            label: '服务',
            value: '3'
          }
        ]
      },
      {
        labelName: '预约业务线',
        tagName: 'el-select',
        modelName: 'appointWay',
        props: {
          clearable: true,
          placeholder: '请选择'
        },
        options: [
          {
            label: '财富线上预约',
            value: '1'
          },
          {
            label: '线上合格投资者',
            value: '2'
          },
          {
            label: '财富线下预约',
            value: '3'
          },
          {
            label: '已分配',
            value: '4'
          },
          {
            label: '海外线上预约',
            value: '5'
          },
          {
            label: '其他类',
            value: '6'
          },
          {
            label: '保险',
            value: '7'
          }
        ]
      },
      {
        labelName: '预约业务线子类',
        tagName: 'el-select',
        modelName: 'productKind',
        props: {
          clearable: true,
          placeholder: '请选择',
          disabled: parseInt(vm.viewerState.filterModel.appointWay) !== 1
        },
        options: [
          { value: '3', label: '阳光私募' },
          { value: '2', label: '私募股权' },
          { value: '1', label: '类固收' },
          { value: '6', label: '券商小集合' },
          { value: '7', label: '券商大集合' },
          { value: '8', label: '信托' }]
      },
      {
        labelName: '分享者',
        tagName: 'el-input',
        modelName: 'shareInfo',
        props: {
          clearable: true,
          placeholder: '分享者姓名/京东用户名'
        }
      }
    ];
    if (parseInt(vm.viewerState.filterModel.appointWay) !== 1) {
      vm.$store.commit('UPDATE_FILTER_MODEL', {
        modelState: vm.viewerState.filterModel,
        data: {
          ...vm.viewerState.filterModel,
          productKind: ''
        }
      });
    }
    const row3 = [
      {
        labelName: '是否分配理财师',
        tagName: 'el-select',
        modelName: 'hasPlanner',
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
        labelName: '理财师姓名',
        tagName: 'el-input',
        modelName: 'plannerName',
        props: {
          clearable: true,
          placeholder: '理财师姓名'
        }
      },
      {
        labelName: '预约时间',
        tagName: 'el-date-picker',
        modelName: 'createTimeStart',
        props: {
          clearable: true,
          placeholder: '开始时间',
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'createTimeEnd',
        props: {
          clearable: true,
          placeholder: '结束时间',
          'value-format': 'yyyy-MM-dd 23:59:59'
        }
      }
    ];
    if (vm.viewerState.filterModel.showAdvanceFilter) {
      return [row1, row2, row3];
    }
    return [row1];
  },
  filterModel: {
    shareInfo: '', // 分享者
    appointmentName: '', // 预约名称
    customerInfo: '', // 京东用户名
    channel: '', // 客户来源
    hasPlanner: '', // 是否分配理财师
    appointType: '', // 预约类型
    appointWay: '', // 预约业务线
    productKind: '',
    plannerName: '',
    createTimeStart: '', // 预约时间开始
    createTimeEnd: '', // 预约时间结束
    showAdvanceFilter: false
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 60,
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
                vm.gotoLeadsDetail(scope.$index, scope.row);
              }
            };
          }
        }
      ]
    },
    {
      label: '序号',
      dataKey: '',
      props: {
        width: 50,
        formatter: (row, col, cellval, index) => {
          const { currentPageNo, pageSize } = vm.viewerState.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '京东用户名',
      dataKey: 'jdpin',
      props: {
        width: 160
      }
    },
    {
      label: '客户姓名',
      dataKey: 'name',
      props: {
        width: 150
      }
    },
    {
      label: '客户手机号',
      dataKey: 'mobile',
      props: {
        width: 120
      }
    },
    {
      label: '预约类型',
      dataKey: 'appointTypeStr',
      props: {
        width: 120
      }
    },
    {
      label: '预约业务线',
      dataKey: 'appointWayStr',
      props: {
        width: 120
      }
    },
    {
      label: '预约业务线子类',
      dataKey: 'productKindStr',
      props: {
        width: 120
      }
    },
    {
      label: '预约产品名称',
      dataKey: 'productName',
      props: {
        width: 200
      }
    },
    {
      label: '预约活动名称',
      dataKey: 'activityName',
      props: {
        width: 200
      }
    },
    {
      label: '预约服务名称',
      dataKey: 'serviceName',
      props: {
        width: 190
      }
    },
    {
      label: '来源渠道',
      dataKey: 'channel',
      props: {
        width: 160
      }
    },
    {
      label: '预约时间',
      dataKey: 'createTime',
      props: {
        width: 150
      }
    },
    {
      label: '是否分配理财师',
      dataKey: 'assignFlagStr',
      props: {
        width: 160
      }
    },
    {
      label: '理财师姓名',
      dataKey: 'plannerName',
      props: {
        width: 160
      }
    },
    {
      label: '分享者',
      dataKey: 'shareInfo',
      props: {
        width: 160
      }
    }
  ]
};
