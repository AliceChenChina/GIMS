<template>
  <div v-if="state" class="box-card">
    <slot name="before-filter"></slot>
    <dynamic-filter
      :comps="getFilterOptions"
      :filterModel="state.filterModel"
      @onModelChange="handleModelChange"
    />
    <slot name="before-table"></slot>
    <dynamic-table
      ref="dynamic_table"
      :column="getTableColumn"
      :table-props="getTableProps"
      :data="recordsData"
      :selection-change="handleSelectionChange"
      :sort-change="handleSortChange"
      :current-change="handleCurrentChange"
    />
    <slot name="before-pagination"></slot>
    <pagination v-if="paginationState"
                ref="pager"
                :state="paginationState"
                :total="totalRecordCount"
                @onPageChange="onPagerStateChange"
    ></pagination>
    <slot name="after-pagination"></slot>
  </div>
</template>

<script>
  import DynamicFilter from 'common/dynamicFilter.tsx';
  import DynamicTable from 'common/DynamicTable';
  import Pagination from 'common/Pagination';

  export default {
    components: {
      DynamicFilter,
      DynamicTable,
      Pagination
    },
    props: {
      context: {
        type: Object,
        default: () => {}
      },
      state: {
        type: Object,
        default: () => null
      },
      update: {
        type: Boolean,
        default: () => false
      }
    },
    data() {
      const handler = {
        get: (target, name) => {
          if (typeof name === 'string') {
            if (name in target) {
              // 本组件方法
              return target[name];
            }
            // 否则调取调用者的方法
            return this.context[name];
          }
          return target[name];
        }
      };
      const proxyVm = new Proxy(this, handler);
      return {
        load: false,
        proxyVm
      };
    },
    computed: {
      getFilterOptions() {
        if (this.state.filterOptions instanceof Function) {
          return this.state.filterOptions(this.proxyVm); // store里面数据绑定本组件和父组件方法
        }
        return this.state.filterOptions;
      },
      getTableColumn() {
        if (this.state.tableColumn instanceof Function) {
          return this.state.tableColumn(this.proxyVm); // store里面数据绑定本组件和父组件方法
        }
        return this.state.tableColumn;
      },
      getTableProps() {
        if (this.state.tableProps instanceof Function) {
          return this.state.tableProps(this.proxyVm); // store里面数据绑定本组件和父组件方法
        }
        return this.state.tableProps;
      },
      recordsData() {
        return this.state.tableData && this.state.tableData.records;
      },
      totalRecordCount() {
        return this.state.tableData && this.state.tableData.totalRecordCount;
      },
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      },
      paginationState() {
        return this.state.paginationState;
      }
    },
    methods: {
      // 筛选框数据源改变
      handleModelChange(data) {
        this.$store.commit('UPDATE_FILTER_MODEL', {
          modelState: this.state.filterModel,
          data
        }
        );
      },
      // 加工返回dynamic-filter组件el-select里面用的配置数组
      statusArgsWithElOptionsTag(groupKey) {
        // map方法不会执行空数组
        const enumArgs = this.enumArgs[groupKey] || {};
        const options = Object.keys(enumArgs).map(key => {
          if (/^[^\u4e00-\u9fa5]+$/.test(key)) {
            return {
              label: enumArgs[key],
              value: /^\d+$/.test(key) ? parseInt(key) : key
            };
          }
        });
        return options.filter(nodes => nodes);
      },
      handleSelectionChange(value) {
        // 勾选框选中事件
        this.$emit('onSelectionChange', value);
      },
      handleCurrentChange(value) {
        // 表格单选事件
        this.$emit('onCurrentChange', value);
      },
      handleSortChange(event) {
        this.$emit('onSortChange', event);
      },
      doQuery() {
        // 页码设为1，并执行查询
        this.$refs.pager.setPageNo(1);
      },
      doDefaultReset() {
        // 简单地清空所有value
        const state = { ...this.state.filterModel };
        Object.keys(state).forEach(key => {
          state[key] = '';
        });
        this.$store.commit('UPDATE_FILTER_MODEL', {
          modelState: this.state.filterModel,
          data: state
        }
        );
        this.$refs.pager.setPageNo(1);
      },
      onPagerStateChange(params) {
        // 页码改变时，通知外部组件加载新一页数据
        this.$store.commit('UPDATE_PAGINATION_STATE', {
          paginationState: this.state.paginationState,
          data: params
        });
        this.fetchData();
      },
      clearSelection() {
        this.$refs.dynamic_table.clearSelection();
      },
      async fetchData() {
        // 组件外面自行处理页码加载请求的ajax参数
        this.$emit('onFetchData');
      },
      getDyTable() {
        return this.$refs.dynamic_table;
      },
      getPager() {
        return this.$refs.pager;
      }
    }
  };
</script>

<style scoped>
  .el-select .el-select__tags .el-tag {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-color: transparent;
    margin: 2px 0 2px 6px;
    background-color: #f0f2f5
  }

</style>
