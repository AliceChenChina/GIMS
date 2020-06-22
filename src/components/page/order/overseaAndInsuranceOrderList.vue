<template>
  <el-card class="box-card">
    <list-viewer
      v-loading="isLoading"
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
      @onSelectionChange="handleSelectionChange"
    />
    <input id="file_upload" type="file" style="display: none" @change="uploadImportIncomes">
    <el-dialog
      v-loading="dialogLoading"
      title="编辑"
      :visible.sync="showEdit"
      width="50%"
    >
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="150px">
        <el-form-item label="理财师：" prop="empName">
          <el-autocomplete
            v-model="editForm.empName"
            :fetch-suggestions="querySearch"
            placeholder="请输入理财师姓名"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="房号：">
          <el-input v-model="editForm.roomNo"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="updateData()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewerLevel2';
  import { mapState } from 'vuex';
  export default {
    name: 'OverseaAndInsuranceOrderList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        shouldUpdateData: false,
        upload: {},
        selectedList: [],
        dialogLoading: false,
        showEdit: false,
        editForm: {
          empName: '', // 理财师
          roomNo: '', // 房号
          deptName: '' // deptName
        },
        editFormRules: {
          empName: [
            { required: true, message: '理财师名称不能为空', trigger: 'change' }
          ]
        },
        eptData: []
      }
    },
    computed: {
      ...mapState({
        viewerState: state => state.order.overseaAndInsuranceOrderList
      })
    },
    created() {
      this.$store.commit('order/COMMIT_OVERSEA_AND_INSURANCE_ORDER_LIST');
      this.upload = this.$upload.getUploadInstance('');
      this.upload.setUploadHandler(this.uploadImportIncomes);
      this.upload.setTypeLimit(['xls', 'xlsx']);
      this.upload.setTypeLimitErrorHandler(this.onTypesError);
      this.fetchData();
      this.getEptData();
    },
    activated() {
      if (this.shouldUpdateData) {
        this.fetchData();
        this.shouldUpdateData = false;
      }
    },
    methods: {
      // 理财师信息
      async getEptData() {
        try {
          this.isLoading = true;
          const res = await this.$fetch.setParam('/systemSetting/employee/query', { pageSize: 9999 }).doRequest();
          this.eptData = res ? res.records : [];
          this.eptData = this.handleEptData(this.eptData);
        } catch (msg) {
          this.$message.error(msg);
        }
        this.isLoading = false;
      },
      handleEptData(data) {
        const arr = [];
        data.forEach(item => {
          if (item.name) {
            arr.push({ value: item.name, deptName: item.deptNames });
          }
        });
        return arr;
      },
      querySearch(queryString, cb) {
        const results = queryString ? this.eptData.filter(this.createFilter(queryString)) : this.eptData;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.editForm.empName = item.value;
        this.editForm.deptName = item.deptName;
      },
      // 保存编辑的数据
      async updateData() {
        const param = {
          djId: this.editForm.djId,
          roomNo: this.editForm.roomNo,
          empName: this.editForm.empName,
          deptName: this.editForm.deptName
        };
        this.$refs.editForm.validate(async(valid) => {
          if (valid) {
            const uri = '/trade/editRealStateInsurance';
            try {
              const res = await this.$fetch.setParam(uri, param).doRequest();
              if (res.code === 0) {
                this.$message.success(res.message);
                this.fetchData();
                this.showEdit = false;
              } else {
                this.$message.error(res.message);
              }
            } catch (msg) {
              this.$message.error(msg);
            }
          }
        });
      },
      edit(row) {
        this.showEdit = true;
        this.editForm = {
          djId: row.djId,
          roomNo: row.roomNo,
          empName: row.empName,
          deptName: row.deptName
        };
      },
      delete(row) {
        this.$alert(
          {
            msg: '是否确认删除该订单',
            onConfirm: async() => {
              const param = {
                djId: row.djId
              };
              const uri = '/trade/deleterRealStateInsurance';
              try {
                this.isLoading = true;
                const res = await this.$fetch.setParam(uri, param).doRequest();
                this.isLoading = false;
                this.$message.success(res.message);
                this.fetchData();
              } catch (msg) {
                this.isLoading = false;
                this.$message.error(msg);
              }
            }
          }
        );
      },
      downloadTemplate() {
        window.open(this.$fetch.getBasePath() + '/file/downloadHwBxTemplate');
      },
      importOrder() {
        this.upload.triggerUpload();
      },
      handleSelectionChange(list) {
        this.selectedList = list;
      },
      async confirmOrder() {
        if (!this.selectedList.length) {
          this.$message.error('请选择一个项目');
          return;
        }
        for (let i = 0; i < this.selectedList.length; i++) {
          if (this.selectedList[i].errorMsg) {
            this.$message.error('验证错误，无法导入！');
            return;
          }
        }
        const uri = '/trade/confirmImportRealStateInsuranceList';
        const idStr = this.selectedList.map(item => (
          item.djId
        )).join(',');
        const param = { djIds: idStr };
        try {
          const res = await this.$fetch.setParam(uri, param).doRequest();
          this.$message.success('操作成功！');
          this.fetchData();
        } catch (msg) {
          this.$message.error(msg);
        }
      },
      async uploadImportIncomes(file) {
        const uri = '/trade/importRealStateInsuranceOrder';
        const form = new FormData();
        form.append('file', file);
        this.isLoading = true;
        const res = await this.$fetch.setParam(uri, form).doRequest();
        if (res.code === 0) {
          this.$message.success(res.message);
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
        this.upload.clearFile();
        this.isLoading = false;
      },
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('order/getOverseaAndInsuranceList', this.getLoadParam());
        this.isLoading = false;
      },
      // 导出excel数据
      doExport() {
        if (this.viewerState.tableData.records.length === 0) {
          this.$message.error('无数据，无法导出');
          return;
        }
        const uri = '/trade/exportRealStateInsuranceList';
        this.viewerState.filterModel.empId = this.$store.state.userInfo.userId;
        const arg = this.$utils.jsonClone(this.viewerState.filterModel);
        const query = this.$utils.queryString.stringify(arg);
        window.open(`${this.$fetch.getBasePath()}${uri}?${query}`);
      }
    }
  };
</script>
<style lang="scss">
  .red {
    color: red;
  }
  .red:hover {
    cursor: pointer;
  }
  .el-autocomplete {
    width: 100%;
  }
</style>
