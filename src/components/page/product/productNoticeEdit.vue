<template>
  <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="30%">
    <dynamic-form
      ref="dy_form"
      :form="getFormItems()"
      :model="form"
      label-width="100px"
      @onFormChange="handleFormChange"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="editVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveEdit">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import DynamicForm from 'common/DynamicForm';
  export default {
    name: 'ProductNoticeEdit',
    components: {
      DynamicForm
    },
    props: {
      category: {
        type: Number,
        default: 4 // holding_report持仓研报，3是产品公告
      }
    },
    data() {
      return {
        editVisible: false,
        dialogTitle: '',
        form: {
          id: '',
          title: '',
          productId: '',
          productName: '',
          pushTerminal: '',
          type: '',
          content: '',
          remark: '',
          attachFileListDto: [],
          fileDto: [],
          publishDate: '' // 发布日期
        }
      };
    },
    watch: {
      editVisible(val) {
        if (!val) {
          Object.keys(this.form).forEach(formKey => {
            if (formKey === 'attachFileListDto' || formKey === 'fileDto') {
              this.form[formKey] = [];
            } else {
              this.form[formKey] = '';
            }
          });
        } else {
          setTimeout(() => {
            this.$refs.dy_form.resetFields();
          });
        }
      }
    },
    methods: {
      getFormItems() {
        const formItems = [
          [
            {
              formLabel: '产品名称：',
              modelKey: 'productName',
              formRules: 'required',
              inputAttrs: {
                placeholder: '点击选择产品...' // 原生属性
              },
              inputProps: {
                clearable: true
              },
              inputEvents: {
                input: (value) => {
                  if (!value) {
                    // 清空产品
                    this.setProduct({
                      productId: '',
                      productName: ''
                    });
                    return;
                  }
                },
                focus: () => {
                  this.$emit('onChooseProduct');
                }
              },
              inputTag: 'el-input'
            }
          ],
          [
            {
              formLabel: '标题：',
              modelKey: 'title',
              formRules: 'required',
              inputTag: 'el-input',
              inputAttrs: {
                placeholder: '产品标题' // 原生属性
              }
            }
          ],
          [
            {
              formLabel: '发布日期：',
              modelKey: 'publishDate',
              inputTag: 'el-date-picker',
              props: {
                'value-format': 'yyyy-MM-dd 00:00:00'
              }
            }
          ],
          [
            {
              formLabel: '附件：',
              modelKey: 'attachFileListDto',
              formRules: 'required',
              inputTag: 'el-upload',
              inputProps: {
                beforeUpload: (file) => {
                  // 图片上传前格式，大小限制
                  const fileTypeArrys = ['application/pdf'];
                  if (!fileTypeArrys.includes(file.type)) {
                    this.$message.error(`文件${file.name}格式不正确，只能上传pdf`);
                    return false;
                  }
                  return file;
                }
              }
            }
          ]
        ];
        if (this.category === 4) {
          formItems[2] = [
            {
              formLabel: '发布日期：',
              modelKey: 'publishDate',
              formRules: 'required',
              inputTag: 'el-date-picker',
              inputProps: {
                'value-format': 'yyyy-MM-dd 00:00:00'
              }
            }
          ];
        } else if (this.category === 3) {
          formItems[2] = [
            {
              formLabel: '简介：',
              modelKey: 'remark',
              formRules: 'required',
              inputTag: 'el-input'
            }
          ];
        }
        return formItems;
      },
      handleFormChange(form) {
        this.form = this.$utils.jsonClone(form);
      },
      setProduct(choosedProduct) {
        this.$refs.dy_form.resetFields();
        const product = this.$utils.jsonClone(choosedProduct);
        this.form.productId = product.productId;
        this.form.productName = product.productName;
      },
      setForm(form) {
        // 编辑产品设置表单内容
        this.dialogTitle = '编辑';
        this.form = this.$utils.jsonClone(form);
        this.$set(this.form, 'productName', this.form.productDto.productName);
        this.$set(this.form, 'productNameShort', this.form.productDto.productNameShort);
        this.$set(this.form, 'productId', this.form.productDto.productId);
        this.$set(this.form, 'attachFileListDto', this.extractFileObj(this.form.attachFileListDto));
      },
      // 将后端返回的文件对象转换成elementui使用的对象格式
      extractFileObj(files) {
        if (!files) return [];
        return files.map(file => {
          return {
            uid: file.fileId,
            url: `${file.filePath}${file.fileName}`,
            status: 'success',
            name: file.fileName,
            size: file.fileSize,
            response: {
              data: file
            }
          };
        });
      },
      saveEdit() {
        const uri = '/productNotice/save';
        this.$refs.dy_form.getFormValidate()(async valid => {
          if (!valid) return;
          try {
            const submitForm = window.JSON.parse(window.JSON.stringify(this.form));
            submitForm.category = this.category;
            submitForm.attachFileListDto = submitForm.attachFileListDto.map(file => {
              return {
                ...file.response.data,
                module: 'productNotice'
              };
            });
            delete submitForm.productDto;
            await this.$fetch.setParam(uri, submitForm).doRequest();
            this.$emit('onSaveSuccess');
            this.$message.success('保存成功');
            this.editVisible = false;
          } catch (e) {
            this.$message.error(e);
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
