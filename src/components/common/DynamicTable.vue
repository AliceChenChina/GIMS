<template>
  <!--动态表格-->
  <el-row type="flex"
          class="comp-dy-table"
          justify="start"
  >
    <el-table ref="multipleTable"
              :data="data"
              class="table"
              style="width: 100%"
              stripe
              v-bind="tableProps"
              @selection-change="selectionChange"
              @sort-change="sortChange"
              @current-change="currentChange"
    >
      <template v-for="(columnItem, index) in getColumn">
        <!--有操作按钮选项，这里拆成两个是因为slot-scope不能使用v-if，否则表格行会空白-->
        <el-table-column
          v-if="columnItem.slotComps && columnItem.slotComps.length"
          :key="`cus-tab-${index}`"
          fit
          v-bind="columnItem.props"
          v-on="columnItem.eventOn?element.eventOn:{}"
        >
          <div slot-scope="scope" class="el-td-slot">
            <component
              :is="slotComp.tagName"
              v-for="(slotComp, scopeIndex) in columnItem.slotComps"
              :key="`scope${scopeIndex}${slotComp.tagName}`"
              v-bind="slotComp.props?slotComp.props:{}"
              v-on="slotComp.getEventsOn(scope)"
            >
              {{ slotComp.innerText }}
            </component>
          </div>
        </el-table-column>
        <el-table-column
          v-else
          :key="`cus-tab-${index}`"
          fit
          v-bind="columnItem.props"
          v-on="columnItem.eventOn?element.eventOn:{}"
        />
      </template>
    </el-table>
  </el-row>
</template>

<script>
  import { Powers } from '@/utils/powers';
  export default {
    name: 'DynamicTable',
    props: {
      column: {
        // 表格列设定
        type: Array,
        default() {
          return [];
        }
      },
      data: {
        // 表格数据
        type: Array,
        default() {
          return [];
        }
      },
      selectionChange: {
        type: Function,
        default() {
          return function() {};
        }
      },
      tableProps: {
        type: Object,
        default() {
          return {};
        }
      },
      sortChange: {
        type: Function,
        default() {
          return function() {};
        }
      },
      currentChange: {
        // 单选
        type: Function,
        default() {
          return function() {};
        }
      }
    },
    computed: {
      getColumn() {
        const column = this.column.filter( item => item.powerKey === false || this.$power.hasPower(`${item.powerKey}.${item.dataKey}`) === false)
        if (column.length <= 7) {
          return column.map(columnItem => {
            if (columnItem.props) {
              columnItem.props.width = 'auto';
            }
            const item = { ...columnItem };
            const props = {
              prop: item.dataKey,
              label: item.label,
              align: 'left', // 默认左对齐
              formatter: (row) => {
                // 无数据显示横杠
                // todo 用点分割开的取值方法,现在如果xx.xx需要手都写formatter
                return this.$utils.emptyableValue(row[item.dataKey]);
              }
            };
            item.props = Object.assign(props, item.props); // 自定义设定覆盖默认设定
            // 注入scope对象以获得表格行上下文
            if (item.slotComps && item.slotComps.length) {
              item.slotComps.forEach(slotItem => {
                slotItem.getEventsOn = (scope) => {
                  if (slotItem.eventOn instanceof Function) {
                    return slotItem.eventOn(scope);
                  }
                  return slotItem.eventOn || {};
                };
              });
            }
            return item;
          });
        }
        return column.map(columnItem => {
          const item = { ...columnItem };
          const props = {
            prop: item.dataKey,
            label: item.label,
            align: 'left', // 默认左对齐
            formatter: (row) => {
              // 无数据显示横杠
              // todo 用点分割开的取值方法,现在如果xx.xx需要手都写formatter
              return this.$utils.emptyableValue(row[item.dataKey]);
            }
          };
          item.props = Object.assign(props, item.props); // 自定义设定覆盖默认设定
          // 注入scope对象以获得表格行上下文
          if (item.slotComps && item.slotComps.length) {
            item.slotComps.forEach(slotItem => {
              slotItem.getEventsOn = (scope) => {
                if (slotItem.eventOn instanceof Function) {
                  return slotItem.eventOn(scope);
                }
                return slotItem.eventOn || {};
              };
            });
          }
          return item;
        });
      }
    },
    methods: {
      clearSelection() {
        this.$refs.multipleTable.clearSelection();
      },
      toggleSelection(row) {
        this.$refs.multipleTable.toggleRowSelection(row);
      }
    }
  };
</script>

<style scoped>
  /*重置 top 8*/
  .el-card__body {
    padding-top: 8px!important;
  }
  .el-td-slot {
    display: flex;
  }
</style>
