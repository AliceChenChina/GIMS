import { Component, Vue, Watch } from 'vue-property-decorator';
import ListViewer from 'common/ListViewer.vue';
import dynamicForm from 'common/DynamicForm.vue';
import EmployeeEdit from './EmployeeEdit';
import { State, Mutation, Action } from 'vuex-class';
import { DynamicForm, DynamicTableColumn, formItem } from '@/types/types';
import { sysManagerState } from '@/store/modules/systemManager/state';
import { BindingOptions } from 'vuex-class/lib/bindings';
import { CreateElement } from 'vue';
import { ElPowerTreeItem } from '@/store/modules/systemManager/types';
import './sysManage.scss';
import DynamicTable from '@/components/common/DynamicTable.vue';
import FormDialog from '@/components/common/FormDialog';

const storeNameSpace: BindingOptions = { namespace: 'sysManager' };

interface PowerItem {
  powerId?: number,
  powerKey: string,
  powerType: number,
  powerIcon: string,
  powerCaption: string, // 权限标题
  powerUrl: string,
  isShow: number,
  parentId: number,
  seq: number,
  parentIdStr: string // 父节点显示
}

enum PowerType {
  module = 1,
  page = 2,
  feature = 3
}

const getDefaultPower = (): PowerItem => {
  return {
    powerKey: '',
    powerType: 1,
    powerIcon: '',
    powerCaption: '',
    powerUrl: '',
    isShow: 0,
    parentId: 0,
    seq: 0,
    parentIdStr: ''
  };
};

const getPowerFormState = (vm: PowerList | PowerEditDialog) => {
  const state: Array<formItem> = [
    {
      formLabel: '权限标题:',
      modelKey: 'powerCaption',
      formRules: 'required',
      inputProps: {
      },
      inputTag: 'el-input'
    },
    {
      formLabel: '权限KEY:',
      formRules: 'required',
      modelKey: 'powerKey',
      inputProps: {
        disabled: false
      },
      inputTag: 'el-input'
    },
    {
      formLabel: '权限父节点',
      modelKey: 'parentIdStr',
      formRules: 'required',
      inputTag: 'el-input',
      inputProps: {
        placeholder: '选择父节点...'
      },
      inputEvents: {
        focus: () => {
          (vm as PowerList).chooseParentVisible = true;
        }
      }
    },
    {
      formLabel: '权限URL:',
      modelKey: 'powerUrl',
      inputProps: {
      },
      inputTag: 'el-input'
    },
    {
      formLabel: '排序：',
      modelKey: 'seq',
      inputProps: {
      },
      inputTag: 'el-input'
    },
    {
      formLabel: '权限类型：',
      modelKey: 'powerType',
      inputTag: 'el-radio-group',
      inputTagOptions: [
        {
          label: '模块',
          value: PowerType.module
        },
        {
          label: '页面',
          value: PowerType.page
        },
        {
          label: '功能',
          value: PowerType.feature
        }
      ]
    }
  ];
  state[2].inputProps!.disabled = vm instanceof PowerEditDialog;
  return state;
};

@Component({
  components: {
    dynamicForm
  }
})
class PowerEditDialog extends FormDialog<PowerItem> {
  dialogTitle: string = '';
  addParentId = 0; // 新增权限父id

  get defaultFormModel(): PowerItem {
    return getDefaultPower();
  }

  get formState(): Array<Array<formItem>> | Array<formItem> {
    return getPowerFormState(this);
  }

  async saveEdit() {
    this.formValidate(async(valid) => {
      if (!valid) {
        this.$message.error('请检查输入');
        return;
      }
      let uri, arg;
      this.getFormRef().getFormValidate();
      if (this.isAdd) {
        // 新增权限
        arg = { ...this.formModel };
        arg.parentId = this.addParentId;
        uri = '/systemSetting/power/addPower';
      } else {
        uri = '/systemSetting/power/updatePower';
        arg = { ...this.formModel };
      }
      try {
        this.loading = true;
        await this.$fetch.setParam(uri, arg).doRequest();
        await this.$store.dispatch('getPowerList');
        this.emitSaveSuccess();
        this.$message.success('保存权限成功！');
      } catch (e) {
        this.$message.error(e);
      }
      this.loading = false;
    });
  }

  render(h: CreateElement): any {
    return super.renderElDialog(h, this);
  }
}

@Component({
  components: {
    ListViewer, EmployeeEdit, dynamicForm, DynamicTable, PowerEditDialog
  }
})
export default class PowerList extends Vue {
  @State('sysManager') sysManagerState!: sysManagerState;
  @State powerListState!: ElPowerTreeItem;
  name: string = 'PowerEdit';
  loading: boolean = false;
  defaultKeys: Array<number> = [0];
  formModel: PowerItem = {} as PowerItem;
  currentPowerItem!: ElPowerTreeItem;
  currentPowerItemChildrenList: Array<ElPowerTreeItem> = [];
  chooseParentVisible = false;
  choosedNewParentId = 0;
  isRoot = false;

  get powerTreeState(): Array<ElPowerTreeItem> {
    return [this.powerListState];
  };

  get defaultFormModel(): PowerItem {
    return getDefaultPower();
  }

  get formState(): Array<Array<formItem>> | Array<formItem> {
    return getPowerFormState(this);
  }

  created() {
    // this.setRoleListViewerState('power_list');
  }

  handleFormChange(val: any) {
    this.formModel = { ...val };
  }

  activated() {
    this.formModel = { ...this.defaultFormModel };
  }

  // 查询当前权限信息
  async getPowerDetail(powerTreeItem: ElPowerTreeItem) {
    if (this.loading) return;
    const arg = {
      powerId: powerTreeItem.powerId,
      parentId: powerTreeItem.parentId
    };
    this.isRoot = arg.parentId === -1;
    this.loading = true;
    const res = await this.$fetch.setParam('/systemSetting/power/getPower', arg).doRequest();
    this.currentPowerItem = powerTreeItem;
    // 获取当前权限信息的子权限信息
    await this.getChildrenPower();
    this.loading = false;
    this.formModel = { ...res };
    if (!this.isRoot) {
      this.formModel.parentIdStr = this.getParentIdStr(res.parentId);
    }
  }

  async getChildrenPower() {
    // 获取当前节点子权限
    const arg = {
      powerId: this.currentPowerItem.powerId,
      parentId: this.currentPowerItem.parentId
    };
    this.loading = true;
    this.currentPowerItemChildrenList = await this.$fetch.setParam('/systemSetting/power/queryChildrenPower', arg).doRequest();
    this.loading = false;
  }

  chooseParent(powerTreeItem: ElPowerTreeItem) {
    if (powerTreeItem.powerId === this.formModel.powerId) {
      this.$message.error('不能将自身节点作为父节点');
    }
    this.choosedNewParentId = powerTreeItem.powerId;
  }

  selectParent() {
    this.formModel.parentId = this.choosedNewParentId;
    this.chooseParentVisible = false;
    this.formModel.parentIdStr = this.getParentIdStr(this.formModel.parentId);
  }

  getParentIdStr(powerId: number): string {
    function find(node: ElPowerTreeItem): string {
      if (powerId === node.powerId) {
        return node.label;
      }
      for (const child of node.children) {
        const rs = find(child);
        if (rs) return rs;
      }
      return '';
    }
    return find(this.powerTreeState[0]);
  }

  async refreshPower() {
    const p1 = this.$store.dispatch('getPowerList');
    const p2 = this.getPowerDetail(this.currentPowerItem);
    const p3 = this.getChildrenPower();
    await p1;
    await p2;
    await p3;
  }

  updatePower() {
    if (this.loading) return;
    if (this.isRoot) {
      this.$message.error('根节点不能编辑');
      return;
    }
    if (this.formModel.seq.toString().length > 4) {
      this.$message.error('排序位数不能超过4');
      return;
    }
    (this.$refs.edit_form as DynamicForm).validateForm(async(valid) => {
      if (!valid) return;
      const uri = '/systemSetting/power/updatePower';
      const arg = { ...this.formModel };
      delete arg.parentIdStr;
      try {
        this.loading = true;
        await this.$fetch.setParam(uri, arg).doRequest();
        setTimeout(() => {
          this.defaultKeys[1] = this.formModel.powerId as number;
        });
        await this.refreshPower();
        this.$message.success('保存权限成功！');
      } catch (e) {
        this.$message.error(e);
      }
      this.loading = false;
    });
  }

  showPowerItemEditDialog(powerItem: PowerItem) {
    (this.$refs.power_edit as PowerEditDialog).showEditDialog(powerItem);
    (this.$refs.power_edit as PowerEditDialog).formModel.parentIdStr = this.currentPowerItem.label;
  }

  onEditSuccess() {
    (this.$refs.power_edit as PowerEditDialog).hideEditDialog();
    this.refreshPower();
  }

  addSubPowerItem(powerItem: ElPowerTreeItem) {
    const dialogRef = (this.$refs.power_edit as PowerEditDialog);
    dialogRef.addParentId = powerItem.powerId;
    dialogRef.showEditDialog();
    dialogRef.formModel.parentIdStr = this.currentPowerItem.label;
  }

  delPowerItem(powerItem: PowerItem) {
    this.$elAlert({
      msg: '确认删除这个权限吗？',
      onConfirm: async() => {
        const uri = '/systemSetting/power/delPower';
        const arg = { ...powerItem };
        this.loading = true;
        try {
          await this.$fetch.setParam(uri, arg).doRequest();
          this.$message.success('操作成功!');
          await this.refreshPower();
          this.loading = false;
        } catch (e) {
          this.$message.error(e);
          this.loading = false;
        }
      }
    });
  }

  get subPermissionColumn(): DynamicTableColumn<this> {
    return [
      {
        label: '操作',
        dataKey: '',
        props: {
          formatter: (row: PowerItem, column: any, cellValue: any, index: number) => {
            return (
              <div>
                <el-button type="text" onClick={
                  () => {
                    this.showPowerItemEditDialog(row);
                  }
                }>编辑</el-button>
                <el-button type="text" onClick={ () => {
                  this.delPowerItem(row);
                } }>删除</el-button>
              </div>
            );
          }
        }
      },
      {
        label: '权限标题',
        dataKey: 'powerCaption',
        props: {}
      },
      {
        label: '权限KEY',
        dataKey: 'powerKey',
        props: {}
      },
      {
        label: '权限URL',
        dataKey: 'powerUrl',
        props: {}
      },
      {
        label: '权限类型',
        dataKey: 'powerType',
        props: {
          formatter: (row: PowerItem) => {
            switch (row.powerType) {
              case PowerType.feature:
                return '功能点';
              case PowerType.page:
                return '页面';
              case PowerType.module:
                return '模块';
            }
          }
        }
      },
      {
        label: '排序',
        dataKey: 'seq',
        props: {}
      }
    ];
  };

  render(h: CreateElement) {
    const powerTreeProps = {
      label: 'name',
      children: 'children',
      'node-key': 'powerId',
      'default-expanded-keys': this.defaultKeys,
      data: this.powerTreeState,
      'expand-on-click-node': false // 只有点击小三角展开子权限
    };
    const powerTree = {
      props: powerTreeProps,
      on: {
        'node-click': this.getPowerDetail
      }
    };
    const parentChoose = {
      props: powerTreeProps,
      on: {
        'node-click': this.chooseParent
      }
    };
    const dyFormProps = {
      props: {
        'label-width': '120px',
        form: this.formState,
        model: this.formModel
      },
      on: {
        onFormChange: this.handleFormChange
      }
    };
    return (
      <div class="power-list-edit" v-loading={ this.loading }>
        <el-row>
          <el-col span={ 12 } className="table-view">
            <el-card>
              <el-tree ref="power_tree" className="power-list-tree" { ...powerTree } />
            </el-card>
          </el-col>
          <el-col span={ 12 }>
            {
              this.currentPowerItem ? (
              <el-card class="power-edit">
                <dynamic-form
                  ref="edit_form"
                  {...dyFormProps}
                />
                <div style="padding-left: 38px">
                  <el-button type="primary" onClick={ this.updatePower }>保 存</el-button>
                </div>
              </el-card>) : ''
            }
            {
              this.currentPowerItem ? (
                <el-card style="padding: 15px" class="subpower">
                  <h3>{this.currentPowerItem.label}-子权限</h3>
                  <div class="subpower-op">
                    <el-button type="primary" onClick={() => { this.addSubPowerItem(this.currentPowerItem); }}>添加子权限</el-button>
                  </div>
                  <dynamic-table
                    column={ this.subPermissionColumn }
                    data={ this.currentPowerItemChildrenList }
                  />
                </el-card>
              ) : ''
            }
          </el-col>
        </el-row>
        <el-dialog title="选择新的父节点" visible={ this.chooseParentVisible }
                   width="60%" {...{ on: { 'update:visible': () => { this.chooseParentVisible = false; } } }}>
          <el-tree ref="power_tree" className="power-list-tree" { ...parentChoose } />
          <span slot="footer" class="dialog-footer">
            <el-button onClick={ () => { this.chooseParentVisible = false; } }>取 消</el-button>
            <el-button type="primary" onClick={ this.selectParent }>确 定</el-button>
          </span>
        </el-dialog>
        <power-edit-dialog ref="power_edit" onSaveSuccess={ this.onEditSuccess } />
      </div>
    );
  }
}
