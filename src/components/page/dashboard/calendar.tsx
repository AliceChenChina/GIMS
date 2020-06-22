import { CreateElement, VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import './dashboard.scss';
import DynamicFilter, { DynamicFilterTagItem } from '@/components/common/dynamicFilter.tsx';
import { elOptionTag } from '@/types/types';

interface CalendarProductTime {
  start: string,
  end: string
}

interface CalendarProductItem {
  productId: string,
  productName: string,
  productType: string,
  nav: number,
  navDate: string,
  subscribeOpenDays: Array<CalendarProductTime>, // 申购时间
  canSubscribeOpenDays: Array<CalendarProductTime> // 可购买时间
  redemptionOpenDays: Array<CalendarProductTime>, // 开放赎回时间
  canRedemptionOpenDays: Array<CalendarProductTime>, // 可赎回时间
  recentOpenDate: string
}

enum CalendarDateType {
  canBuy = 1, subscribeOpen = 2, canRedeem = 3, redeemOpen = 4
}

@Component({
  components: {
    DynamicFilter
  }
})
export default class Calendar extends Vue {
  loading = false;
  filterModel = {
    productNames: [], // 多选是数组
    publishDateStart: new Date(),
    publishDateEnd: new Date(),
    dataType: this.defaultDataType
  };
  currentMonthFirstDate!: Date;
  currentMonthLastDate!: Date;
  calendarStartDate: Date = new Date(); // 与日期渲染绑定f
  calendarEndDate: Date = new Date(); // 与日期渲染绑定

  filterOptions: Array<Array<DynamicFilterTagItem>> = [
    [
      {
        tagName: 'el-select',
        labelName: '',
        modelName: 'productNames',
        options: [],
        props: {
          clearable: true,
          class: 'product-select',
          multiple: true,
          remote: true,
          'collapse-tags': true,
          filterable: true,
          'remote-method': (val: string) => {
            if (val) {
              this.filterOptions[0][0].options = this.getProductNameSearchOption(val);
              this.setTableScrollOffsetTop();
            }
          },
          props: {
            multiple: true
          },
          placeholder: '输入产品名称'
        },
        event: {
          focus: this.handelSelectFocus
        }
      },
      {
        labelName: '',
        tagName: 'el-date-picker',
        modelName: 'publishDateStart',
        props: {
          clearable: true,
          placeholder: '开始时间'
        }
      },
      {
        labelName: '-',
        tagName: 'el-date-picker',
        modelName: 'publishDateEnd',
        props: {
          clearable: true,
          placeholder: '结束时间'
        }
      },
      {
        tagName: 'el-select',
        labelName: '显示信息',
        modelName: 'dataType',
        options: [
          {
            label: '可买入',
            value: CalendarDateType.canBuy
          },
          {
            label: '申购开放',
            value: CalendarDateType.subscribeOpen
          },
          {
            label: '可赎回',
            value: CalendarDateType.canRedeem
          },
          {
            label: '赎回开放',
            value: CalendarDateType.redeemOpen
          }
        ],
        props: {
          class: 'choose-type',
          multiple: true,
          filterable: true,
          clearable: true,
          props: {
            multiple: true
          }
        }
      },
      {
        labelName: '',
        tagName: 'el-button-group',
        modelName: '',
        slotComps: [
          {
            tagName: 'el-button',
            innerText: '查询',
            props: {
              type: 'primary',
              icon: 'el-icon-search'
            },
            eventOn: {
              click: this.doQuery
            }
          },
          {
            tagName: 'el-button',
            innerText: '重置',
            props: {
              icon: 'el-icon-refresh-right'
            },
            eventOn: {
              click: this.resetQuery
            }
          }
        ]
      }
    ]
  ];

  calendarData: Array<CalendarProductItem> = [];
  calendarDataDisp: Array<CalendarProductItem> = [];
  onlyHeaderFixedStyle = {
    top: '0px',
    left: '0px',
    width: '0px'
  };

  contentBox!: HTMLDivElement;
  tableHeader!: HTMLDivElement; // 日历表头元素
  tableHeaderFixedLeft!: HTMLDivElement; // 固定左侧的日历表头
  onlyHeaderfixedLeft!: HTMLDivElement; // 浮动吸顶的日历表头元素

  get defaultDataType() {
    return [
      CalendarDateType.canBuy,
      CalendarDateType.subscribeOpen,
      CalendarDateType.canRedeem,
      CalendarDateType.redeemOpen
    ];
  }

  get todayDate() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  setProductRowWidthStyle() {
    // 每次日历更新数据和都需要调用
    const dashboardDiv = document.querySelectorAll('.calendar-container')[0] as HTMLDivElement;
    let width = '';
    if (!dashboardDiv) {
      width = '100%';
    } else {
      const scrollWidth = dashboardDiv.scrollWidth - 5;
      const cardBodyWidth = document.querySelectorAll('.el-card__body')[0].clientWidth;
      if (scrollWidth > cardBodyWidth) {
        width = scrollWidth + 'px';
      } else {
        width = '100%';
      }
    }
    const productRowEle = document.querySelectorAll('.product-row');
    for (const productEleDiv of productRowEle) {
      (productEleDiv as HTMLDivElement).style.width = width;
    }
  }

  created() {
    const serialized = window.localStorage.getItem('gzt_filter') as string;
    if (serialized) {
      const filterModel = window.JSON.parse(serialized);
      filterModel.publishDateStart = new Date(filterModel.publishDateStart);
      filterModel.publishDateEnd = new Date(filterModel.publishDateEnd);
      this.filterModel = filterModel;
    } else {
      this.initFirstAndLastDate();
      this.resetDate();
    }
    this.queryCalendarData();
  }

  mounted() {
    this.setTableScrollOffsetTop();
    setTimeout(() => {
      const tableScrollEle = document.querySelectorAll('.table-scroll')[0] as HTMLDivElement;

      tableScrollEle.addEventListener('scroll', (e) => {
        const scrollEle = (document.querySelectorAll('.fixed-left')[0] as HTMLDivElement);
        // 如果已经使用了scroll监听事件，那么手动更新位置
        if ((e.target as HTMLDivElement).scrollLeft > 0) {
          scrollEle.style['box-shadow'] = '5px 0 10px rgba(0,0,0,.12)';
        } else {
          scrollEle.style['box-shadow'] = '';
        }
      });
      (document.querySelectorAll('.fixed-left')[0] as HTMLDivElement).style.overflowX = 'hidden';
    });
  }

  async doQuery() {
    await this.queryCalendarData();
  }

  handelSelectFocus() {
    if (!this.filterModel.productNames.length) {
      // 没有输入内容清除下拉框数据
      this.filterOptions[0][0].options = [];
      this.setTableScrollOffsetTop();
    }
  }

  activated() {
    const onlyHeader = document.querySelectorAll('.only-header')[0] as HTMLDivElement;
    onlyHeader.style.visibility = 'hidden';
  }

  resetDate() {
    // 重置日期，设置为今天开始往后30天
    const lastDate = new Date(this.todayDate.getTime() + (3600 * 24 * 29 * 1000));
    this.filterModel.publishDateStart = this.todayDate;
    this.filterModel.publishDateEnd = lastDate;
    this.calendarStartDate = this.todayDate;
    this.calendarEndDate = lastDate;
  }

  resetQuery() {
    this.filterModel.productNames = [];
    this.filterModel.dataType = [];
    this.filterModel.dataType = [];
    this.filterModel.dataType = this.defaultDataType;
    this.resetDate();
    this.queryCalendarData();
    this.setTableScrollOffsetTop();
  }

  filterProduct(res: Array<CalendarProductItem>) {
    if (this.filterModel.productNames.length === 0) return [...res];
    return res.filter((productItem) => {
      return this.filterModel.productNames.some((seletedProduct) => {
        return seletedProduct === productItem.productName;
      });
    });
  }

  initFirstAndLastDate() {
    this.currentMonthFirstDate = this.getMonthFirstDayDate(new Date());
    this.currentMonthLastDate = this.getMonthLastDayDate(new Date());
  }

  getMonthLastDayDate(date: Date) {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    return new Date(currentYear, currentMonth + 1, 0);
  }

  getMonthFirstDayDate(date: Date) {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    return new Date(currentYear, currentMonth, 1);
  }

  formatDateToStr(date: Date) {
    return this.$utils.dateFormat(date, 'yyyy-mm-dd HH:MM:ss');
  }

  getCalendarArg() {
    const startDate = this.formatDateToStr(this.filterModel.publishDateStart);
    const endDate = this.formatDateToStr(this.filterModel.publishDateEnd);
    return {
      startDate,
      endDate,
      dataTypes: this.filterModel.dataType.join(',')
    };
  }

  checkDateDiff() {
    if (this.filterModel.publishDateStart > this.filterModel.publishDateEnd) {
      this.$message.error('开始时间不能大于结束时间！');
      return false;
    }
    const dayDiff = this.$utils.dateDiff(this.filterModel.publishDateStart, this.filterModel.publishDateEnd);
    // dayDiff为两个日期之间相差几天
    if (dayDiff >= 30) {
      // 最多显示三十个数据
      this.$message.error('日期跨度不能超过30天');
      return false;
    }
    return true;
  }

  get tableHeaderElements() {
    const startDate = this.calendarStartDate;
    const endDate = this.calendarEndDate;
    const elements: Array<VNode> = [
      (<div class="header-cell text product-name">产品名称</div>),
      (<div class="header-cell text netval">最新净值</div>),
      (<div class="header-cell text netdate">净值日期</div>)
    ];
    const today = new Date();
    for (let time = startDate.getTime(); time <= endDate.getTime(); time += 3600 * 24 * 1000) {
      const date = new Date(time);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const monthStr = this.$utils.prefixInteger(month, 2);
      const dayStr = this.$utils.prefixInteger(day, 2);
      if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && date.getDate() === today.getDate()) {
        elements.push((
          <div class="header-cell day today">今日</div>
        ));
      } else {
        elements.push((
          <div class="header-cell day">{`${monthStr}/${dayStr}`}</div>
        ));
      }
    }
    return elements;
  }

  get tableHeaderElementsStyle() {
    return {
      'grid-template-columns': `114px 114px 114px repeat(${this.tableHeaderElements.length - 3}, auto)`,
      'grid-template-rows': 'repeat(1, auto)'
    };
  }

  async queryCalendarData() {
    const uri = '/desktop/queryProductCalendar';
    if (!this.filterModel.publishDateEnd && !this.filterModel.publishDateStart) {
      this.$message.error('请选择开始时间或者结束时间');
      return;
    }
    if (!this.filterModel.publishDateEnd) {
      const startDateTime = this.filterModel.publishDateStart.getTime();
      const endDate = new Date(startDateTime + (3600 * 24 * 29 * 1000));
      this.filterModel.publishDateEnd = endDate;
    }
    if (!this.filterModel.publishDateStart) {
      const endDateTime = this.filterModel.publishDateEnd.getTime();
      const startDate = new Date(endDateTime - (3600 * 24 * 29 * 1000));
      this.filterModel.publishDateStart = startDate;
    }
    if (!this.checkDateDiff()) return;
    if (this.filterModel.dataType.length === 0) {
      this.$message.error('请至少选择一个显示信息');
      return;
    }
    this.loading = true;
    try {
      const res = await this.$fetch.setParam(uri, this.getCalendarArg()).doRequest();
      this.calendarStartDate = this.filterModel.publishDateStart;
      this.calendarEndDate = this.filterModel.publishDateEnd;
      this.calendarData = res;
      this.calendarDataDisp = this.filterProduct(res);
      this.setProductRowWidth();
      // 缓存搜索的条件
      const str = window.JSON.stringify(this.filterModel);
      window.localStorage.setItem('gzt_filter', str);
    } catch (e) {
      this.$message.error('发生错误，请稍后重试');
    }
    this.loading = false;

    const tableScrollEle = document.querySelectorAll('.table-scroll')[0] as HTMLDivElement;
    this.$xScroller.addXScroll({
      subscriber: tableScrollEle,
      path: this.$route.path,
      scrollLeft: 0,
      onXScrollCallBack: (scrollLeft: number) => {
        // 同时滚动吸顶的table header
        (this.$refs.table_fixed_header as HTMLDivElement).scrollLeft = scrollLeft;
      }
    });
    const contentBox = document.querySelectorAll('.content')[0] as HTMLDivElement;
    const tableHeader = document.querySelectorAll('.table-header')[0] as HTMLDivElement;
    const onlyHeader = document.querySelectorAll('.only-header')[0] as HTMLDivElement;
    setTimeout(() => {
      this.setOnlyHeaderFixedStyle();
      contentBox.addEventListener('scroll', () => {
        const top = 70 + 52; // 顶部黑色导航加白色导航条高度，样式写死的
        // bounding高度小于顶部黑色导航加白色导航条高度就浮动展示
        const { y } = tableHeader.getBoundingClientRect() as DOMRect;
        if (y < top) {
          onlyHeader.style.visibility = 'visible';
          this.setOnlyHeaderFixedStyle();
        } else {
          onlyHeader.style.visibility = 'hidden';
        }
      });
      this.$bus.$on('collapse', () => {
        // 处理折叠菜单吸顶日历位置
        let doReqFrame = true;
        setTimeout(() => {
          doReqFrame = false;
        }, 1000);
        const reqFrame = () => {
          if (!doReqFrame) return;
          requestAnimationFrame(() => {
            this.setOnlyHeaderFixedStyle();
            reqFrame();
          });
        };
        reqFrame();
      });
      tableScrollEle.addEventListener('scroll', () => {
        (this.$refs.table_fixed_header as HTMLDivElement).scrollLeft = tableScrollEle.scrollLeft;
      });
    }, 400);
  }

  setOnlyHeaderFixedStyle() {
    // 设置吸顶日期样式
    // 根据.content的位置决定
    if (!this.contentBox || !this.tableHeader || !this.onlyHeaderfixedLeft) {
      this.contentBox = document.querySelectorAll('.content')[0] as HTMLDivElement;
      this.tableHeader = document.querySelectorAll('.table-header')[0] as HTMLDivElement;
      this.tableHeader = document.querySelectorAll('.table-header')[0] as HTMLDivElement;
      this.tableHeaderFixedLeft = document.querySelectorAll('.table-header')[1] as HTMLDivElement;
      this.onlyHeaderfixedLeft = document.querySelectorAll('.only-header .fixed-left')[0] as HTMLDivElement;
    }
    const bounding = this.contentBox.getBoundingClientRect() as DOMRect;
    const y = bounding.y;
    const x = (this.tableHeaderFixedLeft.getBoundingClientRect() as DOMRect).x;
    const width = this.tableHeader.clientWidth + 'px';
    this.onlyHeaderFixedStyle.width = width;
    this.onlyHeaderFixedStyle.top = y + 'px';
    this.onlyHeaderFixedStyle.left = x + 'px';
    this.onlyHeaderfixedLeft.style.left = x + 'px';
    this.onlyHeaderfixedLeft.style.top = y + 'px';
  }

  handleModelChange(modelVal: any) {
    this.filterModel = { ...modelVal };
    this.setTableScrollOffsetTop();
  }

  buildProductRow(calendarProductItem: CalendarProductItem) {
    const productName = calendarProductItem.productName || '';
    const netVal = calendarProductItem.nav || 0;
    const netValDateStr = calendarProductItem.navDate || '-';
    const buildDayCellItems: Array<{
      productTimeArr: Array<CalendarProductTime>,
      type: CalendarDateType
    }> = [];
    if (calendarProductItem.canSubscribeOpenDays.length > 0) {
      // 可购买
      buildDayCellItems.push({
        productTimeArr: calendarProductItem.canSubscribeOpenDays,
        type: CalendarDateType.canBuy
      });
    }
    if (calendarProductItem.subscribeOpenDays.length > 0) {
      // 开放申购
      buildDayCellItems.push({
        productTimeArr: calendarProductItem.subscribeOpenDays,
        type: CalendarDateType.subscribeOpen
      });
    }
    if (calendarProductItem.canRedemptionOpenDays.length > 0) {
      // 可赎回
      buildDayCellItems.push({
        productTimeArr: calendarProductItem.canRedemptionOpenDays,
        type: CalendarDateType.canRedeem
      });
    }
    if (calendarProductItem.redemptionOpenDays.length > 0) {
      // 赎回开放
      buildDayCellItems.push({
        productTimeArr: calendarProductItem.redemptionOpenDays,
        type: CalendarDateType.redeemOpen
      });
    }
    // 有几个日期就横框几行
    const gridRowLen = buildDayCellItems.length; // 根据有几条产品日历有数据决定grid有几行
    const style = {
      'grid-template-columns': `114px 114px 114px repeat(${this.tableHeaderElements.length - 3}, auto)`, // 根据查询的日期范围决定grid有几列
      'grid-template-rows': `repeat(${gridRowLen}, auto)`
    };
    const gridCellStyle = {
      'grid-row-start': 1,
      'grid-row-end': 1 + gridRowLen
    };
    const colLen = (this.tableHeaderElements.length - 3) * buildDayCellItems.length;
    return (
      <div class="calendar-body product-row" style={style} data-collast={colLen + 4} data-colfirst={colLen + 2}>
        <div class="table-cell text product-name" style={gridCellStyle}>
          <p>{productName}</p>
        </div>
        <div class="table-cell text netval" style={gridCellStyle}>
          { netVal ? this.$utils.number.toDecimal(netVal, 4) : '-'}
        </div>
        <div class="table-cell text netdate" style={gridCellStyle}>
          {netValDateStr.substr(0, 10)}
        </div>
        {
          buildDayCellItems.length
            ? buildDayCellItems.map((dayItem, index) => {
              let extClass = '';
              if (buildDayCellItems.length === 1) {
                extClass = 'one-row';
              } else if (index === 0 && buildDayCellItems.length > 1) {
                extClass = 'first-row';
              } else if (index === buildDayCellItems.length - 1 && buildDayCellItems.length > 1) {
                extClass = 'last-row';
              }
              return this.buildDayCell(dayItem.productTimeArr, dayItem.type, extClass);
            })
            : this.buildDayCell([], undefined, 'one-row')
        }
      </div>
    );
  }

  // 绘制日历每个单元格
  buildDayCell(productTimeArr: Array<CalendarProductTime>, dateType?: CalendarDateType, extClass?: string) {
    // todo 周末表示
    const baseDateClass = ['table-cell', 'cell-calendar-date', extClass];
    let dateText = '';
    switch (dateType) {
      case CalendarDateType.canBuy:
        baseDateClass.push('cell-canbuy');
        dateText = '可买入';
        break;
      case CalendarDateType.subscribeOpen:
        baseDateClass.push('cell-subscription-open');
        dateText = '申购开放';
        break;
      case CalendarDateType.canRedeem:
        baseDateClass.push('cell-canredeem');
        dateText = '可赎回';
        break;
      case CalendarDateType.redeemOpen:
        baseDateClass.push('cell-redeem-open');
        dateText = '赎回开放';
        break;
    }
    const filterStartDate = this.calendarStartDate;
    const filterEndDate = this.calendarEndDate;
    const elements: Array<VNode> = [];
    const cellStartTime = filterStartDate.getTime();
    for (let time = cellStartTime; time <= filterEndDate.getTime(); time += 3600 * 24 * 1000) {
      const date = new Date(time);
      const dateClass = [...baseDateClass];
      let isWeekend = false;
      if (date.getDay() === 0 || date.getDay() === 6) {
        isWeekend = true;
      }
      if (isWeekend) {
        dateClass.push('weekend');
      }
      const testTimeInRange = (productTime: CalendarProductTime) => {
        return date > new Date(productTime.start) && date < new Date(productTime.end);
      };
      let pushedValidCell = false;
      // 时间一样重复了
      if (productTimeArr.some((productTime) =>
        new Date(productTime.start).getTime() === date.getTime())) {
        pushedValidCell = true;
        elements.push(<div class={ [...dateClass, 'radius-start'] }
                           data-text={ dateText } />);
      }
      if (productTimeArr.some((productTime) =>
        new Date(productTime.end).getTime() === date.getTime())) {
        if (pushedValidCell) {
          elements[elements.length - 1] = (<div class={ [...dateClass, 'radius-oneday'] }
                                                data-text={ dateText } />);
          continue;
        }
        pushedValidCell = true;
        elements.push(<div class={ [...dateClass, 'radius-end'] } />);
      }
      if (productTimeArr.some(testTimeInRange)) {
        pushedValidCell = true;
        elements.push((
          <div class={ dateClass } />
        ));
      }
      if (pushedValidCell) {
        continue;
      }
      // 没有日历日期项目push的话push空cell
      elements.push((
        <div class={['table-cell empty-data ', extClass, isWeekend ? 'weekend' : '']} />
      ));
    }
    return elements;
  }

  @Watch('calendarData', { deep: true })
  setProductRowWidth() {
    const productRowEle = document.querySelectorAll('.product-row');
    for (const productEleDiv of productRowEle) {
      (productEleDiv as HTMLDivElement).style.width = '100%';
    }
    setTimeout(() => {
      this.setProductRowWidthStyle();
    }, 500);
  }

  getProductNameSearchOption(productNameSearchInput) {
    if (!this.calendarData) return [];
    const rs = this.calendarData.filter((productItem) => {
      return productItem.productName.indexOf(productNameSearchInput) >= 0;
    }).map(item => {
      return {
        value: item.productName,
        label: item.productName
      };
    });
    const selected = this.filterModel.productNames.map(productName => {
      return {
        value: productName,
        label: productName
      };
    });
    this.setTableScrollOffsetTop();
    const map: Map<string, elOptionTag> = new Map();
    for (const labelItem of [...selected, ...rs]) {
      map.set(labelItem.label, labelItem);
    }
    const rt: Array<elOptionTag> = [];
    for (const [key, value] of map) {
      rt.push({
        label: key,
        value: value.value
      });
    }
    return rt;
  }

  setTableScrollOffsetTop() {
    // 设置固定的table与顶栏绝对定位位置
    const fixedLeft = (document.querySelectorAll('.fixed-left')[0] as HTMLDivElement);
    const tableScroll = (document.querySelectorAll('.table-scroll')[0] as HTMLDivElement);
    requestAnimationFrame(() => {
      fixedLeft.style.top = tableScroll.offsetTop + 'px';
      setTimeout(() => {
        fixedLeft.style.top = tableScroll.offsetTop + 'px';
      }, 100);
    });
  }

  render(h: CreateElement) {
    // 实现左边滚动固定，表格重复两遍，横向固定部分使用绝对定位固定，其余部分隐藏
    return (
      <el-card class="dashboard-calendar" v-loading={this.loading}>
        <div class="calendar-header">
          <h3>产品日历</h3>
          <div class="color-block can-buy" />
          <div class="text">可买入</div>
          <div class="color-block subscription-open" />
          <div class="text">申购开放</div>
          <div class="color-block can-redeem" />
          <div class="text">可赎回</div>
          <div class="color-block redeem-open" />
          <div class="text">赎回开放</div>
        </div>
        <dynamic-filter
          comps={this.filterOptions}
          filterModel={this.filterModel}
          onModelChange={this.handleModelChange}/>
        <div class="calendar-container table-scroll">
          <div class="calendar-body table-header" style={this.tableHeaderElementsStyle}>
            { this.tableHeaderElements }
          </div>
          {
            this.calendarDataDisp.map((productItem) => {
              return this.buildProductRow(productItem);
            })
          }
        </div>
        <div class="calendar-container fixed-left">
          <div class="calendar-body table-header" style={this.tableHeaderElementsStyle}>
            { this.tableHeaderElements }
          </div>
          {
            this.calendarDataDisp.map((productItem) => {
              return this.buildProductRow(productItem);
            })
          }
        </div>
        <div class="calendar-container only-header" ref="table_fixed_header" style={this.onlyHeaderFixedStyle}>
          <div>
            <div class="calendar-body table-header" style={this.tableHeaderElementsStyle}>
              { this.tableHeaderElements }
            </div>
            <div class="calendar-body fixed-left" style={this.tableHeaderElementsStyle}>
              { this.tableHeaderElements }
            </div>
          </div>
        </div>
      </el-card>
    );
  }
}
