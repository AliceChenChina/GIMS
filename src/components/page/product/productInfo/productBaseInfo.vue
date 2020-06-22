<template>
  <el-card v-loading="loading" class="info-wrapper" style="position: relative">
    <side-menu-viewer ref="side_menu_viewer" style="height: 89%;" title-class="title-info" class="product-base">
      <info-detail-viewer :state="getDetailViewerState" />
    </side-menu-viewer>
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import SideMenuViewer from 'common/SideMenuViewer';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  export default {
    name: 'ProductBaseInfo',
    components: {
      SideMenuViewer,
      InfoDetailViewer
    },
    data() {
      return {
        formModel: {},
        loading: false
      };
    },
    computed: {
      ...mapState({
        productInfoState: state => state.product.productInfoState
      }),
      formStoreModel() {
        if (this.productInfoState[this.type]) {
          return this.productInfoState[this.type].model || {};
        }
        return {};
      },
      getDetailViewerState() {
        // 每行两个
        if (!this.productInfoState[this.type]) return [];
        const targetFields = this.productInfoState[this.type].fields(this);
        let productIntro = {};
        const renderState = targetFields.map(eachForm => {
          if (eachForm.title === '附件') return null;
          if (eachForm.type === 'table') {
            let tableColumn;
            if (eachForm.tableColumn instanceof Function) {
              tableColumn = eachForm.tableColumn(this);
            } else {
              tableColumn = eachForm.tableColumn;
            }
            return {
              type: 'table',
              title: eachForm.title,
              tableColumn,
              tableData: this.formStoreModel[eachForm.modelKey]
            };
          }
          const formItems = eachForm.formItems;
          const row = [];
          let k = 0;
          for (let i = 0; i < formItems.length; i++) {
            if (!formItems[i]) continue;
            if (!row[k]) {
              row[k] = [];
            }
            const formItem = formItems[i];
            if (formItem.formLabel.indexOf('产品介绍') >= 0) {
              productIntro = formItem;
              continue;
            }
            if (formItem.inputTag === 'el-select' || formItem.inputTag === 'el-radio-group') {
              // 选择框和单选框取出枚举值
              let formItemValue = this.$utils.objStrGet(this.formStoreModel, formItem.modelKey);
              if (/\d+/.test(formItemValue)) {
                formItemValue = parseInt(formItemValue);
              }
              formItem.inputTagOptions.forEach(option => {
                let value = option.value;
                if (/\d+/.test(value)) {
                  value = parseInt(value);
                }
                if (value === formItemValue) {
                  formItemValue = option.label;
                }
              });
              row[k].push({
                label: formItem.formLabel,
                value: formItemValue
              });
            } else {
              row[k].push({
                label: formItems[i].formLabel,
                value: this.$utils.objStrGet(this.formStoreModel, formItems[i].modelKey)
              });
            }
            if (row[k].length === 2) {
              k++;
            }
          }
          return {
            type: 'basic',
            title: eachForm.title,
            rows: row
          };
        }).filter(item => item);
        renderState.splice(1, 0, {
          type: 'html',
          title: '产品介绍',
          content: this.$utils.objStrGet(this.formStoreModel, productIntro.modelKey)
        });
        return renderState;
      },
      enumArgs() {
        // 获取所有枚举类型
        return this.$store.state.argEnum || {};
      },
      type() {
        return this.$route.query.type;
      }
    },
    async mounted() {
      await this.fetchData();
    },
    activated() {
      this.$refs.side_menu_viewer.resetDefaultActive();
      setTimeout(() => {
        if (window.sessionStorage.getItem('refresh_product')) {
          this.fetchData();
          window.sessionStorage.removeItem('refresh_product');
        }
      }, 500);
    },
    methods: {
      statusArgsWithElOptionsTag(groupKey) {
        const options = Object.keys(this.enumArgs[groupKey]).map(key => {
          // 中文或者英文作为key
          if (/^[a-zA-Z0-9]+$/.test(key)) {
            return {
              label: this.enumArgs[groupKey][key],
              value: /^\d+$/.test(key) ? parseInt(key) : key
            };
          }
        });
        return options.filter(nodes => nodes);
      },
      async fetchData() {
        const param = {
          productId: this.$route.query.skuId
        };
        this.loading = true;
        await this.$store.dispatch('product/getProductInfo', {
          type: this.$route.query.type,
          arg: param
        });
        this.loading = false;
        this.$emit('onDataLoad');
      }
    }
  };
</script>

<style scoped>
  .info-wrapper {
    height: 72vh;
  }
</style>

<style lang="scss">
  .product-base {
    .content-info-title {
      width: 160px !important;
    }
  }
</style>
