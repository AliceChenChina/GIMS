<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :context="this"
      :state="viewData"
      @onFetchData="fetchData"
    />
    <startDeclarationForm ref="start_declaration_form" @onUpdate="onUpdate" />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  import startDeclarationForm from 'page/declaration/startDeclaration/startDeclarationForm';
  import { Powers } from '@/utils/powers';
  const newVar = {
    name: 'StartDeclaration',
    components: {
      listViewer,
      startDeclarationForm
    },
    data() {
      return {
        isLoading: false
      };
    },
    computed: {
      ...mapState({
        viewData: state => state.declaration.startDeclarationListState
      })
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_START_DECLARATION_LIST_VIEWER_STATE');
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('declaration/startDeclarationList', { ...this.viewData.filterModel, ...this.viewData.paginationState.getAjaxParam() });
        this.isLoading = false;
      },
      // 启动报单
      goToDeclarationForm(row, status) {
        if (row.commisionConvert === null || row.commisionRate === null) {
          this.$message.error('折标系数与提成比例不能为空，请先到编辑产品页面填写！');
          return false;
        }
        const param = {
          productId: row.productId,
          status: status,
          startId: row.startId || ''
        };
        this.$refs.start_declaration_form.show(param);
      },
      // 关闭报单
      closeDeclaration(row) {
        const uri = '/distributeManage/closeBookingStart';
        this.$alert({
          msg: '确认关闭报单吗？',
          onConfirm: async() => {
            try {
              this.isLoading = true;
              await this.$fetch.setParam(uri, { startd: row.startId }).doRequest();
              this.isLoading = false;
              // 重新加载数据
              this.$message.success('操作成功！');
              this.fetchData();
            } catch (msg) {
              this.isLoading = false;
              this.$message.error(msg);
            }
          }
        });
      },
      onUpdate() {
        this.fetchData();
      }
    }
  };
  export default newVar;
</script>
<style lang="scss">
  .href-container a{
    color:red;
  }
  .href-container a:hover{
    cursor: pointer;
  }
</style>
