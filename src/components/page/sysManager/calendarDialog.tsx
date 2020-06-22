import { Component, Vue } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import './sysManage.scss';
import { Action, State } from 'vuex-class';
import { sysManagerState } from '@/store/modules/systemManager/types';
import { dayItem } from '@/components/page/sysManager/workdayCalendar';
import CalendarDayItemEdit from '@/components/page/sysManager/calendarDayItemEdit';
import Calendar, { CalendarFirstDayAndLastDay, CalendarScopeRender } from '@/components/common/Calendar';
import { BindingOptions } from 'vuex-class/lib/bindings';

const storeNameSpace: BindingOptions = { namespace: 'sysManager' };

@Component({
  components: {
    Calendar, 'day-edit': CalendarDayItemEdit
  }
})
export default class CalendarViewDialog extends Vue {
  @Action('queryWorkdayInCalendar', storeNameSpace) queryWorkdayInCalendar!: (arg: any) => Promise<Array<any>>;
  @State('sysManager') sysManagerState!: sysManagerState;

  loading = false;
  dialogVisible = false;
  currentDate = new Date();

  calendarRecords:Array<any> = [];

  get calendarDataMap() {
    const map = new Map<string, any>();
    for (const day of this.calendarRecords) {
      map.set(new Date(day.day).toString(), day);
    }
    return map;
  }

  showDialog() {
    this.dialogVisible = true;
  }

  hideDialog() {
    this.dialogVisible = false;
  }

  handleCalendarChange(dateObj: CalendarFirstDayAndLastDay) {
    this.currentDate = dateObj.firstDay;
    this.fetchData();
  }

  formatDate(date: Date) {
    return this.$utils.dateFormat(date, 'yyyy-mm-dd HH:MM:ss') + ' 00:00:00';
  }

  mounted() {
    setTimeout(async() => {
      this.calendarRecords = await this.queryWorkdayInCalendar(this.getLoadParam());
    });
  }

  getLoadParam() {
    // 传入时间搜索范围
    const dateObj: CalendarFirstDayAndLastDay = Calendar.getFirstDayAndLastDay(this.currentDate);
    return {
      startDate: this.formatDate(dateObj.firstDay),
      endDate: this.formatDate(dateObj.lastDay),
      page: 1,
      pageNumber: 1,
      pageSize: 999999999
    };
  }

  cellClick(dayItem: dayItem) {
    // 打开编辑
    return () => {
      (this.$refs.day_edit as CalendarDayItemEdit).showEditDialog(dayItem);
    };
  }

  get cellRender(): CalendarScopeRender {
    return (scope) => {
      const day = scope.data.day.split('-')[2];
      const dateKey = new Date(scope.date.getFullYear(),
        scope.date.getMonth(), scope.date.getDate());
      const dayItem = this.calendarDataMap.get(dateKey.toString());
      return (
        <div class='day-cell' onClick={this.cellClick(dayItem)}>
          {day}
          <div class="day-remark">
            { dayItem
              ? dayItem.remark : '' }
          </div>
        </div>
      );
    };
  }

  async fetchData() {
    this.loading = true;
    this.calendarRecords = await this.queryWorkdayInCalendar(this.getLoadParam());
    this.loading = false;
  }

  onEditSuccess() {
    this.fetchData();
    (this.$refs.day_edit as CalendarDayItemEdit).hideEditDialog();
  }

  render(h: CreateElement) {
    return (
      <el-dialog title="查看日历" visible={this.dialogVisible} width="70%"
                 {...{ on: { 'update:visible': this.hideDialog } }}>
        <calendar v-loading={this.loading}
                  ref="calendar"
                  scopeRender={this.cellRender}
                  currentDate={this.currentDate}
                  onCalendarChange={this.handleCalendarChange}/>
        <day-edit ref="day_edit" onSaveSuccess={this.onEditSuccess}/>
        <span slot="footer" class="dialog-footer">
          <el-button onClick={this.hideDialog}>关闭</el-button>
        </span>
      </el-dialog>
    );
  }
}
