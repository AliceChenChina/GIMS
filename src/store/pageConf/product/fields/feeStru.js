/*
费用结构
 */
export default vm => [
  {
    label: '费用类型',
    props: {
      formatter: (row) => vm.enumArgs['fee_type'][row.feeType]
    }
  },
  {
    label: '费率费用',
    dataKey: 'feeRate',
    props: {
      align: 'right',
      width: 140
    }
  },
  {
    label: '折后费率费用',
    dataKey: 'feeDiscountRate',
    props: {
      align: 'right',
      width: 140
    }
  },
  {
    label: '费用计算方式',
    dataKey: 'computeWay',
    props: {
      width: 140,
      formatter: (row) => vm.enumArgs['fee_compute_way'][row.computeWay]
    }
  },
  {
    label: '费率费用单位',
    props: {
      width: 140,
      formatter: (row) => vm.enumArgs['fee_rate_unit'][row.feeRateUnit]
    }
  },
  {
    label: '费用区间类型',
    props: {
      width: 140,
      formatter: (row) => vm.enumArgs['fee_area_type'][row.feeAreaType]
    }
  },
  {
    label: '区间范围下限（含）',
    dataKey: 'minBalance',
    props: {
      align: 'right',
      width: 140
    }
  },
  {
    label: '区间范围上限（不含）',
    dataKey: 'maxBalance',
    props: {
      align: 'right',
      width: 140
    }
  },
  {
    label: '份额类别',
    dataKey: 'shareCategory',
    props: {
      formatter: (row) => vm.enumArgs['share_category'][row.shareCategory]
    }
  },
  {
    label: '价内（外）',
    props: {
      formatter: (row) => vm.enumArgs['fee_balance_about'][row.balanceAbout]
    }
  },
  {
    label: '费用详细描述',
    dataKey: 'remark',
    props: {
      width: 200
    }
  }
];
