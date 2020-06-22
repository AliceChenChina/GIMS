import { Component, Vue, Watch } from 'vue-property-decorator';
import './report.scss';
import fetchApi from '@/api/fetchApi';
import { VNode } from 'vue';

interface ReportItemReq {
  date: string[],
  deptIds: number[],
  newCustPeriod: string
}

interface CascaderItem {
  value: any,
  label: string,
  children?: CascaderItem[]
}

interface DeptItem {
  name: string,
  parentId: number,
  deptId: number
}

const reportGMVItem = {
  pFundNewGMV: '私募新增GMV',
  pFundNewGMVWithOutFee: '私募新增GMV（去手续费）',
  pFundNewCustGMV: '私募新客GMV',
  houseGMV: '海房GMV',
  insuranceGMV: '保险GMV',
  allTotalGMV: '私募总GMV+海房GMV+保险GMV'
};

const reportAUMItem = {
  pFundAum: '私募AUM',
  pFundWithOnRoadAum: '私募AUM（含在途）',
  newPFundAum: '新增私募AUM',
  newPFundWithOnRoadAum: '新增私募AUM（含在途）',
  bindUserNum: '绑定客户数',
  bindUserAum: '绑定客户AUM',
  bindUserWithOnRoadAum: '绑定客户AUM（含在途）',
  exclusiveUserNum: '专属客户数',
  exclusiveUserAum: '专属客户AUM',
  exclusiveUserWithOnRoadAum: '专属客户AUM（含在途）',
  newIncreaseBoundedUserNum: '新增绑定客户数',
  newIncreaseBoundedUserPFundAUM: '新增绑定客户私募AUM',
  newIncreaseBoundedUserPFundWithOnRoadAUM: '新增绑定客户私募AUM（含在途）',
  newExclusiveUserNum: '新增专属客户数',
  newExclusiveUserPFundAUM: '新增专属客户私募AUM',
  newExclusiveUserWithOnRoadAUM: '新增专属客户私募AUM（含在途）'
};

const reportCustomCountItem = {
  pFundNewUserNum: '私募-新增客户数',
  pFundTradeUserNum: '私募-交易客户数',
  pFundAccTradeUserNum: '私募-累计交易客户数',
  pFundTradingUserNum: '私募-在投客户数',
  pFundTradingUserNumWithOnRoad: '私募-在投客户数（含在途）',
  houseNewUserNum: '海房-新增客户数',
  houseTradeUserNum: '海房-交易客户数',
  houseAccTradeUserNum: '海房-累计交易客户数',
  insuranceNewUserNum: '保险-新增客户数',
  insuranceTradeUserNum: '保险-交易客户数',
  insuranceAccTradeUserNum: '保险-累计交易客户数',
  allTradeUserNum: '总交易客户数',
  allAccTradeUserNum: '总累计交易客户数',
  allTradingUserNum: '总在投客户数',
  allTradingUserNumWithOnRoad: '总在投客户数（在途）',
  allNewUserNum: '总新增客户数'

};

type ReportItemDto = {
  reportFeature: string,
  reportGMVItemDto: {[P in keyof typeof reportGMVItem]: number}
  reportAUMItemDto: {[P in keyof typeof reportAUMItem]: number},
  reportCustCountItemDto: {[P in keyof typeof reportCustomCountItem]: number}
}

@Component
export default class CEReport extends Vue {
  name = 'CEReport';
  reportFeature: 'gmv' | 'aum' | 'custCount' = 'gmv';
  reqFormModel: ReportItemReq = {
    date: ['', ''],
    deptIds: [],
    newCustPeriod: '30'
  };
  deptsArray: DeptItem[] = [];
  cascaderProp = { multiple: true, checkStrictly: false, emitPath: false };
  loading = false;

  reportItemDto: ReportItemDto = {} as ReportItemDto;

  mounted() {
    this.getDepartment();
    this.doQuery();
  }

  async doQuery() {
    if (!this.reqFormModel.date) {
      this.reqFormModel.date = ['', ''];
    }
    try {
      this.loading = true;
      const arg = {
        reportFeature: this.reportFeature,
        startDate: this.reqFormModel.date[0],
        endDate: this.reqFormModel.date[1],
        deptIds: this.reqFormModel.deptIds.join(','),
        newCustPeriod: this.reqFormModel.newCustPeriod
      };
      for (const key in arg) {
        if (this.$utils.isEmptyVal(arg[key])) {
          delete arg[key];
        }
      }
      const res = await fetchApi.setParam('/report/CE/reportData', arg).doRequest();
      this.reportItemDto = res;
    } catch (e) {
      this.$message.error(e);
    }
    this.loading = false;
  }

  doReset() {
    this.reqFormModel.date = ['', ''];
    this.reqFormModel.deptIds = [];
    this.reqFormModel.newCustPeriod = '30';
    this.doQuery();
  }

  @Watch('reportFeature')
  handleReportFeatureChange() {
    this.doReset();
  }

  get cascaderOption(): CascaderItem[] {
    if (!this.deptsArray.length) return [];
    // 团队选择级联菜单
    const walkedDeptId = new Set();
    const buildTree = (deptItem: DeptItem) : CascaderItem => {
      walkedDeptId.add(deptItem.deptId);
      const cascaderItem: CascaderItem = {
        label: deptItem.name,
        value: deptItem.deptId,
        children: []
      };
      const deptItemsWithParentId = this.deptsArray.filter(deptArrayItem => deptArrayItem.parentId === deptItem.deptId);
      cascaderItem.children = deptItemsWithParentId.filter(deptItem => !walkedDeptId.has(deptItem.deptId)).map((deptItem) => buildTree(deptItem));
      if (!cascaderItem.children.length) {
        delete cascaderItem.children;
      }
      return cascaderItem;
    };
    const res: CascaderItem[] = [];
    this.deptsArray.forEach(deptItem => {
      if (!walkedDeptId.has(deptItem.deptId)) {
        res.push(buildTree(deptItem));
      }
    });
    res.push({
      label: '网销团队',
      value: -100
    });
    return res;
  }

  async getDepartment() {
    const res = await fetchApi.setParam('/systemSetting/department/querySpecial', {}).doRequest();
    this.deptsArray = res;
  }

  buildDataItem(label, numberValue, borderClass) {
    // const number = this.$utils.number.formatMoney(numberValue, 2, 0); // 后端格式化好了
    return (
      <div class={ ['data-item', borderClass] }>
        <div class="number">{ numberValue || '-' }</div>
        <div class="data-desc">
          {label}
        </div>
      </div>
    );
  }

  get mapDataItem() {
    const type = this.reportFeature;
    const colorClassArr = ['border-purple', 'border-blue', 'border-orange', 'border-yellow'];
    const rt: VNode[] = [];
    let i = 0;
    let iterDescObj;
    let data;
    if (type === 'gmv') {
      iterDescObj = reportGMVItem;
      data = this.reportItemDto.reportGMVItemDto;
    } else if (type === 'aum') {
      iterDescObj = reportAUMItem;
      data = this.reportItemDto.reportAUMItemDto;
    } else if (type === 'custCount') {
      iterDescObj = reportCustomCountItem;
      data = this.reportItemDto.reportCustCountItemDto;
    }
    if (!data || !Object.keys(data).length) return [];
    for (const dataKey in iterDescObj) {
      rt.push(this.buildDataItem(iterDescObj[dataKey], data[dataKey], colorClassArr[i % 4]));
      i += 1;
    }
    return rt;
  }

  render() {
    const cascaderOption = {
      props: {
        props: this.cascaderProp,
        options: this.cascaderOption,
        'collapse-tags': true,
        clearable: true
      },
      attrs: {
        style: 'width: 100%',
        placeholder: '全部团队'
      }
    };
    return (
      <div class="report-main" v-loading={this.loading}>
        <el-card>
          <el-tabs v-model={this.reportFeature}>
            <el-tab-pane label="GMV统计表" name="gmv" />
            <el-tab-pane label="AUM统计表" name="aum" />
            <el-tab-pane label="客户数据统计表" name="custCount" />
          </el-tabs>
          <el-form ref="el_form" label-width="140px">
            <el-form-item label="统计日期">
              <el-date-picker
                type="daterange"
                picker-options= {{
                  disabledDate: (time) => {
                    const today = new Date();
                    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    return this.reportFeature !== 'gmv' && time.getTime() >= d.getTime();
                  }
                }}
                unlink-panels={true}
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                v-model={this.reqFormModel.date}
                style="width: 100%;"
                value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item label="团队">
              <el-cascader
                v-model={this.reqFormModel.deptIds}
                {...cascaderOption}
              />
            </el-form-item>
            {
              this.reportFeature === 'gmv' &&
              <el-form-item label="新客GMV周期（天）" style="white-space:nowrap;" >
                <el-input v-model={this.reqFormModel.newCustPeriod} style="max-width: 100px;" type="number" />
              </el-form-item>
            }
            <el-form-item>
              <el-button type="primary" onClick={this.doQuery}>查询</el-button>
              <el-button onClick={this.doReset}>重置</el-button>
            </el-form-item>
          </el-form>
          <div class="data-container">
            {
              this.mapDataItem
            }
          </div>
        </el-card>
      </div>
    );
  }
}
