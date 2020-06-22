import addressTree from './addressTree';
const formDatas = {
  createFormDatas: function(vm) {
    const options = [
      {
        formLabel: '联系人：',
        modelKey: 'name',
        inputTag: 'el-input',
        formRules: 'required',
        inputProps: {
          clearable: true
        }
      },
      {
        formLabel: '手机：',
        modelKey: 'mobilephone',
        inputTag: 'el-input',
        formRules: [{ pattern: /^1\d{10}$/, trigger: 'blur', message: '请输入有效11位手机号码' }, {
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        inputProps: {
          clearable: true
        }
      },
      {
        formLabel: '地区：',
        modelKey: 'areaAddress',
        inputTag: 'el-cascader',
        inputProps: {
          options: addressTree
        }
      },
      {
        formLabel: '联系地址：',
        modelKey: 'address',
        inputTag: 'el-input',
        inputProps: {
          clearable: true
        }
      },
      {
        formLabel: '固定电话：',
        modelKey: 'telphone',
        inputTag: 'el-input',
        inputProps: {
          clearable: true
        }
      },
      {
        formLabel: '电子邮件：',
        modelKey: 'email',
        inputTag: 'el-input',
        inputProps: {
          clearable: true
        }
      },
      {
        formLabel: '备注: ',
        inputProps: {
          type: 'textarea',
          rows: 2
        },
        modelKey: 'remark',
        inputTag: 'el-input'
      }
    ];
    return options;
  },
  initData: {
    name: '',
    mobilephone: '',
    address: '',
    telphone: '',
    email: '',
    remark: '',
    areaAddress: []
  }
};
export default formDatas;
