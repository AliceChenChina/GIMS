import { getImgUrl } from '../utils';
export default function(data) {
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
            label: '京东用户名：',
            value: data.customerDto ? data.customerDto.pinCode : '-'
          },
          {
            label: '证件号：',
            value: data.identityNo
          }
        ]
      ]
    },
    {
      type: 'basic',
      title: '申请信息',
      rows: [
        [
          {
            label: '产品名称：',
            value: data.productName
          },
          {
            label: '赎回份额：',
            value: data.redeemShare
          },
          {
          label: '是否全额赎回：',
          value: data.isFullRedeem === 0 ? '否' : data.isFullRedeem === 1 ? '是' : '-'
        },
          {
            label: '赎回日期：',
            value: data.redeemDate ? data.redeemDate.substring(0, 10) : '-'
          }
        ]
      ]
    },
    {
      type: 'basic',
      title: '附件',
      rows: [
        [
          {
            label: '证件正面：',
            value: data.userCredenDto ? data.userCredenDto.frontCretFileUrl : '',
            formatter: (json, h) => {
              const files = getImgUrl(json);
              return (<imgView files={files} />);
            }
          },
            {
              label: '证件反面：',
              value: data.userCredenDto.backCretFileUrl,
              formatter: (json, h) => {
                const files = getImgUrl(json);
                return (<imgView files={files} />);
              }
            },
            {
              label: '申请表：',
              value: data.applyFileList,
              formatter: (json, h) => {
                const files = getImgUrl(json);
                return (<imgView files={files} />);
              }
            }
          ],
        [
          {
            label: '其他附件：',
            value: data.redeemOtherFileList,
            formatter: (json, h) => {
              const files = getImgUrl(json);
              return (<imgView files={files} />);
            }
          }
        ]
      ]
    }
  ];
  return main;
}
