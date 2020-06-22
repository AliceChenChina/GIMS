import editDeclarationShareForm from './editDeclarationShareForm';
import editRedeemShareForm from './editRedeemShareForm';
const editShareForm1 = vm => {
  const common = [
    [
      {
        formLabel: '客户名称：',
        modelKey: 'customerName',
        inputTag: 'el-input',
        inputProps: {
          disabled: true,
          clearable: true
        }
      }
    ],
    [
      {
        formLabel: '产品名称：',
        modelKey: 'productName',
        inputTag: 'el-input',
        inputProps: {
          disabled: true
        }
      }
    ],
    [
      {
        formLabel: '确认份额：',
        modelKey: 'confirmShare',
        inputTag: 'el-input',
        formRules: 'required'
      }
    ],
    [
      {
        formLabel: '确认净值：',
        modelKey: 'confirmNav',
        inputTag: 'el-input',
        formRules: 'required',
        inputProps: {
          disabled: vm.formStoreModel.productType !== 'secondary_market'
        }
      }
    ],
    [
      {
        formLabel: '确认日期：',
        modelKey: 'confirmTime',
        inputTag: 'el-date-picker',
        formRules: 'required',
        inputProps: {
          clearable: true
        }
      }
    ]
  ];
  return common;
};
const stateFactory = type => {
   const editShareForm = vm => {
     const common = editShareForm1(vm);
    const inputTagOptions = [
      {
        tagName: 'div',
        children: [{
          tagName: 'i',
          options: {
            attrs: {
              class: 'el-icon-plus'
            }
          }
        }],
        options: {
          attrs: {
            class: 'el-upload__tip',
            slot: 'tip'
          }
        }
      }
    ];
    let add1 = [];
    let add2 = [];
    if (type === 'declaration') {
      add1 = [
        {
          formLabel: '报单金额（元）:',
          modelKey: 'bookingBalance',
          inputTag: 'el-input',
          inputProps: {
            disabled: true
          }
        }
      ];
      add2 = [
        {
          formLabel: '份额确认书：',
          modelKey: 'shareFileList',
          inputTag: 'el-upload',
          inputProps: {
            'list-type': 'picture-card',
            limit: 1
          },
          inputTagOptions: inputTagOptions
        }
      ];
      common.splice(2, 0, add1);
    }
    if (type === 'redeem') {
      add1 = [
        {
          formLabel: '申请份额:',
          modelKey: 'redeemShare',
          inputTag: 'el-input',
          inputProps: {
            disabled: true
          }
        }
      ];
      add2 = [
        {
          formLabel: '赎回确认书：',
          modelKey: 'redeemAmountFileList',
          inputTag: 'el-upload',
          inputProps: {
            'list-type': 'picture-card'
          },
          inputTagOptions: inputTagOptions
        }
      ];
      const add3 = [
        {
          formLabel: '申请日期:',
          modelKey: 'applyTime',
          inputTag: 'el-input',
          inputProps: {
            disabled: true
          }
        }
      ];
      common.splice(2, 0, add1, add3);
    }
    common.push(add2);
    return common;
  };
   return editShareForm;
};
export default stateFactory;
