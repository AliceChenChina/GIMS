import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: resolve => require(['page/dashboard/dashboard.tsx'], resolve),
          meta: { title: '系统首页' }
        },
        {
          path: '/CEReportData',
          name: 'report',
          component: resolve => require(['page/report/report.tsx'], resolve),
          meta: { title: '数据看板' }
        },
        {
          path: '/demopage',
          component: resolve => require(['page/demoPage.vue'], resolve),
          meta: { title: '页面规范' }
        },
        {
          path: '/icon',
          component: resolve => require(['page/Icon.vue'], resolve),
          meta: { title: '自定义图标' }
        },
        {
          path: '/table',
          component: resolve => require(['page/BaseTable.vue'], resolve),
          meta: { title: '基础表格' }
        },
        {
          path: '/tabs',
          component: resolve => require(['page/Tabs.vue'], resolve),
          meta: { title: 'tab选项卡' }
        },
        {
          path: '/form',
          component: resolve => require(['page/BaseForm.vue'], resolve),
          meta: { title: '基本表单' }
        },
        {
          // 富文本编辑器组件
          path: '/editor',
          component: resolve => require(['page/VueEditor.vue'], resolve),
          meta: { title: '富文本编辑器' }
        },
        {
          // markdown组件
          path: '/markdown',
          component: resolve => require(['page/Markdown.vue'], resolve),
          meta: { title: 'markdown编辑器' }
        },
        {
          // 图片上传组件
          path: '/upload',
          component: resolve => require(['page/Upload.vue'], resolve),
          meta: { title: '文件上传' }
        },
        {
          // vue-schart组件
          path: '/charts',
          component: resolve => require(['page/BaseCharts.vue'], resolve),
          meta: { title: 'schart图表' }
        },
        {
          // 拖拽列表组件
          path: '/drag',
          component: resolve => require(['page/DragList.vue'], resolve),
          meta: { title: '拖拽列表' }
        },
        {
          // 拖拽Dialog组件
          path: '/dialog',
          component: resolve => require(['page/DragDialog.vue'], resolve),
          meta: { title: '拖拽弹框' }
        },
        {
          // 国际化组件
          path: '/i18n',
          component: resolve => require(['page/I18n.vue'], resolve),
          meta: { title: '国际化' }
        },
        {
          // 权限页面
          path: '/permission',
          component: resolve => require(['page/Permission.vue'], resolve),
          meta: { title: '权限测试', permission: true }
        },
        {
          // 交易管理
          path: '/orderQuery',
          name: 'orderQuery',
          component: resolve => require(['../components/page/order/orderQuery.vue'], resolve),
          meta: { title: '认申购订单', crumb: '交易管理 / 认申购订单' }
        },
        {
          // 交易管理
          path: '/orderQueryRedeem',
          name: 'orderQueryRedeem',
          component: resolve => require(['page/order/orderQuery.vue'], resolve),
          meta: { title: '赎回订单', crumb: '交易管理 / 赎回订单' }
        },
        {
          // 交易管理
          path: '/overseaAndInsuranceOrderList',
          name: 'overseaAndInsuranceOrderList',
          component: resolve => require(['page/order/overseaAndInsuranceOrderList.vue'], resolve),
          meta: { title: '海外/保险订单', crumb: '交易管理 / 海外/保险订单' }
        },
        {
          // 客户列表
          path: '/consumerList',
          name: 'consumerList',
          component: resolve => require(['page/consumer/consumerList.vue'], resolve),
          meta: { title: '客户列表', crumb: '客户管理 / 客户列表' }
        },
        {
          // 客户跟进情况
          path: '/consumerVisit',
          name: 'consumerVisit',
          component: resolve => require(['page/consumer/consumerList.vue'], resolve),
          meta: { title: '客户跟进情况', crumb: '客户管理 / 客户跟进情况' }
        },
        {
          // 待分配客户列表
          path: '/consumerNoAssign',
          name: 'consumerNoAssign',
          component: resolve => require(['page/consumer/consumerList.vue'], resolve),
          meta: { title: '待分配客户列表', crumb: '客户管理 / 待分配客户列表' }
        },
        {
          // 资产证明记录列表
          path: '/pfundAssetProofList',
          name: 'pfundAssetProofList',
          component: resolve => require(['page/consumer/pfundAssetProofList.vue'], resolve),
          meta: { title: '资产证明记录列表', crumb: '客户管理 / 资产证明记录列表' }
        },
        {
          // 待分配客户列表
          path: '/consumerDetail',
          name: 'consumerDetail',
          component: resolve => require(['page/consumer/consumerDetail.vue'], resolve),
          meta: { title: '客户详情', crumb: '客户管理 / 客户详情' }
        },
        {
          // 客户持仓列表
          path: '/consumerHoldingList',
          name: 'consumerHoldingList',
          component: resolve => require(['page/consumer/consumerHoldingList.vue'], resolve),
          meta: { title: '客户持仓列表', crumb: '客户管理 / 客户持仓列表' }
        },
        {
          // 客户归属校验
          path: '/customerSalesCompareList',
          name: 'customerSalesCompareList',
          component: resolve => require(['page/consumer/customerSalesCompareList.vue'], resolve),
          meta: { title: '客户归属校验', crumb: '客户管理 / 客户归属校验' }
        },
        {
          // leads列表
          path: '/leadsQuery',
          name: 'leadsQuery',
          component: resolve => require(['page/leads/leadsQuery.vue'], resolve),
          meta: { title: 'leads列表', crumb: '预约管理 / leads列表' }
        },
        {
          // leads详情
          path: '/leadsDetail',
          name: 'leadsDetail',
          component: resolve => require(['page/leads/leadsDetail.vue'], resolve),
          meta: { title: 'leads详情', crumb: '预约管理 / leads详情' }
        },
        {
          // leads导入
          path: '/leadsImport',
          name: 'leadsImport',
          component: resolve => require(['page/leads/leadsImport.vue'], resolve),
          meta: { title: 'leads导入', crumb: '预约管理 / leads导入' }
        },
        {
          // 产品存续列表
          path: '/durationList',
          name: 'durationList',
          component: resolve => require(['../components/page/product/durationList.vue'], resolve),
          meta: { title: '产品存续列表', crumb: '产品管理 / 产品存续列表' }
        },
        {
          // 付息明细
          path: '/durationList/benefitsListInterest',
          name: 'benefitsListInterest',
          component: resolve => require(['../components/page/product/benefitsList.vue'], resolve),
          meta: { title: '付息明细', crumb: '产品管理 / 产品存续列表 / 付息明细' }
        },
        {
          // 收益分配明细
          path: '/durationList/benefitsListApportionment',
          name: 'benefitsListApportionment',
          component: resolve => require(['../components/page/product/benefitsList.vue'], resolve),
          meta: { title: '收益分配明细', crumb: '产品管理 / 产品存续列表 / 收益分配明细' }
        },
        {
          // 存续列表
          path: '/durationList/durationManage',
          name: 'durationManage',
          component: resolve => require(['../components/page/product/durationManage.vue'], resolve),
          meta: { title: '存续列表', crumb: '产品管理 / 产品存续列表 / 存续列表' }
        },
        {
          // 产品编辑
          path: '/productEdit',
          name: 'productEdit',
          component: resolve => require(['../components/page/product/productEdit.vue'], resolve),
          meta: { title: '产品编辑', crumb: '产品管理 / 产品编辑' }
        },
        {
          // 产品查看
          path: '/productInfo',
          name: 'productInfo',
          component: resolve => require(['../components/page/product/productInfo.vue'], resolve),
          meta: { title: '产品概览', crumb: '产品管理 / 产品概览' }
        },
        {
          // 产品库
          path: '/productList',
          name: 'productList',
          component: resolve => require(['../components/page/product/productList.vue'], resolve),
          meta: { title: '产品库', crumb: '产品管理 / 产品库' }
        },
        {
          // 产品库--编辑
          path: '/modifyProductLabel',
          name: 'modifyProductLabel',
          component: resolve => require(['../components/page/product/modifyProductLabel.vue'], resolve),
          meta: { title: '修改产品标签'}
        },
        {
          // 在售产品
          path: '/productSellingList',
          name: 'productSellingList',
          component: resolve => require(['../components/page/product/productSellingList.vue'], resolve),
          meta: { title: '在售产品', crumb: '产品管理 / 在售产品' }
        },
        {
          // 产品净值
          path: '/productListNetValue',
          name: 'productListNetValue',
          component: resolve => require(['../components/page/product/productListNetValue.vue'], resolve),
          meta: { title: '产品净值', crumb: '产品管理 / 产品净值' }
        },
        {
          // 产品报告
          path: '/productNoticeList',
          name: 'productNoticeList',
          component: resolve => require(['../components/page/product/ProductNoticeList.vue'], resolve),
          meta: { title: '产品报告管理', crumb: '产品管理 / 产品报告管理' }
        },
        {
          // 组织结构
          path: '/employeeList',
          name: 'employeeList',
          component: resolve => require(['../components/page/sysManager/EmployeeList.tsx'], resolve),
          meta: { title: '组织结构', crumb: '系统管理 / 组织结构' }
        },
        {
          // 角色管理
          path: '/roleList',
          name: 'roleList',
          component: resolve => require(['../components/page/sysManager/roleListPage.tsx'], resolve),
          meta: { title: '角色管理', crumb: '系统管理 / 角色管理' }
        },
        {
          // 权限管理
          path: '/powerList',
          name: 'powerList',
          component: resolve => require(['../components/page/sysManager/powerList.tsx'], resolve),
          meta: { title: '角色授权', crumb: '系统管理 / 角色授权' }
        },
        {
          // 权限编辑
          path: '/powerEdit',
          name: 'powerEdit',
          component: resolve => require(['../components/page/sysManager/powerEdit.tsx'], resolve),
          meta: { title: '权限编辑', crumb: '系统管理 / 权限编辑' }
        },
        {
          // 数据字典
          path: '/argList',
          name: 'argList',
          component: resolve => require(['../components/page/sysManager/argList.tsx'], resolve),
          meta: { title: '数据字典', crumb: '系统管理 / 数据字典' }
        },
        {
          // 工作日历
          path: '/workday',
          name: 'workday',
          component: resolve => require(['../components/page/sysManager/workdayCalendar.tsx'], resolve),
          meta: { title: '工作日历', crumb: '系统管理 / 工作日历' }
        },
        {
          // 报单管理--启动报单
          path: '/startDeclarationList',
          name: 'startDeclarationList',
          component: resolve => require(['page/declaration/startDeclaration/startDeclarationList.vue'], resolve),
          meta: { title: '启动报单', crumb: '报单管理 / 启动报单' }
        },
        {
          // 报单管理 -- 启动报单 -- 启动认申购报单
          path: '/startDeclarationList/startDeclarationForm',
          name: 'startDeclarationForm',
          component: resolve => require(['page/declaration/startDeclaration/startDeclarationForm.vue'], resolve),
          meta: { title: '启动认申购报单', crumb: '报单管理 / 启动报单 / 启动认申购报单' }
        },
        {
          // 报单管理 -- 编辑启动报单
          path: '/startDeclarationList/editDeclarationForm',
          name: 'editDeclarationForm',
          component: resolve => require(['page/declaration/startDeclaration/startDeclarationForm.vue'], resolve),
          meta: { title: '编辑启动报单', crumb: '报单管理 / 启动历史 / 编辑启动报单' }
        },
        {
          // 报单管理--启动报单 -- 启动历史
          path: '/startDeclarationList/startHistoryList',
          name: 'startHistoryList',
          component: resolve => require(['page/declaration/startDeclaration/startHistoryList.vue'], resolve),
          meta: { title: '启动历史', crumb: '报单管理 / 启动报单 / 启动历史' }
        },
        {
          // 报单管理--启动报单 -- 报单历史
          path: '/startDeclarationList/declarationHistoryList',
          name: 'declarationHistoryList',
          component: resolve => require(['page/declaration/startDeclaration/declarationHistoryList.vue'], resolve),
          meta: { title: '报单历史', crumb: '报单管理 / 启动报单 / 报单历史' }
        },
        {
          // 报单管理-- 产品报单
          path: '/productDeclarationList',
          name: 'productDeclarationList',
          component: resolve => require(['page/declaration/productDeclaration/productDeclarationList.vue'], resolve),
          meta: { title: '产品报单', crumb: '报单管理 / 产品报单' }
        },
        {
          // 报单管理-- 产品报单 -- 新建报单
          path: '/productDeclarationList/createDeclaration',
          name: 'createDeclaration',
          component: resolve => require(['page/declaration/declarations/createDeclaration.vue'], resolve),
          meta: { title: '新建报单', crumb: '报单管理 / 产品报单 / 新建报单' },
          children: [
            {
              // 报单管理-- 产品报单 -- 选择客户
              path: '/productDeclarationList/createDeclaration/declarationChooseCustomer',
              name: 'declarationChooseCustomer',
              component: resolve => require(['page/declaration/declarations/declarationChooseCustomer.vue'], resolve),
              meta: { title: '新建报单', crumb: '报单管理 / 产品报单 / 新建报单' }
            }
          ]
        },
        {
          // 报单管理-- 报单审核
          path: '/declarationAuditList',
          name: 'declarationAuditList',
          component: resolve => require(['page/declaration/declarationAudit/declarationAuditList.vue'], resolve),
          meta: { title: '报单审核', crumb: '报单管理 / 报单审核' }
        },
        {
          // 报单管理-- 我的报单
          path: '/myDeclarationList',
          name: 'myDeclarationList',
          component: resolve => require(['page/declaration/startDeclaration/declarationHistoryList.vue'], resolve),
          meta: { title: '我的报单', crumb: '报单管理 / 我的报单' }
        },
        {
          // 报单管理-- 全部报单
          path: '/allDeclarationList',
          name: 'allDeclarationList',
          component: resolve => require(['page/declaration/declarations/allDeclarationList.vue'], resolve),
          meta: { title: '全部报单', crumb: '报单管理 / 全部报单' }
        },
        {
          // 报单管理--全部赎回
          path: '/allRedeemApplyList',
          name: 'allRedeemApplyList',
          component: resolve => require(['page/declaration/redeem/allRedeemApplyList.vue'], resolve),
          meta: { title: '全部赎回', crumb: '报单管理 / 全部赎回' }
        },
        {
          // 报单管理--赎回详情
          path: '/allRedeemApplyList/redeemInfo',
          name: 'redeemInfo',
          component: resolve => require(['page/declaration/redeem/redeemInfo.vue'], resolve),
          meta: { title: '赎回详情', crumb: '报单管理 / 赎回详情' }
        },
        {
          // 报单管理--赎回申请审核列表
          path: '/redeemApplyList',
          name: 'redeemApplyList',
          component: resolve => require(['page/declaration/redeem/redeemApplyList.vue'], resolve),
          meta: { title: '赎回申请审核', crumb: '报单管理 / 全部赎回 / 赎回申请审核' }
        },
        {
          // 报单管理--赎回申请审核详情页
          path: '/redeemApplyList/redeemAuditDetail',
          name: 'redeemAuditDetail',
          component: resolve => require(['page/declaration/redeem/redeemAuditDetail.vue'], resolve),
          meta: { title: '报单审核详情', crumb: '报单管理 / 报单审核详情' }
        },
        {
          // 报单管理--赎回申请审核
          path: '/redeemApplyList/redeemAudit',
          name: 'redeemAudit',
          component: resolve => require(['page/declaration/redeem/redeemAudit.vue'], resolve),
          meta: { title: '赎回申请审核详情页', crumb: '报单管理 / 赎回申请审核详情' }
        },
        {
          // 报单管理--详情页
          path: '/declaration/declarationInfo',
          name: 'declarationInfo',
          component: resolve => require(['page/declaration/declarationInfo.vue'], resolve),
          meta: { title: '报单详情', crumb: '报单管理 / 报单详情' }
        },
        {
          // 报单管理--编辑份额
          path: '/declaration/editShare',
          name: 'editShare',
          component: resolve => require(['page/declaration/declarations/editShare.vue'], resolve),
          meta: { title: '编辑份额', crumb: '报单管理 / 全部报单 / 编辑份额' }
        },
        {
          // 报单管理--补录份额
          path: '/declaration/addShare',
          name: 'addShare',
          component: resolve => require(['page/declaration/declarations/editShare.vue'], resolve),
          meta: { title: '补录份额', crumb: '报单管理 / 全部报单 / 补录份额' }
        },
        {
          // 全部赎回--编辑份额
          path: '/redeem/editShare',
          name: 'editRedeemShare',
          component: resolve => require(['page/declaration/declarations/editShare.vue'], resolve),
          meta: { title: '编辑份额', crumb: '报单管理 / 全部赎回 / 编辑份额' }
        },
        {
          // 全部赎回--补录份额
          path: '/redeem/addShare',
          name: 'addRedeemShare',
          component: resolve => require(['page/declaration/declarations/editShare.vue'], resolve),
          meta: { title: '补录份额', crumb: '报单管理 / 全部赎回 / 补录份额' }
        },
        {
          // 业绩佣金列表
          path: '/commissionQueryList',
          name: 'commissionQueryList',
          component: resolve => require(['../components/page/commission/commissionQueryList.vue'], resolve),
          meta: { title: '业绩佣金列表', crumb: '业绩佣金管理 / 业绩佣金列表' }
        },
        {
          // 运营活动管理
          path: '/activity',
          name: 'gimsActivity',
          component: resolve => require(['../components/page/activity/activity.tsx'], resolve),
          meta: { title: '活动列表', crumb: '活动列表 / 全部活动' }
        },
        {
          // 运营活动管理
          path: '/activityEdit',
          name: 'gimsActivityEdit',
          component: resolve => require(['../components/page/activity/activityEdit.tsx'], resolve),
          meta: { title: '编辑活动', crumb: '活动列表 / 编辑活动' }
        },
        {
          // 运营海报管理
          path: '/poster',
          name: 'posterList',
          component: resolve => require(['../components/page/activity/posterList.tsx'], resolve),
          meta: { title: '海报列表', crumb: '海报列表 / 全部海报' }
        },
        {
          // 运营文章管理
          path: '/article',
          name: 'articleList',
          component: resolve => require(['../components/page/activity/articleList.tsx'], resolve),
          meta: { title: '文章列表', crumb: '文章列表 / 全部文章' }
        },
        {
          // 运营文章管理-编辑
          path: '/articleEdit',
          name: 'gimsArticleEdit',
          component: resolve => require(['../components/page/activity/articleEdit.vue'], resolve),
          meta: { title: '编辑文章', crumb: '文章列表 / 编辑文章' }
        },
        {
          // 策略推荐--策略推荐
          path: '/strategyList',
          name: 'strategyList',
          component: resolve => require(['../components/page/strategyRecommend/strategyList.vue'], resolve),
          meta: { title: '策略推荐', crumb: '策略推荐 / 策略推荐列表' }
        },
        {
          // 策略推荐--理财师策略推荐
          path: '/strategySalesList',
          name: 'strategySalesList',
          component: resolve => require(['../components/page/strategyRecommend/strategySalesList.vue'], resolve),
          meta: { title: '策略推荐', crumb: '策略推荐 / 策略推荐列表' }
        },
        {
          // 用户申请列表
          path: '/userApplyList',
          name: 'userApplyList',
          component: resolve => require(['../components/page/strategyRecommend/userApplyList.vue'], resolve),
          meta: { title: '用户申请列表', crumb: '策略推荐 / 用户申请列表' }
        },
        {
          // 策略推荐--策略推荐
          path: '/strategyForm',
          name: 'strategyForm',
          component: resolve => require(['../components/page/strategyRecommend/strategyForm.vue'], resolve),
          meta: { title: '策略推荐', crumb: '策略推荐 / 新增策略推荐' }
        },
        {
          // 策略推荐--编辑
          path: '/editStrategyForm',
          name: 'editStrategyForm',
          component: resolve => require(['../components/page/strategyRecommend/strategyForm.vue'], resolve),
          meta: { title: '编辑策略推荐', crumb: '策略推荐 / 新增策略推荐' }
        },
        {
          // 策略推荐--查看
          path: '/checkStrategyForm',
          name: 'checkStrategyForm',
          component: resolve => require(['../components/page/strategyRecommend/strategyForm.vue'], resolve),
          meta: { title: '查看策略推荐', crumb: '策略推荐 / 新增策略推荐' }
        },
        {
          // 策略推荐--客户分组
          path: '/userGroupList',
          name: 'userGroupList',
          component: resolve => require(['../components/page/strategyRecommend/userGroupList'], resolve),
          meta: { title: '客户分组列表', crumb: '客户分组 / 客户分组列表' }
        },
        {
          // 策略推荐--客户分组--编辑、查看
          path: '/editUserGroupInfo',
          name: 'editUserGroupInfo',
          component: resolve => require(['../components/page/strategyRecommend/editUserGroupInfo'], resolve),
          meta: { title: '客户分组', crumb: '客户分组 / 编辑客户分组' }
        },
        {
          path: '/404',
          name: '404',
          component: resolve => require(['page/404.vue'], resolve),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: resolve => require(['page/403.vue'], resolve),
          meta: { title: '403' }
        },
        {
          path: '/donate',
          component: resolve => require(['page/Donate.vue'], resolve),
          meta: { title: '支持作者' }
        },
        {
          // 冷静期回访
          path: '/tradeVisitList',
          name: 'tradeVisitList',
          component: resolve => require(['../components/page/customerService/tradeVisitList.vue'], resolve),
          meta: { title: '冷静期回访', crumb: '客服管理 / 冷静期回访' }
        },
        {
          // 冷静期查看页面
          path: '/tradeVisitDetail',
          name: 'tradeVisitDetail',
          component: resolve => require(['../components/page/customerService/tradeVisitDetail.vue'], resolve),
          meta: { title: '冷静期回访查看', crumb: '客服管理 / 冷静期回访查看' }
        },
        {
          // 修改密码页面
          path: '/changePassword',
          name: 'changePassword',
          component: resolve => require(['../components/page/changePassword.vue'], resolve),
          meta: { title: '修改密码', crumb: '修改密码' }
        },
        {
          // 未读消息
          path: '/unreadMessage',
          name: 'unreadMessage',
          component: resolve => require(['../components/page/unreadMessage.vue'], resolve),
          meta: { title: '未读消息', crumb: '未读消息' }
        },
        {
          // 理财师客户管理客户拜访页面
          path: '/myConsumerVisit',
          name: 'myConsumerVisit',
          component: resolve => require(['../components/page/myConsumer/myConsumerVisitList.vue'], resolve),
          meta: { title: '客户拜访', crumb: '理财师客户管理 / 客户拜访' }
        },
        {
          // 理财师客户管理--我的客户列表
          path: '/myConsumerList',
          name: 'myConsumerList',
          component: resolve => require(['../components/page/myConsumer/myConsumerList.vue'], resolve),
          meta: { title: '我的客户', crumb: '理财师客户管理 / 我的客户' }
        },
        {
          // 理财师客户管理--新增、编辑、详情
          path: '/myConsumerList/myConsumerInfo',
          name: 'myConsumerInfo',
          component: resolve => require(['../components/page/myConsumer/myConsumerInfo.vue'], resolve),
          meta: { title: '理财师客户管理', crumb: '理财师客户管理 / 我的客户 / 新增客户' }
        },
        {
          // 理财师客户管理--我的管理资产
          path: '/manageAssetsList',
          name: 'manageAssetsList',
          component: resolve => require(['../components/page/myConsumer/manageAssetsList.vue'], resolve),
          meta: { title: '我的管理资产', crumb: '理财师客户管理 / 我的管理资产' }
        },
        {
          // 总分享统计列表
          path: '/shareList',
          name: 'shareList',
          component: resolve => require(['../components/page/activity/shareList.tsx'], resolve),
          meta: { title: '分享数据管理', crumb: '内容管理 / 分享数据管理' }
        },
        {
          // 分享内容统计明细列表（运营角度）
          path: '/shareDetailList',
          name: 'shareDetailList',
          component: resolve => require(['../components/page/activity/shareDetailList.tsx'], resolve),
          meta: { title: '分享内容统计明细列表', crumb: '内容管理 / 分享内容统计明细列表' }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['page/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
