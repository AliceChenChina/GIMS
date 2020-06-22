<template>
  <selector
    ref="selector"
    :loading="isLoading"
    title="报单匹配列表"
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
    name: 'DeclarationOrderSelector',
    components: {
      selector
    },
    data() {
      return {
        isLoading: false,
        onSelectList: [],
        param: {}
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.declaration.chooseDeclarationOrderState
      })
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_CHOOSE_DECLARATION_ORDER_VIEWER_STATE');
    },
    watch: {
    },
    methods: {
      showDialog(param = {}) {
        this.param = param;
        this.fetchData();
        this.$refs.selector.showDialog();
      },
      selectionChange(selectionList) {
        this.onSelectList = selectionList;
      },
      confirmSelection(value) {
        if (!this.onSelectList.length) {
          this.$message.error('请选择一个订单！');
          return;
        }
        if (this.onSelectList.length > 1) {
          this.$message.error('只能选择一个订单！');
          return;
        }
        this.$refs.selector.dialogVisible = false;
        this.$emit('onSelectionConfirm', this.onSelectList[0]);
        this.onSelectList = [];
      },
      getLoadParam() {
        const state = this.viewerState;
        return {
          userPin: decodeURIComponent(this.param.userPin),
          productId: this.param.productId,
          bookingTime: this.param.bookingTime,
          ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('declaration/getChooseDeclarationOrder', this.getLoadParam());
        this.isLoading = false;
      }
    }
  };
</script>

<style scoped>

</style>
