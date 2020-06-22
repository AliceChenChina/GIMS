import feeStru from '../feeStru';
import projectList from './projectList';
import guarantor from './guarantor';
import attachmentLimitTypes from '../uploadFileTypes';

export default function(vm) {
  const productStatusOption = vm.statusArgsWithElOptionsTag('product_status');
  const contractTypeOption = vm.statusArgsWithElOptionsTag('contract_type'); // 合同类型
  const riskLevelOption = vm.statusArgsWithElOptionsTag('product_risk_level'); // 产品风险等级
  const moneyTypeOption = vm.statusArgsWithElOptionsTag('money_type');
  const raiseTypeOption = vm.statusArgsWithElOptionsTag('raise_type'); // 产品分类
  const incomeTypeOption = vm.statusArgsWithElOptionsTag('income_type'); // 收益分配类别
  const incomeDistributionWayDescOption = vm.statusArgsWithElOptionsTag('feeratio_memo_type'); // 收益分配说明类别
  const investmentIndustryOption = vm.statusArgsWithElOptionsTag('investment_industry'); // 投资行业
  const cycleSuggestOption = vm.statusArgsWithElOptionsTag('cycle_suggest'); // 周期建议
  const dividendMethodOption = vm.statusArgsWithElOptionsTag('dividend_method'); // 分红方式
  const productStageOption = vm.statusArgsWithElOptionsTag('product_stage');
  const redemptionPrincipleOption = vm.statusArgsWithElOptionsTag('redemption_principle'); // 赎回明细分配原则
  const issueTypeOption = vm.statusArgsWithElOptionsTag('issue_type'); // 基金发行方式

  return [
    {
      title: '基本信息',
      formItems: [
        {
          formLabel: '产品名称：',
          modelKey: 'productName',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '产品简称：',
          modelKey: 'productNameShort',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '产品阶段：',
          inputTagOptions: productStageOption,
          modelKey: 'productStage',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '产品状态：',
          inputTagOptions: productStatusOption,
          modelKey: 'productStatus',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '基金代码：',
          modelKey: 'productCode',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '年化天数：',
          inputTagOptions: [
            {
              label: '360',
              value: '360'
            },
            {
              label: '365',
              value: '365'
            },
            {
              label: '366',
              value: '366'
            },
            {
              label: '225',
              value: '225'
            }
          ],
          modelKey: 'incomeYearDays',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '期限单位：',
          inputTagOptions: [
            {
              label: '天',
              value: 1
            },
            {
              label: '月',
              value: 2
            },
            {
              label: '年',
              value: 3
            }
          ],
          modelKey: 'timeLimitType',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '产品期限：',
          modelKey: 'timeLimit',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '是否有封闭期：',
          inputTagOptions: [
            {
              label: '有固定封闭期',
              value: 1
            },
            {
              label: '无固定封闭期',
              value: 0
            }
          ],
          modelKey: 'hasClosedPeriod',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-radio-group',
          dispFormatter(value) {
            // productBaseInfo中将model的结果处理后输出
            const val = parseInt(value);
            if (val === 1) {
              return '有固定封闭期';
            } else if (val === 0) {
              return '无固定封闭期';
            }
            return '-';
          }
        },
        parseInt(vm.formStoreModel && vm.formStoreModel.hasClosedPeriod) === 1
        ? {
          formLabel: '封闭期（月）：',
          modelKey: 'closedPeriod',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        } : null,
        {
          formLabel: '合同类型：',
          inputTagOptions: contractTypeOption,
          modelKey: 'contractType',
          inputTag: 'el-select'
        },
        {
          formLabel: '增信措施/风控措施：',
          inputProps: {
            type: 'textarea',
            rows: 2,
            disabled: true
          },
          modelKey: 'riskCtrlMethod',
          inputTag: 'el-input'
        },
        {
          formLabel: '收益分配方式：',
          modelKey: 'incomeDistributionWay',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '还款来源：',
          modelKey: 'repaymentSource',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '发行类型：',
          inputTagOptions: raiseTypeOption,
          modelKey: 'raiseType',
          inputTag: 'el-select'
        },
        {
          formLabel: '收益分配说明类别：',
          inputTagOptions: incomeDistributionWayDescOption,
          modelKey: 'incomeDistributionWayDesc',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '募集资金用途：',
          inputProps: {
            type: 'textarea',
            rows: 2,
            disabled: true
          },
          modelKey: 'financeObjective',
          formRules: 'required',
          inputTag: 'el-input'
        },
        {
          formLabel: '投资方向：',
          modelKey: 'investmentTrends',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '投资行业：',
          inputTagOptions: investmentIndustryOption,
          modelKey: 'investmentIndustry',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '周期建议：',
          inputTagOptions: cycleSuggestOption,
          modelKey: 'cycleSuggest',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '分红方式：',
          inputTagOptions: dividendMethodOption,
          modelKey: 'dividendMethod',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '是否允许修改分红方式：',
          inputTagOptions: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          modelKey: 'modifyDividend',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-radio-group'
        },
        {
          formLabel: '是否过会：',
          inputTagOptions: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          modelKey: 'isVote',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-radio-group'
        },
        {
          formLabel: '币种类别: ',
          inputTagOptions: moneyTypeOption,
          modelKey: 'moneyType',
          formRules: 'required',
          inputTag: 'el-select'
        },
        {
          formLabel: '收益信息类型: ',
          inputTagOptions: incomeTypeOption,
          modelKey: 'incomeType',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '收益信息值: ',
          modelKey: 'incomeValue',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '业绩报酬说明：',
          inputProps: {
            type: 'textarea',
            rows: 2
          },
          modelKey: 'rewardDesc',
          inputTag: 'el-input'
        },
        {
          formLabel: '产品介绍：',
          inputProps: {
            type: 'textarea',
            rows: 2,
            disabled: true
          },
          modelKey: 'productDesc',
          formRules: 'required',
          inputTag: 'el-input'
        }
      ]
    },
      {
        title: '融资人/项目方',
        type: 'table',
        modelKey: 'productProjectDtoList',
        tableColumn: projectList
      },
      {
        title: '担保人',
        type: 'table',
        modelKey: 'productProjectDtoList',
        tableColumn: guarantor
      },
    {
      title: '服务机构',
      formItems: [
        {
          formLabel: '产品管理人：',
          modelKey: 'mandatorName',
          inputTag: 'el-input',
          inputProps: {
            disabled: true
          }
        },
        {
          formLabel: '管理人简称：',
          inputProps: {
            type: 'textarea',
            rows: 2,
            disabled: true
          },
          modelKey: 'mandatorObj.shortName',
          inputTag: 'el-input'
        },
        {
          formLabel: '管理人简介：',
          inputProps: {
            type: 'textarea',
            rows: 2,
            disabled: true
          },
          modelKey: 'mandatorObj.mandatorBrief',
          inputTag: 'el-input'
        },
        {
          formLabel: '成立日期：',
          modelKey: 'mandatorObj.setupTime',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '注册资本：',
          modelKey: 'mandatorObj.registerCapital',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '管理人机构规模：',
          modelKey: 'mandatorObj.orgScale',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '股东/实际控制人：',
          modelKey: 'mandatorObj.stockHolderName',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '外包服务机构：',
          modelKey: 'outsourcingServiceOrg',
          inputTag: 'el-input'
        },
        {
          formLabel: '通道名称：',
          modelKey: 'channelName',
          inputTag: 'el-input'
        },
        {
          formLabel: '托管机构：',
          modelKey: 'storageBank',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '其他服务机构：',
          modelKey: 'otherServiceOrg',
          inputTag: 'el-input'
        },
        {
          formLabel: '投资顾问：',
          modelKey: 'investAdviser',
          inputTag: 'el-input'
        },
        {
          formLabel: '注册登记机构：',
          modelKey: 'regOrg',
          inputTag: 'el-input'
        }
      ]
    },
    {
      title: '适当性信息',
      formItems: [
        {
          formLabel: '产品风险等级：',
          inputTagOptions: riskLevelOption,
          modelKey: 'riskLevel',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '资产证明等级：',
          inputTagOptions: [
            {
              label: '私募300万',
              value: 1
            },
            {
              label: '资管500万',
              value: 2
            }
          ],
          modelKey: 'assetCertificateLevel',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-radio-group'
        },
        {
          formLabel: '是否可以越级购买',
          inputProps: {
            disabled: true
          },
          inputTagOptions: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          modelKey: 'canBuyBypass',
          formRules: 'required',
          inputTag: 'el-radio-group'
        },
        {
          formLabel: '是否支持港澳台客户购买:',
          inputProps: {
            disabled: true
          },
          inputTagOptions: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          modelKey: 'canHkBuy',
          formRules: 'required',
          inputTag: 'el-radio-group'
        }
      ]
    },
    {
      title: '销售控制信息',
      formItems: [
        {
          formLabel: '个人最低认购金额（元）：',
          modelKey: 'minSubBalance',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '个人追加认购金额（元）：',
          modelKey: 'minSubAddBalance',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '个人最低申购金额（元）：',
          modelKey: 'minPurBalance',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '个人追加申购金额（元）：',
          modelKey: 'minPurAddBalance',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '个人认购递增金额（元）：',
          modelKey: 'subDifferential',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '个人申购递增金额（元）：',
          modelKey: 'purDifferential',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '机构最低认购金额（元）：',
          modelKey: 'orgMinSubBalance',
          inputTag: 'el-input'
        },
        {
          formLabel: '机构追加认购金额（元）：',
          modelKey: 'orgMinSubAddBalance',
          inputTag: 'el-input'
        },
        {
          formLabel: '机构最低申购金额（元）：',
          modelKey: 'orgMinPurBalance',
          inputTag: 'el-input'
        },
        {
          formLabel: '机构追加申购金额（元）：',
          modelKey: 'orgMinPurAddBalance',
          inputTag: 'el-input'
        },
        {
          formLabel: '单笔购买上限：',
          modelKey: 'singlePurchaseLimit',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '赎回明细分配原则：',
          inputTagOptions: redemptionPrincipleOption,
          modelKey: 'redemptionPrinciple',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '最低赎回：',
          modelKey: 'minimumRedemption',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '最低持有：',
          modelKey: 'minimumHolding',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '认购确认日T+几：',
          modelKey: 'subConfirmDateLength',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '申购确认日T+几：',
          modelKey: 'purConfirmDateLength',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '收益时间T+几：',
          modelKey: 'incomeDateLength',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '赎回确认时间T+几：',
          modelKey: 'redemConfirmDateLength',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '赎回到账时间T+几：',
          modelKey: 'redemTimeDateLength',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        }
      ]
    },
    {
      title: '发行信息',
      formItems: [
        {
          formLabel: '产品发行规模是否无上限:',
          inputProps: {
            disabled: true
          },
          inputTagOptions: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          modelKey: 'hasMaxBalanceUnlimit',
          formRules: 'required',
          inputTag: 'el-radio-group'
        },
        {
          formLabel: '产品发行规模（元）：',
          modelKey: 'maxBalance',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '提前（）天线上支付：',
          modelKey: 'daysBeforePay',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '赎回开始时间（M-几） ：',
          modelKey: 'daysBeforeRedemption',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '赎回结束时间（M-几）：',
          modelKey: 'daysBeforeRedemptionEnd',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '认购开始日：',
          modelKey: 'issueDate',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-date-picker'
        },
        {
          formLabel: '认购结束日：',
          modelKey: 'issueEndDate',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-date-picker'
        },
        {
          formLabel: '是否未成立:',
          inputProps: {
            disabled: true
          },
          inputTagOptions: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          modelKey: 'hasNoSetupDate',
          formRules: 'required',
          inputTag: 'el-radio-group'
        },
        {
          formLabel: '成立日期：',
          modelKey: 'setupDate',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-date-picker'
        },
        {
          formLabel: '起息日期：',
          modelKey: 'valueDate',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-date-picker'
        },
        {
          formLabel: '到期日期：',
          modelKey: 'contractEndDate',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-date-picker'
        },
        {
          formLabel: '基金发行方式：',
          inputTagOptions: issueTypeOption,
          modelKey: 'issueType',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-select'
        },
        {
          formLabel: '可投名额上限：',
          modelKey: 'maxUpperPeople',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        },
        {
          formLabel: '是否无冷静期:',
          inputProps: {
            disabled: true
          },
          inputTagOptions: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          modelKey: 'haveCalmingDownTime',
          formRules: 'required',
          inputTag: 'el-radio-group'
        },
        {
          formLabel: '冷静期时间：',
          modelKey: 'coolingTime',
          formRules: 'required',
          inputProps: {
            disabled: true
          },
          inputTag: 'el-input'
        }
      ]
    },
    {
      title: '费用结构类型',
      formItems: [
        {
          formLabel: '折标系数：',
          modelKey: 'commisionConvert',
          formRules: 'required',
          inputTag: 'el-input'
        },
        {
          formLabel: '提成比例(%)：',
          modelKey: 'commisionRate',
          formRules: 'required',
          inputTag: 'el-input'
        }
      ]
    },
    {
      title: '费率',
      type: 'table',
      modelKey: 'productFeeRateList',
      tableColumn: feeStru
    },
    {
      title: '附件',
      formItems: [
        {
          formLabel: '产品要素：',
          modelKey: 'attachList.productElement', // 浅拷贝引用修改原model vuex会报警
          inputTag: 'el-upload',
          inputProps: {
            accept: attachmentLimitTypes
          }
        },
        {
          formLabel: '签约指南：',
          modelKey: 'attachList.productSign', // 浅拷贝引用修改原model vuex会报警
          inputTag: 'el-upload',
          inputProps: {
            accept: attachmentLimitTypes
          }
        },
        {
          formLabel: '营销资料：',
          modelKey: 'attachList.productMarketing', // 浅拷贝引用修改原model vuex会报警
          inputTag: 'el-upload',
          inputProps: {
            accept: attachmentLimitTypes
          }
        }
      ]
    }
  ];
}
