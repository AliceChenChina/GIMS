<template>
  <el-card v-loading="isLoading">
    <list-viewer
      ref="tradeVisit_viewer"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
      @onSortChange="handleSortChange"
    />
    <trade-visit-edit ref="tradeVisitEdit" @onUpDate="update"></trade-visit-edit>
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  import tradeVisitEdit from 'page/customerService/tradeVisitEdit';
  import { Powers } from '@/utils/powers';
  export default {
    name: 'TradeVisitList',
    components: {
      listViewer,
      tradeVisitEdit
    },
    data() {
      return {
        isLoading: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.customerService.tradeVisitListViewerState
      })
    },
    mounted() {
      // 初始化筛选框的查询
      this.$store.commit('customerService/COMMIT_TRADEVISITLIST_VIEWER_STATE');
      this.fetchData();
    },
    activated() {
      this.fetchData();
    },
    methods: {
      getLoadParam() {
        // 获取筛选框表单的内容
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        const params = this.getLoadParam();
        params.order = this.order;
        params.orderColumn = this.orderColumn;
        await this.$store.dispatch('customerService/getTradeVisitList', params);
        this.isLoading = false;
      },
      handleSortChange(event) {
        let order;
        if (event.order === 'descending') {
          order = 'desc';
        } else {
          order = 'asc';
        }
        this.orderColumn = event.prop;
        this.order = order;
        this.fetchData();
      },
      async gotoTradeVisitDetail(id) {
        await this.$power.checkPower(Powers.tradeVisitEdit);
        this.$router.push({
          name: 'tradeVisitDetail',
          params: {
            id
          }
        });
      },
      async gotoTradeVisitEdit(id) {
        await this.$power.checkPower(Powers.tradeVisitEdit);
        this.$refs.tradeVisitEdit.open(id);
      },
      update() {
        this.fetchData();
      }
    }
  };
</script>

<style>
  .disable{
    color: #ccc;
  }

  .able{
    color: red;
    cursor: pointer;
  }
</style>
