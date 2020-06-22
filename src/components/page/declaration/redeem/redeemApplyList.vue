<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  import { Powers } from '@/utils/powers';
  export default {
    name: 'RedemApplyList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        needRefresh: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.declaration.redeemApplyListState
      }),
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      }
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_REDEEM_APPLY_VIEWER_STATE', this);
      this.fetchData();
    },
    activated() {
      if (this.needRefresh) {
        this.fetchData();
        this.needRefresh = false;
      }
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        const extraParam = { type: 2 };
        return { ...state.filterModel, ...state.paginationState.getAjaxParam(), ...extraParam };
      },
      async fetchData() {
        this.isLoading = true;
        const param = this.getLoadParam();
        if (Array.isArray(param.statusStrs)) {
          param.statusStrs = param.statusStrs.join(',');
        }
        await this.$store.dispatch('declaration/getRedeemApplyList', param);
        this.isLoading = false;
      },
      // 审核按钮方法
      async redeemAudit(index, row) {
        // 权限认证
        await this.$power.checkPower(Powers.redeemApplyAudit);
        this.needRefresh = true;
        this.$router.push({
          name: 'redeemAudit',
          query: {
            tradeId: row.tradeId,
            pageSign: 1
          }
        });
      },
      // 导出数据方法
      async doExport(row) {
        // 权限认证
        await this.$power.checkPower(Powers.redeemApplyExport);
        const url = '/file/downloadRedeemFile';
        const param = '?tradeId=';
        window.open(`${this.$fetch.getBasePath()}${url}${param}${row.tradeId}`);
      },
      // 加工返回dynamic-filter组件el-select里面用的配置数组
      statusArgsWithElOptionsTag(groupKey) {
        // map方法不会执行空数组
        const enumArgs = this.enumArgs[groupKey] || {};
        const options = Object.keys(enumArgs).map(key => {
          if (/^[^\u4e00-\u9fa5]+$/.test(key)) {
            return {
              label: enumArgs[key],
              value: /^\d+$/.test(key) ? parseInt(key) : key
            };
          }
        });
        return options.filter(nodes => nodes);
      }
    }
  };
</script>
<style lang="scss">
  .able {
    color: red;
    cursor: pointer;
  }
  .disable {
    color: #cccccc;
    cursor: not-allowed;
  }
</style>
