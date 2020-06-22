
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
        formItems: [
          {
            formLabel: '备案类型',
            inputTag: 'el-select',
            modelKey: 'filingType',
            inputTagOptions: statusArgsWithElOptionsTag('filing_type'),
            inputProps: {
              clearable: true,
              placeholder: ''
            }
          },
          {
            formLabel: '大类资产',
            inputTag: 'el-select',
            modelKey: 'largeClassAssetsType',
            inputTagOptions: statusArgsWithElOptionsTag('large_class_assets_type'),
            inputProps: {
              clearable: true,
              placeholder: ''
            }
          },
          {
            formLabel: '开放频次',
            inputTag: 'el-select',
            modelKey: 'openingFrequency',
            inputTagOptions: statusArgsWithElOptionsTag('opening_frequency'),
            inputProps: {
              clearable: true,
              placeholder: ''
            }
          },
          {
            formLabel: '产品大标签',
            inputTag: 'el-select',
            modelKey: 'productLabel',
            inputTagOptions: statusArgsWithElOptionsTag('product_label'),
            inputProps: {
              clearable: true,
              placeholder: ''
            }
          },
          {
            formLabel: '产品小标签',
            inputTag: 'el-input',
            modelKey: 'productSubLabel',
            inputProps: {
              clearable: true,
              placeholder: ''
            }
          },
          {
            formLabel: '协议主体',
            inputTag: 'el-input',
            modelKey: 'protocolBouncers',
            inputProps: {
              inputTagOptions: true,
              placeholder: ''
            }
          },
          {
            formLabel: '好赚产品类型',
            inputTag: 'el-select',
            modelKey: 'accountType',
            inputTagOptions: statusArgsWithElOptionsTag('account_type'),
            inputProps: {
              clearable: true,
              placeholder: ''
            }
          },
        ]
      }
    ];
    return options;
  },
  initData: {
    filingType: '',
    largeClassAssetsType: '',
    openingFrequency: '',
    productLabel: '',
    productSubLabel: '',
    protocolBouncers: '',
    accountType: ''
  }
};
export default formDatas;
