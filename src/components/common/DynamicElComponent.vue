<script>
  /*
  动态生成element ui里面的组件,
  包含动态生成slot
   */
  import listViewer from 'common/ListViewer';
  import ShareIconUpload from '@/components/page/activity/uploadShareAvatar'; // todo 注册为全局组件
  import UploadImg from '@/components/page/activity/uploadImg'; // todo 注册为全局组件
  import ElTag from '@/components/page/activity/elTag'; // todo 注册为全局组件
  export default {
    name: 'DynamicElComponent',
    components: {
      listViewer,
      ShareIconUpload,
      UploadImg,
      ElTag
    },
    props: {
      comp: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {};
    },
    methods: {
      createElComponent(tagName, options, children) {
        // children可以是tagName对象或者VNodes实例
        if (children instanceof Array) {
          // 递归创建子节点
          const childrenVNodes = children.map(child => {
            return this.createElComponent(child.tagName, child.options, child.children);
          });
          return this.$createElement(tagName, options, childrenVNodes);
        }
        // 不是数组此时children就是文字
        return this.$createElement(tagName, options, children);
      }
    },
    render() {
      return this.createElComponent(this.comp.tagName, this.comp.options, this.comp.children);
    }
  };
</script>
