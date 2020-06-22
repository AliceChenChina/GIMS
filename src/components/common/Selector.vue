<template>
  <el-dialog v-if="mountDialog" :title="title" :visible.sync="visible" :width="width" :append-to-body="true">
    <list-viewer ref="list_viewer"
                 v-loading="loading"
                 :state="state"
                 :context="context"
                 class="selector-viewer"
                 @onFetchData="onFetchData"
                 @onSelectionChange="handleSelectionChange"
    ></list-viewer>
    <div slot="footer" class="dialog-footer">
      <el-button @click="doCancel">取 消</el-button>
      <el-button type="primary" @click="confirmSelction">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  /*
  弹框列表选择器，一个table表+多选
   */
  import listViewer from 'common/ListViewer';
  export default {
    name: 'EmployeeSelector',
    components: {
      listViewer
    },
    props: {
      title: {
        // 选择框标题
        type: String,
        default: ''
      },
      loading: {
        // 是否显示加载中动画
        type: Boolean,
        default: false
      },
      state: {
        // 数据状态
        type: Object,
        default() {
          return {};
        }
      },
      context: {
        // 调用者vue实例
        type: Object,
        default() {
          return {};
        }
      },
      width: {
        type: String,
        default: '70%'
      }
    },
    data() {
      return {
        dialogVisible: false,
        visible: false, // 控制对话框是否展示和过渡效果
        mountDialog: false // 是否mount对话框组件
      };
    },
    watch: {
      visible(val) {
        if (!val) {
          this.hideDialog();
        }
      },
      async dialogVisible(val) {
        if (val) {
          this.mountDialog = true;
          await this.$nextTick();
          this.visible = true;
          // todo 是否单选的控制
          setTimeout(() => {
            // 不显示一键多选按钮
            this.showHeadMultiChoice(true);
          });
        } else {
          this.visible = false;
          // 清理选择框
          this.$refs.list_viewer.clearSelection();
          setTimeout(() => {
            this.mountDialog = false;
          }, 500);
        }
      }
    },
    methods: {
      showHeadMultiChoice(isShow) {
        // 隐藏表头一键多选按钮
        const dom = document.querySelectorAll('.selector-viewer .el-table .el-table__header tr .cell')[0];
        if (!dom) return;
        if (!isShow) {
          dom.style.display = 'none';
        } else {
          dom.style.display = 'block';
        }
      },
      showDialog() {
        this.dialogVisible = true;
      },
      hideDialog() {
        // 隐藏对话框
        this.dialogVisible = false;
      },
      handleSelectionChange(selectionList) {
        // 这里会同时运行tableColumn设定里的selectable回调
        this.$emit('onSelectionChange', selectionList);
      },
      confirmSelction() {
        // 确认选择
        this.$emit('onSelectionConfirm');
        // 外部控制是否继续展示对话框
      },
      doCancel() {
        this.dialogVisible = false;
        this.$emit('onCancel');
        // 通过watch执行隐藏对话框和emit事件
      },
      async onFetchData() {
        this.$emit('onFetchData');
      },
      getDyTableRef() {
        return this.$refs.list_viewer.getDyTable();
      }
    }
  };
</script>

<style scoped>

</style>
