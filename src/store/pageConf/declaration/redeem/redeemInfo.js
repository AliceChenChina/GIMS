import { getImgUrl } from '../utils';
import formatData from '@/utils/index';
export default function(data) {
  return [
    {
      type: 'basic',
      title: '赎回信息',
      rows: [
        [
          {
            label: '客户名称：',
            value: data.customerName
          }
        ],
        [
          {
            label: '产品名称：',
            value: data.productName
          }
        ],
        [
          {
            label: '申请份额：',
            value: data.redeemShare ? formatData.number.formatMoney(data.redeemShare) : '-'
          }
        ],
        [
          {
            label: '申请日期：',
            value: data.applyTime ? data.applyTime.substring(0, 10) : '-'
          }
        ],
        [
          {
            label: '确认金额（万元）：',
            value: data.confirmAmount ? data.confirmAmount / 10000 : '-'
          }
        ],
        [
          {
            label: '确认日期：',
            value: data.confirmTime ? data.confirmTime.substring(0, 10) : '-'
          }
        ],
        [
          {
            label: '赎回确认书：',
            value: data.redeemAmountFileList,
            formatter: (json, h) => {
              const files = getImgUrl(json);
              return (<imgView files={files} />);
            }
          }
        ]
      ]
    }
  ];
}
