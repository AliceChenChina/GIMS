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

function getcallbackStatus(value) {
  let newString;
  switch (value) {
    case '2':
      newString = '确认交易';
      break;
    case '3':
      newString = '客户撤单';
      break;
    case '4':
      newString = '回访异常';
      break;
    default:
      newString = '';
       break;
  }
  return newString;
}

function handelFiles(attchList) {
  if (attchList === null) {
    return [];
  }
  attchList.map((item) => {
      const url = '/file/download?directory=' + item.filePath + '&downloadFile=' + item.fileId + item.fileNameExt + '&fileName=' + item.fileName;
      return {
        name: item.fileName,
        url: url
      };
  });
}
export default function(argState, data) {
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
            },
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
            },
            {
              label: '订单金额(元)：',
              value: data.bookingBalance
            },
            {
              label: ' ',
              value: ' '
            }
          ],
          [
            {
              label: '支付确认时间：',
              value: data.paymentDate
            },
            {
              label: '订单状态：',
              value: getOrderStatus(argState, data.orderStatus, data.channel)
            },
            {
              label: '可回访时间：',
              value: data.coolPeriodEnd
            },
            {
              label: '',
              value: ''
            }
          ]
        ]
      },
      {
        type: 'basic',
        title: '回访信息',
        rows: [
          [
            {
              label: '回访结果：',
              value: getcallbackStatus(data.callbackStatus)
            }
          ],
          [
            {
              label: '备注：',
              value: data.remark
            }
          ]
        ]
      },
      {
        type: 'images',
        title: '附件',
        files: handelFiles(data.attachList)
      }
    ]
  };
}
