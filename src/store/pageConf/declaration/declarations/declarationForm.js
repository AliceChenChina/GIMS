// 启动报单表单 -- 视图结构数据
const formDatas = {
  createFormDatas: function(vm) {
    const checkAmount = (rule, value, callback) => {
      const reg = /^([1-9]\d{0,11}|0)(\.\d{1,2})?$/;
      if (value && !reg.test(value)) {
        return callback(new Error('最大可输入12位正数(最多2位小数)'));
      }
      callback();
    };
    const checkBankAccount = (rule, value, callback) => {
      const reg = /^([0-9]*)$/;
      if (value && !reg.test(value)) {
        return callback(new Error('只能输入数字'));
      }
      callback();
    };
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
    let options = [
      [
        {
          formLabel: '报单金额(元)：',
          modelKey: 'bookingBalance',
          inputTag: 'el-input',
          formRules: [{ validator: checkAmount, trigger: 'blur' }, { required: true, message: '不能为空', trigger: 'blur' }],
          inputProps: {
            clearable: true
          }
        },
        {
          formLabel: '费用(元):',
          modelKey: 'feeBalance',
          inputTag: 'el-input',
          formRules: [{ validator: checkAmount, trigger: 'blur', required: false }],
          inputProps: {
            clearable: true
          }
        }
      ],
      [
        {
          formLabel: '汇款金额(元)：',
          modelKey: 'paymentBlance',
          inputTag: 'el-input',
          inputProps: {
            disabled: true,
            clearable: true
          }
        },
        {
          formLabel: '汇款日期：',
          modelKey: 'paymentDate',
          inputTag: 'el-date-picker',
          formRules: 'required',
          inputProps: {
            clearable: true,
            type: 'datetime',
            'value-format': 'yyyy-MM-dd HH:mm:ss'
          }
        }
      ]
    ];
    const card = [
      [
        {
          formLabel: '银行开户行：',
          modelKey: 'bankBranch',
          inputTag: 'el-input',
          formRules: 'required',
          inputProps: {
            clearable: true
          }
        },
        {
          formLabel: '银行账号：',
          modelKey: 'bankAccount',
          inputTag: 'el-input',
          formRules: [{ validator: checkBankAccount, trigger: 'blur' }, { required: true, message: '不能为空', trigger: 'blur' }],
          inputProps: {
            clearable: true
          }
        }
      ],
      [
        {
          formLabel: '证件：',
          modelKey: 'identificationFileList',
          inputTag: 'el-upload',
          formRules: 'required',
          inputProps: {
            'list-type': 'picture-card',
            limit: 1,
            'on-exceed': function(files, fileList) {
            }
          },
          inputTagOptions: inputTagOptions
        },
        {
          formLabel: '银行卡：',
          modelKey: 'bankcardFileList',
          inputTag: 'el-upload',
          formRules: 'required',
          inputProps: {
            'list-type': 'picture-card',
            limit: 1,
            'on-success': function(file) {
            }
          },
          inputTagOptions: inputTagOptions
        }
      ],
      [{
        formLabel: '付款凭证：',
        modelKey: 'paymentFileList',
        inputTag: 'el-upload',
        formRules: 'required',
        inputProps: {
          'list-type': 'picture-card',
          limit: 1
        },
        inputTagOptions: inputTagOptions
      }],
      [
        {
          formLabel: '其他附件：',
          modelKey: 'otherFilesList',
          inputTag: 'el-upload',
          inputProps: {
            'list-type': 'picture-card',
            limit: 3
          },
          inputTagOptions: inputTagOptions
        }
      ]
    ];
    if (vm.isProxy !== 1) {
      options = options.concat(card);
    }
    return options;
  },
  initData: {
    tradeId: '',
    bankBranch: '', // 开户银行
    bankAccount: '', // 开户银行账号
    bookingBalance: '', // 报单金额
    feeBalance: '', // 费用
    paymentBlance: '', // 汇款金额
    paymentDate: '', // 汇款日期
    bookingTime: '', // 报单日期
    empJobnumber: '', // 陪谈人工号
    customerId: '',
    customerName: '',
    pinCode: '',
    startId: '',
    tradeType: '10',
    source: '1',
    riskMismatch: null,
    paymentFileList: [],
    paymentFile: {}, // 付款凭证
    bankcardFile: {}, // 银行卡附件
    bankcardFileList: [], // 银行卡附件
    identificationFile: {}, // 证件附件
    identificationFileList: [], // 证件附件
    otherFiles: [], // 其他附件
    otherFilesList: [], // 其他附件
    isOne: true, // 确保附件唯一 只能为一条有效数据
    isFile: false, // 是否上传
    feeRateDesc: '', // 费用率描述
    rateTotal: 0,
    fixedTotal: 0,
    customerFrom: ''
  },
  declarationHeadInfo: function(data) {
    const basicInfo = [
      {
        type: 'basic',
        title: '客户信息',
        rows: [
          [
            {
              label: '客户名称：',
              value: data.contact
            },
            {
              label: '京东用户名：',
              value: data.pinCode
            }
          ]
        ]
      },
      {
        type: 'basic',
        title: '报单信息信息',
        rows: [
        ]
      }
    ];
    return basicInfo;
  }
};
export default formDatas;
