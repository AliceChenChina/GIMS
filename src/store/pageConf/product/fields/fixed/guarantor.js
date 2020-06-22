/*
融资人/项目方
 */
// 正则替换
// render: function \(row(\, \w+)*\) \{
//   return eucte.arg.getText\(\'(\S+)\', row\.(\S+)\);
//    \}
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
    props: {
      formatter: row => vm.enumArgs['project_company_class'][row.companyClass]
    }
  },
  {
    label: '股东/实际控制人',
    dataKey: 'cnterShareHolder'
  }, {
    label: '注册资本(元)',
    dataKey: 'registCapital'
  }, {
    label: '总资产(元)',
    dataKey: 'companyTotalAssets'
  }, {
    label: '净资产(元)',
    dataKey: 'companyNetAssets'
  }, {
    label: '年收入(元)',
    dataKey: 'companyIncome'
  }, {
    label: '担保方式',
    dataKey: 'guaranteeMode',
    props: {
      formatter: row => vm.enumArgs['guarantee_mode'][row.guaranteeMode]
    }
  }
];
