/*
基金经理
 */
export default [
  {
    label: '项目号',
    props: {
      formatter: (row, column, cellValue, index) => index + 1
    }
  },
  {
    label: '基金经理姓名',
    dataKey: 'managerName',
    props: {
      width: 130
    }
  },
  {
    label: '基金经理简介',
    dataKey: 'companyDesc',
    props: {
      width: 700
    }
  },
  {
    label: '从业时间',
    dataKey: 'employTime'
  },
  {
    label: '管理基金数量',
    dataKey: 'fundsNum',
    props: {
      width: 130
    }
  },
  {
    label: '擅长类型',
    dataKey: 'expert'
  },
  {
    label: '回报率',
    dataKey: 'responseRate'
  }
];
