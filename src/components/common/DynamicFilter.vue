<template>
  <div class="custom-el-filter">
    <el-row
      v-for="(elElementRow, index) in filterOptions"
      :key="index"
      type="flex"
      class="comp-row"
      justify="start"
    >
      <template v-for="(element, indexInner) in elElementRow">
        <span v-if="element.tagName !== 'radio-filter'" :key="element.labelName" class="label">{{ element.labelName }}</span>
        <component
          :is="element.tagName"
          :key="`comp${indexInner}`"
          :class="['el-custom-filter']"
          :value="model[element.modelName]"
          :title="element.tagName === 'radio-filter'?element.labelName:''"
          v-bind="element.props?element.props:{}"
          v-on="element.eventOn?element.eventOn:{}"
        >
          <template v-for="slotComp in element.slotComps">
            <component
              :is="slotComp.tagName"
              v-if="slotComp.innerText"
              v-bind="slotComp.props?slotComp.props:{}"
              v-on="slotComp.eventOn?slotComp.eventOn:{}"
            >
              {{ slotComp.innerText }}
            </component>
            <component
              :is="slotComp.tagName"
              v-else
              v-bind="slotComp.props?slotComp.props:{}"
              v-on="slotComp.eventOn?slotComp.eventOn:{}"
            />
          </template>
        </component>
      </template>
    </el-row>
  </div>
</template>

<script>
  import radioFilter from 'common/radioFilter';
  import { Powers } from '@/utils/powers';
  /*
  动态生成element ui组件作为表格过滤器
  支持多行生成
  统一使用事件处理输出
   */
  export default {
    name: 'DynamicFilter',
    components: {
      radioFilter
    },
    props: {
      // 组件设定列表
      // value根据设定的value name绑定model里面的字段
      // 如果没有设定onChange事件，绑定默认输入框或者选择到这个事件上面去
      comps: {
        type: Array,
        default() {
          return [];
        }
      },
      // 数据源
      model: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        localModelData: {}
      };
    },
    computed: {
      filterOptions() {
        const vm = this;
        const bindDefaultValueComps = ['el-input', 'el-select', 'el-date-picker', 'radio-filter'];
        if (!this.comps.length) return [];
        const comps = this.comps.map( item => {
          return item.filter( childItem => {
            if (childItem.powerKey === false) return true;
            if (childItem.dataKey && childItem.dataKey.split(',').length !== 0) {
              const dataKeys = childItem.dataKey.split(',');
              let getIfDataKey = true;
              for (let i = 0; i < dataKeys.length; i++ ) {
                if (this.$power.hasPower(`${childItem.powerKey}.${dataKeys[i]}`)) {
                  getIfDataKey = false;
                  break;
                }
              }
              return getIfDataKey;
            }
            return true;
          })
        })
        for (const compRow of comps) {
          for (const eachComp of compRow) {
            if (typeof eachComp.eventOn === 'undefined' && bindDefaultValueComps.indexOf(eachComp.tagName) >= 0) {
              // 绑定默认输入事件
              eachComp.eventOn = {
                input: value => {
                  // 修改拷贝到本地的数据，改变的时候emit到外部
                  vm.localModelData[eachComp.modelName] = value;
                  // 通知外部组件数据已经修改
                  this.$emit('onModelChange', vm.localModelData);
                }
              };
            }
            switch (eachComp.tagName) {
            case 'el-input':
              break;
            case 'el-select':
              if (typeof eachComp.options === 'undefined') {
                break;
              }
              eachComp.slotComps = eachComp.options.map(option => {
                return {
                  tagName: 'el-option',
                  props: {
                    value: option.value,
                    label: option.label
                  }
                };
              });
              break;
            case 'radio-filter':
              if (typeof eachComp.options === 'undefined') {
                break;
              }
              eachComp.slotComps = eachComp.options.map(option => {
                return {
                  tagName: 'el-radio',
                  innerText: option.label,
                  props: {
                    label: option.value
                  }
                };
              });
              break;
            default:
              break;
            }
          }
        }
        return comps;
      }
    },
    watch: {
      model: {
        deep: true,
        handler() {
          this.localModelData = { ...this.model };
        }
      }
    },
    created() {
      // 浅拷贝model
      // 绑定的数据源里面不应该有函数
      // 组件所有的输入修改本地的modelData，而不是直接修改props的对象引用的属性，更符合单项数据流原则
      this.localModelData = { ...this.model };
    }
  };
</script>
<style scoped lang="scss">
  .comp-row {
    align-items: center;
    .label {
      white-space: nowrap;
      font-size:13px;
    }
    &:nth-child(1){
      margin-right: 10px;
    }
    &:nth-child(1) .label:last-of-type{
      /*margin-right: 10px;*/
    }
  }
  .comp-row {
    margin: 10px 0;
  }
  .comp-row:last-child{
    margin-bottom: 20px;
  }
  .el-custom-filter {
    margin: 0 10px;
    width: 100%;
    max-width: 320px;
  }
  .el-button-group {
    width: 100%;
    display: flex;
  }
  .el-select {
    width: 100%;
  }
</style>
