<template>
  <el-card v-loading="loadingStatus[type]" class="box-card">
    <list-viewer
      ref="consumer_list_viewer"
      :state="getConsumerListViewerState"
      :context="this"
      @onFetchData="onFetchData"
    >
      <template v-if="$route.name === 'consumerList'" #before-filter>
        <div class="op-btn">
          <el-button type="primary" @click="getCustomerComplianceInfo">当前页全部去合规</el-button>
        </div>
      </template>
    </list-viewer>
    <employee-selector
      ref="employee_selector"
      @onSelectionConfirm="selectionConfirmFn"
    />
    <consumer-edit ref="consumer_edit" @saveSuccess="onEditConsumerSuccess" />
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import listViewer from 'common/ListViewer';
  import employeeSelector from 'common/employeeSelector';
  import ConsumerEditDialog from './consumerEditDialog.tsx';
  import { Powers } from '@/utils/powers';

  export default {
    name: 'ConsumerList',
    components: {
      listViewer,
      employeeSelector,
      'consumer-edit': ConsumerEditDialog
    },
    data() {
      return {
        loadingStatus: {
          list: false,
          visit: false,
          no_assign: false
        },
        selectionConfirmFn: {},
        hasmore: false
      };
    },
    computed: {
      ...mapState({
        consumerViewerState: state => state.consumer.consumerViewerState
      }),
      type() {
        switch (this.$route.name) {
          case 'consumerList':
            return 'list';
          case 'consumerVisit':
            return 'visit';
          case 'consumerNoAssign':
            return 'no_assign';
          default:
            return '';
        }
      },
      getConsumerListViewerState() {
        const state = this.consumerViewerState[this.type] ? this.consumerViewerState[this.type] : {};
        return state;
      }
    },
    watch: {
      type() {
        if (this.type && !this.consumerViewerState[this.type]) {
          // 若不存在state结构进行初始化
          this.$store.commit('consumer/SET_CONSUMER_VIEWER', this.type);
          this.onFetchData(this.getLoadParam());
        }
      }
    },
    mounted() {
      this.$store.commit('consumer/SET_CONSUMER_VIEWER', this.type);
      this.onFetchData(this.getLoadParam());
    },
    methods: {
      getLoadParam() {
        const state = this.consumerViewerState[this.type];
        return { ...state.filterModel, ...state.paginationState.getAjaxParam() };
      },
      getPaginationState() {
        const state = this.getConsumerListViewerState;
        return state.paginationState;
      },
      switchFilter() {
        this.hasmore = !this.hasmore;
      },
      getCustomerComplianceInfo(userId) {
        // 全部获取合规页面就拼接当前页面userId字符串
        const { records } = this.getConsumerListViewerState.tableData;
        if (!userId || typeof userId !== 'string') {
          userId = records.map(record => record.customerId).join(',');
        }
        this.$alert({
          msg: '确认获取合规信息吗',
          onConfirm: async() => {
            const uri = '/customerOverview/getCustomerComplianceInfo';
            const type = this.type;
            this.loadingStatus[type] = true;
            await this.$fetch.setParam(uri, { userId }).doRequest();
            this.loadingStatus[type] = false;
            // 重新加载数据
            this.onFetchData(this.getLoadParam());
            this.$message.success('获取客户合规信息完成！');
          }
        });
      },
      // 仅回收
      async recycleCustomer(row) {
        this.$alert({
          msg: '确认回收吗',
          onConfirm: async() => {
            const uri = '/customerUnAllocation/recycleCustomer';
            const type = this.type;
            const param = {
              userId: row.customerId,
              formerPlannerId: row.sales
            };
            this.loadingStatus[type] = true;
            await this.$fetch.setParam(uri, param).doRequest();
            this.loadingStatus[type] = false;
            // 重新加载数据
            this.onFetchData(this.getLoadParam());
            this.$message.success('回收成功！');
          }
        });
      },
      conformDialog(content, ifShowCancelButton, confirmButtonText, succFn) {
        this.$msgbox({
          title: '提示',
          message: content,
          showCancelButton: ifShowCancelButton,
          confirmButtonText: confirmButtonText,
          cancelButtonText: '取消'
        }).then(() => { succFn && succFn(); });
      },
      // 转分配
      async recycleAndAllocateCustomer(row) {
        await this.$power.checkPower(Powers.followConsumerAllocate);
        const { customerId: userId, sales: formerPlannerId, relationship, salesName, pinCode, customerFrom } = row;
        const param = {
          userId, formerPlannerId
        };
        if (relationship === 2) {
          this.conformDialog(`${salesName}理财师已是客户${pinCode}的专属理财师，您确定需要转换理财师嘛？`, true, '确定', this.$refs.employee_selector.showDialog);
        }
        if ((relationship === 1 && customerFrom === 1) || (relationship === 1 && customerFrom === 2)) {
          this.conformDialog(`客户${pinCode}是${salesName}理财师自行拓展的客户，您确定需要转换理财师嘛？`, true, '确定', this.$refs.employee_selector.showDialog);
        }
        if (relationship === 1 && customerFrom === 3) {
          this.$refs.employee_selector.showDialog();
        }
        this.selectionConfirmFn = (list) => {
          param.plannerId = parseInt(Object.keys(list)[0]);
          this.submitRecycleAndAllocate(param);
        };
      },
      async submitRecycleAndAllocate(param) {
        const uri = '/customerUnAllocation/recycleAndAllocateCustomer';
        const type = this.type;
        this.loadingStatus[type] = false;
        try {
          await this.$fetch.setParam(uri, param).doRequest();
          this.loadingStatus[type] = false;
          // // 重新加载数据
          this.onFetchData(this.getLoadParam());
          this.$message.success('分配成功！');
        } catch (e) {
          this.loadingStatus[type] = false;
          this.$message.error(e);
        }
      },
      // 分配客户
      async allocateCustomer(row) {
        await this.$power.checkPower(Powers.noAssignConsumerAllocate);
        const { pendingAllocationReason } = row;
        const { id: recordId } = row;
        if (pendingAllocationReason === '预约无跟进') {
          this.$message.error('请去crm中进行分配!');
          return;
        }
        const reasons = ['自动回收', '人工回收', '离职回收', '成单无跟进', '资产认证无跟进', '在线客服'];
        if (reasons.indexOf(pendingAllocationReason) >= 0) {
          // 弹框选择客户
          this.$refs.employee_selector.showDialog();
          this.selectionConfirmFn = (list) => {
            this.submitAllocate(list, recordId);
          };
        } else {
          this.$message.error(`状态未知，${pendingAllocationReason}`);
        }
      },
      async submitAllocate(list, recordId) {
        const uri = '/customerUnAllocation/allocateCustomer';
        const type = this.type;
        this.loadingStatus[type] = true;
        const plannerId = parseInt(Object.keys(list)[0]);
        const param = {
          plannerId,
          id: recordId
        };
        try {
          await this.$fetch.setParam(uri, param).doRequest();
          this.loadingStatus[type] = false;
          // // 重新加载数据
          this.onFetchData(this.getLoadParam());
          this.$message.success('分配成功！');
        } catch (e) {
          this.loadingStatus[type] = false;
          this.$message.error(e);
        }
      },
      async onFetchData(param) {
        if (!param) param = this.getLoadParam();
        const type = this.type;
        this.loadingStatus[type] = true;
        try {
          await this.$store.dispatch('consumer/queryConsumerList', {
            type,
            arg: param
          });
        } catch (e) {
          // 失败清空状态
          this.$store.commit('consumer/CLEAR_CONSUMER_VIEWER', type);
        }
        this.loadingStatus[type] = false;
      },
      async gotoConsumerDetail(row, from) {

        if (from && from === 'myConsumerList'){
          await this.$power.checkPower(Powers.gimsConsumerCheck);
        }
        if (from && from === 'visitList'){
          await this.$power.checkPower(Powers.followConsumerCheck);
        }
        if (from && from === 'noAssignList'){
          await this.$power.checkPower(Powers.noAssignConsumerCheck);
        }
        this.$router.push({
          name: 'consumerDetail',
          query: {
            userId: row.customerId || row.userId,
            pinCode: row.pinCode || row.userPin
          }
        });
      },
     async editConsumer(row) {
        await this.$power.checkPower(Powers.gimsConsumerEdit);
        row.relationship = parseInt(row.relationship);
        row.customerFrom = parseInt(row.customerFrom);
        row.originSource = parseInt(row.source);
        row.isDjTrade = parseInt(row.djTradeFlag);
        this.$refs.consumer_edit.showEditDialog(row);
      },
      // gims回收
      async gimsCallback(row) {
        const type = this.type;
        // 权限认证
        await this.$power.checkPower(Powers.gimsCallback);
        this.loadingStatus[type] = true;
        const bindResult = await this.$fetch.setParam('/customerList/findUserBindEmp', { customerId: row.customerId }).doRequest();
        this.loadingStatus[type] = false;
        if (!bindResult) {
          this.$message.error('该客户无归属理财师，无需回收');
          return false;
        }
        this.$alert({
          msg: '操作后会将该客户置为无归属状态，此信息仅在GIMS更新，不会传给CRM系统，是否确认？',
          onConfirm: async() => {
            const uri = '/customerList/recycleBindUser';
            const param = {
              customerId: row.customerId
            };
            this.loadingStatus[type] = true;
            const recycleResult = await this.$fetch.setParam(uri, param).doRequest();
            this.loadingStatus[type] = false;
            this.$message.success('回收成功');
            // 重新加载数据
            this.onFetchData(this.getLoadParam());
          }
        });
      },
      // gims分配
      async gimsAllocate(row) {
        // 权限认证
        await this.$power.checkPower(Powers.gimsAllocate);
        // 弹框选择客户
        this.$refs.employee_selector.showDialog();
        this.selectionConfirmFn = (list) => {
          // this.submitAllocate(list, recordId);
          this.gimsGoToAllocate(row, list);
        };

      },
      async gimsGoToAllocate(row, list) {
        const url = '/customerList/resignBindUser';
        const param = {
          customerId: row.customerId,
          sales: parseInt(Object.keys(list)[0])
        }
        const type = this.type;
        this.loadingStatus[type] = true;
        const result = await this.$fetch.setParam(url, param).doRequest();
        if (result.code !== 0) {
          this.$message.error(result.message);
          this.loadingStatus[type] = false;
          return false;
        }
        this.loadingStatus[type] = false;
        this.$message.success('分配成功');
        // 重新加载数据
        this.onFetchData(this.getLoadParam());
      },
      onEditConsumerSuccess() {
        this.onFetchData();
      },
      onCloseTab() {
        // 关闭标签的时候清空store
        this.$store.commit('consumer/CLEAR_CONSUMER_VIEWER', this.type);
      }
    }
  };
</script>

<style lang="scss">
  .able {
    color: #F52020;
    cursor: pointer;
  }
  .disable {
    color: #cccccc;
    cursor: not-allowed;
  }
</style>
