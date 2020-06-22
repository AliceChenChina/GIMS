function handelIidentification(index) {
  let identification;
  switch (index) {
    case '1':
      identification = '身份证';
      break;
    case '3':
      identification = '护照';
      break;
    case '4':
      identification = '回乡证';
      break;
    case '5':
      identification = '台胞证';
      break;
  }
  return identification;
}

function getOrderStatus(argState, orderStatus, channel) {
  orderStatus = orderStatus.toString();
  if (channel === '01') {
    return argState['trade_indent_status'][orderStatus];
  } else {
    return argState['trade_proxy_order_status'][orderStatus];
  }
}

export function tradeVisitEditDetail(argState, data) {
  return {
    basicView: [
      {
        type: 'basic',
        title: '客户信息',
        rows: [
          [
            {
              label: '客户名称：',
              value: data.customerName
            },
            {
              label: '证件类型：',
              value: handelIidentification(data.identification)
            }
          ],
          [
            {
              label: '客户手机号：',
              value: data.mobile
            },
            {
              label: '证件号：',
              value: data.identificationNo
            }
          ]
        ]
      },
      {
        type: 'basic',
        title: '交易信息',
        rows: [
          [
            {
              label: '产品简称：',
              value: data.productName
            },
            {
              label: '是否代销：',
              value: data.channel === '01' ? '否' : '是'
            }
          ],
          [
            {
              label: '订单金额(元)：',
              value: data.bookingBalance
            },
            {
              label: '支付确认时间：',
              value: data.paymentDate
            }
          ],
          [
            {
              label: '订单状态：',
              value: getOrderStatus(argState, data.orderStatus, data.channel)
            },
            {
              label: '可回访时间：',
              value: data.coolPeriodEnd
            }
          ]
        ]
      }
    ]
  };
}

export function tradeVisitEditEdit(vm) {
  return [
    {
      title: '回访信息',
      formItems: [
        [
          {
            formLabel: '回访结果：',
            inputTagOptions: [
              {
                label: '确认交易',
                value: 2
              },
              {
                label: '客户撤单',
                value: 3
              },
              {
                label: '回访异常',
                value: 4
              }
            ],
            modelKey: 'callbackStatus',
            formRules: 'required',
            inputProps: {
              disabled: false
            },
            inputTag: 'el-radio-group'
          }
        ],
        [
          {
            formLabel: '备注：',
            inputProps: {
              type: 'textarea',
              rows: 2
            },
            modelKey: 'remark',
            inputTag: 'el-input'
          }
        ]
      ]
    }
  ];
}
