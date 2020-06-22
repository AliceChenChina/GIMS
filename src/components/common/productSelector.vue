<template>
  <selector
    ref="selector"
    :loading="isLoading"
    title="产品选择"
    :state="viewerState"
    :context="this"
    @onFetchData="fetchData"
    @onSelectionChange="selectionChange"
    @onSelectionConfirm="confirmSelection"
  />
</template>

<script>
  import selector from 'common/Selector';
  import { mapState } from 'vuex';
  export default {
    name: 'ProductSelector',
    components: {
      selector
    },
    data() {
      return {
        isLoading: false,
        onSelectList: {}
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.productSelectorViewerState
      })
    },
    watch: {
    },
    async mounted() {
      this.$store.commit('product/COMMIT_PRODUCT_SELECTOR');
      await this.fetchData();
    },
    methods: {
      showDialog() {
        this.$refs.selector.showDialog();
      },
      selectionChange(selectionList) {
        this.onSelectList = {};
        selectionList.forEach(item => {
          this.onSelectList[item.productId] = item;
        });
      },
      confirmSelection(value) {
        if (!Object.keys(this.onSelectList).length) {
          this.$message.error('请选择至少一个产品！');
          return;
        }
        this.$refs.selector.dialogVisible = false;
        this.$emit('onSelectionConfirm', this.onSelectList);
        this.onSelectList = {};
      },
      getLoadParam() {
        const state = this.viewerState;
        return {
          productTag: 0,
          ...state.filterModel,
          ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('product/queryProductSelectorList', this.getLoadParam());
        this.isLoading = false;
      }
    }
  };
</script>

<style scoped>

</style>
