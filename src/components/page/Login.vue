<template>
  <div class="login-wrap bg2">
    <vue-particles
      color="#fff"
      :particle-opacity="0.7"
      :particles-number="60"
      shape-type="circle"
      :particle-size="4"
      lines-color="#fff"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="2"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
      class="lizi"
    >
    </vue-particles>
    <div class="body_bg">
      <div class="wel" style=" float: left;"></div>
      <div class="">
        <div v-show="flag==2" class="ms-login">
          <div class="ms-title">登录</div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="ms-content" label-width="0px">
            <div class="login_style" @click="flag=1"></div>
            <el-form-item prop="username">
              <el-input v-model="ruleForm.username" size="large" placeholder="请输入用户名">
                <el-button slot="prepend" icon="el-icon-lee-people" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="ruleForm.password" size="large" placeholder="请输入密码" show-password type="password">
                <el-button slot="prepend" icon="el-icon-lee-lock" />
              </el-input>
            </el-form-item>
            <el-form-item v-if="errorCount > 3" prop="verifyCode">
              <el-row>
                <el-col>
                  <el-input v-model="ruleForm.verifyCode" size="large" placeholder="验证码" type="text" maxlength="5" oninput="value=value.replace(/[^\d.]/g,'')">
                    <el-button slot="prepend" icon="el-icon-lee-lock" />
                  </el-input>
                </el-col>
                <el-col class="yzm_info">
                  <img :src="loadVerficImgSrc" alt="" style="vertical-align: bottom;cursor: pointer;padding:4px;" @click="updateDateTime">
                </el-col>
              </el-row>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
            </div>
          </el-form>
        </div>
        <!--企业微信登录-->
        <div v-show="flag==1" class="ms-login">
          <div class="ms-title"><img src="~img/WeworkLogoBule.png" />企业微信登录</div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="ms-content" label-width="0px">
            <div class="pclogin_style" @click="flag=2"></div>
            <div id="wx_qrcode" class="login_withqrc_code">
            </div>
          </el-form>
        </div>
      </div>
      <p class="login-tips">推荐使用 <b>企业微信</b> 扫码登录</p>
    </div>
  </div>
</template>

<script>
  import fetchApi from '@/api/fetchApi';
  export default {
    data: function() {
      return {
        ruleForm: {
          username: '',
          password: '',
          verifyCode: ''
        },
        flag: 2,
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        },
        errorCount: this.getErrCount(),
        dateTime: new Date().toString()
      };
    },
    computed: {
      loadVerficImgSrc() {
        return `/djjf-web/image/code?timeStamp=${this.dateTime}`;
      }
    },
    watch: {
      errorCount(currVal) {
        window.localStorage.setItem('err_count', currVal.toString());
      },
      'ruleForm.verifyCode'(val) {
        if (val.toString().length > 5) {
          this.ruleForm.verifyCode = this.ruleForm.verifyCode.substr(0, 5);
        }
      }
    },
    created() {
      const that = this;
      document.onkeydown = function(e) {
        e = window.event || e;
        if (that.$route.path === '/login' && (e.code === 'Enter' || e.code === 'enter')) { // 验证在登录界面和按得键是回车键enter
          that.submitForm('ruleForm');// 登录函数
        }
      };
    },
    mounted() {
      window.localStorage.setItem('token', '');
      window.WwLogin({
        id: 'wx_qrcode',
        appid: 'ww8f4383114f03cce5',
        agentid: '1000012',
        redirect_uri: 'https://gims.jd.com/djjf-web/login/scanCode',
        state: '3828293919281',
        href: 'https://storage.360buyimg.com/jr-assets/web/gims/QRLogin.css'
      });
    },
    methods: {
      updateDateTime() {
        this.dateTime = new Date().toString();
      },
      getErrCount() {
        const value = window.localStorage.getItem('err_count');
        if (value) {
          return parseInt(value);
        }
        return 0;
      },
      submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            const param = {
              login_name: this.ruleForm.username,
              password: this.ruleForm.password,
              verifyCode: this.ruleForm.verifyCode,
              loginCnt: this.errorCount
            };
            try {
              const token = await fetchApi.setParam('/login/doLogin', param).doRequest();
              window.localStorage.setItem('token', token);
              window.localStorage.setItem('err_count', '0');
              this.$router.push('/');
            } catch (msg) {
              this.errorCount += 1;
              this.$message({
                message: msg,
                type: 'error'
              });
            }
          } else {
            return false;
          }
        });
      }
    }
  };
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .wel{
    background: url(~img/wel.png) no-repeat;
    width: 460px;
    height: 520px;
  }
  .bg1{
    background: url(~img/login_bg3.png) no-repeat;
    background-size: cover;
  }
  .bg2{
    background: url(~img/bgnew.jpg) no-repeat #030014;
    background-size: cover;
  }
  .bg3{
    background: url(~img/login_bg.jpg) no-repeat;
    background-size: cover;
  }
  .bg4{
    background: url(~img/login-bg.jpg) no-repeat;
    background-size: cover;
  }
  .ms-title {
    width: 100%;
    line-height: 140px;
    text-align: center;
    font-size: 28px;
  }
  .ms-title img{
    vertical-align: middle;
  }
  .body_bg {
    margin: 0 auto;
    width: 900px;
    position: absolute;
    left: 50%;
    top: 45%;
    overflow: hidden;
    margin: -190px 0 0 -450px;
    border-radius: 8px;
    box-shadow: 0 0px 15px 8px rgba(15,0,71,1);
  }
  .ms-login {
    overflow: hidden;
    min-height: 520px;
    background: #fff;
  }
  .ms-content {
    padding:0 45px 45px;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    margin-top: 13px;
    width: 100%;
    height: 50px;
    font-size: 18px;
  }
  .login_style,.pclogin_style {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 72px;
    height: 72px;
    cursor: pointer;
  }
  .login_style {
    background: url(~img/withqrc.png);
  }
  .pclogin_style{
    background: url(~img/withpc.png);
  }
  .login_withqrc_code{
    margin: 0 auto;
    width: 160px;
    height: 159px;
    border: 1px solid #e6e6e6;
  }
  .login_withqrc_code img{
    vertical-align: bottom;
    border: 5px solid #fff;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 30px;
  }
  .el-form-item__error{
    padding-top: 8px!important;
  }
  .yzm_info{
    text-align: right;
    position: absolute;
    width: auto;
    right: 0;
  }
  .login-tips {
    position: absolute;
    bottom: 5%;
    right: 0;
    width: 440px;
    font-size: 16px;
    line-height: 40px;
    color: #999;
    text-align: center;
  }
  .login-tips b{
    color:#1E79FF;
  }
</style>
