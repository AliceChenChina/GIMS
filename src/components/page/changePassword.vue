<template>
  <el-card class="changePassword">
    <dynamic-form
      ref="form"
      :form="formItems"
      :model="formModel"
      :col-span="9"
      @onFormChange="handleFormChange"
    />
    <el-row class="save bottom-op" justify="center">
      <el-button type="danger" size="large" @click="confirm">保存</el-button>
      <el-button size="large" @click="closeCurrentTag">取消</el-button>
    </el-row>
  </el-card>
</template>

<script>
  import DynamicForm from 'common/DynamicForm';
  import fetchApi from '@/api/fetchApi';
  export default {
    name: 'ChangePassword',
    components: {
      DynamicForm
    },
    data() {
      // 确认密码正则
      const vm = this;
      const validateConfirm = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入确认密码'));
        } else if (value !== vm.formModel.newPassWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      // 新密码正则
      const validateNewPass = (rule, value, callback) => {
        const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+=.)(_-]).{8,30}$');
        if (value.length < 8) {
          callback(new Error('密码长度不能小于8位'));
        } else if (!regex.test(value)) {
          callback(new Error('密码不符合规则，密码长度应为[8-30]位，包含大小写字母,数字及特殊字符'));
        } else if (value === vm.formModel.oldPassWord) {
          callback(new Error('新密码不能和原密码一致'));
        } else {
          callback();
        }
      };
      return {
        formItems: [
          [{
            formLabel: '旧密码: ',
            modelKey: 'oldPassWord',
            formRules: 'required',
            inputProps: {
              disabled: false,
              showPassword: true,
              autocomplete: 'off'
            },
            inputTag: 'el-input'
          }],
          [{
            formLabel: '新密码: ',
            modelKey: 'newPassWord',
            formRules: [
              { required: true, message: '请输入新密码', trigger: 'blur' },
              { validator: validateNewPass, trigger: ['blur', 'change'] }
            ],
            inputProps: {
              disabled: false,
              showPassword: true,
              autocomplete: 'off'
            },
            inputTag: 'el-input'
          }],
          [{
            formLabel: '确认密码: ',
            modelKey: 'confirmPassword',
            formRules: [
              { required: true, message: '请输入确认密码', trigger: 'blur' },
              { validator: validateConfirm, trigger: ['blur', 'change'] }
            ],
            inputProps: {
              disabled: false,
              showPassword: true,
              autocomplete: 'off'
            },
            inputTag: 'el-input'
          }]
        ],
        formModel: {
          oldPassWord: '',
          newPassWord: '',
          confirmPassword: ''
        }
      };
    },
    methods: {
      async confirm() {
        this.$refs.form.getFormValidate()(async valid => {
          if (!valid) return;
          const arg = { password: this.formModel.oldPassWord, newPassword: this.formModel.newPassWord };
          try {
            await fetchApi.setParam('/systemSetting/employee/changePassword', arg).doRequest();
            this.closeCurrentTag();
            this.$message.info('密码修改成功');
          } catch (e) {
            this.$message.error(e);
          }
        });
      },
      closeCurrentTag() {
        const tagsChildrens = this.$parent.$children;
        let tagIndex;
        for (let i = 0; i < tagsChildrens.length; i++) {
          if (tagsChildrens[i].$el.className === 'tags') {
            tagIndex = i;
            break;
          }
        }
        const tabs = document.getElementsByClassName('tags-li');
        let tabIndex;
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].className.indexOf('active') > 0) {
            tabIndex = i;
            break;
          }
        }
        tagsChildrens[tagIndex].closeTags(tabIndex);
      },
      handleFormChange(value) {
        // 表单改变事件
        this.formModel = { ...this.formModel, ...value };
      }
    }
  };
</script>

<style scoped lang="scss">
  .bottom-op {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    height: 60px;
    width: 100%;
    background: #fff;
  }
  .changePassword{
    /deep/.el-form-item__error{
      position: relative;
    }
  }
</style>
