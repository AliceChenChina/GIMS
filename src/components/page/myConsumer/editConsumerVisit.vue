<template>
  <div>
    <el-dialog :title="dialogType=='add'?'新建拜访记录':'编辑拜访记录'" :visible.sync="dialogVisible">
      <dynamic-form
        ref="form"
        :form="getForms"
        :model="formModel"
        @onFormChange="handleFormChange"
      />
      <el-row class="save bottom-op" justify="center">
        <el-button type="danger" size="large" @click="saveVisit">保存</el-button>
        <el-button size="large" @click="dialogVisible=false">取消</el-button>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <customerSelector ref="customer_selector" @onSelectionConfirm="selectionConfirmFn" />
  </div>
</template>

<script>
  import DynamicForm from 'common/DynamicForm';
  import customerSelector from 'page/declaration/customerSelector';
  import form from '@/store/pageConf/myConsumer/myConsumerVisitEdit';
  export default {
    name: 'EditConsumerVisit',
    components: {
      DynamicForm,
      customerSelector
    },
    props: {
      // 对话框标题
      dialogType: {
        type: String,
        required: true,
        default: 'add'
      },
      formValue: {
        type: Object,
        default: () => {}
      },
      contactDisable: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogImageVisible: false, // 图片大图是否显示
        dialogImageUrl: '', // 当前预览image大图url
        formModel: {}
      };
    },
    computed: {
      getForms() {
        const vm = this;
        const attchments = [{
          formLabel: '附件',
          modelKey: 'attachList',
          inputTag: 'el-upload',
          inputProps: {
            'list-type': 'picture-card',
            beforeUpload(file) {
              // 图片上传前格式，大小限制
              const fileTypeArrys = ['image/bmp', 'image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
              if (!fileTypeArrys.includes(file.type)) {
                this.$message.error(`文件${file.name}格式不正确`);
                return false;
              }
              const maxSize = 1024 * 1024 * 10;
              if (file.size > maxSize) {
                this.$message.error('请上传小于10M的图片');
                return false;
              }
              return file;
            },
            onPreview(file) {
              // todo onPreview事件
              const fileData = file.response.data;
              const url = `/djjf-web/file/download?directory=${fileData.filePath}&downloadFile=${fileData.fileId}${fileData.fileNameExt}&fileName=${fileData.fileName}`;
              vm.dialogImageUrl = url;
              vm.dialogImageVisible = true;
            }
          },
          inputTagOptions: [
            {
              tagName: 'div',
              children: [{
                tagName: 'i',
                options: {
                  attrs: {
                    class: 'el-icon-plus'
                  }
                }
              }],
              options: {
                attrs: {
                  class: 'el-upload__tip',
                  slot: 'tip'
                }
              }
            }
          ]
        }];
        const oldform = form(this);
        return [...oldform, attchments];
      }
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          setTimeout(() => {
            this.$refs.form.resetFields();
          });
        }
      }
    },
    methods: {
      // 表单改变事件
      handleFormChange(value) {
        this.formModel = { ...this.formModel, ...value };
      },
      /* 保存拜访记录 */
      saveVisit() {
        this.$refs.form.getFormValidate()(async valid => {
          if (!valid) return;
          const tempData = this.$utils.jsonClone(this.formModel);
          if (tempData.startTime > tempData.endTime) {
            this.$message.error('开始时间不能大于结束时间');
            return;
          }
          const submitData = { ...tempData };
          if (typeof tempData.attachList !== 'undefined') {
            submitData.attachList = tempData.attachList.map(file => {
              return {
                ...file.response.data,
                module: 'customerVisit'
              };
            });
          };
          try {
            let url;
            if (this.dialogType === 'add') {
              url = '/customerVisit/save';
              submitData.customerId = submitData.customerSalesDto.customerId;
              submitData.customerName = submitData.customerSalesDto.contact;
            } else {
              url = '/customerVisit/update';
            }
            await this.$fetch.setParam(url, submitData).doRequest();
            this.$emit('reloadData');
            this.$message.success('保存成功！');
          } catch (msg) {
            this.$message.error(msg);
          }
          this.dialogVisible = false;
        });
      },
      // 选择客户
      selectConsumer() {
        this.$refs.customer_selector.showDialog();
      },
      // 选择客户后
      selectionConfirmFn(id, contact, customerId) {
        this.$refs.form.resetFields();
        const customerSalesDto = { customerId, contact };
        this.$set(this.formModel, 'customerSalesDto', customerSalesDto);
      },
      // 打开dialog
      openDialoag() {
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.formModel = this.$utils.jsonClone(this.formValue);
        });
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
</style>
