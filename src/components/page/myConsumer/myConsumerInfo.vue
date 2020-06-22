<template>
  <el-card v-loading="isLoading">
    <template v-for="(row, index) in getForms">
      <div :key="index" class="title-info mt25 mgb20">
        <span>{{ row.title }}</span>
      </div>
      <dynamic-form
        v-if="row.type === 'form'"
        ref="dy_form"
        :form="row.formItems"
        :model="formModel"
        @onFormChange="handleFormChange"
      />
    </template>
    <div v-if="status && status !== 'check'" class="tac mt20">
      <el-button type="primary" @click="submitForm(getParam())">提交</el-button>
    </div>
    <info-detail-viewer
      v-if="status && status !== 'add' && userPin"
      :state="jdInfo"
    />
    <div v-if="status && status !== 'add'">
      <div class="title-info mb10">
        <span>更多联系方式</span>
      </div>
      <div class="mb10"><el-button v-if="status && status !== 'check'" type="primary" @click="addLinkMan">新建联系方式</el-button></div>
      <dynamic-table
        :column="linkInfo"
        :data="linkInfoTableData"
      ></dynamic-table>
    </div>
    <div v-if="status && status !== 'add'">
      <div class="title-info mb10">
        <span>跟进记录</span>
      </div>
      <div class="mb10"><el-button v-if="status && status !== 'check'" type="primary" @click="addFowlling">添加记录</el-button></div>
      <dynamic-table
        :column="followInfo"
        :data="followInfoTableData"
      ></dynamic-table>
    </div>
    <div v-if="status && status !== 'add' && relationType !== 0">
      <div class="title-info mb10">
        <span>leads信息</span>
      </div>
      <dynamic-table
        :column="leadsInfo"
        :data="leadsInfoTableData"
      ></dynamic-table>
    </div>
    <div v-if="status && status !== 'add'">
      <el-dialog
        title="添加更多联系方式"
        :visible.sync="controlLinkShow"
      >
        <dynamic-form
          ref="link_form"
          :form="linkForm"
          :model="linkModel"
          @onFormChange="handleLinkFormChange"
        />
        <el-row class="save bottom-op" justify="center">
          <el-button type="danger" size="large" @click="saveLink">保存</el-button>
          <el-button size="large" @click="cancleLink">取消</el-button>
        </el-row>
      </el-dialog>
    </div>
    <EditConsumerVisit ref="editList" dialog-type="add" :form-value="followingParam" :contact-disable="true" @reloadData="reloadData"></EditConsumerVisit>
    <div v-if="status && status !== 'add' && relationType !== 0">
      <div class="title-info mb10">
        <span>持仓信息</span>
      </div>
      <TotalAssetsList :pinCode="$route.query.userPin" v-if="status && status !== 'add' && $route.query.relationType != 0"/>
    </div>
  </el-card>
</template>

<script>
  import DynamicForm from 'common/DynamicForm';
  import DynamicTable from 'common/DynamicTable.vue';
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  import EditConsumerVisit from 'page/myConsumer/editConsumerVisit';
  import TotalAssetsList from 'page/myConsumer/totalAssetsList';
  export default {
    name: 'MyConsumerInfo',
    components: {
      DynamicForm,
      InfoDetailViewer,
      DynamicTable,
      EditConsumerVisit,
      TotalAssetsList
    },
    data() {
      return {
        isLoading: false,
        formModel: {},
        linkModel: {},
        status: this.$route.query.status,
        userPin: this.$route.query.userPin,
        customerId: this.$route.query.customerId,
        id: this.$route.query.id,
        controlLinkShow: false,
        rowId: 0,
        contrlVisitShow: false,
        jdInfo: [],
        relationType: this.$route.query.relationType
      };
    },
    computed: {
      ...mapState({
        myConsumerInfoState: state => state.myConsumer.myConsumerInfoState,
        preposeAddState: state => state.myConsumer.preposeAddState
      }),
      jdInfoState() {
        return this.myConsumerInfoState.jdInfo ? this.myConsumerInfoState.jdInfo : [];
      },
      linkInfo() {
        return this.myConsumerInfoState.linkInfo ? this.myConsumerInfoState.linkInfo(this) : [];
      },
      linkInfoTableData() {
        return this.myConsumerInfoState.linkInfoTableData ? this.myConsumerInfoState.linkInfoTableData : [];
      },
      followInfo() {
        return this.myConsumerInfoState.followInfo ? this.myConsumerInfoState.followInfo : [];
      },
      followInfoTableData() {
        return this.myConsumerInfoState.followInfoTableData ? this.myConsumerInfoState.followInfoTableData : [];
      },
      leadsInfo() {
        return this.myConsumerInfoState.leadsInfo ? this.myConsumerInfoState.leadsInfo(this) : [];
      },
      leadsInfoTableData() {
        return this.myConsumerInfoState.leadsInfoTableData ? this.myConsumerInfoState.leadsInfoTableData : [];
      },
      followingParam() {
        return { customerSalesDto: { contact: this.formModel.contact, customerId: this.customerId } };
      },
      getCustomerFrom() {
        return this.myConsumerInfoState.initData.source;
      },
      getCustomerReferPin() {
        return this.myConsumerInfoState.initData.referPin;
      },
      getForms() {
        const targetForm = this.myConsumerInfoState.fields(this);
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
      },
      linkForm() {
        const targetForm = this.myConsumerInfoState.linkForm(this);
        const row = [];
        let k = 0;
        for (let i = 0; i < targetForm.length; i++) {
          if (!row[k]) {
            row[k] = [];
          }
          row[k].push(targetForm[i]);
          if (row[k].length === 2) {
            k++;
          }
        }
        return row;
      },
      formStoreModel() {
        if (this.myConsumerInfoState) {
          return { ...this.myConsumerInfoState.initData };
        }
        return {};
      },
      linkStoreModel() {
        if (this.myConsumerInfoState) {
          return this.myConsumerInfoState.likInitData;
        }
        return {};
      }
    },
    watch: {
      formStoreModel: {
        deep: true,
        handler() {
          this.formModel = { ...this.formStoreModel };
          this.formModel = window.JSON.parse(window.JSON.stringify(this.formStoreModel));
        }
      },
      linkStoreModel: {
        deep: true,
        handler() {
          // this.$utils.jsonClone
          this.linkModel = window.JSON.parse(window.JSON.stringify(this.linkStoreModel));
        }
      },
      jdInfoState: {
        deep: true,
        handler() {
          if (this.jdInfoState instanceof Array) {
            this.jdInfo = this.jdInfoState;
          }
        }
      }
    },
    created() {
      this.$store.commit('myConsumer/COMMIT_DECLARATION_FORM_VIEWER');
      this.$store.commit('myConsumer/COMMIT_LINK_FORM_VIEWER');
      if (this.status && this.status !== 'add') {
        this.$store.commit('myConsumer/COMMIT_JD_VIEWER');
        this.getConsumerInfos();
        // this.getCustomerLink();
      }
    },
    activated() {
      // 表单验证初始化
      this.$refs.dy_form[0].resetFields();
      if (this.$route.query.customerId === this.customerId && this.$route.query.status === this.status && this.$route.query.userPin === this.userPin) {
        return false;
      }
      this.customerId = this.$route.query.customerId;
      this.status = this.$route.query.status;
      this.userPin = this.$route.query.userPin;
      this.id = this.$route.query.id;
      this.relationType = this.$route.query.relationType;
      this.$store.commit('myConsumer/COMMIT_DECLARATION_FORM_VIEWER');
      this.$store.commit('myConsumer/COMMIT_LINK_FORM_VIEWER');
      if (this.status && this.status !== 'add') {
        this.$store.commit('myConsumer/COMMIT_JD_VIEWER');
        this.getConsumerInfos();
      }
    },
    methods: {
      getConsumerInfos() {
        this.getConsumerBasicInfo();
        this.getCustomerLinkInfo();
        this.getJdInfo();
      },
      async getConsumerBasicInfo() {
        this.isLoading = true;
        await this.$store.dispatch('myConsumer/getConsumerBasicInfo', { id: this.id });
        this.isLoading = false;
      },
      async getCustomerLinkInfo() {
        this.isLoading = true;
        await this.$store.dispatch('myConsumer/getCustomerLinkInfo', { pageNumber: 1, customerSaleId: this.id, pageSize: 99999 });
        this.isLoading = false;
      },
      async getJdInfo() {
        this.isLoading = true;
        await this.$store.dispatch('myConsumer/getJdInfo', { userId: this.customerId, customerSalesId: this.id, maskFlag: '1' });
        this.isLoading = false;
      },
      handleLinkFormChange(value) {
        this.linkModel = { ...this.linkModel, ...value };
        this.linkModel = { ...value };
      },
      handleFormChange(value) {
        this.formModel = { ...this.formModel, ...value };
        this.formModel = { ...value };
      },
      getParam() {
        const submitCopyData = JSON.parse(JSON.stringify(this.formModel));
        submitCopyData.timeless = submitCopyData.timeless ? 1 : 0;
        submitCopyData.province = submitCopyData.areaAddress.length > 1 ? submitCopyData.areaAddress.join(',') : '';
        return submitCopyData;
      },
      submitForm(submitData) {
        this.$refs.dy_form[0].getFormValidate()(async valid => {
          if (!valid) {
            this.$message.error('有未通过的验证！');
            return false;
          }
          const preposeParam = {
            pinCode: submitData.pinCode,
            contact: submitData.contact,
            mobilePhone: submitData.mobilePhone,
            id: this.id
          };
          if (this.userPin) {
            await this.preposeEditCustomer(preposeParam, submitData);
            return false;
          }
          await this.preposeAddCustomer(preposeParam, submitData);
        });
      },
      async preposeAddCustomer(preposeParam, submitData) {
        this.isLoading = true;
        await this.$store.dispatch('myConsumer/preposeAddCustomer', preposeParam);
        if (this.preposeAddState.code === 0) {
          this.addCustomer();
        } else if (this.preposeAddState.code && this.preposeAddState.code === 1104) {
          this.conformDialog(this.preposeAddState.message, false, '确定', this.addCustomer);
        } else if (this.preposeAddState.code && this.preposeAddState.code === 1103) {
          this.conformDialog(this.preposeAddState.message, true, '确定', this.addCustomer);
        } else {
          this.isLoading = false;
          this.conformDialog(this.preposeAddState.message, false, '我知道了');
        }
      },
      async preposeEditCustomer(preposeParam, submitData) {
        this.isLoading = true;
        await this.$store.dispatch('myConsumer/preposeEditCustomer', preposeParam);
        if (this.preposeAddState.code === 0) {
          this.editCustomer();
        } else if (this.preposeAddState.code && this.preposeAddState.code === 1103) {
          this.conformDialog(this.preposeAddState.message, true, '确定', this.editCustomer);
        } else {
          this.isLoading = false;
          this.conformDialog(this.preposeAddState.message, false, '我知道了');
        }
      },
      conformDialog(content, ifShowCancelButton, confirmButtonText, succFn) {
        const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: content,
          showCancelButton: ifShowCancelButton,
          confirmButtonText: confirmButtonText,
          cancelButtonText: '取消'
        }).then(() => { succFn && succFn(); }).catch(action => {
          this.isLoading = false;
        });
      },
      async addCustomer() {
        try {
          const res = await this.$fetch.setParam('/customerList/v2/addCustomer', this.getParam()).doRequest();
          this.conformDialog(res.msg, false, '我知道了', () => {
            this.$bus.emit('close_current_tags');
          });
        } catch (msg) {
          this.$message.error(msg);
        }
        this.isLoading = false;
      },
      async editCustomer() {
        try {
          await this.$fetch.setParam('/customerList/v2/editCustomer', this.getParam()).doRequest();
          this.$message.success('编辑成功！');
          this.$bus.emit('close_current_tags');
        } catch (msg) {
          this.$message.error(msg);
        }
        this.isLoading = false;
      },
      checkLeads(row) {
        // 查看leads详情
        // todo 测试id20025
        this.$router.push({
          name: 'leadsDetail',
          query: {
            id: row.id
          }
        });
      },
      saveLink() {
        this.$refs.link_form.getFormValidate()(async valid => {
          if (!valid) {
            this.$message.error('有未通过的验证！');
            return false;
          }
          let submitCopyData = JSON.parse(JSON.stringify(this.linkModel));
          submitCopyData = { ...submitCopyData, ...{ customerSaleId: this.id }, ...{ customerId: this.customerId } };
          if (submitCopyData.areaAddress && submitCopyData.areaAddress.length > 0) {
            submitCopyData.prov = submitCopyData.areaAddress[0];
            if (submitCopyData.areaAddress.length > 1) {
              submitCopyData.city = submitCopyData.areaAddress[1];
            }
            if (submitCopyData.areaAddress.length > 2) {
              submitCopyData.area = submitCopyData.areaAddress[2];
            }
          }
          if (!submitCopyData.id) {
            for (let i = 0; i < this.linkInfoTableData.length; i++) {
              if (this.linkInfoTableData[i].mobilephone === submitCopyData.mobilephone) {
                this.$message.error('该手机号客户您已经添加过，请勿重复添加！');
                return false;
              }
            }
          }
          this.addSaveLink(submitCopyData);
        });
      },
      async addSaveLink(submitCopyData) {
        this.isLoading = true;
        try {
          await this.$fetch.setParam('/customerLinkman/save', submitCopyData).doRequest();
          this.getCustomerLinkInfo();
          this.linkModel = {};
          this.controlLinkShow = false;
          this.$message.success('保存成功！');
        } catch (msg) {
          this.$message.error(msg);
        }
        this.isLoading = false;
      },
      editLink(row) {
        row.areaAddress = [];
        if (row.prov) {
          row.areaAddress.push(row.prov);
        }
        if (row.city) {
          row.areaAddress.push(row.city);
        }
        if (row.area) {
          row.areaAddress.push(row.area);
        }
        this.linkModel = window.JSON.parse(window.JSON.stringify(row));
        this.controlLinkShow = true;
      },
      cancleLink() {
        this.linkModel = {};
        this.controlLinkShow = false;
      },
      deleteLink(row) {
        this.conformDialog('确认要删除该条数据吗？', true, '确定', this.deleteLinkData);
        this.rowId = row.id;
      },
      async deleteLinkData() {
        this.isLoading = true;
        try {
          await this.$fetch.setParam('/customerLinkman/delete', { id: this.rowId }).doRequest();
          this.getCustomerLinkInfo();
          this.$message.success('删除成功！');
        } catch (msg) {
          this.$message.error(msg);
        }
        this.isLoading = false;
      },
      addLinkMan() {
        this.controlLinkShow = true;
      },
      addFowlling() {
        this.$refs.editList.openDialoag();
      },
      reloadData() {
        this.getJdInfo();
      }
    }
  };
</script>
<style lang="scss" scoped>
  /*.box-card .el-card__body{*/
  /*  width: 500px;*/
  /*}*/
  .menu-anchor-info{
    font-size: 16px;
    color: #EB5954;
    font-weight: bold;
    padding-bottom: 30px;
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
  .title-info{
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
</style>
