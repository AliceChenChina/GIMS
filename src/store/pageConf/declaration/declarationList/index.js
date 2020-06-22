import historyList from './historyList';
import myList from './myList';
const commonFilterModel = {
  bookingWay: '',
  customerName: '', // 客户名称
  salesName: '', // 理财师
  productName: '', // 产品名称
  statusStrs: '', // 报单状态
  tradeType: '', // 报单类型
  bookingTimeStart: '', // 报单日期
  bookingTimeEnd: '' // 报单日期
};
const commonTableColumn = vm => [
  {
    label: '序号',
    dataKey: '',
    props: {
      width: 80,
      align: 'center',
      formatter: (row, col, cellval, index) => {
        const { currentPageNo, pageSize } = vm.getViewData().paginationState;
        return (currentPageNo - 1) * pageSize + index + 1;
      }
    }
  },
  {
    label: '客户名称',
    dataKey: 'customerName',
    props: {
      width: 150
    }
  },
  {
    label: '产品名称',
    dataKey: 'productName',
    props: {
      width: 350,
      formatter: row => {
        const getHref = (clickEvent, text) => {
          const options = {
            style: 'padding: 0 5px;cursor:pointer;color:#EB5954',
            on: {
              click: () => {
                clickEvent(row);
              }
            }
          };
          return vm.$createElement('a', options, text);
        };
        const links = [
          getHref(vm.goProductOverview, row.productName)
        ];
        return vm.$createElement('div', {}, links);
      }
    }
  },
  {
    label: '报单方式',
    props: {
      width: 100,
      formatter: row => vm.enumArgs['booking_way'][`${row.bookingWay.toString()}`]
    }
  },
  {
    label: '报单金额(元)',
    dataKey: 'bookingBalance',
    props: {
      align: 'right',
      width: 140,
      // formatter: row => row.bookingBalance ? vm.$utils.number.formatMoneyWan(row.bookingBalance) : '-'
      formatter: row => vm.$utils.number.formatMoney(row.bookingBalance, 2, false)
    }
  },
  {
    label: '汇款金额(元)',
    dataKey: 'paymentBlance',
    props: {
      align: 'right',
      width: 200,
      formatter: row => vm.$utils.number.formatMoney(row.paymentBlance, 2, false)
    }
  },
  {
    label: ' 报单日期',
    dataKey: 'bookingTime',
    props: {
      width: 200,
      formatter: row => row.bookingTime ? row.bookingTime.substring(0, 10) : '-'
    }
  },
  {
    label: '报单类型',
    dataKey: 'tradeType',
    props: {
      width: 150,
      formatter: row => row.tradeType.toString() === '10' ? '认购' : row.tradeType.toString() === '20' ? '申购' : '-'
    }
  },
  {
    label: '报单状态',
    dataKey: 'status',
    props: {
      width: 150,
      formatter: row => vm.enumArgs['trade_indent_status'][`${row.status.toString()}`]
    }
  }
];
const stateFactory = state => {
  state.filterOptions = vm => state.filterOptionOther(vm);
  state.filterModel = commonFilterModel;
  state.tableColumn = vm => {
    const commonColumn = commonTableColumn(vm);
    state.tableColumnOther(vm).forEach(item => {
      if (item.label === '操作') {
        commonColumn.unshift(item);
      };
      if (item.label === '理财师') {
        commonColumn.push(item);
      };
    });
    return commonColumn;
  };
  return state;
};
export default { historyList, myList, stateFactory };
