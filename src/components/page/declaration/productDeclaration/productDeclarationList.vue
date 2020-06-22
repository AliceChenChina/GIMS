<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :context="this"
      :state="viewData"
      @onFetchData="fetchData"
    />
    <createDeclaration ref="start_declaration_form" @onUpdate="onUpdate" />
  </el-card>
</template>
<script>
  import listViewer from 'common/ListViewer';
  import createDeclaration from 'page/declaration/declarations/createDeclaration';
  import { mapState } from 'vuex';
  const newVar = {
    name: 'ProductDeclarationList',
    components: {
      listViewer,
      createDeclaration
    },
    data() {
      return {
        isLoading: false
      };
    },
    computed: {
      ...mapState({
        viewData: state => state.declaration.productDeclarationListState
      })
    },
    mounted() {
      this.$store.commit('declaration/COMMIT_PRODUCT_DECLARATION_LIST_VIEWER');
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('declaration/productDeclarationList', { ...this.viewData.filterModel, ...this.viewData.paginationState.getAjaxParam() });
        this.isLoading = false;
      },
      // 报单
      declaration(row) {
        const param = {
          productId: row.productId,
          startId: row.bookingStart.id || ''
        };
        this.$refs.start_declaration_form.show(param);
      },
      onUpdate() {
        this.fetchData();
      }
    }
  };
  export default newVar;
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
  .spanLeft, .spanRight {
    display: inline-block;
  }
  .spanLeft {
    width: 80px;
    text-align: left;
  }
  .spanRight {
    padding-left: 10px;
  }
</style>
