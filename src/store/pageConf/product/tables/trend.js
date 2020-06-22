/*
净值列表
 */
export default {
  filterOptions() {
    return [];
  },
  filterModel: {},
  tableColumn: vm => [
    {
      label: '序号',
      dataKey: '',
      props: {
        width: 60,
        align: 'left',
        formatter: (row, column, cellValue, index) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '净值日期',
      dataKey: 'statisticDate',
      props: {
        formatter: (row) => row.statisticDate.split(' ')[0]
      }
    },
    {
      label: '单位净值',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.toDecimal(row.nav, 4)
      }
    },
    {
      label: '累计净值',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.toDecimal(row.addedNav, 4)
      }
    },
    {
      label: '复权累计净值',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.toDecimal(row.swanav, 4)
      }
    },
    {
      label: '近一个月收益率',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.deciToPer(row.m1YieldRate)
      }
    },
    {
      label: '近三个月收益率',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.deciToPer(row.m3YieldRate)
      }
    },
    {
      label: '近六个月收益率',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.deciToPer(row.m6YieldRate)
      }
    },
    {
      label: '近一年收益率',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.deciToPer(row.y1YieldRate)
      }
    },
    {
      label: '今年以来收益率',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.deciToPer(row.yearYieldRate)
      }
    },
    {
      label: '成立以来收益率',
      props: {
        align: 'right',
        formatter: (row) => vm.$utils.number.deciToPer(row.totalYieldRate)
      }
    }
  ]
};
