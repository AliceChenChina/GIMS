<template>
  <el-card v-loading="isLoading">
    <info-detail-viewer
      :state="infoData"
    />
    <info-header infoTitle="产品类型"/>
    <template v-for="row in getForms">
      <dynamic-form
        ref="dy_form"
        :form="row.formItems"
        :model="formModel"
        @onFormChange="handleFormChange"
      />
    </template>
    <el-row class="tar">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-row>
  </el-card>
</template>

<script>
  import DynamicForm from 'common/DynamicForm';
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  import InfoHeader from 'common/InfoHeader';
  export default {
    name: 'modifyProductLabel',
    components: {
      DynamicForm,
      InfoDetailViewer,
      InfoHeader
    },
    data() {
      return {
        isLoading: false,
        formModel: {
        },
        headInfo: {},
        productId: this.$route.query.productId
      };
    },
    computed: {
      ...mapState({
        modifyProductLabelState: state => state.product.modifyProductLabelState,
      }),
      infoData() {
        return this.modifyProductLabelState.infoData(this.headInfo)
      },
      getForms() {
        const targetForm = this.modifyProductLabelState.fields(this);
        return targetForm.map(eachForm => {
          const formItems = eachForm.formItems;
          const row = [];
          let k = 0;
          for (let i = 0; i < formItems.length; i++) {
            if (!row[k]) {
              row[k] = [];
            }
            row[k].push(formItems[i]);
            if (row[k].length === 3) {
              k++;
            }
          }
          return {
            title: eachForm.title,
            type: eachForm.type,
            formItems: row
          };
        });
      }
    },
    created() {
      this.headInfo = {
        productName: decodeURIComponent(this.$route.query.productName),
        productNameShort: decodeURIComponent(this.$route.query.productNameShort),
        isProxy: this.$route.query.isProxy,
        productTypeName: decodeURIComponent(this.$route.query.productTypeName)
      }
      this.formModel = {
        filingType: this.$route.query.filingType,
        largeClassAssetsType: this.$route.query.largeClassAssetsType,
        openingFrequency: this.$route.query.openingFrequency,
        productLabel: this.$route.query.productLabel,
        productSubLabel: this.$route.query.productSubLabel,
        protocolBouncers: this.$route.query.protocolBouncers,
        accountType: this.$route.query.accountType
      }
      this.$store.commit('product/SET_MODIFY_PRODUCT_LABEL_VIEW');
      this.$store.commit('product/COMMIT_MODIFY_PRODUCT_LABEL_FORM_VIEWER');
    },
    activated() {
      this.productId = this.$route.query.productId;
      this.headInfo = {
        productName: decodeURIComponent(this.$route.query.productName),
        productNameShort: decodeURIComponent(this.$route.query.productNameShort),
        isProxy: this.$route.query.isProxy,
        productTypeName: decodeURIComponent(this.$route.query.productTypeName)
      }
      this.formModel = {
        filingType: this.$route.query.filingType,
        largeClassAssetsType: this.$route.query.largeClassAssetsType,
        openingFrequency: this.$route.query.openingFrequency,
        productLabel: this.$route.query.productLabel,
        productSubLabel: this.$route.query.productSubLabel,
        protocolBouncers: this.$route.query.protocolBouncers,
        accountType: this.$route.query.accountType
      }
    },
    methods: {
      handleFormChange(value) {
        this.formModel = { ...this.formModel, ...value };
        this.formModel = { ...value };
      },
      getParam() {
        const submitCopyData = JSON.parse(JSON.stringify(this.formModel));
        submitCopyData.productId = this.$route.query.productId;
        return submitCopyData;
      },
      async submitForm() {
        try {
          this.isLoading = true;
          await this.$fetch.setParam('/product/updateProductMultiType', this.getParam()).doRequest();
          this.isLoading = false;
          this.$message.success('编辑成功！');
          this.$bus.emit('close_current_tags');
        }
        catch (e) {
          this.$message.error(e);
        }
      },
      cancel(){
        this.$bus.emit('close_current_tags');
      }
    }
  };
</script>
