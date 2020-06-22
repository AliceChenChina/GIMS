<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :context="this"
      :state="viewData"
      @onFetchData="fetchData"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'StartHistoryList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        productId: this.$route.query.productId || ''
      };
    },
    computed: {
      ...mapState({
        viewData: state => state.declaration.startHistoryListState
      })
    },
    created() {
      this.productId = this.$route.query.productId || '';
      this.$store.commit('declaration/COMMIT_START_HISTORY_LIST_VIEWER_STATE');
      this.fetchData();
    },
    activated() {
      this.productId = this.$route.query.productId || '';
      this.$store.commit('declaration/COMMIT_START_HISTORY_LIST_VIEWER_STATE');
      this.fetchData();
    },
    methods: {
      // 获取请求接口的参数
      getParams() {
        return { ...this.viewData.paginationState.getAjaxParam(), ...{ productIds: this.productId } };
      },
      // 调取接口
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('declaration/startHistoryList', this.getParams());
        this.isLoading = false;
      },
      // 查看按钮
      edit(row) {
        const startId = row.bookingStartDto.id || '';
        const productId = row.productDto.productId;
        this.$router.push({
          name: 'editDeclarationForm',
          query: {
            productId: productId,
            startId: startId,
            status: 'edit'
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
