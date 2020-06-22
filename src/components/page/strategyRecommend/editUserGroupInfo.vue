<template>
  <el-card class="box-card" v-loading="isLoading">
    <div class="mb10 flex">
      <p class="w80 lh32">分组名称:</p>
      <div class="w400 mr10">
        <el-input v-model="encodeGroupName" size="small" v-if="status==='edit'"/>
        <p class="lh32" v-if="status==='check'">{{encodeGroupName}}</p>
      </div>
      <div>
        <el-button size="small" type="primary" @click="modify" v-if="status==='edit'">修改</el-button></div>
    </div>
    <div class="line mb20 mt30"></div>
    <p>组内用户</p>
    <div class="mt10"><el-button size="small" type="primary" @click="addCustomer" v-if="status==='edit'">新增客户</el-button></div>
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
    <customerSelector ref="customer_selector" @onSelectionConfirm="selectionConfirmFn" />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewerLevel2';
  import { ActivityResultWrapper } from '@/api/ResultWrapper';
  import FetchApiFactory from '@/api/fetchApi';
  import { mapState } from 'vuex';
  import customerSelector from 'page/strategyRecommend/customerSelector';
  export default {
    name: 'EditUserGroupInfo',
    components: {
      listViewer,
      customerSelector
    },
    data() {
      return {
        isLoading: false,
        shouldUpdateData: false,
        status: this.$route.query.status,
        id: this.$route.query.id,
        groupName: this.$route.query.groupName,
        encodeGroupName: ''
      };
    },
    watch: {
      groupName(val) {
        this.encodeGroupName = decodeURIComponent(val);
      }
    },
    computed: {
      ...mapState({
        viewerState: state => state.strategyRecommend.groupConsumerState
      })
    },
    created() {
      const resultWrapper = new ActivityResultWrapper();
      this.requestInstance = FetchApiFactory.getFetchInstance('/userGroup', false, resultWrapper);
    },
    mounted() {
      this.encodeGroupName = decodeURIComponent(this.groupName);
      this.$store.commit('strategyRecommend/COMMIT_GROUP_CONSUMER__VIEWER');
      this.fetchData();
    },
    activated() {
      this.fetchData();
      if (this.id === this.$route.query.id && this.status === this.$route.query.status && this.groupName === this.$route.query.groupName ) {
        return false;
      }
      this.id = this.$route.query.id;
      this.status = this.$route.query.status;
      this.groupName = this.$route.query.groupName;
      this.encodeGroupName = decodeURIComponent(this.groupName);
      this.$store.commit('strategyRecommend/COMMIT_GROUP_CONSUMER__VIEWER');
      this.fetchData();
    },
    methods: {
      addCustomer() {
        this.$refs.customer_selector.showDialog();
      },
      selectionConfirmFn() {
        this.fetchData();
      },
      async modify() {
        if (!this.groupName) {
          this.$message.error('组名不能为空！');
          return false;
        }
        const param = { groupName: this.encodeGroupName, id: this.$route.query.id, uuid: this.$route.query.uuid };
        try {
          this.loading = true;
          await this.requestInstance.setParam('/updateGroupName', param).doRequest();
          this.loading = false;
          this.$message.success('操作成功！');
          this.showEdit = false;
          this.fetchData();
        } catch (msg) {
          this.$message.error(msg);
        }
        this.loading = false;
      },
      getLoadParam() {
        const state = this.viewerState;
        return { ...state.filterModel, ...state.paginationState.getAjaxParam(), ...{ id: this.$route.query.id }, ...{ userPin: state.filterModel.userName} };
      },
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('strategyRecommend/getGroupConsumerList', this.getLoadParam());
        this.isLoading = false;
      },
      check(row) {
        this.$router.push({
          name: 'consumerDetail',
          query: {
            userId: row.customerId || row.userId,
            pinCode: row.pinCode || row.pinCode
          }
        });
      },
      async delete(row) {
        try {
          this.loading = true;
          const param = { oprType: 4, id: row.id };
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
    }
  };
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
</style>
