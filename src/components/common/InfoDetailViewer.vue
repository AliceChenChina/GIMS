<template>
  <div>
    <div v-for="(descItem, index) in mappedState" :key="`${index}desc`" class="desc-item">
      <div v-if="descItem.title" class="title-info mt25">
        <span>{{ descItem.title }}</span>
      </div>
      <div v-if="descItem.type === 'basic'" class="content-info">
        <el-row v-for="(descRow, indexRow) in descItem.rows" :key="`${indexRow}descrow`"
                type="flex" class="tiltle-content-row" justify="space-between"
        >
          <el-col v-for="(descCol, indexCol) in descRow" :key="`${indexCol}desccol`"
                  class="tiltle-content"
          >
            <div class="wrapper">
              <div class="content-info-title">{{ getLabel(descCol.label + ':') }} </div>
              <div v-if="descCol.formattedValue" class="content-info-content">{{ descCol.formattedValue }}</div>
              <VNodes
                v-else-if="descCol.formattedVNodes"
                class="content-info-content"
                :nodes="descCol.formattedVNodes"
              />
              <div v-else class="content-info-content">{{ getValDisp(descCol.value) }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="descItem.type === 'html'" class="content-html">
        <div v-html="descItem.content"></div>
      </div>
      <div v-else-if="descItem.type === 'images'" class="content-images">
        <imgView :files="descItem.files"></imgView>
      </div>
      <div v-else class="content-info">
        <dynamic-table
          :column="getTableColumn(descItem.tableColumn)"
          :data="descItem.tableData"
        ></dynamic-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DynamicTable from 'common/DynamicTable.vue';
  import imgView from 'common/imgView';

  const VNodes = {
    name: 'VNodes',
    props: {
      nodes: {
        type: Object,
        default() {
          return this.$createElement();
        }
      }
    },
    render(_) {
      return this.nodes;
    }
  };

  export default {
    name: 'InfoDetailViewer',
    components: {
      DynamicTable,
      imgView,
      VNodes
    },
    props: {
      state: {
        type: Array,
        default: () => { return []; }
      }
    },
    computed: {
      enumArgs() {
        // 所有枚举类型
        return this.$store.state.argEnum || {};
      },
      mappedState() {
        return this.state.map((descItem) => {
          if (descItem.type !== 'basic') {
            return descItem;
          }
          descItem.rows = descItem.rows.map((descRow) => {
            return descRow.map((descCol) => {
              if (descCol.formatter instanceof Function) {
                const renderResult = descCol.formatter(descCol.value, this.$createElement, this);
                if (typeof renderResult === 'string') {
                  descCol.formattedValue = renderResult;
                } else {
                  descCol.formattedVNodes = renderResult;
                }
              }
              return descCol;
            });
          });
          return descItem;
        });
      }
    },
    methods: {
      getValDisp(val) {
        // 如果是null或者undefined显示-，否则显示值
        if (typeof val === 'undefined' || val === null) {
          return '-';
        }
        return val;
      },
      getTableColumn(tableColumn) {
        if (tableColumn instanceof Function) {
          return tableColumn(this);
        }
        return tableColumn;
      },
      getLabel(text) {
        return text.replace(/：|:/, '');
      }
    }
  };
</script>

<style scoped lang="scss">
  .desc-item {
    padding: 10px 0;
    .title-info{
      font-size: 16px;
      color: #EB5954;
      font-weight: bold;
      border-bottom: 2px solid #ddd;
      span{
        padding: 5px;
        border-bottom: 2px solid #EB5954;
        display: inline-block;
        margin-bottom: -2px;
      }
      &:after {
        display: block;
        background: #bbbabc;
        height: 3px;
        margin-top: 8px;
      }
    }
    .tiltle-content-row {
      margin-top: 15px;
      align-items: center;
    }
    .tiltle-content {
      font-size: 12px;
      color:#666;
      .wrapper {
        width: 100%;
        display: flex;
        align-items: flex-start;
        .content-info-title {
          width: 120px;
          min-width: 120px;
          text-align: right;
          margin-right: 4px;
          flex-shrink: 0;
        }
      }
    }
    .content-html {
      padding: 20px;
    }
  }
</style>
