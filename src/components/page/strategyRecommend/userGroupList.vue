<template>
  <el-card class="box-card" v-loading="isLoading">
    <div class="mb10"> <el-button size="small" type="primary" @click="add">添加组</el-button></div>
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
    <el-dialog
      v-loading="isLoading"
      title="新增分组"
      :visible.sync="showEdit"
      width="50%"
    >
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="150px">
        <el-form-item label="分组名称：" prop="groupName">
          <el-input v-model="editForm.groupName"/>
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
  import { ActivityResultWrapper } from '@/api/ResultWrapper';
  import FetchApiFactory from '@/api/fetchApi';
  import { mapState } from 'vuex';
  export default {
    name: 'UserGroupList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        shouldUpdateData: false,
        showEdit: false,
        editForm: {
          groupName: '' // 分组名称
        },
        editFormRules: {
          groupName: {required: true, message: '分组名称不能为空', trigger: 'blur'}
        }
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.strategyRecommend.userGroupListState
      })
    },
    created() {
      const resultWrapper = new ActivityResultWrapper();
      this.requestInstance = FetchApiFactory.getFetchInstance('/userGroup', false, resultWrapper);
    },
    mounted() {
      this.$store.commit('strategyRecommend/COMMIT_USER_GROUP_LIST_VIEWER');
      this.fetchData();
    },
    activated() {
      if (this.shouldUpdateData) {
        this.fetchData();
        this.shouldUpdateData = false;
      }
    },
    methods: {
      getLoadParam() {
        const state = this.viewerState;
        return {...state.filterModel, ...state.paginationState.getAjaxParam()};
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('strategyRecommend/getUserGroupList', this.getLoadParam());
        this.isLoading = false;
      },
      check(row, status) {
        this.shouldUpdateData = true;
        console.log('status', status);
        this.$router.push({
          name: 'editUserGroupInfo',
          query: {
            id: row.id,
            status: status,
            groupName: encodeURIComponent(row.groupName)
          }
        });
      },
      delete(row) {
        this.$alert({
          msg: '确认要删除这个客户分组吗',
          onConfirm: async() => {
            try {
              this.loading = true;
              let param = {oprType: 3, id: row.id};
              await this.requestInstance.setParam('/deleteData', param).doRequest();
              this.loading = false;
              this.$message.success('操作成功！');
              this.showEdit = false;
              this.fetchData();
            } catch (msg) {
              this.$message.error(msg);
            }
            this.loading = false;
          }
        });
      },
      // 添加分组
      add() {
        this.showEdit = true;
        this.editForm.groupName = '';
        this.$refs['editForm'].resetFields();
      },
      // 保存编辑的数据
      async updateData() {
        const param = this.editForm;
        param.oprType = 1;
        this.$refs.editForm.validate(async (valid) => {
          if (valid) {
            try {
              this.loading = true;
              console.log('param', param);
              await this.requestInstance.setParam('/insertData', param).doRequest();
              this.loading = false;
              this.$message.success('操作成功！');
              this.showEdit = false;
              this.fetchData();
            } catch (msg) {
              this.$message.error(msg);
            }
            this.loading = false;
          }
        });
      }
    }
  }
</script>
<style scoped lang="scss">
  .able {
    color: #F52020;
    cursor: pointer;
  }
  .disable {
    color: #cccccc;
    cursor: not-allowed;
  }
  /deep/ .custom-el-filter .el-custom-filter {
  max-width: 400px;
  }
  /deep/ .custom-el-filter .el-custom-filter input {
    width: 300px;
  }
  /deep/ .pagination {
    display: none
  }
</style>
