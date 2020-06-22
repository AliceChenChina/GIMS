/*
DynamicFilter V2版本
完善ts支持，完善jsx语法支持
 */
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import DynamicComponent, { DynamicCompTag, VNodesRender } from '@/components/common/DynamicComponent';
import radioFilter from '@/components/common/radioFilter.vue'; // 包了一层的radio选择器
import './dynamicFilter.scss';

export interface DynamicFilterTagItem {
  labelName: string, // 左边小标签名称
  tagName: string, // 组件标签名称，不一定是element ui的标签
  modelName: string, // 绑定的数据字段key
  powerKey?: string, // powerKey
  dataKey?: string, // powerKey
  props?: { [key: string]: any }, // element ui 提供的props属性
  slotComps?: Array<DynamicFilterSlotComp>,
  options?: Array<ElOptionTag> | VNodesRender,
  event?: { [key: string]: any }
}

export interface DynamicFilterSlotComp {
  tagName: string,
  innerText: string,
  props: { [key: string]: any }
  eventOn: { [key: string]: any }
}

interface ElTagHandler { // 注册每个el-tag事件处理函数，包含model的处理和ElOptionTag格式数组处理，
  tagName: string,
  defaultProps?: { [key: string]: any }, // 默认props
  getBindValue?: (vm: DynamicFilter, comp: DynamicFilterTagItem) => any,
  getEventsHandler?: (vm: DynamicFilter, comp: DynamicFilterTagItem) => { [key: string]: any }, // 获取element组件绑定事件处理函数（输入，选择等）
  elOptionTagSlotBuilder?: (options: Array<ElOptionTag>) => Array<DynamicCompTag> // 将label->value的形式的配置转换为jsx渲染函数
}

// element ui 下拉框对象格式
declare interface ElOptionTag {
  label: string,
  value: string | number
}

@Component({
  components: {
    DynamicComponent, radioFilter
  }
})
export default class DynamicFilter extends Vue {
  @Prop({ type: Array, default: () => [] }) comps!: Array<Array<DynamicFilterTagItem>>; // 组件配置
  @Prop({ type: Object, default: () => { return {}; } }) filterModel!: { [key: string]: any }; // 数据源

  static elTagHandlers: Array<ElTagHandler> = [];

  localModelData = {};

  static registerComponent(elTagHandlers: Array<ElTagHandler>) {
    DynamicFilter.elTagHandlers = elTagHandlers;
  }

  created() {
    // 浅拷贝model
    // 绑定的数据源里面不应该有函数
    // 组件所有的输入修改本地的modelData，而不是直接修改props的对象引用的属性，更符合单项数据流原则
    this.localModelData = { ...this.filterModel };
  }

  @Watch('filterModel', { deep: true })
  handleModelChange() {
    this.localModelData = { ...this.filterModel };
  }
  getfilterItemOption(comp: DynamicFilterTagItem) {
    // comp为组件传入DynamicFilter的配置文件
    const dyComp = {
      tagName: comp.tagName,
      options: {
        props: {},
        attrs: {}
      }
    };
    const [elHandler] = DynamicFilter.elTagHandlers.filter((item) =>
      item.tagName === comp.tagName
    );
    if (comp.options) {
      if (typeof comp.options === 'function') {
        // 此时options是VNodesRender函数，返回VNode数组
        dyComp['children'] = comp.options;
      }
    }
    if (comp.props) {
      dyComp.options.props = comp.props; // element组件
      if (comp.props.class) {
        dyComp.options.attrs['class'] = comp.props.class;
      }
      if (comp.props.placeholder) {
        dyComp.options.attrs['placeholder'] = comp.props.placeholder;
      }
    }
    if (comp.slotComps instanceof Array) {
      dyComp['children'] = comp.slotComps.map((slotComp) => {
        return this.convertSlotComp(slotComp);
      });
    }

    dyComp.options.props['value'] = this.localModelData[comp.modelName];
    // 绑定默认input事件
    dyComp['options']['on'] = {
      input: value => {
        // 修改拷贝到本地的数据，改变的时候emit到外部
        this.localModelData[comp.modelName] = value;
        // 通知外部组件数据已经修改
        this.$emit('onModelChange', this.localModelData); // 兼容旧代码
        this.$emit('modelChange', this.localModelData);
      }
    };
    // 处理组件默认props，事件等
    if (elHandler) {
      if (typeof elHandler.getEventsHandler === 'function') {
        // 注册组件事件
        dyComp['options']['on'] = elHandler.getEventsHandler(this, comp);
      }
      if (typeof elHandler.getBindValue === 'function') {
        // 如果提供了自定义绑定value的函数
        dyComp['options']['props']['value'] = elHandler.getBindValue(this, comp);
      }
      if (typeof elHandler.elOptionTagSlotBuilder === 'function') {
        dyComp['children'] = elHandler.elOptionTagSlotBuilder(comp.options as Array<ElOptionTag>);
      }
      if (elHandler.defaultProps) {
        dyComp['options']['props'] = { ...elHandler.defaultProps, ...dyComp['options']['props'] };
      }
    }
    if (comp.event) {
      dyComp['options']['on'] = { ...dyComp['options']['on'], ...comp.event };
    }
    return {
      dyCompOption: dyComp,
      comp
    };
  }

  // 兼容老的slotComps格式
  convertSlotComp(slotComp: DynamicFilterSlotComp): DynamicCompTag {
    return {
      tagName: slotComp.tagName,
      options: {
        props: slotComp.props,
        on: slotComp.eventOn
      },
      children: slotComp.innerText
    };
  }

  renderComponent(filterItem) {
    const key = `${filterItem.comp.modelName}`;
    return (
      <div class="filter-item-wrapper">
        <span key={ `label${key}` } class="label">{ filterItem.comp.labelName }</span>
        <dynamic-component class="el-custom-filter" comp={ filterItem.dyCompOption } key={ key }/>
      </div>
    );
  }

  render(h: CreateElement) {
    const comps = this.comps.map( item => {
      return item.filter( childItem => {
        if (Boolean(childItem.powerKey) === false) return true;
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
    return (
      <div class="custom-el-filter">
        {
          comps.map((row, index) => {
            return (
              <el-row
                key={`r${index}`}
                type="flex"
                class="comp-row"
                justify="start"
              >
                {
                  row.map((comp) => {
                    return this.renderComponent(this.getfilterItemOption(comp));
                  })
                }
              </el-row>
            );
          })
        }
      </div>
    );
  }
}

const defaultElHandler: Array<ElTagHandler> = [
  {
    tagName: 'el-input',
    getBindValue: (vm: DynamicFilter, comp: DynamicFilterTagItem) => {
      return vm.localModelData[comp.modelName];
    }
  },
  {
    tagName: 'el-select',
    getEventsHandler: (vm: DynamicFilter, comp: DynamicFilterTagItem) => {
      return {
        input: value => {
          // 修改拷贝到本地的数据，改变的时候emit到外部
          vm.localModelData[comp.modelName] = value;
          // 通知外部组件数据已经修改
          vm.$emit('onModelChange', vm.localModelData);
          vm.$emit('modelChange', vm.localModelData);
        }
      };
    },
    defaultProps: {},
    elOptionTagSlotBuilder: (tagOptions: Array<ElOptionTag>): Array<DynamicCompTag> => {
      return tagOptions.map((tagOption) => {
        return {
          tagName: 'el-option',
          options: {
            props: {
              key: tagOption.value,
              value: tagOption.value,
              label: tagOption.label
            }
          }
        };
      });
    }
  },
  {
    tagName: 'el-date-picker',
    defaultProps: {
      'popper-append-to-body': false // 处理下拉框不随着页面滚动跟随滚动
    },
    getBindValue: (vm: DynamicFilter, comp: DynamicFilterTagItem) => {
      comp.props = comp.props ? comp.props : {};
      if (comp.props.type === 'daterange') {
        return [vm.localModelData[comp.props.startTime], vm.localModelData[comp.props.endTime]];
      } else {
        return vm.localModelData[comp.modelName];
      }
    },
    getEventsHandler: (vm: DynamicFilter, comp: DynamicFilterTagItem) => {
      const prop = comp.props ? comp.props : {};
      return {
        input: value => {
          // 修改拷贝到本地的数据，改变的时候emit到外部
          if (prop.type === 'daterange') {
            value = value === null ? ['', ''] : value;
            vm.localModelData[prop.startTime] = value[0];
            vm.localModelData[prop.endTime] = value[1];
          } else {
            vm.localModelData[comp.modelName] = value;
          }
          // 通知外部组件数据已经修改
          vm.$emit('onModelChange', vm.localModelData);
          vm.$emit('modelChange', vm.localModelData);
        }
      };
    }
  }
];

DynamicFilter.registerComponent(defaultElHandler);
