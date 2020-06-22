export default function(data) {
  return [
    {
      type: 'basic',
      title: '京东信息',
      rows: [
        [
          {
            label: '产品名称：',
            value: data.pinCode
          },
          {
            label: '产品简称：',
            value: data.customerName
          }
        ],
        [
          {
            label: '是否代销：',
            value: data.riskLevelStr
          },
          {
            label: '产品类型: ',
            value: data.privateStatusStr
          }
        ]
      ]
    }
  ];
}
