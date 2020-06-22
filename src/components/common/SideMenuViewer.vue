<template>
  <div style="position: relative">
    <el-row style="display: flex; height: 100%;">
      <el-col :span="4" style="overflow: auto">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-side"
          background-color="#fff"
          active-text-color="#fff"
        >
          <el-menu-item v-for="(item, index) in menu" :key="`${index}`" :index="`${index}`" @click="handleMenuItemClick(index)">
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="scroller">
          <!--锚点位置和里面text根据menu-anchor-info来确定-->
          <slot></slot>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  /*
  element ui菜单侧栏布局+右侧可滚动布局
  点击菜单项目右侧能滚动到制定位置
  滚动的时候左侧菜单可以实时高亮当前项目
   */
  export default {
    name: 'SideMenuViewer',
    props: {
      titleClass: {
        type: String,
        default: 'menu-anchor-info'
      }
    },
    data() {
      return {
        editorScrollPos: 0,
        menu: [],
        defaultActive: '0',
        scrollerEle: {}
      };
    },
    mounted() {
      this.scrollerEle = document.querySelectorAll('.scroller')[0];
      this.scrollerEle.addEventListener('scroll', (e) => {
        this.editorScrollPos = e.target.scrollTop;
        this.menu.forEach((menuItem, index) => {
          if (this.editorScrollPos >= menuItem.offset) {
            this.defaultActive = '' + index;
          }
        });
      });
      // 每个元素高度
      this.$parent.$parent.$on('onDataLoad', () => {
        this.initMenuPos();
      });
    },
    methods: {
      resetDefaultActive() {
        this.defaultActive = '0';
      },
      handleMenuItemClick(index) {
        this.scrollerEle.scrollTop = this.menu[index].offset + 4;
      },
      initMenuPos() {
        this.menu = [];
        for (const titleElement of document.querySelectorAll(`.${this.titleClass}`)) {
          this.menu.push({
            title: titleElement.innerText,
            offset: titleElement.offsetTop
          });
        }
      }
    }
  };
</script>

<style lang="scss">
  .el-menu-side {
    border-right: 0 !important;
  .el-menu-item.is-active {
    background-color: #EB5954 !important;
  }
  }
  .el-card__body {
    height: 100%;
  }
</style>
<style lang="scss" scoped>
  .scroller {
    box-sizing: border-box;
    padding: 20px;
    max-height: 100%;
    overflow: scroll;
    overflow-x: hidden;
  }
</style>
