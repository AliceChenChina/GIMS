export default function(data) {
  return [
    {
      type: 'basic',
      title: '产品信息',
      rows: [
        [
          {
            label: '产品名称：',
            value: data.productName
          },
          {
            label: '产品简称：',
            value: data.productNameShort
          }
        ],
        [
          {
            label: '是否代销：',
            value: data.isProxy === 1 ? '是' : '否'
          },
          {
            label: '产品类型：',
            value: data.productTypeName
          }
        ]
      ]
    }
  ];
}
