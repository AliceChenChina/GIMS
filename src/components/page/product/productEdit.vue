<template>
  <el-card class="edit-wrapper" style="position: relative">
    <side-menu-viewer style="height: 88%;" ref="side_menu_viewer">
      <template v-for="(row, index) in getForms">
        <div :key="index" class="menu-anchor-info mt25">
          <span>{{ row.title }}</span>
        </div>
        <list-viewer
          v-if="row.type === 'table'"
          :state="row.tableState"
        />
        <div v-else-if="row.type === 'html'" :key="`html${index}`" style="padding: 20px" v-html="row.htmlValue">
        </div>
        <dynamic-form
          v-else
          :form="row.formItems"
          :model="formModel"
          @onFormChange="handleFormChange"
        />
      </template>
    </side-menu-viewer>
    <el-row class="save bottom-op" justify="center">
      <el-button type="danger" size="large" @click="submitForm">保存</el-button>
    </el-row>
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import SideMenuViewer from 'common/SideMenuViewer';
  import DynamicForm from 'common/DynamicForm';
  import listViewer from 'common/ListViewer';
  import { Powers } from '@/utils/powers';
  export default {
    name: 'ProductEdit',
    components: {
      DynamicForm,
      listViewer,
      SideMenuViewer
    },
    data() {
      return {
        formModel: {
          productName: 'test'
        },
        skuId: this.$route.query.skuId
      };
    },
    computed: {
      ...mapState({
        productInfoState: state => state.product.productInfoState
      }),
      formStoreModel() {
        if (this.productInfoState[this.type]) {
          const storeModel = this.productInfoState[this.type].model;
          const model = this.$utils.jsonClone(storeModel);
          model.attachList = {};
          model.attachList.productSign = this.extractFileObj(storeModel.attachList);
          model.attachList.productElement = this.extractFileObj(storeModel.attachList);
          model.attachList.productMarketing = this.extractFileObj(storeModel.attachList);
          Object.keys(model.attachList).forEach(attachType => {
            model.attachList[attachType] = model.attachList[attachType].filter(file => file.module === attachType);
          });
          return model;
        }
        return {};
      },
      getForms() {
        // 每行两个
        if (!this.productInfoState[this.type]) return [];
        const targetForm = this.productInfoState[this.type].fields(this);
        // 拿出产品介绍
        const form0Length = targetForm[0].formItems.length;
        const productIntro = targetForm[0].formItems[form0Length - 1];
        targetForm[0].formItems.splice(form0Length - 1, 1);
        targetForm.splice(1, 0, {
          title: '产品介绍',
          type: 'html',
          htmlValue: ''
        });
        return targetForm.map(eachForm => {
          if (eachForm.type === 'table') {
            eachForm.tableState = {
              tableColumn: eachForm.tableColumn,
              tableData: {
                records: this.formModel[eachForm.modelKey]
              }
            };
            return eachForm;
          }
          if (eachForm.type === 'html') {
            eachForm.htmlValue = this.formModel[productIntro.modelKey];
            return eachForm;
          }
          const formItems = eachForm.formItems;
          const row = [];
          let k = 0;
          for (let i = 0; i < formItems.length; i++) {
            if (!formItems[i]) continue;
            if (!row[k]) {
              row[k] = [];
            }
            row[k].push(formItems[i]);
            if (formItems[i].inputProps &&
              formItems[i].inputProps.type === 'textarea' &&
              row[k].length === 1) {
              // textarea单独占一行
              k++;
              continue;
            }
            if (row[k].length === 3) {
              k++;
            }
          }
          return {
            title: eachForm.title,
            formItems: row
          };
        });
      },
      enumArgs() {
        // 获取所有枚举类型
        return this.$store.state.argEnum || {};
      },
      type() {
        return this.$route.query.type;
      }
    },
    watch: {
      formStoreModel: {
        deep: true,
        handler() {
          // this.formModel = { ...this.formStoreModel }; // vuex里面有数组对象属性，需要深拷贝
          this.formModel = window.JSON.parse(window.JSON.stringify(this.formStoreModel));
        }
      }
    },
    async created() {
      try {
        await this.$power.checkPower(Powers.editProduct);
        this.fetchData();
      } catch (e) {
        this.$bus.$emit('close_current_tags');
      }
    },
    activated() {
      if (this.$route.query.skuId !== this.skuId) {
        this.skuId = this.$route.query.skuId;
        this.fetchData();
      }
    },
    methods: {
      initModel() {
        // 初始化form绑定字段
        const targetForm = this.productInfoState[this.type].fields(this);
        targetForm.forEach(form => {
          form.formItems.forEach(item => {
            if (typeof this.formModel[item.modelKey] === 'undefined') {
              // this.$set(this.formModel, item.modelKey, ''); // todo upload 的key要设置为数组
            }
          });
        });
      },
      handleFormChange(value) {
        this.formModel = { ...this.formModel, ...value };
      },
      // 将后端返回的文件对象转换成elementui使用的对象格式
      extractFileObj(files) {
        if (!files) return [];
        return files.map(file => {
          return {
            uid: file.fileId,
            module: file.module,
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
      async submitForm() {
        const submitData = this.$utils.jsonClone(this.formModel);
        submitData.attachList = [];
        Object.keys(this.formModel.attachList).forEach(attachKey => {
          const fileArr = this.formModel.attachList[attachKey].map(file => {
            return {
              ...file.response.data,
              module: attachKey
            };
          });
          submitData.attachList = [...submitData.attachList, ...fileArr];
        });
        let uri;
        switch (this.type) {
        case 'secondary_market':
          uri = '/product/updateSecondaryMarket';
          break;
        case 'fixed_income':
          uri = '/product/updateFixedIncome';
          break;
        case 'equity':
          uri = '/product/updateEquity';
          break;
        }
        try {
          if (submitData.moneyType === null || typeof submitData.moneyType === 'undefined') {
            this.$message.error('请填写币种类别');
            return;
          }
          await this.$fetch.setParam(uri, submitData).doRequest();
          this.$message.success('保存成功！');
          window.sessionStorage.setItem('refresh_product', '1');
          this.$bus.emit('close_current_tags');
        } catch (msg) {
          this.$message.error(msg);
        }
      },
      async fetchData() {
        const param = {
          productId: this.skuId
        };
        await this.$store.dispatch('product/getProductInfo', {
          type: this.$route.query.type,
          arg: param
        });
        this.$emit('onDataLoad');
      },
      statusArgsWithElOptionsTag(groupKey) {
        const options = Object.keys(this.enumArgs[groupKey]).map(key => {
          // 中文或者英文作为key
          if (/^[a-zA-Z0-9_]+$/.test(key)) {
            return {
              label: this.enumArgs[groupKey][key],
              value: /^\d+$/.test(key) ? parseInt(key) : key
            };
          }
        });
        return options.filter(nodes => nodes);
      }
    }
  };
</script>

<style lang="scss">
  .dy-form-item {
    .el-radio {
      margin-right: 0;
    }
  }
</style>
<style lang="scss" scoped>
  .el-form-item__label{
    font-size: 12px !important;
  }
  .menu-anchor-info{
    font-size: 16px;
    color: #EB5954;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    span{
      padding: 5px;
      border-bottom: 2px solid #EB5954;
      display: inline-block;
      margin-bottom: -2px;
    }
    &:after {
      display: block;
      background: #bbbabc;
      height: 3px;
      margin-top: 8px;
    }
  }
  .edit-wrapper {
    height: 80vh;
  }
  .el-menu-side {}
</style>

<style lang="scss">
  .el-table{
    margin-bottom: 20px;
  }
  .bottom-op {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    height: 60px;
    width: 100%;
    background: #fff;
  }
  .el-form-item__label,.el-radio__label,.el-select .el-input__inner,.el-textarea.is-disabled .el-textarea__inner{
    font-size: 12px !important;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-top: 20px;
    margin-bottom: 0;
  }

</style>
