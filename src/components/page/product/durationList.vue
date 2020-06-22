<template>
  <el-card v-loading="isLoading" class="box-card">
    <list-viewer
      ref="list_viewer"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    ></list-viewer>
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import listViewer from 'common/ListViewer';
  export default {
    name: 'DurationList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.durationListViewerState
      })
    },
    created() {
      this.$store.commit('product/SET_DURATION_VIEWER_STATE');
    },
    async mounted() {
      this.isLoading = true;
      await this.fetchData();
      this.isLoading = false;
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('product/productDurationList', this.getLoadParam());
        this.isLoading = false;
      },
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      goToDurationManage(row) {
        console.warn('row is', row);
        this.$router.push({
          name: 'durationManage',
          query: {
            skuId: row.productId,
            type: row.productType
          }
        });
      },
      goToBenefitList(row) {
        if (row.productType === '私募股权') {
          this.$router.push({
            name: 'benefitsListApportionment',
            query: {
              skuId: row.productId
            }
          });
        }
        if (row.productType === '类固收') {
          this.$router.push({
            name: 'benefitsListInterest',
            query: {
              skuId: row.productId
            }
          });
        }
      }
    }
  };
</script>

<style scoped>

</style>
