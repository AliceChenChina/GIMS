// 启动报单表单 -- 视图结构数据
export default function(vm) {
  const openStatusOption = [{ value: 1, label: '开放' }, { value: 0, label: '关闭' }];
  const options = [
    {
      title: '产品信息',
      formItems: [
        {
          formLabel: '产品名称:',
          modelKey: 'productName',
          inputTag: 'el-input',
          inputProps: {
            disabled: true
          }
        },
        {
          formLabel: '产品风险等级:',
          modelKey: 'productLevel',
          inputTag: 'el-input',
          inputProps: {
            disabled: true
          }
        }
      ]
    },
    {
      title: '启动报单信息',
      formItems: [
        {
          formLabel: '业务类型:',
          modelKey: 'type',
          inputTag: 'el-input',
          inputProps: {
            disabled: true
          }
        },
        {
          formLabel: '启动报单名称:',
          modelKey: 'startName',
          formRules: 'required',
          inputTag: 'el-input'
        },
        {
          formLabel: '报单开放状态:',
          inputTagOptions: openStatusOption,
          modelKey: 'openStatus',
          formRules: 'required',
          inputTag: 'el-select'
        },
        {
          formLabel: '报单开放开始日期:',
          modelKey: 'openStart',
          formRules: 'required',
          inputTag: 'el-date-picker'
        },
        {
          formLabel: '报单开放结束日期:',
          modelKey: 'openEnd',
          formRules: 'required',
          inputTag: 'el-date-picker'
        }
      ]
    }
  ];
  return options;
};
