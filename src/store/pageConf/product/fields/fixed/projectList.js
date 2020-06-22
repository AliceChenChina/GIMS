/*
融资人/项目方
 */
export default vm => [
  {
    label: '项目号',
    props: {
      formatter: (row, column, cellValue, index) => index + 1
    }
  },
  {
    label: '公司名称',
    dataKey: 'companyName'
  },
  {
    label: '年净利润(元)',
    dataKey: 'companyProfit'
  },
  {
    label: '公司类型',
    pros: {
      formatter: row => vm.enumArgs['project_company_class'][row.companyClass]
    }
  },
  {
    label: '股东/实际控制人',
    dataKey: 'cnterShareHolder'
  },
  {
    label: '注册资本(元)',
    dataKey: 'registCapital'
  },
  {
    label: '是否实控人无限连带责任担保',
    dataKey: 'unlimitdGuarantee',
    formatter: row => {
      if (parseInt(row.unlimitdGuarantee) === 0) {
        return '否';
      }
      if (parseInt(row.unlimitdGuarantee) === 1) {
        return '是';
      }
      return '-';
    }
  },
  {
    label: '总资产(元)',
    dataKey: 'companyTotalAssets'
  },
  {
    label: '抵押物情况说明',
    dataKey: 'guarantyDesc'
  },
  {
    label: '净资产(元)',
    dataKey: 'companyNetAssets'
  },
  {
    label: '年收入(元)',
    dataKey: 'companyIncome'
  }
];
