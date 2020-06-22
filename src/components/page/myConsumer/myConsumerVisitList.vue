<template>
  <el-card>
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    >
      <div slot="before-filter" style="margin-bottom: 10px">
        <el-row>
          <el-button type="danger" @click="addVisit">新建拜访记录</el-button>
        </el-row>
      </div>
    </list-viewer>
    <edit-consumer-visit ref="editList" :dialog-type="dialogType" :form-value="formModel" @reloadData="fetchData"></edit-consumer-visit>
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewer';
  import { mapState } from 'vuex';
  import fetchApi from '@/api/fetchApi';
  import editConsumerVisit from 'page/myConsumer/editConsumerVisit';
  import { Powers } from '@/utils/powers';

  export default {
    name: 'MyConsumerVisit',
    components: {
      listViewer,
      editConsumerVisit
    },
    data() {
      return {
        dialogType: 'add',
        formModel: {}
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.myConsumer.visitListState
      })
    },
    mounted() {
      // 初始化筛选框的查询
      this.$store.commit('myConsumer/COMMIT_VIST_LIST_VIEWER_STATE');
      this.fetchData();
    },
    activated() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        // 获取ajax的arg值
        const params = this.getLoadParam();
        await this.$store.dispatch('myConsumer/getMyConsumerVisitList', params);
        this.isLoading = false;
      },
      getLoadParam() {
        // 获取筛选框表单的内容
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      goCustomerOverview({ id, customerId, pinCode, relationType }) {
        // 跳转到客户概览页面
        this.$router.push({
          name: 'myConsumerInfo',
          query: {
            id,
            customerId,
            userPin: pinCode,
            status: 'check',
            relationType
          }
        });
      },
      /* 修改拜访记录，获取拜访记录详情 */
      async editVisit(id) {
        await this.$power.checkPower(Powers.consumerVisitEdit);
        const res = await fetchApi.setParam('/customerVisit/get', { id }).doRequest();
        res.attachList = this.extractFileObj(res.attachList);
        this.formModel = res;
        this.dialogType = 'edit';
        this.$refs.editList.openDialoag();
      },
      // 将后端返回的文件对象转换成elementui使用的对象格式
      extractFileObj(files) {
        if (!files) return [];
        return files.map(file => {
          return {
            uid: file.fileId,
            module: file.module,
            url: `/djjf-web/file/download?directory=${file.filePath}&downloadFile=${file.fileId}${file.fileNameExt}&fileName=${file.fileName}`,
            status: 'success',
            name: file.fileName,
            size: file.fileSize,
            response: {
              data: file
            }
          };
        });
      },
      /* 删除拜访记录 */
      async remove(id) {
        await this.$power.checkPower(Powers.consumerVisitDel);
        this.$confirm('确认要删除该条数据吗?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchApi.setParam('/customerVisit/remove', { id }).doRequest().then(res => {
            if (res) {
              this.fetchData();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 新建拜访记录
      async addVisit() {
        await this.$power.checkPower(Powers.consumerVisitAdd);
        this.formModel = {};
        this.dialogType = 'add';
        this.$refs.editList.openDialoag();
      }
    }
  };
</script>
