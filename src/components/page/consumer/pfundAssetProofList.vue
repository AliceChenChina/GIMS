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
  import listViewer from 'common/ListViewerLevel2';
  import { mapState } from 'vuex';
  export default {
    name: 'PfundAssetProofList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        shouldUpdateData: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.consumer.pfundAssetProofListState
      })
    },
    mounted() {
      this.$store.commit('consumer/COMMIT_PFUND_PROOF_LIST_VIEWER');
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
        await this.$store.dispatch('consumer/getPfundAssetProofList', this.getLoadParam());
        this.isLoading = false;
      },
      // 导出excel数据
      doExport() {
        const filterModel = this.viewerState.filterModel;
        const filterModelString = JSON.parse(JSON.stringify(filterModel));
        filterModelString.userPin = encodeURIComponent(this.handleUndefine(filterModelString.userPin));
        const filterModelStringArr = [
          'querybeginSubmitTime=' + this.handleUndefine(filterModelString.querybeginSubmitTime),
          'queryEndSubmitTime=' + this.handleUndefine(filterModelString.queryEndSubmitTime),
          'querybeginAuditTime=' + this.handleUndefine(filterModelString.querybeginAuditTime),
          'queryEndAuditTime=' + this.handleUndefine(filterModelString.queryEndAuditTime),
          'querybeginExpireTime=' + this.handleUndefine(filterModelString.querybeginExpireTime),
          'queryEndExpireTime=' + this.handleUndefine(filterModelString.queryEndExpireTime),
          'channel=' + this.handleUndefine(filterModelString.channel),
          'medium=' + this.handleUndefine(filterModelString.medium),
          'auditStatus=' + this.handleUndefine(filterModelString.auditStatus),
          'status=' + this.handleUndefine(filterModelString.status),
          'submitWay=' + this.handleUndefine(filterModelString.submitWay),
          'userPin=' + filterModelString.userPin];
        window.open(this.$fetch.getBasePath() + '/pfundAssetProofDetail/exportPfundAssetProofDetail?' + filterModelStringArr.join('&'));
      },
      // 处理undefined
      handleUndefine(data) {
        return data === undefined ? '' : data;
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
