<template>
  <el-card class="strategyForm" v-loading="isLoading">
    <!--    理财师推荐人群-->
    <chooseCrowd :crowd="crowd" :customer-list="customerList" :recommendType="recommendType" :customerGroupValue="customerGroupValue"  @updateCrowd="updateCrowd" @updateCustomerList="updateCustomerList" @updateCustomerGroupValue="updateCustomerGroupValue" @updateRecommendType="updateRecommendType"/>
    <p class="title mt10">推荐模板</p>
    <div class="mt10 groupChoose">
      <el-radio v-model="recommendForm" label="3" :disabled="status === 'check' || (status === 'edit' && isSales === '1' )"
      >直接推荐</el-radio
      >
      <el-radio v-model="recommendForm" label="1" :disabled="status === 'check' || (status === 'edit' && isSales === '1' )"
      >图片上传（仅支持推荐一个产品，图片宽度为1080）</el-radio
      >
    </div>
    <div class="mt10">
      <!--      直接推荐-->
      <div v-if="recommendForm === '3'">
        <!--        运营-->
        <div
          class="flex"
          style="justify-content: space-around"
          v-if="isSales !== '1'"
        >
          <div style="width: 30%">
            <div>
              <img style="width: 50%" src="@/assets/img/template1.jpg" />
            </div>
            <div style="text-align: center;width: 50%">
              <el-radio
                v-model="recommendTemplate"
                label="1"
                :disabled="status === 'check'"
              >模板</el-radio
              >
            </div>
          </div>
        </div>
        <!--        理财师-->
        <div
          class="flex"
          style="justify-content: space-around"
          v-if="isSales === '1'"
        >
          <div style="width: 30%">
            <div>
              <img style="width: 50%" src="@/assets/img/salesTemplate1.png" />
            </div>
            <div style="text-align: center;width: 50%">
              <el-radio
                v-model="recommendTemplate"
                label="1"
                :disabled="status === 'check' || (status === 'edit' && isSales === '1' )"
              >模板1</el-radio
              >
            </div>
          </div>
          <div style="width: 30%">
            <div>
              <img style="width: 50%" src="@/assets/img/salesTemplate2.png" />
            </div>
            <div style="text-align: center;width: 50%">
              <el-radio
                v-model="recommendTemplate"
                label="2"
                :disabled="status === 'check' || (status === 'edit' && isSales === '1' )"
              >模板2</el-radio
              >
            </div>
          </div>
        </div>

        <div>
          <p class="title">选择产品</p>
          <div>
            <el-tag
              class="mr10"
              :closable="status === 'add' || (status === 'edit' && isSales !== '1')"
              v-for="(productItem, productkey) in directProductList"
              :key="productkey"
              @close="closeTag(directProductList, productkey)"
            >{{ productItem.productNameShort }}</el-tag
            >
          </div>
          <div
            style="height: 220px; overflow: scroll;"
            v-if="status === 'add' || (status === 'edit' && isSales !== '1')"
          >
            <productSelector
              ref="product_selector"
              :from="from"
              @onSelectionConfirm="selectionConfirmFn"
            />
          </div>
        </div>
        <div class="mt10" v-if="isSales !== '1'">
          <p class="title">产品显示字段</p>
          <el-radio v-model="productSameStep" label="1" class="mt10"
          >同步产品列表信息</el-radio
          >
        </div>
        <div class="mt10" v-if="isSales !== '1'">
          <p class="title">是否独家产品</p>
          <el-radio
            v-model="exclusiveFlag"
            label="1"
            class="mt10"
            :disabled="status === 'check'"
          >是</el-radio
          >
          <el-radio
            v-model="exclusiveFlag"
            label="0"
            class="mt10"
            :disabled="status === 'check'"
          >否</el-radio
          >
        </div>
        <div class="mt10">
          <p class="title">推荐文案</p>
          <ul v-if="isSales !== '1'">
            <li class="flex">
              <p style="width: 100px; line-height: 50px">优势1</p>
              <div class="mr10 iconImg">
                <up-load :check="status === 'check'" action="/activity/picture/upload" :headers="uploadHeaders" :fileList="cfgContent1"  @updateFileList="updateCfgContent1"/>
              </div>
              <div style="width: 300px; margin-right: 10px">
                <el-input
                  :disabled="status === 'check'"
                  type="textarea"
                  placeholder=""
                  maxlength="30"
                  v-model="cfgContent2"
                  show-word-limit
                >
                </el-input>
              </div>
              <div style="width: 300px">
                <el-input
                  :disabled="status === 'check'"
                  type="textarea"
                  placeholder=""
                  maxlength="30"
                  v-model="cfgContent3"
                  show-word-limit
                >
                </el-input>
              </div>
            </li>
            <li class="flex mr10 mt10">
              <p style="width: 100px; line-height: 50px">优势2</p>
              <div class="mr10 iconImg">
                <up-load :check="status === 'check'" action="/activity/picture/upload" :headers="uploadHeaders" :fileList="cfgContent4"  @updateFileList="updateCfgContent4"/>
              </div>
              <div style="width: 300px" class="mr10">
                <el-input
                  :disabled="status === 'check'"
                  type="textarea"
                  placeholder=""
                  maxlength="30"
                  v-model="cfgContent5"
                  show-word-limit
                >
                </el-input>
              </div>
              <div style="width: 300px">
                <el-input
                  :disabled="status === 'check'"
                  type="textarea"
                  placeholder=""
                  maxlength="30"
                  v-model="cfgContent6"
                  show-word-limit
                >
                </el-input>
              </div>
            </li>
            <li class="flex mr10 mt10">
              <p style="width: 100px; line-height: 50px;">优势3</p>
              <div class="mr10 iconImg">
                <up-load :check="status === 'check'" action="/activity/picture/upload" :headers="uploadHeaders" :fileList="cfgContent7"  @updateFileList="updateCfgContent7"/>
              </div>
              <div style="width: 300px" class="mr10">
                <el-input
                  :disabled="status === 'check'"
                  type="textarea"
                  placeholder=""
                  maxlength="30"
                  v-model="cfgContent8"
                  show-word-limit
                >
                </el-input>
              </div>
              <div style="width: 300px">
                <el-input
                  :disabled="status === 'check'"
                  type="textarea"
                  placeholder=""
                  maxlength="30"
                  v-model="cfgContent9"
                  show-word-limit
                >
                </el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--      图片推荐-->
      <div v-if="recommendForm === '1'">
        <div class="text-center">
          <up-load :check="status === 'check'" action="/activity/picture/upload" :headers="uploadHeaders" :fileList="picFileList" picKey="picReccond" @updateFileList="updatePicFileList"/>
        </div>
      </div>
      <div v-if="recommendForm === '1'">
        <p class="title">选择产品</p>
        <div>
          <el-tag
            :closable="status === 'add' || (status === 'edit' && isSales !== '1')"
            v-for="(productItem, productkey) in picProductList"
            :key="productkey"
            @close="closeTag(picProductList, productkey)"
          >{{ productItem.productNameShort }}</el-tag
          >
        </div>
        <div style="height: 220px; overflow: scroll" v-if="status === 'add' || (status === 'edit' && isSales !== '1')">
          <productSelector
            ref="product_selector"
            :from="from"
            @onSelectionConfirm="selectionConfirmFn"
          />
        </div>
      </div>
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="form"
        >
          <el-form-item
            label="整体推荐文案"
            prop="cfgContent1"
            required
            v-if="isSales === '1' && recommendForm === '3'"
          >
            <el-input
              type="textarea"
              v-model="ruleForm.cfgContent1"
              maxlength="50"
              show-word-limit
              :disabled="status === 'check'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="推荐产品1文案"
            prop="cfgContent2"
            required
            v-if="recommendTemplate === '2' && isSales === '1'&& recommendForm === '3'"
          >
            <el-input
              type="textarea"
              maxlength="50"
              show-word-limit
              v-model="ruleForm.cfgContent2"
              :disabled="status === 'check'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="推荐产品2文案"
            prop="cfgContent3"
            required
            v-if="recommendTemplate === '2' && isSales === '1'&& recommendForm === '3'"
          >
            <el-input
              type="textarea"
              maxlength="50"
              show-word-limit
              v-model="ruleForm.cfgContent3"
              :disabled="status === 'check'"
            ></el-input>
          </el-form-item>
          <el-form-item label="初始策略分" prop="strategyScore" required v-if="isSales !== '1'">
            <el-input
              v-model="ruleForm.strategyScore"
              :disabled="status === 'check'"
            ></el-input>
          </el-form-item>
          <el-form-item label="上下线时间:" required>
            <el-col v-if="status === 'add'">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="ruleForm.startTime"
                  type="daterange"
                  :picker-options="pickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  @change="changeDatePicker"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col v-if="status === 'edit' || status === 'check'">
              <el-form-item prop="startTime">
                <el-date-picker
                  :disabled="status === 'check' || (status === 'edit' && isSales === '1')"
                  v-model="ruleForm.startTime"
                  type="daterange"
                  :picker-options="pickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-value="this.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  @change="changeDatePicker"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center" v-if="status !== 'check'">
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
  import { ActivityResultWrapper } from '@/api/ResultWrapper';
  import FetchApiFactory from '@/api/fetchApi';
  import productSelector from 'page/strategyRecommend/productSelector';
  import { mapState } from 'vuex';
  import chooseCrowd  from './chooseCrowd';
  import upLoad  from './upLoad';
  export default {
    name: 'StrategyForm',
    components: {
      productSelector,
      chooseCrowd,
      upLoad
    },
    data() {
      const checkAmount = (rule, value, callback) => {
        const reg = /^([0-9]*)$/;
        if (value && !reg.test(value)) {
          return callback(new Error('只能输入数字'));
        }
        callback();
      };
      return {
        uploadHeaders: { token: localStorage.getItem('token') },
        exclusiveFlag: '', // 是否是独家产品
        from: '', // 记录产品选择的时候是图片选择还是产品选择
        id: this.$route.query.id,
        uuid: this.$route.query.uuid,
        isSales: this.$route.query.isSales,
        status: this.$route.query.status,
        isLoading: false,
        recommendType: '1', // 推荐人群：1.用户组推荐  2.指定用户推荐
        crowd: [], // 指定用户推荐--客户，
        customerList: [], // 运营所选择的客户群体
        customerGroupValue: 0, // 选中的客户组
        recommendForm: '3', // 推荐模板 1.图片上传2.对比推荐3.直接推荐
        recommendTemplate: '1', // 存储选择的模板1.模板1 2.模板2
        picFileList: [],
        productSameStep: '1',
        picProductList: [],
        directProductList: [],
        startTime: ['', ''],
        ruleForm: {
          startTime: ['', ''],
          strategyScore: '',
          cfgContent1: '',
          cfgContent2: '',
          cfgContent3: ''
        },
        rules: {
          startTime: [
            {
              type: 'array',
              required: true,
              message: '请选择日期',
              trigger: 'change'
            }
          ],
          strategyScore: [
            { validator: checkAmount, trigger: 'blur' },
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          cfgContent1: {
            type: 'string',
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          cfgContent2: {
            type: 'string',
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          cfgContent3: {
            type: 'string',
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        },
        cfgContent1: [],
        cfgContent2: '',
        cfgContent3: '',
        cfgContent4: [],
        cfgContent5: '',
        cfgContent6: '',
        cfgContent7: [],
        cfgContent8: '',
        cfgContent9: '',
        strategyUpperDaysLimit: 90, // 上下线间隔时间
        pickerOptions: {
          disabledDate: (value) => {
            const now = new Date();
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0);
            now.setMilliseconds(0);
            if (now - value > 0 ) {
              // 禁用
              return true;
            }
            return false;
          }
        }
      };
    },
    activated() {
      if (
        this.id === this.$route.query.id &&
        this.status === this.$route.query.status &&
        this.isSales === this.$route.query.isSales &&
        this.uuid === this.$route.query.uuid
      ) {
        return false;
      }
      this.exclusiveFlag = this.ruleForm.cfgContent1 = this.ruleForm.cfgContent2 = this.ruleForm.cfgContent3 = '';
      this.recommendType = '1';
      this.recommendTemplate = '1';
      this.customerGroupValue = 0;
      this.recommendForm = '3';
      this.cfgContent1 = this.cfgContent4 = this.cfgContent7 = [];
      this.cfgContent2 = this.cfgContent3 = this.cfgContent5 = this.cfgContent6 = this.cfgContent8 = this.cfgContent9 = '';
      console.log('this.customerList', this.customerList);
      this.crowd = [];
      this.customerList = [];
      this.directProductList = [];
      this.picFileList =[];
      this.picProductList = [];
      console.log('22', this.directProductList);
      this.ruleForm = { startTime: ['', ''], strategyScore: '', cfgContent1: '', cfgContent2: '', cfgContent3: ''};
      this.id = this.$route.query.id;
      this.uuid = this.$route.query.uuid;
      this.status = this.$route.query.status;
      this.isSales = this.$route.query.isSales;
      this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
      this.from = this.recommendForm === '1' ? 'picChoose' : 'directChoose';
      if (
        this.$route.query.status === 'edit' ||
        this.$route.query.status === 'check'
      ) {
        this.getDetail();
      }
      this.getIntervalDays();
    },
    computed: {
      ...mapState({
        viewerState: state => state.strategyRecommend.strategyListState
      })
    },
    created() {
      this.from = this.recommendForm === '1' ? 'picChoose' : 'directChoose';
      const resultWrapper = new ActivityResultWrapper();
      this.requestInstance = FetchApiFactory.getFetchInstance(
        '/strategyRecommend',
        false,
        resultWrapper
      );
      if (
        this.$route.query.status === 'edit' ||
        this.$route.query.status === 'check'
      ) {
        this.getDetail();
      }
      this.getIntervalDays();
    },
    watch: {
      recommendForm(val) {
        this.from = val === '1' ? 'picChoose' : 'directChoose';
      }
    },
    methods: {
      async getIntervalDays(){
        let res = {};
        try {
          res = await this.requestInstance
            .setParam('/configInfo', {})
            .doRequest();
          this.strategyUpperDaysLimit = res.strategyUpperDaysLimit;
        } catch (msg) {
          this.$message.error(msg);
        }
      },
      changeDatePicker(value){
        if(!value){
          this.$message.error('未选择时间');
          return false;
        }
        const startTime = new Date(value[0]).getTime();
        const endTime = new Date(value[1]).getTime();
        if(((endTime - startTime ) / (1000 * 60 * 60 * 24)) > this.strategyUpperDaysLimit ) {
          this.$message.error(`选择的时间跨度不能超过${this.strategyUpperDaysLimit}天！`);
        }
      },
      async getDetail() {
        const param = { oprType: 'RD', uuid: this.$route.query.uuid };
        let res = {};
        try {
          this.isLoading = true;
          res = await this.requestInstance
            .setParam('/query/recommend', param)
            .doRequest();
        } catch (msg) {
          this.$message.error(msg);
        }
        this.isLoading = false;
        const strategyData = res.strategy_data || {};
        if (this.isSales === '1') {
          this.recommendType = strategyData.recommendType + '';
          if (this.recommendType === '1') {
            this.customerGroupValue = strategyData.userGroupId;
          }
          if (this.recommendType === '2') {
            this.customerList = [];
            const userNameList = strategyData.userNameList;
            userNameList.forEach(item => {
              const obj = {};
              obj.pinCode = item.userPin;
              obj.customerName = item.userName;
              if(obj.pinCode) {this.customerList.push(obj);}
            });
          }
          this.recommendForm = strategyData.recommendForm + '';
          this.recommendTemplate =
            strategyData.recommendTemplate || '';
          const productList = res.strategy_products || [];
          if (this.recommendForm === '1') {
            this.picProductList = [];
            this.picProductList.push({
              skuId: productList[0].skuId,
              productNameShort: productList[0].proName
            });
            this.picFileList = [];
            this.picFileList.push({ url: strategyData.pictureUrl });
          }
          if (this.recommendForm === '3') {
            this.directProductList = [];
            productList.forEach(item => {
              const obj = {
                skuId: item.skuId,
                productNameShort: item.proName || ''
              };
              if (obj.skuId && obj.productNameShort) {
                this.directProductList.push(obj);
              }
            });
            this.ruleForm.cfgContent1 = productList[0].cfgContent1;
            this.ruleForm.cfgContent2 = productList[0].cfgContent2;
            this.ruleForm.cfgContent3 = productList[0].cfgContent3;
          }
        } else {
          // 运营
          this.exclusiveFlag = strategyData.exclusiveFlag + '';
          this.recommendForm = strategyData.recommendForm + '';
          this.recommendType = this.recommendType || '3';
          const productList = res.strategy_products || [];
          this.crowd = [];
          if(strategyData.crowdId) {
            this.crowd.push({
              crowdCode: strategyData.crowdId,
              crowdName: strategyData.crowdName || ''
            });
          }
          if (this.recommendForm === '1') {
            this.picFileList = [];
            this.picFileList.push({ url: strategyData.pictureUrl });
            this.picProductList = [];
            this.picProductList.push({
              skuId: productList[0].skuId,
              productNameShort: productList[0].proName
            });
          }
          if (this.recommendForm === '3') {
            this.directProductList = [];
            this.cfgContent1 = [];
            this.cfgContent4 = [];
            this.cfgContent7 = [];
            this.directProductList.push({
              skuId: productList[0].skuId,
              productNameShort: productList[0].proName || ''
            });
            this.cfgContent1[0] = { url: productList[0].cfgContent1 };
            this.cfgContent2 = productList[0].cfgContent2;
            this.cfgContent3 = productList[0].cfgContent3;
            this.cfgContent4[0] = { url: productList[1].cfgContent1 };
            this.cfgContent5 = productList[1].cfgContent2;
            this.cfgContent6 = productList[1].cfgContent3;
            this.cfgContent7[0] = { url: productList[2].cfgContent1 };
            this.cfgContent8 = productList[2].cfgContent2;
            this.cfgContent9 = productList[2].cfgContent3;
          }
        }
        this.recommendTemplate = strategyData.recommendTemplate
          ? strategyData.recommendTemplate + ''
          : '1';
        this.ruleForm.strategyScore = strategyData.strategyScore + '';
        this.startTime.splice(0, 1, new Date(strategyData.onlineTime));
        this.startTime.splice(1, 1, new Date(strategyData.offlineTime));
        this.ruleForm.startTime = this.startTime;
      },
      getProductList(arr, cfg) {
        const productLst = [];
        arr.forEach(item => {
          cfg.forEach(cfgItem => {
            const obj = JSON.parse(JSON.stringify(cfgItem));
            obj.skuId = item.skuId;
            obj.cfgType = '2';
            productLst.push(obj);
          });
        });
        return productLst;
      },
      async confirm() {
        if (
          this.isSales === '1' &&
          this.recommendType === '1' &&
          this.customerGroupValue === 0
        ) {
          this.$message.error('请选择用户组！');
          return false;
        }
        if (
          this.isSales !== '1' && this.crowd.length === 0
        ) {
          this.$message.error('请选择人群!');
          return false;
        }
        if (
          this.isSales === '1' && this.recommendType === '2' && this.customerList.length === 0
        ) {
          this.$message.error('请选择指定客户!');
          return false;
        }
        if (
          this.isSales === '1' &&
          this.recommendType === '2' &&
          this.customerList.length === 0
        ) {
          this.$message.error('请选择客户!');
          return false;
        }
        if (this.recommendForm === '1' && this.picFileList.length === 0) {
          this.$message.error('请上传图片！');
          return false;
        }
        if (this.recommendForm === '1' && this.picProductList.length === 0) {
          this.$message.error('请选择模板对应的产品！');
          return false;
        }
        if (this.recommendForm === '3' && this.directProductList.length === 0) {
          this.$message.error('请选择模板对应的产品！');
          return false;
        }
        if (
          this.recommendForm === '3' &&
          this.recommendTemplate === '1' &&
          this.directProductList.length > 1
        ) {
          this.$message.error('模板1只能选择1个产品，请删除多余的产品！');
          return false;
        }
        if (
          this.recommendForm === '3' &&
          this.recommendTemplate === '2' &&
          this.directProductList.length !== 2
        ) {
          this.$message.error('模板2需要选择2个产品！');
          return false;
        }
        if (
          this.isSales !== '1' &&
          !this.exclusiveFlag && this.recommendForm === '3'
        ) {
          this.$message.error('请选择是否是独家产品！');
          return false;
        }
        if (
          this.isSales !== '1' &&
          this.recommendForm === '3' &&
          this.cfgContent1.length === 0
        ) {
          this.$message.error('优势1图片未上传！');
          return false;
        }
        if (
          (this.isSales !== '1' &&
            this.recommendForm === '3' &&
            this.cfgContent2 === '') ||
          (this.isSales !== '1' &&
            this.recommendForm === '3' &&
            this.cfgContent3 === '')
        ) {
          this.$message.error('优势1描述未填写！');
          return false;
        }
        if (
          this.isSales !== '1' &&
          this.recommendForm === '3' &&
          this.cfgContent4.length === 0
        ) {
          this.$message.error('优势2图片未上传！');
          return false;
        }
        if (
          (this.isSales !== '1' &&
            this.recommendForm === '3' &&
            this.cfgContent5 === '') ||
          (this.isSales !== '1' &&
            this.recommendForm === '3' &&
            this.cfgContent6 === '')
        ) {
          this.$message.error('优势2描述未填写！');
          return false;
        }
        if (
          this.isSales !== '1' &&
          this.recommendForm === '3' &&
          this.cfgContent7.length === 0
        ) {
          this.$message.error('优势3图片未上传！');
          return false;
        }
        if (
          (this.isSales !== '1' &&
            this.recommendForm === '3' &&
            this.cfgContent8 === '') ||
          (this.isSales !== '1' &&
            this.recommendForm === '3' &&
            this.cfgContent9 === '')
        ) {
          this.$message.error('优势3描述未填写！');
          return false;
        }

        this.$refs['ruleForm'].validate(async valid => {
          if (!valid) {
            return false;
          }
          // if (
          //   this.isSales === '1' &&
          //   this.recommendType === '1' &&
          //   (this.ruleForm.strategyScore < 101 ||
          //     this.ruleForm.strategyScore > 150)
          // ) {
          //   this.$message.error('策略分取值范围为101~150');
          //   return false;
          // }
          // if (
          //   this.isSales === '1' &&
          //   this.recommendType === '2' &&
          //   (this.ruleForm.strategyScore < 151 ||
          //     this.ruleForm.strategyScore > 200)
          // ) {
          //   this.$message.error('策略分取值范围为151~200');
          //   return false;
          // }
          // if (
          //   this.isSales !== '1' &&
          //   (this.ruleForm.strategyScore < 0 || this.ruleForm.strategyScore > 100)
          // ) {
          //   this.$message.error('策略分取值范围为0~100');
          //   return false;
          // }
          if (!this.ruleForm.startTime[0]) {
            this.$message.error('请选择上下线时间');
            return false;
          }
          const startTime = new Date(this.ruleForm.startTime[0]).getTime();
          const endTime = new Date(this.ruleForm.startTime[1]).getTime();
          if(((endTime - startTime ) / (1000 * 60 * 60 * 24)) > this.strategyUpperDaysLimit ) {
            this.$message.error(`选择的时间跨度不能超过${this.strategyUpperDaysLimit}天！`);
            return false;
          }
          let productLst = [];
          let cfgContent = [];
          if (typeof this.ruleForm.startTime[0] === 'object') {
            this.ruleForm.startTime[0] = this.formatDate(
              this.ruleForm.startTime[0]
            );
          }
          if (typeof this.ruleForm.startTime[1] === 'object') {
            this.ruleForm.startTime[1] = this.formatDate(
              this.ruleForm.startTime[1]
            );
          }
          const param = {
            productLst: productLst,
            strategeData: {
              crowdId: '',
              userGroupId: '', // 客户组ID
              userPin: '',
              customerNameList: [],
              pictureUrl: '',
              exclusiveFlag: '', // 是否独家推荐
              recommendType: this.recommendType, // 推荐类型 1批量 2单用户 3.人群
              recommendRole: this.isSales === '1' ? 1 : 2,
              recommendTemplate: this.recommendTemplate, // 推荐模板
              recommendForm: this.recommendForm, // 推荐形式 1图文 2直接 3直接推荐
              strategyScore: this.ruleForm.strategyScore, // 策略分
              onlineTime: this.ruleForm.startTime[0], // 上线时间
              offlineTime: this.ruleForm.startTime[1], // 下线时间
              recommendSource: '1', // 客户来源，1.后台 2，app
              oprType: 'C' // 操作type C:新建 RL:查询列表 RD:查询详情 U:更新 D:删除
            }
          };
          // 理财师新建--人群选择方式1.按组2.按客户
          if (this.isSales === '1') {
            param.strategeData.recommendType = this.recommendType;
          }
          if (this.isSales === '1' && this.recommendType === '1') {
            param.strategeData.crowdId = '';
            param.strategeData.exclusiveFlag = '';
            param.strategeData.customerNameList = [];
            param.strategeData.userGroupId = this.customerGroupValue;
          }
          if (this.isSales === '1' && this.recommendType === '2') {
            const pinCodeArr = [];
            console.log('this.customerList33', this.customerList);
            this.customerList.forEach(item => {
              pinCodeArr.push(item.pinCode);
            });
            console.log('this.pinCodeArr', pinCodeArr);
            param.strategeData.crowdId = '';
            param.strategeData.userGroupId = '';
            param.strategeData.customerNameList = pinCodeArr;
          }
          // 运营新建--直接推荐--模板1
          if (this.isSales !== '1') {
            param.strategeData.crowdId = this.crowd[0].crowdCode;
            param.strategeData.recommendType = '3';
            param.strategeData.userGroupId = '';
            param.strategeData.customerNameList = [];
          }
          if (this.isSales !== '1' && this.recommendForm === '3') {
            cfgContent = [
              {
                cfgContent1: this.cfgContent1[0].url,
                cfgContent2: this.cfgContent2,
                cfgContent3: this.cfgContent3
              },
              {
                cfgContent1: this.cfgContent4[0].url,
                cfgContent2: this.cfgContent5,
                cfgContent3: this.cfgContent6
              },
              {
                cfgContent1: this.cfgContent7[0].url,
                cfgContent2: this.cfgContent8,
                cfgContent3: this.cfgContent9
              }
            ];
            productLst = this.getProductList(this.directProductList, cfgContent);
            param.productLst = productLst;
            param.strategeData.exclusiveFlag = this.exclusiveFlag;
          }
          if (this.isSales !== '1' && this.recommendForm === '1') {
            cfgContent = [
              {
                cfgContent1: '',
                cfgContent2: '',
                cfgContent3: ''
              },
              {
                cfgContent1: '',
                cfgContent2: '',
                cfgContent3: ''
              },
              {
                cfgContent1: '',
                cfgContent2: '',
                cfgContent3: ''
              }
            ];
            productLst = this.getProductList(this.picProductList, cfgContent);
            param.productLst = productLst;
            param.strategeData.pictureUrl = this.picFileList[0].url;
            param.strategeData.exclusiveFlag = '';
          }

          // 理财师新建--指定用户--直接推荐--模板1
          if (
            this.isSales === '1' &&
            this.recommendForm === '3' &&
            this.recommendTemplate === '1'
          ) {
            cfgContent = [
              {
                cfgContent1: this.ruleForm.cfgContent1,
                cfgContent2: this.ruleForm.cfgContent1,
                cfgContent3: ''
              }
            ];
          }
          // 理财师新建--指定用户--直接推荐--模板2
          if (
            this.isSales === '1' &&
            this.recommendForm === '3' &&
            this.recommendTemplate === '2'
          ) {
            cfgContent = [
              {
                cfgContent1: this.ruleForm.cfgContent1,
                cfgContent2: this.ruleForm.cfgContent2,
                cfgContent3: this.ruleForm.cfgContent3
              }
            ];
          }
          // 理财师新建--图片推荐
          if (this.isSales === '1' && this.recommendForm === '1') {
            cfgContent = [
              {
                cfgContent1: '',
                cfgContent2: '',
                cfgContent3: ''
              }
            ];
            productLst = this.getProductList(this.picProductList, cfgContent);
            param.productLst = productLst;
            param.strategeData.pictureUrl = this.picFileList[0].url;
          }
          // 理财师新建--直接推荐
          if (this.isSales === '1' && this.recommendForm === '3') {
            productLst = this.getProductList(this.directProductList, cfgContent);
            param.productLst = productLst;
          }
          if (this.$route.query.uuid) {
            param.strategeData.oprType = 'U';
            param.strategeData.uuid = this.$route.query.uuid;
          }
          console.log('parammmm', param);
          try {
            this.isLoading = true;
            await this.requestInstance
              .setParam('/modify/recommend', param)
              .doRequest();
            this.isLoading = false;
            this.$bus.emit('close_current_tags');
            if (this.$route.query.uuid) {
              this.$message.success('编辑成功！');
            } else {
              this.$message.success('增加成功！');
            }
          } catch (msg) {
            this.$message.error(msg);
          }
          this.isLoading = false;
        });
      },
      cancel() {
        this.$bus.emit('close_current_tags');
      },
      selectionConfirmFn(from, data) {
        if (from === 'picChoose') {
          if (this.picProductList.length >= 1) {
            this.$message.error('最多选择一个产品！');
            return false;
          }
          this.picProductList.push(data);
        }
        if (from === 'directChoose') {
          if (
            this.directProductList.length >= 1 &&
            this.recommendTemplate === '1'
          ) {
            this.$message.error('最多选择一个产品！');
            return false;
          }
          if (
            this.directProductList.length >= 2 &&
            this.recommendTemplate === '2'
          ) {
            this.$message.error('最多选择两个产品！');
            return false;
          }
          if (this.directProductList.indexOf(data) !== -1) {
            this.$message.error('已选择该产品！不能重复添加！');
            return false;
          }
          this.directProductList.push(data);
        }
      },
      closeTag(arr, index) {
        arr.splice(index, 1);
      },
      updateCrowd(crowd){
        this.crowd = crowd;
      },
      updateCustomerList(customerList){
        this.customerList = customerList;
        console.log('this.customerList22', this.customerList);
      },
      updateCustomerGroupValue(value) {
        this.customerGroupValue = value;
      },
      updateRecommendType(recommendType) {
        this.recommendType = recommendType;
      },
      updatePicFileList(fileList) {
        this.picFileList = fileList;
      },
      updateCfgContent7(fileList) {
        this.cfgContent7 = fileList;
      },
      updateCfgContent4(fileList) {
        this.cfgContent4 = fileList;
      },
      updateCfgContent1(fileList) {
        this.cfgContent1 = fileList;
      },
      formatDate(currentDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hour = currentDate.getHours();
        const minites = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        return `${year}-${month}-${day} ${hour}:${minites}:${seconds}`;
      }
    }
  };
</script>
<style scoped lang="scss">
  .text-center {
    text-align: center;
  }
  .inline-block {
    display: inline-block;
  }
  .mr5 {
    margin-right: 5px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .ml30 {
    margin-left: 30px;
  }
  .ml80 {
    margin-left: 80px;
  }
  .lh50 {
    line-height: 50px;
  }
  .h240 {
    height: 240px;
  }
  .m0Auto {
    margin: 0 atuo;
  }
  .overFlowAuto {
    overflow: auto;
  }
  .strategyForm .title {
    font-size: 16px;
    font-weight: bold;
  }

  .form {
    width: 500px;
    margin-top: 20px;
  }
  .strategyForm /deep/ .el-tag--small {
    margin-right: 8px;
  }
  .iconImg /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 70px;
    height: 70px;
    line-height: 70px;
  }
  .iconImg
  /deep/
  .el-upload-list--picture-card
  .el-upload-list__item-status-label {
    display: none;
  }
  .groupChoose /deep/ .el-radio:first-child {
    margin-left: 30px;
  }
</style>
