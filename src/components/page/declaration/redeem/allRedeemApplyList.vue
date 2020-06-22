<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
    <eidtShare ref="edit_share" @onUpdate="onUpdate" />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  import eidtShare from 'page/declaration/declarations/editShare';
  export default {
    name: 'AllRedeemApplyList',
    components: {
      listViewer,
      eidtShare
    },
    data() {
      return {
        isLoading: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.declaration.allRedeemApplyListState
      }),
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      }
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_ALL_REDEEM_LIST_VIEWER', this);
      this.fetchData();
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        const extraParam = { type: 4 };
        return { ...state.filterModel, ...state.paginationState.getAjaxParam(), ...extraParam };
      },
      async fetchData() {
        this.isLoading = true;
        const param = this.getLoadParam();
        if (Array.isArray(param.statusStrs)) {
          param.statusStrs = param.statusStrs.join(',');
        }
        await this.$store.dispatch('declaration/allRedeemApplyList', param);
        this.isLoading = false;
      },
      // 审核按钮方法
      redeemAudit(index, row) {
        this.$router.push({
          name: 'redeemAuditDetail',
          params: {
            tradeId: row.tradeId,
            pageSign: 1
          }
        });
      },
      // 退单
      async chargeBack(row) {
        this.$alert({
          msg: '确认退单吗？',
          onConfirm: async() => {
            this.isLoading = true;
            try {
              await this.$fetch.setParam('/tradeConfirm/suspend', { tradeId: row.tradeId }).doRequest();
              this.$message.success('退单成功！');
            } catch (msg) {
              this.$message.error(msg);
            };
            this.isLoading = false;
            // 重新加载数据
            this.fetchData();
          }
        });
      },
      // 编辑份额
      editShare(row) {
        if (row.btnName === 1) {
          this.$refs.edit_share.show({ tradeId: row.tradeId, type: 'editRedeemShare', title: '编辑份额' });
        };
        if (row.btnName === 2) {
          this.$refs.edit_share.show({ tradeId: row.tradeId, type: 'addRedeemShare', title: '补录份额' });
        };
      },
      onUpdate() {
        this.fetchData();
      },
      // 导出数据方法
      doExport(row) {
        const url = '/file/downloadRedeemFile';
        const param = '?tradeId=';
        window.open(`${this.$fetch.getBasePath()}${url}${param}${row.tradeId}`);
      },
      // 查看
      check(row) {
        this.$router.push({
          name: 'redeemInfo',
          query: {
            tradeId: row.tradeId
          }
        });
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
