import { Component, Emit, Vue } from 'vue-property-decorator';
import dynamicForm from 'common/DynamicForm.vue';
import { dayItem } from '@/components/page/sysManager/workdayCalendar';
import { DynamicForm, dynamicFormState } from '@/types/types';
import { CreateElement } from 'vue';

@Component({
  components: {
    dynamicForm
  }
})
export default class CalendarDayItemEdit extends Vue {
  loading = false;
  dialogVisible = false;
  dayItem!: dayItem;
  defaultDayItem: dayItem = {
    day: '',
    work: 0,
    remark: '',
    id: ''
  };
  dialogTitle = '';

  get formItems(): dynamicFormState {
    return [
      [
        {
          formLabel: '日期：',
          modelKey: 'day',
          formRules: 'required',
          inputTag: 'el-date-picker',
          inputProps: {
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
        }
      ],
      [
        {
          formLabel: '工作日：',
          modelKey: 'work',
          formRules: 'required',
          inputTag: 'el-radio-group',
          inputTagOptions: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        }
      ],
      [
        {
          formLabel: '备注：',
          modelKey: 'remark',
          inputTag: 'el-input'
        }
      ]
    ];
  }

  showEditDialog(dayItem?: dayItem) {
    this.dialogVisible = true;
    if (dayItem) {
      this.dialogTitle = '编辑日历';
      this.dayItem = { ...dayItem };
    } else {
      this.dialogTitle = '添加日历';
      this.dayItem = { ...this.defaultDayItem };
    }
  }

  handleFormChange(value: any) {
    this.dayItem = { ...value };
  }

  hideEditDialog() {
    this.dialogVisible = false;
  }

  saveEdit() {
    (this.$refs.workday_form as DynamicForm).getFormValidate()(async(valid: boolean) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      const uri = '/systemSetting/workDay/add';
      this.loading = true;
      try {
        const res = await this.$fetch.setParam(uri, this.dayItem).doRequest();
        if (res.code === 200) {
          this.$message.success('保存成功');
          this.emitSaveSuccess();
          this.dialogVisible = false;
        } else {
          this.$message.error(res.msg);
        }
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
        model: this.dayItem
      },
      on: {
        onFormChange: this.handleFormChange
      }
    };
    return (
      <el-dialog title={ this.dialogTitle } visible={this.dialogVisible} width="40%" append-to-body {...{ on: { 'update:visible': this.hideEditDialog } }}>
        <dynamic-form
          v-loading={this.loading}
          ref="workday_form"
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
