<template>
  <div
    v-if="showTags"
    class="tags"
  >
    <ul>
      <li
        v-for="(item,index) in tagsList"
        :key="index"
        class="tags-li"
        :class="{'active': isActive(item.routeName)}"
      >
        <router-link
          :to="item.fullPath"
          class="tags-li-title"
        >
          {{ item.title }}
        </router-link>
        <span
          class="tags-li-icon"
          @click="closeTags(index)"
        ><i class="el-icon-close" /></span>
      </li>
    </ul>
    <div class="tags-close-box" style="height: 52px; padding-top: 10px; display: none">
      <el-dropdown @command="handleTags">
        <el-button
          size=""
          type="primary"
        >
          标签选项<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu
          slot="dropdown"
          size="small"
        >
          <el-dropdown-item command="other">
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="all">
            关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tagsList: []
      };
    },
    computed: {
      showTags() {
        return this.tagsList.length > 0;
      }
    },
    watch: {
      $route(newValue) {
        this.setTags(newValue);
      }
    },
    created() {
      setTimeout(() => {
        this.setTags(this.$route);
      }, 300);
      // 监听关闭当前页面的标签页
      // todo 路由参数有问题，最后一个tab的query会丢
      this.$bus.$on('close_current_tags', () => {
        const tabIndex = this.tagsList.findIndex((tagItem) =>
          tagItem.fullPath === this.$route.fullPath
        );
        this.closeTags(tabIndex);
      });
    },
    methods: {
      isActive(path) {
        return path === this.$route.name;
      },
      // 关闭单个标签
      closeTags(index) {
        const delItem = this.tagsList.splice(index, 1)[0];
        this.runCloseTabCallback(delItem.closeTabCallback);
        setTimeout(() => {
          // closeTabFn里面有属性是和路由绑定的，需要等待fn执行完毕后再关闭标签
          // 否则有可能关闭标签的时候closeTabFn执行对应的路由是后面一个被激活的路由
          const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
          if (item) {
            // 确认被删除路由的路由与当前路由一致，并推送新路由
            delItem.path === this.$route.path && this.$router.push(item.fullPath);
          } else {
            this.$router.push('/');
          }
        });
      },
      runCloseTabCallback(closeTabCallback) {
        if (closeTabCallback instanceof Function) {
          closeTabCallback();
        }
      },
      // 关闭全部标签
      closeAll() {
        this.tagsList = [];
        this.$router.push('/');
      },
      // 关闭其他标签
      closeOther() {
        this.tagsList = this.tagsList.filter(item => {
          return item.fullPath === this.$route.fullPath;
        });
      },
      // 设置标签
      setTags(route) {
        let isExist = false;
        let existsIndex;
        this.tagsList.forEach((item, index) => {
          if (item.path === route.path) {
            existsIndex = index;
            isExist = true;
          }
        });
        if (!isExist) {
          if (this.tagsList.length >= 8) {
            this.tagsList.shift();
          }
          const routeObj = {
            title: route.meta.title,
            path: route.path,
            fullPath: route.fullPath,
            name: route.matched[1].components.default.name,
            routeName: route.name,
            query: route.query
          };
          if (route.matched[1].components.default.methods) {
            let onCloseTabFn = route.matched[1].components.default.methods.onCloseTab;
            setTimeout(() => {
              // 等路由mount以后绑定当前tab vm实例到closeTabCallback
              const vm = route.matched[1].instances.default;
              if (onCloseTabFn instanceof Function) {
                onCloseTabFn = onCloseTabFn.bind(vm);
              }
              routeObj.closeTabCallback = onCloseTabFn;
            }, 100);
          } else {
            routeObj.closeTabCallback = {};
          }
          this.tagsList.push(routeObj);
          this.$bus.$emit('tags', this.tagsList);
        } else {
          // 替换存在的路由中的fullPath
          this.tagsList[existsIndex].fullPath = route.fullPath;
          this.$bus.$emit('tags', this.tagsList);
        }
      },
      handleTags(command) {
        command === 'other' ? this.closeOther() : this.closeAll();
      }
    }
  };

</script>

<style>
    .tags {
        position: relative;
        height: 52px;
        overflow: hidden;
        background: #F3F3F3;
        padding-right: 120px;
        box-shadow: 0 5px 10px #ddd;
        padding-left: 40px;
      border-bottom: 3px solid #EB5954;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        margin: 16px 5px 2px 3px;
        border-radius: 4px 4px 0 0;
        font-size: 13px;
        overflow: hidden;
        cursor: pointer;
        background: #fff;
        padding-right: 5px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }

    .tags-li.active {
        color: #fff;
    }
    .tags-li .tags-li-icon {
      padding-top: 8px;
      display: inline-block;
    }
    .tags-li a {
      padding: 8px 0px 8px 12px;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: #fff;
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }

</style>
