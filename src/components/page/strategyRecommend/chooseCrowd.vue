<template>
  <div class="strategyForm">
    <!--    理财师推荐人群-->
    <div v-if="isSales === '1'">
      <p class="title">
        推荐人群：
        <el-select
          v-model="recommendTypeLocal"
          placeholder="请选择"
          class="mr10"
          :disabled="status === 'check' || status === 'edit'"
          @change="chooseRecommendType"
        >
          <el-option
            class="mr10"
            v-for="item in reccondCrowOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-tag
          v-if="recommendTypeLocal === '2'"
          :closable="status === 'add'"
          v-for="(crowdItem, crowdkey) in customerListLocal"
          :key="crowdkey"
          @close="closeCustomerListTag(crowdkey)"
          >{{ crowdItem.customerName }}</el-tag>
      </p>
      <!--        按用户组推荐-->
      <div v-if="recommendTypeLocal === '1'" class="mt10 ml80 groupChoose">
        <el-radio-group v-model="customerGroupValueLocal">
          <el-radio
            v-for="(groupItem, groupKey) in customerGroup"
            :key="groupKey"
            :label="groupItem.id"
            :disabled="status === 'check' || status === 'edit'"
            @change="chooseCustomerGroup"
            >{{ groupItem.groupName }}</el-radio
          >
        </el-radio-group>
      </div>
      <!--        指定用户推荐-->
      <div v-if="recommendTypeLocal === '2' && status === 'add'">
        <div class="ml80 h240 overFlowAuto mt10">
          <customerList ref="customer_list" @confirm="selectCustomer" />
        </div>
      </div>
    </div>
    <!--    运营推荐人群-->
    <p class="title" v-if="isSales !== '1'">
      <span class="inline-block mr10">人群(限选1个人群)</span>
      <el-tag
        :closable="status !== 'check'"
        v-for="(crowdItem, crowdkey) in crowdLocal"
        :key="crowdkey"
        @close="closeCrowdTag(crowdkey)"
      >{{ crowdItem.crowdName }}</el-tag>
    </p>
    <div
      class="title h240 overFlowAuto ml30"
      v-if="isSales !== '1' && status !== 'check'"
    >
      <iframe
        class="h240"
        width="100%"
        frameborder="no"
        border="0"
        id="iframe"
        :src="token"
      >
      </iframe>
    </div>
  </div>
</template>

<script>
  import customerList from 'page/strategyRecommend/customerList';
  import FetchApiFactory from '@/api/fetchApi';
  import { ActivityResultWrapper } from '@/api/ResultWrapper';

  export default {
    name: 'StrategyForm',
    data() {
      return {
        isSales: this.$route.query.isSales,
        status: this.$route.query.status,
        token: '',
        customerGroup: [], // 理财师所建立的客户组
        customerGroupValueLocal: 0, // 选中的客户组
        customerListLocal: [], // 理财师所选择的客户群体
        crowdLocal: [], // 运营选择的客户群体
        recommendTypeLocal: '1', // 推荐人群：1.用户组推荐  2.指定用户推荐 3.人群推荐
        reccondCrowOptions: [
          {
            value: '1',
            label: '按用户组推荐'
          },
          {
            value: '2',
            label: '指定用户推荐'
          }
        ]
      };
    },
    props: {
      recommendType: {
        type: String,
        default: '1'
      },
      customerList: { // 理财师--指定用户--选择的客户列表
        type: Array,
        default: () => []
      },
      customerGroupValue: { // 理财师--用户组--选择的用户组
        type: Number,
        default: 0
      },
      crowd: { // 运营--选择的用户群
        type: Array,
        default: () => []
      }
    },
    watch: {
      customerGroupValue: {
        deep: true,
        handler(){
          this.customerGroupValueLocal = this.customerGroupValue;
        }
      },
      recommendType: {
        deep: true,
        handler(){
          this.recommendTypeLocal = this.recommendType;
        }
      },
      customerList: {
        deep: true,
        handler(){
          this.customerListLocal = this.customerList;
        }
      },
      crowd: {
        deep: true,
        handler(){
          this.crowdLocal = this.crowd;
        }
      },
    },
    created(){
      const resultWrapper = new ActivityResultWrapper();
      this.requestInstanceUser = FetchApiFactory.getFetchInstance(
        '/userGroup',
        false,
        resultWrapper
      );
      window.addEventListener('message', event => {
        if (this.crowdLocal.length >= 1 && event.data.crowdCode) {
          return false;
        }
        if (!event.data.crowdCode) {
          return false;
        }
        this.crowdLocal.push(event.data);
        this.$emit('updateCrowd', this.crowdLocal);
      });
      const origin = window.location.origin;
      if (origin.indexOf('gims-new.jd.com') !== -1 || origin.indexOf('gims-admin.jd.com') !== -1 || origin.indexOf('gims-admin2.jd.com') !== -1) {
        this.token =
          `http://usertag-7.jd.com/#/crowdLists?token=b508cd3edafd4dd79218bcc0de96d590&listType=0&isOld=1&clickName=${encodeURIComponent('选择')}`;
      }
      if (origin.indexOf('gimspro-pre.jdfmgt.com') !== -1 || origin.indexOf('gimspro.jdfmgt.com') !== -1) {
        this.token =
          `http://usertag-7.jd.com/#/crowdLists?token=d5d6256fa45946a0936c71ae3adc492e&listType=0&isOld=1&clickName=${encodeURIComponent('选择')}`;
      }
    },
    activated(){
      this.isSales = this.$route.query.isSales;
      this.status = this.$route.query.status;
      this.customerGroup = [];
      if (this.isSales === '1') {
        this.getCustomerGroup();
      }
    },
    components: {
      customerList
    },
    methods: {
      chooseRecommendType(){
        this.$emit('updateRecommendType', this.recommendTypeLocal);
      },
      chooseCustomerGroup(){
        this.$emit('updateCustomerGroupValue', this.customerGroupValueLocal);
      },
      selectCustomer(row) {
        if (this.customerListLocal.length >= 50) {
          this.$message.error('最多选择50个用户');
          return false;
        }
        if (this.customerListLocal.indexOf(row) !== -1) {
          this.$message.error('不能重复添加');
          return false;
        }
        this.customerListLocal.push(row);
        this.$emit('updateCustomerList', this.customerListLocal);
      },
      closeCustomerListTag(index) {
        this.customerListLocal.splice(index, 1);
        this.$emit('updateCustomerList', this.customerListLocal);
      },
      closeCrowdTag(index) {
        this.crowdLocal.splice(index, 1);
        this.$emit('updateCrowd', this.crowdLocal);
      },
      // 客户分组
      async getCustomerGroup() {
        const res = await this.requestInstanceUser
          .setParam('/queryGroupList', {})
          .doRequest();
        this.customerGroup = res || [];
      },
    }
  };
</script>
<style>
  .groupChoose /deep/ .el-radio:first-child {
    margin-left: 30px;
  }
</style>
