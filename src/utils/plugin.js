import commonDialog from 'common/commonDialog';

export default {
  install(Vue, pluginOptions = {}) {
    const Dialog = Vue.extend(commonDialog);
    const dialog = new Dialog();
    dialog.$mount();
    // 挂载组件到dom
    document.querySelector(pluginOptions.container || 'body').appendChild(dialog.$el);
    function $alert(options = Object) {
      const { title = '提示', msg, msghtml, onConfirm, onCancel } = options;
      dialog.setMsg(title, msg);
      dialog.setMsgHtml(title, msghtml);
      dialog.setCallback(onConfirm, onCancel);
      dialog.show();
    }
    Vue.prototype.$alert = $alert;
    Vue.prototype.$elAlert = $alert; // ts命名空间冲突了，暂时别名
  }
};
