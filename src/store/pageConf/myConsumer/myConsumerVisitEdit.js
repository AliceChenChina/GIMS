function handelArg(oldarry) {
  const options = Object.keys(oldarry).map(key => {
    // 中文或者英文作为key
    if (/^[a-zA-Z0-9_]+$/.test(key)) {
      return {
        label: oldarry[key],
        value: /^\d+$/.test(key) ? parseInt(key) : key
      };
    }
  });
  return options.filter(nodes => nodes);
}

let formData;
const validateEndTime = (rule, value, callback) => {
  const startTime = formData.formModel.startTime;
  if (!startTime) {
    callback(new Error('请输入开始时间'));
  } else if (startTime > value) {
    callback(new Error('结束时间不能小于开始时间'));
  } else {
    callback();
  }
};

export default (vm) => {
  formData = vm._data;
  return [
      [{
        formLabel: '客户拜访主题: ',
        modelKey: 'title',
        formRules: 'required',
        inputProps: {
          disabled: false
        },
        inputTag: 'el-input'
      }],
      [
        {
          formLabel: '联系人：',
          modelKey: 'customerSalesDto.contact',
          formRules: vm.contactDisable ? '' : 'required',
          inputAttrs: {
            placeholder: '点击选择联系人...' // 原生属性
          },
          inputProps: {
            clearable: true,
            disabled: vm.contactDisable
          },
          inputEvents: {
            input: (value) => {
               if (!value) {
                // 清空产品
                vm.formModel.customerSalesDto.contact = '';
                vm.formModel.customerSalesDto.customerId = '';
                return;
              };
            },
            focus: () => {
              vm.selectConsumer();
            }
          },
          inputTag: 'el-input'
        }
      ],
      [{
        formLabel: '拜访开始时间: ',
        modelKey: 'startTime',
        inputProps: {
          type: 'datetime',
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        inputTag: 'el-date-picker'
      }],
      [{
        formLabel: '拜访结束时间: ',
        modelKey: 'endTime',
        inputProps: {
          type: 'datetime',
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        inputTag: 'el-date-picker'
      }],
      [{
        formLabel: '拜访方式: ',
        modelKey: 'visitWay',
        inputTag: 'el-select',
        inputTagOptions: handelArg(vm.$store.state.argEnum.visit_way)
      }],
      [{
        formLabel: '备注: ',
        modelKey: 'remark',
        inputTag: 'el-input',
        inputProps: {
          type: 'textarea',
          rows: '2'
        }
      }]
];
};
