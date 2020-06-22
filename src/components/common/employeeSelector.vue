<template>
  <selector
    ref="selector"
    :loading="isLoading"
    title="理财师选择"
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
    name: 'EmployeeSelector',
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
        viewerState: state => state.consumer.employeeSelectorViewerState
      })
    },
    async mounted() {
      this.$store.commit('consumer/COMMIT_EMPLOYEE_SELECTOR');
      await this.fetchData();
    },
    methods: {
      showDialog() {
        // 筛选栏数据清空
        Object.keys(this.viewerState.filterModel).forEach(key => {
          this.viewerState.filterModel[key] = '';
        });
        // 请求数据
        this.fetchData();
        // 弹出弹框
        this.$refs.selector.showDialog();
      },
      selectionChange(selectionList) {
        this.onSelectList = {};
        selectionList.forEach(item => {
          this.onSelectList[item.empId] = item;
        });
      },
      confirmSelection(value) {
        if (!Object.keys(this.onSelectList).length) {
          this.$message.error('请选择至少一个用户！');
          return;
        }
        this.$refs.selector.dialogVisible = false;
        this.$emit('onSelectionConfirm', this.onSelectList);
        this.onSelectList = {};
      },
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('consumer/getEmployee', this.getLoadParam());
        this.isLoading = false;
      }
    }
  };
</script>

<style scoped>

</style>
