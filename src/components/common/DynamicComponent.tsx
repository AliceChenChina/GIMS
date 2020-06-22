import { CreateElement, VNode, VNodeChildren, VNodeData } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface DynamicCompTag {
  tagName: string
  options?: { [key: string]: any }, // 对应$createElement里面的options（attrs, on, props等）
  children?: string | Array<DynamicCompTag> | VNodesRender
}

export type VNodesRender = (h: CreateElement) => Array<VNode>;
export type VNodeRender = (h: CreateElement) => VNode;

@Component
export default class DynamicComponent extends Vue {
  @Prop({ type: Object, default: () => {} }) comp!: any;

  _createComponent(tagName: string,
                  options: VNodeData = {},
                  textOrChildren?: Array<DynamicCompTag> | VNodesRender | string): VNode {
    // children可以是DynamicCompTag数组对象或者VNodes实例
    if (textOrChildren instanceof Array) {
      // 递归创建子节点
      const childrenVNodes = (textOrChildren as Array<DynamicCompTag>).map((child: DynamicCompTag): VNode => {
        return this._createComponent(child.tagName, child.options, child.children);
      });
      return this.$createElement(tagName, options, childrenVNodes);
    } else if (textOrChildren instanceof Function) {
      // 插入实例的createElement并且进行渲染返回
      // 这个时候tagName和options参数是被忽略的
      const childrenVNodes = (textOrChildren as Function)(this.$createElement);
      return this.$createElement(tagName, options, childrenVNodes);
    }
    // 不是数组此时children就是文字或者VNode
    return this.$createElement(tagName, options, textOrChildren);
  }

  createComponent(tagName: string | VNodeRender,
                  options: VNodeData = {},
                  textOrChildren?: Array<DynamicCompTag> | string): VNode {
    if (tagName instanceof Function) {
      // 直接作为vnode传入
      return (tagName as Function)(this.$createElement);
    }
    return this._createComponent(tagName as string, options, textOrChildren);
  }

  render(h: CreateElement) {
    return this.createComponent(this.comp.tagName, this.comp.options, this.comp.children);
  }
}
