<template>
  <!--分页容器 -->
  <div class="pagination">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page="state.currentPageNo"
      :page-size="state.pageSize"
      @current-change="_updateCurrentPageNo"
      @size-change="onSizeChange"
    />
  </div>
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      state: {
        // 当前表格对应的分页器状态
        type: Object,
        default() {
          return {};
        }
      },
      total: {
        type: Number,
        default: 0
      },
      sizeChange: {
        type: Function,
        default: function() {}
      }
    },
    data() {
      return {
        paginationState: {}
      };
    },
    watch: {
      state() {
        this.paginationState = { ...this.state };
      }
    },
    created() {
      this.paginationState = { ...this.state };
    },
    methods: {
      _updateCurrentPageNo(value) {
        this.paginationState.currentPageNo = value;
        this.$emit('onPageChange', this.getPageParam());
      },
      onSizeChange(value) {
        this.paginationState.pageSize = value;
        this.paginationState.currentPageNo = 1;
        this.$emit('onPageChange', this.getPageParam());
      },
      setPageNo(value) {
        this.paginationState.currentPageNo = value;
        this.$emit('onPageChange', this.getPageParam());
      },
      getPageParam() {
        const paramObj = {};
        paramObj.pageSize = this.paginationState.pageSize;
        paramObj.pageNumber = this.paginationState.currentPageNo;
        // 同步到store
        return paramObj;
      }
    }
  };
</script>

<style scoped>

</style>
