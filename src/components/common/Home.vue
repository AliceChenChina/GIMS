<template>
  <div class="wrapper">
    <v-head ref="v_header" />
    <v-sidebar ref="sidebar" />
    <!--所有枚举参数加载完成后再读取tab路由-->
    <div
      v-if="isQueryArgAllLoad"
      class="content-box"
      :class="{'content-collapse':collapse}"
    >
      <v-tags />
      <div ref="content" class="content">
        <transition
          name="move"
          mode="out-in"
        >
          <div ref="tab_viewer" class="tab-viewer">
            <!--所有页面组件要有name否则无法keepAlive，关闭标签可以调用关闭标签回调（清理state等操作）-->
            <keep-alive :include="keepAliveList">
              <router-view />
            </keep-alive>
          </div>
        </transition>
        <v-bottom />
      </div>
      <x-scroller ref="x_scroller" />
    </div>
  </div>
</template>

<script>
  import vHead from './Header.vue';
  import vSidebar from './Sidebar.vue';
  import vTags from './Tags.vue';
  import vBottom from './Bottom.vue';
  import Vue from 'vue';
  import breadCrumb from 'common/breadCrumb.vue';
  import PowerCheck from '@/utils/PowerCheck';
  import XScroller from 'common/XScroller';

  export default {
    components: {
      vHead, vSidebar, vTags, vBottom, 'x-scroller': XScroller
    },
    data() {
      return {
        isQueryArgAllLoad: false,
        keepAliveList: [],
        collapse: false
      };
    },
    watch: {
      keepAliveList: {
        deep: true,
        handler() {
        }
      }
    },
    created() {
      this.$bus.$on('collapse', msg => {
        this.collapse = msg;
      });

      // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
      // tab关闭的时候清空store里面state相关内容
      this.$bus.$on('tags', msg => {
        const arr = [];
        for (let i = 0, len = msg.length; i < len; i++) {
          msg[i].name && arr.push(msg[i].name);
        }
        this.keepAliveList = arr;
      });
      // 第一次加载加入当前页面到keep alive
    },
    async mounted() {
      const searchParams = new window.URLSearchParams(window.location.search);
      const tokenFromUrl = searchParams.get('token');
      if (tokenFromUrl) {
        window.localStorage.setItem('token', tokenFromUrl);
        window.history.pushState({}, '', '/#/');
      }
      await Promise.all([
        this.$store.dispatch('queryArgAll'),
        this.$store.dispatch('getUserInfo'),
        this.$store.dispatch('getPowerList')
      ]);
      this.$refs.v_header.getRemind();
      setInterval(() => {
        // 循环获取通知
        if (this.$refs.v_header) {
          this.$refs.v_header.getRemind();
        }
      }, 60000);
      const powerTreeState = this.$store.state.powerListState;
      const userInfoState = this.$store.state.userInfo;

      Vue.prototype.$power = PowerCheck.getPowerCheck(userInfoState, powerTreeState, this.$message.error);
      this.$refs.sidebar.buildMenu();
      const powerMenuItems = this.$refs.sidebar.items;
      const powerKey = this.$refs.sidebar.getMenuPowerKey(this.$route.path, powerMenuItems);
      // 检查用户是否有权限访问当前页面
      try {
        if (powerKey) {
          await this.$power.checkPower(powerKey);
        }
        this.isQueryArgAllLoad = true;
      } catch (e) {
        this.$message.error('没有权限访问这个页面');
      }
      setTimeout(() => {
        Vue.prototype.$xScroller = this.$refs.x_scroller;
        this.$refs.x_scroller.contentWrapper = this.$refs.content;
      });
      // 无权限抛出异常
      this.$router.beforeEach(async(to, from, next) => {
        // 切换路由的时候默认回到tab内容回到顶部
        if (document.querySelectorAll('.content')[0]) {
          document.querySelectorAll('.content')[0].scrollTop = 0;
        }
        if (!this.$refs.sidebar) {
          next();
          return;
        }
        const powerMenuItems = this.$refs.sidebar.items;
        const powerKey = this.$refs.sidebar.getMenuPowerKey(to.path, powerMenuItems);
        // todo 保存tab滚动的位置在内存里
        if (!powerKey) {
          // 没找到权限key不检测权限
          if (!this.isQueryArgAllLoad) {
            this.isQueryArgAllLoad = true;
          }
          next();
        } else {
          // 检查用户是否有权限访问页面
          await this.$power.checkPower(powerKey);
          // 无权限抛出异常
          if (!this.isQueryArgAllLoad) {
            this.isQueryArgAllLoad = true;
          }
          next();
        }
      });
    }
  };
</script>
<style scoped>
  .content {
    overflow-y: auto;
  }
</style>
