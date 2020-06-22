<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#2E2C46"
      text-color="#bfcbd9"
      active-text-color="#EB5954"
      unique-opened
      router
    >
      <template v-for="item in powerMenuItems">
        <template v-if="item.subs">
          <el-submenu
            :key="item.index"
            :index="item.index"
          >
            <template slot="title">
              <i :class="item.icon" /><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :key="subItem.index"
                :index="subItem.index"
              >
                <template slot="title">
                  {{ subItem.title }}
                </template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :key="subItem.index"
                :index="subItem.index"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item
            :key="item.index"
            :index="item.index"
          >
            <i :class="item.icon" /><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        collapse: false,
        items: [
          {
            icon: 'el-icon-lee-home',
            index: '/dashboard',
            title: '系统首页',
            power: 'gzt'
          },
          {
            icon: 'el-icon-s-data',
            index: '/CEReportData',
            title: '数据看板',
            power: 'sjkb'
          },
          {
            icon: 'el-icon-lee-servicefill',
            index: 'leads',
            title: '预约管理',
            power: 'yygls',
            subs: [
              {
                index: '/leadsQuery',
                power: 'yygls.leadslb',
                title: 'leads列表'
              },
              {
                index: '/leadsImport',
                power: 'yygls.drleads',
                title: 'leads导入'
              }
            ]
          },
          {
            icon: 'el-icon-lee-addressbook',
            index: 'consumer',
            power: 'khgl',
            title: '客户管理',
            subs: [
              {
                index: '/consumerList',
                power: 'khgl.khlb',
                title: '客户列表'
              },
              {
                index: '/consumerVisit',
                power: 'khgl.khgjqk',
                title: '客户跟进情况'
              },
              {
                index: '/consumerNoAssign',
                power: 'khgl.dfpkhlb',
                title: '待分配客户列表'
              },
              {
                index: '/pfundAssetProofList',
                power: 'khgl.zczmlb',
                title: '资产证明记录'
              },
              {
                index: '/consumerHoldingList',
                power: 'khgl.khcclb',
                title: '客户持仓列表'
              },
              {
                index: '/customerSalesCompareList',
                power: 'khgl.khgsjy',
                title: '客户归属校验'
              }
            ]
          },
          {
            icon: 'el-icon-lee-people',
            index: 'myConsumer',
            title: '理财师客户管理',
            power: 'lcskhgl',
            subs: [
              {
                index: '/myConsumerList',
                title: '我的客户',
                power: 'lcskhgl.wdkh'
              },
              {
                index: '/myConsumerVisit',
                title: '客户拜访',
                power: 'lcskhgl.khbf'
              },
              {
                index: '/manageAssetsList',
                power: 'lcskhgl.wdglzc',
                title: '我的管理资产'
              }
            ]
          },
          {
            icon: 'el-icon-lee-punch',
            index: 'product',
            title: '产品管理',
            power: 'cpgl',
            subs: [
              {
                index: '/durationList',
                title: '产品存续管理',
                power: 'cpgl.cpcxgl'
              },
              {
                index: '/productList',
                title: '产品库',
                power: 'cpgl.cpk'
              },
              {
                index: '/productSellingList',
                power: 'cpgl.zscp',
                title: '在售产品'
              },
              {
                power: 'cpgl.cpjzgl',
                index: '/productListNetValue',
                title: '产品净值管理'
              },
              {
                power: 'cpgl.cpgggl',
                index: '/productNoticeList',
                title: '产品报告管理'
              }
            ]
          },
          {
            icon: 'el-icon-first-aid-kit',
            index: 'declaration',
            title: '报单管理',
            power: 'yygl',
            subs: [
              {
                index: '/startDeclarationList',
                power: 'yygl.qdbd',
                title: '启动报单'
              },
              {
                index: '/productDeclarationList',
                power: 'yygl.cpbd',
                title: '产品报单'
              },
              {
                index: '/declarationAuditList',
                power: 'yygl.bdsh',
                title: '报单审核'
              },
              {
                index: '/myDeclarationList',
                power: 'yygl.wdbd',
                title: '我的报单'
              },
              {
                index: '/allDeclarationList',
                power: 'yygl.qbbd',
                title: '全部报单'
              },
              {
                index: '/redeemApplyList',
                power: 'jygl.shsqsh',
                title: '赎回申请审核'
              },
              {
                index: '/allRedeemApplyList',
                power: 'jygl.qbsh',
                title: '全部赎回'
              }
            ]
          },
          {
            icon: 'el-icon-lee-edit',
            index: '',
            title: '交易管理',
            power: 'jygl',
            subs: [
              {
                index: '/orderQuery',
                power: 'jygl.rsgdd',
                title: '认申购订单'
              },
              {
                index: '/orderQueryRedeem',
                power: 'jygl.shdd',
                title: '赎回订单'
              },
              {
                index: '/overseaAndInsuranceOrderList',
                power: 'jygl.hwbxdd',
                title: '海外/保险订单'
              }
            ]
          },
          {
            icon: 'el-icon-lee-edit',
            index: 'commission',
            title: '业绩佣金管理',
            power: 'yjyjgl',
            subs: [
              {
                index: '/commissionQueryList',
                power: 'yjyjgl.yjyjgllb',
                title: '业绩佣金列表'
              }
            ]
          },
          {
            icon: 'el-icon-phone',
            index: 'customerService',
            title: '客服管理',
            power: 'kfgl',
            subs: [
              {
                power: 'kfgl.ljqhfxx',
                index: '/tradeVisitList',
                title: '冷静期回访'
              }
            ]
          },
          {
            icon: 'el-icon-document',
            index: 'activityManageL',
            title: '内容管理',
            power: 'nrgl',
            subs: [
              {
                index: '/activity',
                power: 'nrgl.hdgl',
                title: '活动管理'
              },
              {
                index: '/poster',
                power: 'nrgl.hbgl',
                title: '海报管理'
              },
              {
                index: '/article',
                power: 'nrgl.wzgl',
                title: '文章管理'
              },
              {
                index: '/shareList',
                power: 'nrgl.fxsjgl',
                title: '分享数据管理'
              }
            ]
          },
          {
            icon: 'el-icon-document',
            index: 'strategyRecommend',
            title: '策略推荐',
            power: 'cltj',
            subs: [
              {
                index: '/strategyList',
                power: 'cltj.yycltj',
                title: '运营策略推荐'
              },
              {
                index: '/strategySalesList',
                power: 'cltj.lcscltj',
                title: '理财师策略推荐'
              },
              {
                index: '/userApplyList',
                power: 'cltj.yhsqlb',
                title: '用户申请列表'
              },
              {
                index: '/userGroupList',
                power: 'cltj.khfz',
                title: '客户分组'
              }
            ]
          },
          {
            icon: 'el-icon-setting',
            index: 'sysManage',
            title: '系统管理',
            power: 'xtgl',
            subs: [
              {
                index: '/employeeList',
                power: 'xtgl.zzjg',
                title: '组织结构'
              },
              {
                index: '/roleList',
                power: 'xtgl.jsgl',
                title: '角色管理'
              },
              {
                index: '/powerList',
                power: 'xtgl.jssq',
                title: '角色授权'
              },
              {
                index: '/powerEdit',
                power: 'xtgl.qxbj',
                title: '权限编辑'
              },
              {
                index: '/argList',
                title: '数据字典',
                power: 'xtgl.sjzd'
              },
              {
                index: '/workday',
                power: 'xtgl.sjzd',
                title: '工作日历'
              }
            ]
          }
        ],
        powerMenuItems: []
      };
    },
    computed: {
      onRoutes() {
        return this.$route.path;
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      this.$bus.$on('collapse', msg => {
        this.collapse = msg;
      });
    },
    methods: {
      buildMenuItemsWithPower(rtMenuItems) {
        rtMenuItems = rtMenuItems.filter(menuItem => {
          if (!menuItem.power) return menuItem;
          if (menuItem.subs) {
            menuItem.subs = this.buildMenuItemsWithPower(menuItem.subs);
          }
          return this.$power.hasPower(menuItem.power);
        });
        return rtMenuItems;
      },
      buildMenu() {
        this.powerMenuItems = this.buildMenuItemsWithPower(this.$utils.jsonClone(this.items));
      },
      getMenuPowerKey(routePath, items) {
        // 获取菜单路由对应的powerKey
        for (const item of items) {
          if (item.index === routePath) return item.power;
          if (item.subs && item.subs instanceof Array) {
            const rs = this.getMenuPowerKey(routePath, item.subs);
            if (rs) return rs;
          }
        }
        return '';
      }
    }
  };
</script>

<style scoped>
  .sidebar{
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom:0;
    overflow-y: scroll;
  }
  .sidebar::-webkit-scrollbar{
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse){
    width: 180px;
  }
  .sidebar > ul {
    height:100%;
  }
</style>
<style>
  /*第一个菜单对齐*/
  div.sidebar > ul > li.el-menu-item > i {
    margin-left: -5px;
  }
</style>

