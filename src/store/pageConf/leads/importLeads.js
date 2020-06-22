/*
赎回直销订单页面设置
 */
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '',
          tagName: 'el-button-group',
          slotComps: [
            {
              tagName: 'el-button',
              innerText: '导入校验',
              props: {
                type: 'primary',
                icon: 'el-icon-upload2'
              },
              eventOn: {
                click: vm.openUploadSelecotr
              }
            },
            {
              tagName: 'el-button',
              innerText: '下载导入模板',
              props: {
                icon: 'el-icon-document'
              },
              eventOn: {
                click: vm.downloadTemplate
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {},
  tableColumn: vm => {
    const getValue = function(colItem) {
      if (!colItem) return '-';
      return colItem.right ? colItem.value : setRedSpan(colItem.value);
    };
    const setRedSpan = (text) => {
      return vm.$createElement('span', {
        attrs: {
          style: 'color: red'
        }
      }, text);
    };
    return [
      {
        label: '来源渠道',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.channel);
          }
        }
      },
      {
        label: '预约页面',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.sourceUrl);
          }
        }
      },
      {
        label: '所属省份',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.region);
          }
        }
      },
      {
        label: '所属城市',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.city);
          }
        }
      },
      {
        label: '预约类型',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.appointType);
          }
        }
      },
      {
        label: '预约业务线',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.appointWay);
          }
        }
      },
      {
        label: '预约业务线子类',
        dataKey: '',
        props: {
          width: 140,
          formatter: (row) => {
            return getValue(row.productType);
          }
        }
      },
      {
        label: '客户pin',
        dataKey: '',
        props: {
          width: 90,
          formatter: (row) => {
            return getValue(row.jdpin);
          }
        }
      },
      {
        label: '预约手机号',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.appointMobile);
          }
        }
      },
      {
        label: '预约产品名称',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.productName);
          }
        }
      },
      {
        label: '预约活动名称',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.activityName);
          }
        }
      },
      {
        label: '预约服务名称',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.serviceName);
          }
        }
      },
      {
        label: '客户备注',
        dataKey: '',
        props: {
          width: 100,
          formatter: (row) => {
            return getValue(row.remark);
          }
        }
      },
      {
        label: '客户建议沟通时间',
        dataKey: '',
        props: {
          width: 140,
          formatter: (row) => {
            return getValue(row.contactTime);
          }
        }
      },
      {
        label: '预约时间',
        dataKey: '',
        props: {
          width: 200,
          formatter: (row) => {
            return getValue(row.createTime);
          }
        }
      },
      {
        label: '校验结果',
        dataKey: '',
        props: {
          formatter: (row) => {
            if (row.right) {
              return '正确';
            }
            return setRedSpan('错误');
          }
        }
      }
    ];
  }
};
