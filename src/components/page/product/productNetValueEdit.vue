<template>
  <!--编辑净值 -->
  <el-dialog :title="dialogTitle" :visible.sync="createNetValueVisible" width="30%" :append-to-body="true">
    <el-form ref="form" v-loading="loading" :model="form" label-width="130px" :rules="formRules">
      <el-form-item label="产品名称:">
        <el-input v-model="form.productName" :disabled="true" />
      </el-form-item>
      <el-form-item label="净值日期:" prop="netDate">
        <el-date-picker v-model="form.netDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="form.id"/>
      </el-form-item>
      <el-form-item label="单位净值(元):" prop="netValue">
        <el-input v-model="form.netValue" />
      </el-form-item>
      <el-form-item label="累计净值(元):" prop="netValueAccu">
        <el-input v-model="form.netValueAccu" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="createNetValueVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveNetValue">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ProductNetValueEdit',
    data() {
      return {
        createNetValueVisible: false,
        dialogTitle: '',
        form: {
          id: 0,
          netCover: false,
          productId: '',
          productName: '',
          productCode: '',
          netDate: '',
          isOpenDate: '2',
          netValue: '',
          netValueAccu: '',
          yearIncomeRate: ''
        },
        formRules: {
          netDate: { required: true, message: '净值日期必填', trigger: 'blur' },
          netValue: { required: true, validator: this.numValidator },
          netValueAccu: { required: true, validator: this.numValidator }
        },
        loading: false
      };
    },
    watch: {
      createNetValueVisible(val) {
        if (val) {
          setTimeout(() => {
            this.$refs.form.clearValidate();
          }, 100);
        }
      }
    },
    methods: {
      async saveNetValue() {
        this.$refs['form'].validate(async(valid) => {
          if (valid) {
            const uri = '/productNetValue/saveProductNetValueRecord';
            const form = { ...this.form };
            form.netDate = `${form.netDate} 00:00:00`;
            try {
              this.loading = true;
              await this.$fetch.setParam(uri, form).setRejectHandler((reject, res) => {
                // 直接返回错误对象
                reject(res);
              }).doRequest();
              this.$message.success('保存成功！');
              this.createNetValueVisible = false;
              this.form.netCover = false;
              this.$emit('onEditSuccess');
              this.loading = false;
            } catch (res) {
              this.loading = false;
              if (parseInt(res.code) === 8002) {
                this.$alert({
                  msg: '所选净值日期已存在净值数据，确认添加则覆盖原有数据，确认要添加吗？',
                  onConfirm: async() => {
                    this.form.netCover = true;
                    this.saveNetValue();
                  }
                });
              } else {
                this.$message.error('发生错误，请重试');
              }
            }
          } else {
            return false;
          }
        });
      },
      setForm(product) {
        this.form = { ...product };
        if (!this.form.id) {
          this.dialogTitle = '新建净值';
        } else {
          this.dialogTitle = '编辑净值';
        }
      },
      numValidator(rule, value, callback) {
        const numReg = /^[0-9]+.?[0-9]*$/;
        if (value === '') {
          callback(new Error('必填项'));
        } else if (!numReg.test(value)) {
          callback(new Error('请输入有效的数字'));
        } else {
          callback();
        }
      }
    }
  };
</script>

<style scoped>

</style>
