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
  import { Powers } from '@/utils/powers';
  import eidtShare from 'page/declaration/declarations/editShare';
  export default {
    name: 'AllDeclarationList',
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
        viewerState: state => state.declaration.allDeclarationListState
      }),
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      }
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_ALL_DECLARATION_LIST_VIEWER', this);
      this.fetchData();
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam(), ...{ type: 3 } };
      },
      async fetchData() {
        this.isLoading = true;
        const param = this.getLoadParam();
        if (Array.isArray(param.statusStrs)) {
          param.statusStrs = param.statusStrs.join(',');
        }
        await this.$store.dispatch('declaration/allDeclarationList', param);
        this.isLoading = false;
      },
      // 查看
      async check(row) {
        await this.$power.checkPower(Powers.allDeclarationCheck);
        this.$router.push({
          name: 'declarationInfo',
          query: {
            tradeId: row.tradeId
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
          this.$refs.edit_share.show({ tradeId: row.tradeId, type: 'editShare', title: '编辑份额' });
        };
        if (row.btnName === 2) {
          this.$refs.edit_share.show({ tradeId: row.tradeId, type: 'addShare', title: '补录份额' });
        };
      },
      onUpdate() {
        this.fetchData();
      },
      // 导出excel数据
      doExport() {
        const filterModel = this.viewerState.filterModel;
        const filterModelString = JSON.parse(JSON.stringify(filterModel));
        filterModelString.customerName = encodeURIComponent(this.handleUndefine(filterModelString.customerName));
        filterModelString.productNameShort = encodeURIComponent(this.handleUndefine(filterModelString.productNameShort));
        filterModelString.salesName = encodeURIComponent(this.handleUndefine(filterModelString.salesName));
        filterModelString.statusStrs = Array.isArray(filterModelString.statusStrs) ? filterModelString.statusStrs.join(',') : filterModelString.statusStrs;
        const filterModelStringArr = ['bookingWay=' + this.handleUndefine(filterModelString.bookingWay), 'statusStrs=' + this.handleUndefine(filterModelString.statusStrs), 'customerName=' + filterModelString.customerName, 'productNameShort=' + filterModelString.productNameShort, 'salesName=' + filterModelString.salesName];
        window.open(this.$fetch.getBasePath() + '/bookingTrade/exportAllBookingTrade?' + filterModelStringArr.join('&'));
      },
      // 处理undefined
      handleUndefine(data) {
        return data === undefined ? '' : data;
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
    color: #F52020;
    cursor: pointer;
  }
  .disable {
    color: #cccccc;
    cursor: not-allowed;
  }
</style>
