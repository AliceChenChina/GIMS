<template>
  <el-card class="box-card" v-loading="isLoading">
    <list-viewer
      :state="viewerState"
      :context="this"
      @onFetchData="fetchData"
    />
  </el-card>
</template>

<script>
  import listViewer from 'common/ListViewerLevel2';
  import { ActivityResultWrapper } from '@/api/ResultWrapper';
  import FetchApiFactory from '@/api/fetchApi';
  import { mapState } from 'vuex';
  export default {
    name: 'StrategyGroupList',
    components: {
      listViewer
    },
    data() {
      return {
        isLoading: false,
        shouldUpdateData: false
      };
    },
    computed: {
      ...mapState({
        viewerState: state => state.strategyRecommend.strategySalesListState,
        loginRole: state => state.strategyRecommend.loginRole
      })
    },
    created() {
      const resultWrapper = new ActivityResultWrapper();
      this.requestInstance = FetchApiFactory.getFetchInstance('/strategyRecommend', false, resultWrapper);
    },
    mounted() {
      this.$store.commit('strategyRecommend/COMMIT_STRATEGY_SALES_LIST_VIEWER');
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
        return { ...state.filterModel, ...state.paginationState.getAjaxParam(), ...{ oprType: 'RL' }, ...{roleFrom: 1} };
      },
      async fetchData() {
        this.isLoading = true;
        let param = this.getLoadParam();
        await this.$store.dispatch('strategyRecommend/getSalestrategyList', param);
        this.isLoading = false;
      },
      check(row, status) {
       // await this.$power.checkPower(Powers.gimsCallback);
        this.shouldUpdateData = true;
        let name;
        if (status === 'edit') {
          name = 'editStrategyForm';
        }
        if (status === 'check') {
          name = 'checkStrategyForm';
        }
        this.$router.push({
          name: name,
          query: {
            id: row.id,
            status: status,
            isSales: '1',
            uuid: row.uuid
          }
        });
      },
      // 添加分组
      add() {
        this.shouldUpdateData = true;
        const query = {
          query: {
            status: 'add',
            isSales: '1'
          }
        }
        this.$router.push({ name: 'strategyForm', ...query });
      },
      async delete(row) {
        this.$alert({
          msg: '确认要删除这个策略吗',
          onConfirm: async() => {
            try {
              this.loading = true;
              let param = {
                strategeData: {oprType: 'D',uuid:row.uuid},
              };
              console.log('parrrr', param);
              await this.requestInstance.setParam('/modify/recommend', param).doRequest();
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
      // 保存编辑的数据
      async updateData() {
        const param = this.editForm;
        param.oprType = 1;
        this.$refs.editForm.validate(async (valid) => {
          if (valid) {
            try {
              this.loading = true;
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
</style>
