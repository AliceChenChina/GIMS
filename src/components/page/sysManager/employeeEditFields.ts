import EmployeeEdit from '@/components/page/sysManager/EmployeeEdit';
import { dynamicFormState } from '@/types/types';
import { ValidateType } from '@/utils/FieldValidator';

function employeeEditFields(vm: EmployeeEdit) {
  return [
    [
      {
        formLabel: '用户名：',
        modelKey: 'loginName',
        formRules: 'required',
        inputProps: {
          disabled: !!vm.user.empId // 新建用户为false
        },
        inputTag: 'el-input'
      },
      {
        formLabel: '企业微信姓名：',
        modelKey: 'name',
        formRules: 'required',
        inputProps: {
          disabled: !!vm.user.empId // 新建用户为false
        },
        inputTag: 'el-input'
      },
      {
        formLabel: '真实姓名：',
        modelKey: 'trueName',
        formRules: 'required',
        inputTag: 'el-input'
      }
    ],
    [
      {
        formLabel: '京东用户名：',
        modelKey: 'pinCode',
        inputTag: 'el-input'
      },
      {
        formLabel: '是否同步企业微信：',
        modelKey: 'creator',
        formRules: 'required',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      },
      {
        formLabel: '手机号：',
        modelKey: 'mobile',
        inputTag: 'el-input',
        formRules: [{ validator: vm.validateText(ValidateType.mobile, true), required: true }]
      }
    ],
    [
      {
        formLabel: '所属部门',
        modelKey: 'deptIdValue',
        formRules: 'required',
        inputTag: 'el-cascader',
        inputProps: {
          options: vm.deptCascaderOptions,
          props: {
            checkStrictly: true
          }
        }
      },
      {
        formLabel: '员工状态：',
        modelKey: 'status',
        formRules: 'required',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '在职',
            value: 1
          },
          {
            label: '离职',
            value: 2
          }
        ]
      },
      {
        formLabel: '离职时间',
        modelKey: 'leaveDate',
        inputTag: 'el-date-picker',
        inputProps: {
          'value-format': 'yyyy-MM-dd 00:00:00',
          disabled: vm.user.status === 1
        }
      }
    ],
    [
      {
        formLabel: '出生日期：', // todo 下拉层级选择框
        modelKey: 'birthday',
        inputTag: 'el-date-picker',
        inputProps: {
          'value-format': 'yyyy-MM-dd 00:00:00'
        }
      },
      {
        formLabel: '员工工号：',
        modelKey: 'jobnumber',
        inputTag: 'el-input'
      },
      {
        formLabel: '性别：',
        modelKey: 'gender',
        formRules: 'required',
        inputTag: 'el-select',
        inputTagOptions: [
          {
            label: '男',
            value: 1
          },
          {
            label: '女',
            value: 2
          },
          {
            label: '保密',
            value: 0
          }
        ]
      },
      {
        formLabel: '身份证号',
        modelKey: 'idcard',
        inputTag: 'el-input',
        formRules: [{ validator: vm.validateText(ValidateType.idcard, false) }]
      }
    ],
    [
      {
        formLabel: '银行卡号：',
        modelKey: 'cardNo',
        inputTag: 'el-input'
      },
      {
        formLabel: '邮箱：',
        modelKey: 'email',
        inputTag: 'el-input',
        formRules: [{ validator: vm.validateText(ValidateType.mail, false) }]
      }
    ],
    [
      {
        formLabel: '地址：',
        modelKey: 'address',
        inputTag: 'el-input'
      },
      {
        formLabel: '是否是理财师：',
        modelKey: 'isSales',
        inputTag: 'el-radio-group',
        inputTagOptions: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      }
    ],
    [
      {
        formLabel: '手机小号：',
        modelKey: 'dummyMobile',
        formRules: 'required',
        inputTag: 'el-input'
      },
      {
        formLabel: '职位：',
        modelKey: 'classLevel',
        formRules: 'required',
        inputTag: 'el-select',
        inputTagOptions: vm.$utils.statusArgsWithElOptionsTag('class_level')
      }
      ]
  ];
}

export { employeeEditFields };
