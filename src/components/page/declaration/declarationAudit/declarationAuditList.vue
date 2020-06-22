<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
    <redeemAuditDetail ref="redeem_audit_detail" @onUpdate="onUpdate" />
  </el-card>
</template>
<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  import { Powers } from '@/utils/powers';
  import redeemAuditDetail from 'page/declaration/redeem/redeemAuditDetail';
  export default {
    name: 'DeclarationAuditList',
    components: {
      listViewer,
      redeemAuditDetail
    },
    data() {
      return {
        isLoading: false,
        shouldUpdateData: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.declaration.declarationAuditListState
      }),
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      }
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_DECLARATION_AUDIT_LIST_VIEWER', this);
      this.fetchData();
    },
    activated() {
      if (this.shouldUpdateData) {
        this.fetchData();
        this.shouldUpdateData = false;
      }
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        const param = this.getLoadParam();
        if (Array.isArray(param.statusStrs)) {
          param.statusStrs = param.statusStrs.join(',');
        }
        await this.$store.dispatch('declaration/declarationAuditList', param);
        this.isLoading = false;
      },
      // 审核按钮方法
      async auditDeclaration(row) {
        await this.$power.checkPower(Powers.declarationAudit);
        this.shouldUpdateData = true;
        const param = {
          tradeId: row.tradeId,
          startId: row.startId
        }
        this.$refs.redeem_audit_detail.show(param);
      },
      // 导出数据方法
      exportReport(row) {
        const url = '/product/hasCommisionConvert';
        const param = {
          productId: row.productId
        };
        const tradeId = row.tradeId;
        this.checkHasCommidionConvert(url, param, tradeId);
      },
      // 检查是否有折标系数
      async checkHasCommidionConvert(url, param, tradeId) {
        try {
          await this.$fetch.setParam(url, param).doRequest();
          window.open(this.$fetch.getBasePath() + '/file/createGladTidingsCheck?tradeId=' + tradeId);
        } catch (msg) {
          this.$message.error('折标系数为空');
        }
      },
      // 导出excel数据
      doExport() {
        const filterModel = this.viewerState.filterModel;
        const filterModelString = JSON.parse(JSON.stringify(filterModel));
        filterModelString.customerName = encodeURIComponent(this.handleUndefine(filterModelString.customerName));
        filterModelString.productNameShort = encodeURIComponent(this.handleUndefine(filterModelString.productNameShort));
        filterModelString.salesName = encodeURIComponent(this.handleUndefine(filterModelString.salesName));
        filterModelString.statusStrs = Array.isArray(filterModelString.statusStrs) ? filterModelString.statusStrs.join(',') : filterModelString.statusStrs;
        const filterModelStringArr = ['bookingWay=' + this.handleUndefine(filterModelString.bookingWay), 'statusStrs=' + this.handleUndefine(filterModelString.statusStrs), 'bookingTimeStart=' + this.handleUndefine(filterModelString.bookingTimeStart), 'bookingTimeEnd=' + this.handleUndefine(filterModelString.bookingTimeEnd), 'customerName=' + filterModelString.customerName, 'productNameShort=' + filterModelString.productNameShort, 'salesName=' + filterModelString.salesName];
        window.open(this.$fetch.getBasePath() + '/bookingTrade/exportBookingCheck?' + filterModelStringArr.join('&'));
      },
      // 处理undefined
      handleUndefine(data) {
        return data === undefined ? '' : data;
      },
      onUpdate() {
        this.fetchData();
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
