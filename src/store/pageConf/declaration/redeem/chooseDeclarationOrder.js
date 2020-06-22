// 启动历史列表视图数据
export default {
  tableColumn: vm => [
    {
      label: '',
      props: {
        type: 'selection'
      }
    },
    {
      label: '集团编号',
      dataKey: 'plOrderId'
    },
    {
      label: '集团客户名称',
      dataKey: 'userName'
    },
    {
      label: '产品简称',
      dataKey: 'productShowName'
    },
    {
      label: '集团订单金额(元)',
      dataKey: 'inputAmount'
    },
    {
      label: '集团订单时间',
      dataKey: 'createdTime',
      props: {
        width: 160
      }
    },
    {
      label: '确认日期',
      dataKey: 'fundShareTime',
      props: {
        width: 160
      }
    },
    {
      label: '订单状态',
      props: {
        formatter: row => vm.enumArgs['trade_proxy_order_status'][`${row.orderState.toString()}`]
      }
    }
  ]
};
