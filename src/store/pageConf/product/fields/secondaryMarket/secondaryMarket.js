import managerList from './managerList';
import feeStru from '../feeStru';
export default function(vm) {
  const productStatusOption = vm.statusArgsWithElOptionsTag('product_status'); // '产品阶段（0正常发行、1产品终止、2发行失败）'
  const contractTypeOption = vm.statusArgsWithElOptionsTag('contract_type'); // 合同类型
  const investmentIndustryOption = vm.statusArgsWithElOptionsTag('investment_industry'); // 投资行业
  const cycleSuggestOption = vm.statusArgsWithElOptionsTag('cycle_suggest'); // 周期建议
  const styleOption = vm.statusArgsWithElOptionsTag('style'); // 风格
  const marketAdaptabilityOption = vm.statusArgsWithElOptionsTag('market_adaptability'); // 市况适应性
  const marketValueOption = vm.statusArgsWithElOptionsTag('market_value'); // 市值
  const dividendMethodOption = vm.statusArgsWithElOptionsTag('dividend_method'); // 分红方式
  const incomeTypeOption = vm.statusArgsWithElOptionsTag('income_type'); // 收益分配类别
  const issueTypeOption = vm.statusArgsWithElOptionsTag('issue_type'); // 基金发行方式
  const incomeDistributionWayDescOption = vm.statusArgsWithElOptionsTag('feeratio_memo_type'); // 收益分配说明类别
  const redemptionPrincipleOption = vm.statusArgsWithElOptionsTag('redemption_principle'); // 赎回明细分配原则
  const productStageOption = vm.statusArgsWithElOptionsTag('product_stage');
  const lockPeriodUnitOption = vm.statusArgsWithElOptionsTag('lock_period_unit');
  const strategyTypeOption = vm.statusArgsWithElOptionsTag('strategy_type');
  const moneyTypeOption = vm.statusArgsWithElOptionsTag('money_type');
  const riskLevelOption = vm.statusArgsWithElOptionsTag('product_risk_level');

  // 替换正则
  // (\w+): eucte.arg.getGroup\(\'(\w+)'\),
  // const $1 = vm.statusArgsWithElOptionsTag('$2');

  return [
    {
     title: '基本信息',
     formItems: [
        {
         formLabel: '产品名称: ',
         modelKey: 'productName',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '产品简称: ',
         modelKey: 'productNameShort',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '产品阶段: ',
         inputTagOptions: productStageOption,
         modelKey: 'productStage',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '产品状态: ',
         inputTagOptions: productStatusOption,
         modelKey: 'productStatus',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '基金代码: ',
         modelKey: 'productCode',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '期限单位: ',
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
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '是否有封闭期: ',
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
         formLabel: '锁定期: ',
         modelKey: 'lockPeriod',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '锁定期单位: ',
         inputTagOptions: lockPeriodUnitOption,
         modelKey: 'lockPeriodUnit',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '产品期限: ',
         modelKey: 'timeLimit',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '策略分类: ',
         inputTagOptions: strategyTypeOption,
         modelKey: 'strategyType',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '合同类型: ',
         inputTagOptions: contractTypeOption,
         modelKey: 'contractType',
         inputTag: 'el-select'
        },
        {
         formLabel: '业绩报酬计提率: ',
         modelKey: 'performanceCompensationRate',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '业绩报酬说明: ',
         inputProps: {
           type: 'textarea',
           rows: 2,
           disabled: true
          },
         modelKey: 'rewardDesc',
         inputTag: 'el-input'
        },
        {
         formLabel: '收益分配方式: ',
         modelKey: 'incomeDistributionWay',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '收益分配说明类别: ',
         inputTagOptions: incomeDistributionWayDescOption,
         modelKey: 'incomeDistributionWayDesc',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '收益信息类型: ',
         inputTagOptions: incomeTypeOption,
         modelKey: 'incomeType',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '收益信息值: ',
         modelKey: 'incomeValue',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '投资范围: ',
         inputProps: {
           type: 'textarea',
           rows: 2,
           disabled: true
          },
         modelKey: 'investmentScale',
         formRules: 'required',
         inputTag: 'el-input'
        },
        {
         formLabel: '投资方向: ',
         modelKey: 'investmentTrends',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '投资行业:',
         inputTagOptions: investmentIndustryOption,
         modelKey: 'investmentIndustry',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '周期建议: ',
         inputTagOptions: cycleSuggestOption,
         modelKey: 'cycleSuggest',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '风格: ',
         inputTagOptions: styleOption,
         modelKey: 'style',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '市况适应性: ',
         inputTagOptions: marketAdaptabilityOption,
         modelKey: 'marketAdaptability',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '市值: ',
         inputTagOptions: marketValueOption,
         modelKey: 'marketValue',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '分红方式: ',
         inputTagOptions: dividendMethodOption,
         modelKey: 'dividendMethod',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '是否允许修改分红方式: ',
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
         formLabel: '是否过会: ',
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
         formRules: 'required',
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
         formLabel: '开放日说明: ',
         inputProps: {
           type: 'textarea',
           rows: 2,
           disabled: true
          },
         modelKey: 'opendayDesc',
         formRules: 'required',
         inputTag: 'el-input'
        },
        {
         formLabel: '产品介绍: ',
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
     title: '服务机构',
     formItems: [
       {
         formLabel: '产品管理人: ',
         modelKey: 'mandatorName',
         inputTag: 'el-input',
         inputProps: {
           disabled: true
         }
       },
        {
         formLabel: '管理人简称: ',
         modelKey: 'mandatorObj.shortName',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '管理人简介: ',
         inputProps: {
           type: 'textarea',
           rows: 2,
           disabled: true
          },
         modelKey: 'mandatorObj.mandatorBrief',
         inputTag: 'el-input'
        },
        {
         formLabel: '成立日期: ',
         modelKey: 'mandatorObj.setupTime',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '注册资本: ',
         modelKey: 'mandatorObj.registerCapital',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '管理人机构规模: ',
         modelKey: 'mandatorObj.orgScale',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '外包服务机构: ',
         modelKey: 'outsourcingService',
         inputTag: 'el-input'
        },
        {
         formLabel: '托管机构: ',
         modelKey: 'storageBank',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '投资顾问: ',
         modelKey: 'investAdviser',
         inputTag: 'el-input'
        },
        {
         formLabel: '发行机构: ',
         modelKey: 'issueChannel',
         inputTag: 'el-input'
        }
      ]
    },
    {
     title: '适当性信息',
     formItems: [
        {
         formLabel: '产品风险等级: ',
         inputTagOptions: riskLevelOption,
         modelKey: 'riskLevel',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '资产证明等级: ',
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
         inputTag: 'el-radio-group',
         inputProps: {
          disabled: true
         }
        },
        {
         formLabel: '是否可以越级购买:',
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
         inputTag: 'el-radio-group',
        inputProps: {
          disabled: true
        }
        },
        {
         formLabel: '是否支持港澳台客户购买:',
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
         inputTag: 'el-radio-group',
          inputProps: {
            disabled: true
          }
        }
      ]
    },
    {
     title: '销售控制信息',
     formItems: [
        {
         formLabel: '个人最低认购金额（元）: ',
         modelKey: 'minSubBalance',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '个人追加认购金额（元）: ',
         modelKey: 'minSubAddBalance',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '个人最低申购金额（元）: ',
         modelKey: 'minPurBalance',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '个人追加申购金额（元）: ',
         modelKey: 'minPurAddBalance',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '个人认购递增金额（元）: ',
         modelKey: 'subDifferential',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '个人申购递增金额（元）: ',
         modelKey: 'purDifferential',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '机构最低认购金额（元）: ',
         modelKey: 'orgMinSubBalance',
         inputTag: 'el-input'
        },
        {
         formLabel: '机构追加认购金额（元）: ',
         modelKey: 'orgMinSubAddBalance',
         inputTag: 'el-input'
        },
        {
         formLabel: '机构最低申购金额（元）: ',
         modelKey: 'orgMinPurBalance',
         inputTag: 'el-input'
        },
        {
         formLabel: '机构追加申购金额（元）: ',
         modelKey: 'orgMinPurAddBalance',
         inputTag: 'el-input'
        },
        {
         formLabel: '单笔购买上限是否无上限:',
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
         modelKey: 'singlePurchaseLimitUnlimit',
         formRules: 'required',
         inputTag: 'el-radio-group'
        },
        {
         formLabel: '单笔购买上限(元): ',
         modelKey: 'singlePurchaseLimit',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '赎回明细分配原则: ',
         inputTagOptions: redemptionPrincipleOption,
         modelKey: 'redemptionPrinciple',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '最低赎回(元): ',
         modelKey: 'minimumRedemption',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '最低持有(元): ',
         modelKey: 'minimumHolding',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '认购确认日T+: ',
         modelKey: 'subConfirmDateLength',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '申购确认日T+: ',
         modelKey: 'purConfirmDateLength',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '赎回确认时间T+: ',
         modelKey: 'redemConfirmDateLength',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '赎回到账时间T+: ',
         modelKey: 'redemTimeDateLength',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '收益时间T+: ',
         modelKey: 'incomeDateLength',
         formRules: 'required',
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
         formLabel: '提前（）天线上支付: ',
         modelKey: 'daysBeforePay',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '赎回开始时间（M-几） : ',
         modelKey: 'daysBeforeRedemption',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '赎回结束时间（M-几）: ',
         modelKey: 'daysBeforeRedemptionEnd',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        },
        {
         formLabel: '认购开始日: ',
         modelKey: 'issueDate',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-date-picker'
        },
        {
         formLabel: '认购结束日: ',
         modelKey: 'issueEndDate',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-date-picker'
        },
        {
         formLabel: '到期日期: ',
         modelKey: 'contractEndDate',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-date-picker'
        },
        {
         formLabel: '起息日期: ',
         modelKey: 'valueDate',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-date-picker'
        },
        {
         formLabel: '基金发行方式: ',
         inputTagOptions: issueTypeOption,
         modelKey: 'issueType',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-select'
        },
        {
         formLabel: '可投名额上限: ',
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
         formLabel: '冷静期时间: ',
         modelKey: 'coolingTime',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
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
         formLabel: '成立日期: ',
         modelKey: 'setupDate',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-date-picker'
        },
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
         formLabel: '产品发行规模（元）: ',
         modelKey: 'maxBalance',
         formRules: 'required',
         inputProps: {
           disabled: true
          },
         inputTag: 'el-input'
        }
      ]
    },
    {
     title: '风控信息',
     formItems: [
        {
         formLabel: '投资限制和禁止行为: ',
         inputProps: {
           type: 'textarea',
           rows: 2
          },
         modelKey: 'investmentRestrictionsAndProhibitions',
         inputTag: 'el-input'
        },
        {
         formLabel: '投资范围的变更: ',
         inputProps: {
           type: 'textarea',
           rows: 2
          },
         modelKey: 'investmentScaleChange',
         inputTag: 'el-input'
        },
        {
         formLabel: '被动上升后，投资限制的调整: ',
         modelKey: 'passiveInvestmentRestrictions',
         inputTag: 'el-input'
        },
        {
         formLabel: '预警线/平仓线: ',
         modelKey: 'warningAndUnravelLine',
         inputTag: 'el-input'
        },
        {
         formLabel: '触及预警线/止损线的措施: ',
         inputProps: {
           type: 'textarea',
           rows: 2
          },
         modelKey: 'touchSteps',
         inputTag: 'el-input'
        },
        {
         formLabel: '风险收益特征: ',
         inputProps: {
           type: 'textarea',
           rows: 2
          },
         modelKey: 'riskBenefitFeatures',
         inputTag: 'el-input'
        },
        {
         formLabel: '估值错误的认定: ',
         modelKey: 'appraisementErrorAffirm',
         inputTag: 'el-input'
        },
        {
         formLabel: '份额转让: ',
         inputProps: {
           type: 'textarea',
           rows: 2
          },
         modelKey: 'shareTransfer',
         inputTag: 'el-input'
        }
      ]
    },
    {
     title: '费用结构信息',
     formItems: [
        {
         formLabel: '折标系数：',
         modelKey: 'commisionConvert',
         inputTag: 'el-input'
        },
        {
         formLabel: '提成比例(%)：',
         modelKey: 'commisionRate',
         inputTag: 'el-input'
        }
      ]
    },
    {
      title: '基金经理',
      type: 'table',
      modelKey: 'managerList',
      tableColumn: managerList
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
          inputTag: 'el-upload'
        },
        {
          formLabel: '签约指南：',
          modelKey: 'attachList.productSign', // 浅拷贝引用修改原model vuex会报警
          inputTag: 'el-upload'
        },
        {
          formLabel: '营销资料：',
          modelKey: 'attachList.productMarketing', // 浅拷贝引用修改原model vuex会报警
          inputTag: 'el-upload'
        }
      ]
    }
  ];
}
