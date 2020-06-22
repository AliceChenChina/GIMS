/*
基金经理
 */
export default function(vm) {
  return [
    {
      label: '操作',
      props: {
        align: 'center',
        width: 120,
        fixed: 'left',
        formatter: (row, column, cellValue, index) => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;',
              class: 'able',
              on: {
                click: () => {
                  clickEvent(row);
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.checkLeads, '查看')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '序号',
      dataKey: '',
      props: {
        width: 60,
        align: 'left',
        formatter: (row, column, cellValue, index) => {
          return index + 1;
        }
      }
    },
    {
      label: '预约类型',
      dataKey: 'appointTypeStr',
      props: {
        width: 100
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
        width: 140
      }
    },
    {
      label: '预约产品名称',
      dataKey: 'productName'
    },
    {
      label: '预约活动名称',
      dataKey: 'activityName'
    },
    {
      label: '预约服务名称',
      dataKey: 'serviceName',
      props: {
        width: 130
      }
    },
    {
      label: '预约时间',
      dataKey: 'createTime',
      props: {
        width: 160
      }
    }
  ];
}
