<template>
  <el-dialog :title="title" :visible.sync="formDialogVisible" @close="close" :close-on-click-modal=false v-loading="isLoading">
    <info-detail-viewer
      :state="view"
    />
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="启动开始时间:" required>
          <el-col v-if="status === 'add'">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="ruleForm.startTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col v-if="status === 'edit'">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="ruleForm.startTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-value="this.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: right">
      <el-button type="danger" size="small" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import InfoDetailViewer from 'common/InfoDetailViewer';
  import { mapState } from 'vuex';
  export default {
    name: 'StartDeclarationForm',
    components: {
      InfoDetailViewer
    },
    data() {
      return {
        formModel: {},
        formDialogVisible: false,
        title: '',
        isLoading: false,
        status: '',
        startTime: [new Date(''), new Date('')],
        ruleForm: {
          startTime: [new Date(''), new Date('')]
        },
        rules: {
          startTime: [
            { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
          ]
        }
      };
    },
    computed: {
      ...mapState({
        startDeclarationFormState: state => state.declaration.startDeclarationFormState
      }),
      view() {
        if (this.startDeclarationFormState.infoView) {
          const data = this.startDeclarationFormState.data ? this.startDeclarationFormState.data : {};
          return this.startDeclarationFormState.infoView(data);
        }
        return {};
      }
    },
    methods: {
      show(param = {}) {
        // 弹框弹出把之前的验证的数据重置
        this.productId = param.productId;
        this.startId = param.startId;
        this.status = param.status;
        if (this.status === 'add') {
          this.title = '启动报单';
        }
        if (this.status === 'edit') {
          this.title = '编辑报单';
        }
        this.formDialogVisible = true;
        this.$store.commit('declaration/COMMIT_START_DECLARATION__FORM_VIEWER');
        this.fetchData();
      },
      getParam() {
        const submitCopyData = JSON.parse(JSON.stringify(this.startDeclarationFormState.data));
        if (parseInt(submitCopyData.productStatus) === 0) {
          submitCopyData.tradeType = '10'; // 认购
        } else {
          submitCopyData.tradeType = '20'; // 申购
        }
        submitCopyData.productId = this.productId;
        submitCopyData.id = this.startId;
        submitCopyData.openStart = this.ruleForm.startTime[0];
        submitCopyData.openEnd = this.ruleForm.startTime[1];
        if (typeof (submitCopyData.openStart) === 'object') {
          submitCopyData.openStart = this.formatDate(submitCopyData.openStart);
        }
        if (typeof (submitCopyData.openEnd) === 'object') {
          submitCopyData.openEnd = this.formatDate(submitCopyData.openEnd);
        }
        return submitCopyData;
      },
      // 保存
      async save() {
        this.$refs['ruleForm'].validate(async(valid) => {
          if (!valid) {
            return false;
          }
          this.isLoading = true;
          let url;
          if (this.status === 'edit') {
            url = '/distributeManage/edit';
          }
          if (this.status === 'add') {
            url = '/distributeManage/save';
          }
          try {
            await this.$fetch.setParam(url, this.getParam()).doRequest();
            this.$message.success('保存成功！');
            // 触发列表更新数据
            this.$emit('onUpdate');
          } catch (msg) {
            this.$message.error(msg);
          };
          this.isLoading = false;
          // 无论数据请求成功与否，都关闭弹框
          this.formDialogVisible = false;
          // 重置数据验证
          this.$refs['ruleForm'].resetFields();
        });
      },
      close() {
        // 关闭按钮后事件
        this.$refs['ruleForm'].resetFields();
      },
      async fetchData() {
        await this.$store.dispatch('declaration/getStartDeclarationData', {
          productId: this.productId
        });
        // 用于编辑情况，请求数据
        if (this.status === 'edit' && this.startId) {
          await this.$store.dispatch('declaration/getStartDeclarationOpenData', {
            startId: this.startId
          });
          if (this.startDeclarationFormState.data.openStart && this.startDeclarationFormState.data.openEnd) {
            this.startTime.splice(0, 1, new Date(this.startDeclarationFormState.data.openStart));
            this.startTime.splice(1, 1, new Date(this.startDeclarationFormState.data.openEnd));
            this.ruleForm.startTime = this.startTime;
          }
        }
      },
      formatDate(currentDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hour = currentDate.getHours();
        const minites = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        return `${year}-${month}-${day} ${hour}:${minites}:${seconds}`;
      }
    }
  };
</script>
<style scoped lang="scss">
  /*更改表单样式*/
  /*以下样式写法需要style标签中使用scope，不要加lang*/
  /deep/ .el-form-item__label {
    width: 120px;
    min-width: 120px;
    text-align: right;
    margin-right: 4px;
    flex-shrink: 0;
    font-size: 12px;
    padding: 0;
  }
  /deep/ .el-form-item__content {
    padding-left: 4px;
  }
  /deep/ .el-dialog__body {
    margin-top: -30px;
  }
</style>
