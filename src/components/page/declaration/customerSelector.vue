<template>
  <selector
    ref="selector"
    :loading="isLoading"
    title="选择 - 客户"
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
    name: 'CustomerSelector',
    components: {
      selector
    },
    data() {
      return {
        isLoading: false,
        onSelectList: []
      };
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_CUSTOMER_SELECTOR');
    },
    computed: {
      ...mapState({
        viewerState: state => state.declaration.customerSelectorViewerState
      })
    },
    methods: {
      showDialog() {
        // 筛选栏数据清空
        Object.keys(this.viewerState.filterModel).forEach(key => {
          this.viewerState.filterModel[key] = '';
        });
        this.fetchData();
        this.$refs.selector.showDialog();
      },
      selectionChange(selectionList) {
        this.onSelectList = selectionList;
      },
      confirmSelection(value) {
        if (this.onSelectList.length === 0) {
          this.$message.error('请选择至少一个用户！');
          return;
        }
        if (this.onSelectList.length > 1) {
          this.$message.error('请选择一个用户！');
          return;
        }
        const row = this.onSelectList[0];
        this.getCustomerComplianceInfo(row.pinCode, row.id, row.contact, row.customerId);
      },
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('declaration/getCustomerList', this.getLoadParam());
        this.isLoading = false;
      },
      async getCustomerComplianceInfo(pinCode, id, contact, customerId) {
        this.isLoading = true;
        try {
          await this.$fetch.setParam('/customerOverview/getCustomerComplianceInfo', { userId: customerId }).doRequest();
          this.$refs.selector.dialogVisible = false;
          this.$emit('onSelectionConfirm', id, contact, customerId);
          this.onSelectList = {};
        } catch (msg) {
          this.$message.error(msg);
        };
        this.isLoading = false;
      }
    }
  };
</script>

<style scoped>

</style>
