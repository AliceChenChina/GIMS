<template>
  <el-card v-loading="isLoading" class="benefit-box-card">
    <list-viewer
      ref="list_viewer"
      :state="getCurrentViewerType()"
      :context="this"
      @onFetchData="fetchData"
      @onSelectionChange="handleSelectionChange"
    />
    <!--编辑分配弹框-->
    <el-dialog
      v-loading="dialogLoading"
      title="编辑"
      :visible.sync="showEdit"
      width="50%"
    >
      <info-detail-viewer
        :state="editDialogTextState"
      />
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="150px">
        <template v-if="type === 'apportionment'">
          <!--股权-->
          <el-form-item label="分配日期" prop="incomeDate">
            <el-date-picker v-model="editForm.incomeDate" value-format="yyyy-MM-dd" style="width: 60%" />
          </el-form-item>
          <el-form-item label="分配本金百分比" prop="quitPercent">
            <el-input v-model="editForm.quitPercent" style="width: 60%" />%
          </el-form-item>
          <el-form-item label="退出本金（万元）" prop="allocatePrincipal">
            <el-input v-model="editForm.allocatePrincipal" style="width: 60%" prop="payAmount" />万元
          </el-form-item>
          <el-form-item label="分配金额" prop="payAmount">
            <el-input v-model="editForm.payAmount" style="width: 60%" prop="payAmount" />万元
          </el-form-item>
        </template>
        <template v-else>
          <!--固收-->
          <el-form-item label="结算日" prop="incomeDate">
            <el-date-picker v-model="editForm.incomeDate"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            style="width: 60%"
            />
          </el-form-item>
          <el-form-item label="收益率" prop="incomeRate">
            <el-input v-model="editForm.incomeRate" style="width: 60%" />%
          </el-form-item>
          <el-form-item label="兑付本金" prop="allocatePrincipal">
            <el-input v-model="editForm.allocatePrincipal" style="width: 60%" prop="payAmount" />万元
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="updateData(getUpdateParam())">确 定</el-button>
      </span>
    </el-dialog>
    <input id="file_upload" type="file" style="display: none" @change="uploadImportIncomes">
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import listViewer from 'common/ListViewer';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  export default {
    name: 'BenefitsList',
    components: {
      listViewer,
      InfoDetailViewer
    },
    data() {
      return {
        isLoading: false,
        dialogLoading: false,
        skuId: this.$route.query.skuId,
        editForm: {
          allocatePrincipal: '', // 兑付本金（万元）
          payAmount: '', // 利息,分配金额
          incomeRate: '', // 收益率
          incomeDate: '', // 分配日期
          quitPercent: '', // 分配本金百分比
          userName: '', // 客户名称
          userPin: '', // 京东用户名
          identificationNo: '', // 身份证号
          planner: ''
        },
        editFormRules: {
          incomeRate: [
            { required: true, message: '请正确填写百分比', trigger: 'blur' },
            { validator: this.checkNumberInput, trigger: 'blur' }
          ],
          allocatePrincipal: [
            { required: true, message: '请正确填写本金', trigger: 'blur' },
            { validator: this.checkNumberInput, trigger: 'blur' }
          ],
          quitPercent: [
            { required: true, message: '请正确填写分配本金百分比', trigger: 'blur' },
            { validator: this.checkNumberInput, trigger: 'blur' }
          ],
          payAmount: [
            { required: true, message: '请正确填写分配金额', trigger: 'blur' },
            { validator: this.checkNumberInput, trigger: 'blur' }
          ],
          incomeDate: [{ required: true, message: '请填写日期', trigger: 'blur' }]
        },
        showEdit: false,
        upload: {},
        selectedList: []
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.product.benefitsListViewerState
      }),
      type() {
        if (this.$route.name === 'benefitsListInterest') {
          // 固收产品
          return 'interest';
        }
        if (this.$route.name === 'benefitsListApportionment') {
          // 股权产品
          return 'apportionment';
        }
        return 'interest';
      },
      editDialogTextState() {
        return [{
          type: 'basic',
          title: '',
          rows: [
            [
              {
                label: '客户名称：',
                value: this.editForm.userName
              },
              {
                label: '京东用户名：',
                value: this.editForm.userPin
              }
            ],
            [
              {
                label: '身份证号：',
                value: this.editForm.identificationNo
              },
              {
                label: '首次触达时间：',
                value: this.editForm.planner
              }
            ]
          ]
        }];
      }
    },
    created() {
      this.upload = this.$upload.getUploadInstance('benefits_upload');
      this.upload.setUploadHandler(this.uploadImportIncomes);
      this.upload.setTypeLimit(['xls', 'xlsx']);
      this.upload.setTypeLimitErrorHandler(this.onTypesError);
      this.fetchData();
    },
    activated() {
      if (this.$route.query.skuId !== this.skuId) {
        this.skuId = this.$route.query.skuId;
        this.fetchData();
      }
    },
    methods: {
      edit(row) {
        this.showEdit = true;
        setTimeout(() => {
          this.editForm.id = row.id;
          this.$refs.editForm.resetFields();
          this.editForm = { ...row };
          Object.keys(this.editForm).forEach(key => {
            if (key === 'quitPercent' ||
              key === 'incomeRate' ||
              key === 'allocatePrincipal' ||
              key === 'payAmount'
            ) {
              if (row[key]) {
                this.editForm[key] = parseFloat(row[key]);
              }
            } else {
              this.editForm[key] = row[key];
            }
          });
        });
      },
      onTypesError(validTypes) {
        this.$message.error(`只有${validTypes.join(',')}文件类型可以上传`);
      },
      delete(row) {
        this.$alert(
          {
            msg: '是否确认删除该条记录',
            onConfirm: async() => {
              const param = {
                id: row.id,
                yn: 0
              };
              this.submitDataUpdate(param);
            }
          }
        );
      },
      downloadTemplate() {
        window.open(this.$fetch.getBasePath() + '/customerIncome/exportTemplate?skuId=' + this.skuId);
      },
      getUpdateParam() {
        const param = { ...this.editForm };
        param.incomeDate += ' 00:00:00';
        param.yn = 1;
        if (param.incomeRate !== '') {
          param.incomeRate = Number(param.incomeRate) / 100;
        }
        // 分配本金百分比转为小数传后台
        if (param.quitPercent !== '') {
          param.quitPercent = Number(param.quitPercent) / 100;
        }
        return param;
      },
      // 保存编辑的数据
      async updateData(param) {
        this.$refs.editForm.validate(async(valid) => {
          if (valid) {
            this.submitDataUpdate(param);
          }
        });
      },
      async submitDataUpdate(param) {
        const uri = '/customerIncome/update';
        this.dialogLoading = true;
        try {
          this.dialogLoading = true;
          await this.$fetch.setParam(uri, param).doRequest();
          this.$message.success('操作成功！');
          this.fetchData();
          this.showEdit = false;
        } catch (msg) {
          this.$message.error(msg);
        }
        this.dialogLoading = false;
      },
      getCurrentViewerType() {
        if (this.type && !this.viewerState[this.type]) {
          // 若不存在state结构进行初始化
          this.$store.commit('product/SET_BENEFITS_VIEWER_STATE', this.type);
          // 加载第一页数据
          // todo 切换state加载了两次
          this.fetchData();
        }
        return this.viewerState[this.type];
      },
      async fetchData() {
        this.isLoading = true;
        const arg = {
          type: this.type,
          arg: this.getLoadParam()
        };
        await this.$store.dispatch('product/benefitsDetailQuery', arg);
        this.isLoading = false;
      },
      getLoadParam() {
        const state = this.getCurrentViewerType();
        return {
          skuId: this.skuId,
          ...state.filterModel,
          ...state.paginationState.getAjaxParam()
        };
      },
      goToDurationList(e) {
      },
      goToBenefitList(row) {
      },
      checkNumberInput(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入值'));
        }
        const pattern = /^\d+(\.\d{0,2})?$/;
        if (!pattern.test(value)) {
          callback(new Error('请输入有效数字,最多保留2位小数'));
        }
        callback();
      },
      importIncomes() {
        this.upload.triggerUpload();
      },
      handleSelectionChange(list) {
        this.selectedList = list;
      },
      sendBenefitsList() {
        if (!this.selectedList.length) {
          this.$message.error('请选择一个产品');
          return;
        }
        const uri = '/redeemTrade/confirm/push';
        const idStr = this.selectedList.map(item => (
          item.uuid
        )).join(',');
        const param = { incomeIds: idStr };
        this.$alert({
          msghtml: '<div>推送成功后，将无法删除和编辑收益记录，客户持仓将根据分配明细进行调整，且归属理财师将收到消息提醒</div><p style="color:#999999;margin-top:10px">是否确认明细正确并推送给理财师及客户？</p>',
          onConfirm: async() => {
            try {
              await this.$fetch.setParam(uri, param).doRequest();
              this.$message.success('操作成功！');
              this.fetchData();
            } catch (msg) {
              this.$message.error(msg);
            }
          }
        });
      },
      async uploadImportIncomes(file) {
        const uri = '/customerIncome/importIncomes';
        const form = new FormData();
        form.append('file', file);
        form.append('skuId', this.skuId);
        this.isLoading = true;
        try {
          await this.$fetch.setParam(uri, form).doRequest();
          this.isLoading = false;
          this.$message.success('操作成功！');
          this.upload.clearFile();
          this.fetchData();
        } catch (msg) {
          this.upload.clearFile();
          this.isLoading = false;
          this.$message.error(msg);
        }
      }
    }
  };
</script>

<style lang="scss">
  .benefit-box-card {
    .op {
      color: red;
    }
    .edit-disabled {
      color: gray;
    }
  }
</style>
