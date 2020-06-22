import addressTree from './addressTree';
const formDatas = {
  createFormDatas: function(vm) {
    const enumArgs = vm.$store.state.argEnum || {};
    const statusArgsWithElOptionsTag = function(groupKey) {
      const options = Object.keys(enumArgs[groupKey]).map(key => {
        if (/^[^\u4e00-\u9fa5]+$/.test(key)) {
          return {
            label: enumArgs[groupKey][key],
            value: /^\d+$/.test(key) ? parseInt(key) : key
          };
        }
      });
      return options.filter(nodes => nodes);
    };
    const sexOption = [{ value: 0, label: '保密' }, { value: 1, label: '男' }, { value: 2, label: '女' }];
    const workIndustryOption = statusArgsWithElOptionsTag('work_industry');
    const countryOption = statusArgsWithElOptionsTag('country');
    const eduLevelOption = statusArgsWithElOptionsTag('edu_level');
    const identityTypePersonOption = statusArgsWithElOptionsTag('identity_type_person');
    const customerFromOption = statusArgsWithElOptionsTag('source_type');
    const customerTypeOptions = [{ value: 1, label: '个人' }, { value: 2, label: '机构' }];
    const relaAuthOptions = [
      {
        label: '相关',
        value: 0
      },
      {
        label: '绑定',
        value: 1
      },
      {
        label: '专属',
        value: 2
      }
    ];
    const options = [
      {
        title: '基本信息',
        type: 'form',
        formItems: [
          {
            formLabel: '联系人：',
            modelKey: 'contact',
            inputTag: 'el-input',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '联系方式：',
            modelKey: 'mobilePhone',
            inputTag: 'el-input',
            formRules: [{ pattern: /^1\d{10}$/, trigger: 'blur', message: '请输入有效11位手机号码' }],
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '性别：',
            modelKey: 'sex',
            inputTag: 'el-select',
            inputTagOptions: sexOption,
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '职业：',
            modelKey: 'vocation',
            inputTag: 'el-select',
            inputTagOptions: workIndustryOption,
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '职务：',
            modelKey: 'duty',
            inputTag: 'el-input',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '生日：',
            modelKey: 'birthday',
            inputTag: 'el-date-picker',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check',
              'value-format': 'yyyy-MM-dd HH:mm:ss'
            }
          },
          {
            formLabel: '国籍：',
            modelKey: 'nationality',
            inputTag: 'el-select',
            inputTagOptions: countryOption,
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '教育程度：',
            modelKey: 'eduLevel',
            inputTag: 'el-select',
            inputTagOptions: eduLevelOption,
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '固定电话：',
            modelKey: 'telphone',
            inputTag: 'el-input',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '地区：',
            modelKey: 'areaAddress',
            inputTag: 'el-cascader',
            inputProps: {
              options: addressTree,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '邮编：',
            modelKey: 'zipCode',
            inputTag: 'el-input',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '联系地址：',
            modelKey: 'address',
            inputTag: 'el-input',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '证件类型：',
            modelKey: 'identification',
            inputTag: 'el-select',
            inputTagOptions: identityTypePersonOption,
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '证件号码：',
            modelKey: 'identificationNo',
            inputTag: 'el-input',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '证件开始有效期：',
            modelKey: 'validateStart',
            inputTag: 'el-date-picker',
            inputProps: {
              clearable: true,
              'value-format': 'yyyy-MM-dd HH:mm:ss',
              disabled: vm.formModel.timeless || (vm.status && vm.status === 'check')
            }
          },
          {
            formLabel: '证件结束有效期：',
            modelKey: 'validateEnd',
            inputTag: 'el-date-picker',
            inputProps: {
              clearable: true,
              'value-format': 'yyyy-MM-dd HH:mm:ss',
              disabled: vm.formModel.timeless || (vm.status && vm.status === 'check')
            }
          },
          {
            formLabel: '证件是否长期有效：',
            modelKey: 'timeless',
            inputTag: 'el-checkbox',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '京东用户名：',
            modelKey: 'pinCode',
            formRules: 'required',
            inputTag: 'el-input',
            inputProps: {
              clearable: true,
              disabled: (vm.status === 'edit' && !!(vm.userPin)) || vm.status === 'check'
            }
          },
          {
            formLabel: '电子邮件：',
            modelKey: 'email',
            inputTag: 'el-input',
            inputProps: {
              clearable: true,
              disabled: vm.status && vm.status === 'check'
            }
          },
          {
            formLabel: '客户来源：',
            modelKey: 'source',
            inputTag: 'el-select',
            formRules: 'required',
            inputTagOptions: customerFromOption,
            inputProps: {
              clearable: true,
              disabled: (vm.status === 'edit' && !(vm.getCustomerFrom !== 1 && vm.getCustomerFrom !== 2 && vm.getCustomerFrom !== 3)) || (vm.status === 'check')
            }
          }
        ]
      }
    ];
    if (vm.formModel.source === 2) {
      const refer = {
        formLabel: '推荐人京东用户名：',
        modelKey: 'referPin',
        inputTag: 'el-input',
        formRules: 'required',
        inputProps: {
          clearable: true,
          disabled: (vm.status === 'edit' && !!(vm.getCustomerReferPin)) || vm.status === 'check'
        }
      };
      options[0].formItems.push(refer);
    }
    if (vm.formModel.timeless) {
      vm.formModel.validateStart = '';
      vm.formModel.validateEnd = '';
    }
    if (vm.status && vm.status !== 'add') {
      const createdTime = {
        formLabel: '创建时间：',
        modelKey: 'createdTime',
        inputTag: 'el-input',
        inputProps: {
          disabled: vm.status && vm.status !== 'add'
        }
      };
      options[0].formItems.push(createdTime);
    }
    if (vm.status && vm.status !== 'add' && vm.userPin) {
      const isDjTrade = {
        formLabel: '东家成交客户：',
        modelKey: 'isDjTrade',
        inputTag: 'el-input',
        inputProps: {
          disabled: vm.status && vm.status !== 'add'
        }
      };
      const customerTypeStr = {
        formLabel: '客户类型：',
        modelKey: 'customerType',
        inputTag: 'el-select',
        inputTagOptions: customerTypeOptions,
        inputProps: {
          disabled: vm.status && vm.status !== 'add'
        }
      };
      const relaAuth = {
        formLabel: '关联关系：',
        modelKey: 'relaAuth',
        inputTag: 'el-select',
        inputTagOptions: relaAuthOptions,
        inputProps: {
          disabled: vm.status && vm.status !== 'add'
        }
      };
      options[0].formItems.push(isDjTrade);
      options[0].formItems.push(customerTypeStr);
      options[0].formItems.push(relaAuth);
    }
    return options;
  },
  initData: {
    pinCode: '', // 京东用户名
    contact: '', // 联系人
    mobilePhone: '', // 手机号码
    duty: '', // 职务
    vocation: '', // 职业
    birthday: '', // 生日
    nationality: '', // 国籍
    eduLevel: '', // 教育程度
    telphone: '', // 固定电话
    province: '', // 地区/省份
    city: '', // 城市
    area: '', // area
    zipCode: '', // 邮编
    address: '', // 详细地址
    referPin: '', // 推荐人京东用户名
    sex: '', // 性别
    identification: '', // 证件类型
    identificationNo: '', // 证件号码
    email: '', // 电子邮件
    validateStart: '', // 开始日期
    validateEnd: '', // 结束日期
    timeless: false, // 长期
    source: '', // 客户来源
    createdTime: '',
    areaAddress: [],
    isDjTrade: ''
  }
};
export default formDatas;
