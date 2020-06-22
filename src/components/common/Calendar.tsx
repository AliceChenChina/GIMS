import { CreateElement, VNode } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

export interface CalendarFirstDayAndLastDay {
  firstDay: Date,
  lastDay: Date
}

export interface CalendarCellData {
  type: 'prev-month' | 'current-month' | 'next-month', // 表示该日期的所属月份
  isSelected: boolean, // 当前单元格是否选择
  day: string // 格式化的日期格式
}

export interface CalendarScopeObject {
  data: CalendarCellData,
  date: Date
}

export type CalendarScopeRender = (scope: CalendarScopeObject) => VNode;

/*
日历组件
currentDate：当前日期，传入后自动转换为每个月第一天
scopeRender: 日历内每个单元格渲染函数
事件calendarChange: 选择当前日历的月份时返回当前日历的第一天和最后一天
 */
@Component
export default class Calendar extends Vue {
  // 当前日历的时间，需要是每个月第一天
  @Prop({ type: Date, default: () => new Date() }) currentDate!: Date;
  // 日历单元格渲染函数
  @Prop(Function) scopeRender!: CalendarScopeRender;

  get currentCalendarDate() {
    // 返回每个月第一天
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth());
  }

  calendarScope() {
    return {
      dateCell: this.scopeRender
    };
  }

  @Emit('calendarChange')
  onCalendarDayChange(value: Date): CalendarFirstDayAndLastDay {
    return Calendar.getFirstDayAndLastDay(value);
  }

  static getFirstDayAndLastDay(date: Date): CalendarFirstDayAndLastDay {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const firstDay = new Date(currentYear, currentMonth, 1); // 这个月第一天
    const lastDay = new Date(currentYear, currentMonth + 1, 0); // 这个月最后一天
    return { firstDay, lastDay };
  }

  render(h: CreateElement) {
    return (
      <el-calendar
        class="workday-calendar"
        value={this.currentCalendarDate}
        onInput={this.onCalendarDayChange}
        scopedSlots={this.calendarScope()} />
    );
  }
}
