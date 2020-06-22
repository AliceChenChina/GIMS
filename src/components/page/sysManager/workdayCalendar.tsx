import { CreateElement } from 'vue';
import { Component, Emit, Vue } from 'vue-property-decorator';
import ListViewer from 'common/ListViewer.vue';
import './sysManage.scss';
import { Action, Mutation, State } from 'vuex-class';
import { sysManagerState } from '@/store/modules/systemManager/types';
import { BindingOptions } from 'vuex-class/lib/bindings';
import { DynamicForm, dynamicFormState } from '@/types/types';
import dynamicForm from 'common/DynamicForm.vue';
import CalendarDayItemEdit from '@/components/page/sysManager/calendarDayItemEdit';
import CalendarViewDialog from './calendarDialog';
import { Powers } from '@/utils/powers';

const storeNameSpace: BindingOptions = { namespace: 'sysManager' };

export interface dayItem {
  day: string,
  work: 0 | 1
  remark: string,
  id: string
}

@Component({
  components: {
    dynamicForm
  }
})
class AddYearWorkDay extends Vue {
  loading = false;
  dialogVisible = false;
  form = {
    year: 0,
    remark: ''
  };

  get formItems(): dynamicFormState {
    return [
      [
        {
          formLabel: '年份：',
          modelKey: 'year',
          formRules: 'required',
          inputTag: 'el-input',
          inputProps: {
            type: 'number'
          }
        }
      ]
    ];
  }

  showEditDialog() {
    this.form.year = new Date().getFullYear();
    this.dialogVisible = true;
  }

  handleFormChange(value: any) {
    this.form = { ...value };
  }

  hideEditDialog() {
    this.dialogVisible = false;
  }

  saveEdit() {
    (this.$refs.add_year_form as DynamicForm).getFormValidate()(async(valid: boolean) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      const uri = '/systemSetting/workDay/addGroupYearWorkDay';
      this.loading = true;
      try {
        this.$elAlert({
          msg: '确认要初始化' + this.form.year + '年内交易日吗？',
          onConfirm: async() => {
            try {
              this.loading = true;
              await this.$fetch.setParam(uri, this.form).doRequest();
              this.loading = false;
              this.$message.success('保存成功！');
              this.emitSaveSuccess();
            } catch (msg) {
              this.$message.error(msg);
            }
            this.loading = false;
          }
        });
      } catch (msg) {
        this.$message.error(msg);
      }
      this.loading = false;
    });
  }

  @Emit('saveSuccess')
  emitSaveSuccess() {}

  render(h: CreateElement) {
    const dyFormProps = {
      props: {
        'label-width': '120px',
        form: this.formItems,
        model: this.form
      },
      on: {
        onFormChange: this.handleFormChange
      }
    };
    return (
      <el-dialog title="初始化年休息日" visible={this.dialogVisible} width="40%" {...{ on: { 'update:visible': this.hideEditDialog } }}>
        <dynamic-form
          v-loading={this.loading}
          ref="add_year_form"
          {...dyFormProps}
        />
        <span slot="footer" class="dialog-footer">
          <el-button onClick={this.hideEditDialog}>取 消</el-button>
          <el-button type="primary" onClick={this.saveEdit}>保 存</el-button>
        </span>
      </el-dialog>
    );
  }
}

@Component({
  components: {
    ListViewer,
    'add-year': AddYearWorkDay,
    'calendar-view-dialog': CalendarViewDialog,
    'calendar-edit-dialog': CalendarDayItemEdit
  }
})
export default class WorkdayCalendar extends Vue {
  @State('sysManager') sysManagerState!: sysManagerState;
  @Mutation('SET_WORKDAY_CALENDAR_VIEWER_STATE',
    storeNameSpace
  ) setViewerState!: Function;
  @Action('queryWorkday', storeNameSpace) queryWorkday!: (arg: any) => Promise<void>;

  loading = false;

  get tableViewerState() {
    return this.sysManagerState.workdayCalendarState;
  }

  created() {
    this.setViewerState();
    this.fetchData();
  }

  getLoadParam() {
    const state = this.tableViewerState;
    return { ...state.filterModel, ...state.paginationState!.getAjaxParam() };
  }

  async editDay(dayItem: dayItem) {
    await this.$power.checkPower(Powers.sysCalendarEdit);
    (this.$refs.day_edit as CalendarDayItemEdit).showEditDialog(dayItem);
  }

  async addDay() {
    await this.$power.checkPower(Powers.sysCalendarAdd);
    (this.$refs.day_edit as CalendarDayItemEdit).showEditDialog();
  }

  async addYear() {
    await this.$power.checkPower(Powers.sysCalendarAddByYear);
    (this.$refs.year_add as AddYearWorkDay).showEditDialog();
  }

  async removeDay(dayItem: dayItem) {
    await this.$power.checkPower(Powers.sysCalendarDel);
    const itemDayTime = new Date(dayItem.day).getTime();
    const currentTime = new Date().getTime();
    if (itemDayTime < currentTime) {
      this.$message.error('当日(含)之前数据不可删除');
    } else {
      this.$elAlert({
        msg: '确认删除这条数据吗？',
        onConfirm: async() => {
          const uri = '/systemSetting/workDay/delete';
          this.loading = true;
          try {
            this.loading = true;
            await this.$fetch.setParam(uri, { id: dayItem.id }).doRequest();
            this.loading = false;
            this.$message.success('删除成功！');
            this.fetchData();
          } catch (msg) {
            this.$message.error(msg);
          }
          this.loading = false;
        }
      });
    }
  }

  onEditSuccess() {
    this.fetchData();
    (this.$refs.day_edit as CalendarDayItemEdit).hideEditDialog();
  }

  onYearAddSuccess() {
    this.fetchData();
    (this.$refs.year_add as AddYearWorkDay).hideEditDialog();
  }

  async showCalendarView() {
    await this.$power.checkPower(Powers.sysCalendarView);
    (this.$refs.calendar_view_dialog as CalendarViewDialog).showDialog();
  }

  async fetchData() {
    this.loading = true;
    await this.queryWorkday(this.getLoadParam());
    this.loading = false;
  }

  render(h: CreateElement) {
    const listViewerProps = {
      props: {
        context: this,
        state: this.tableViewerState
      },
      on: {
        onFetchData: this.fetchData
      }
    };
    return (
      <el-card class="workday-list" v-loading={this.loading}>
        <list-viewer ref="data_viewer" {...listViewerProps} />
        <calendar-edit-dialog ref="day_edit" onSaveSuccess={this.onEditSuccess}/>
        <add-year ref="year_add" onSaveSuccess={this.onYearAddSuccess}/>
        <calendar-view-dialog ref="calendar_view_dialog"/>
      </el-card>
    );
  }
}
