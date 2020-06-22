
export default function(data) {
  const options = [
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
            value: data.isProxy,
            formatter: (value) => {
              return value === 1 ? '是' : '否';
            }
          },
          {
            label: '产品类型：',
            value: data.productTypeName
          }
        ]
      ]
    },
    {
      type: 'basic',
      title: '启动信息',
      rows: [
        [
          {
            label: '业务类型：',
            value: data.productStatus,
            formatter: (value) => {
              return value === '0' ? '认购启动' : '申购启动'
            }
          }
        ]
      ]
    }
  ];
  return options;
}
