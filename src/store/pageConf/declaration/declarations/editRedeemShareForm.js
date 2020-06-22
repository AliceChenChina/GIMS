// 启动报单表单 -- 视图结构数据
export default function(vm) {
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
  const options = [
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
        formLabel: '报单金额（万元）:',
        modelKey: 'bookingBalance',
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
          disabled: vm.productType !== 'secondary_market'
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
    ],
    [
      {
        formLabel: '份额确认书：',
        modelKey: 'shareFileList',
        inputTag: 'el-upload',
        inputProps: {
          'list-type': 'picture-card',
          'value-format': 'string'
        },
        inputTagOptions: inputTagOptions
      }
    ]
  ];
  return options;
};
