import { getImgUrl } from './utils';
export default function(data) {
  let options = [];
  const main = [
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
            value: data.customerRealNameDto ? data.customerRealNameDto.identification : {},
            formatter: (value, h, context) => {
              return context.enumArgs['identity_type_jd'][value];
            },
            getArgText: 'identity_type_jd'
          },
          {
            label: '证件号：',
            value: data.customerRealNameDto ? data.customerRealNameDto.identificationNo : {}
          }
        ],
        [
          {
            label: '银行开户行：',
            value: data.bankBranch
          },
          {
            label: '银行账号：',
            value: data.bankAccount
          },
          {
            label: '客户来源：',
            value: data.customerFromStr
          }
        ]
      ]
    },
    {
      type: 'basic',
      title: '报单信息',
      rows: [
        [
          {
            label: '报单金额：',
            value: data.bookingBalance,
            formatter: (value) => `${value}元`
          },
          {
            label: '费用信息：',
            value: data.feeBalance + '元'
          },
          {
            label: '报单日期：',
            value: data.bookingTime ? data.bookingTime.substring(0, 10) : ''
          }
        ],
        [
          {
            label: '汇款金额：',
            value: data.paymentBlance,
            hasUnit: '元'
          }
        ],
        [
          {
            label: '汇款时间：',
            value: data.bookingTime ? data.paymentDate.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') : ''
          }
        ]
      ]
    }
  ];
  const card1 = [
    {
      label: '证件：',
      value: data.identificationFile,
      formatter: (json, h) => {
        const files = getImgUrl(json);
        return (<imgView files={files} />);
      }
    },
    {
      label: '银行卡：',
      value: data.bankcardFile,
      formatter: (json, h) => {
        const files = getImgUrl(json);
        return (<imgView files={files} />);
      }
    },
    {
      label: '付款凭证：',
      value: data.paymentFile,
      formatter: (json, h) => {
        const files = getImgUrl(json);
        return (<imgView files={files} />);
      }
    }
  ];
    const card2 = [
      {
        label: '其他附件：',
        value: data.otherFiles,
        formatter: (json, h) => {
          const files = getImgUrl(json);
          return (<imgView files={files} />);
        }
      }
    ];
  if (data.productDto && data.productDto.isProxy === 0) {
    main[1].rows.splice(2, 0, card1);
    main[1].rows.splice(3, 0, card2);
  }
  options = main;
  return options;
}
