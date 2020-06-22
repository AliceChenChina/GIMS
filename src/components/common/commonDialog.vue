<template>
  <div class="dg">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div v-if="msghtml" v-html="msghtml"></div>
      <span v-else>{{ msg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doCancel">取 消</el-button>
        <el-button type="primary" @click="doConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*
  普通对话框，包含消息和确认取消按钮
   */
  export default {
    name: 'CommonDialog',
    data() {
      return {
        dialogVisible: false,
        title: '',
        msg: '',
        msghtml: '',
        onConfirm: {},
        onCancel: {}
      };
    },
    methods: {
      setMsg(title, msg) {
        this.title = title;
        this.msg = msg;
      },
      setMsgHtml(title, msgHtml) {
        this.title = title;
        this.msghtml = msgHtml;
      },
      setCallback(onConfirm, onCancel) {
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
      },
      doConfirm() {
        this.dialogVisible = false;
        if (this.onConfirm instanceof Function) {
          this.onConfirm();
        }
      },
      doCancel() {
        this.dialogVisible = false;
        if (this.onCancel instanceof Function) {
          this.onCancel();
        }
      },
      show() {
        this.dialogVisible = true;
      }
    }
  };
</script>

<style scoped>

</style>
