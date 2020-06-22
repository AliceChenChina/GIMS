import Vue, { VNode } from 'vue';
import PowerCheck from '@/utils/PowerCheck';
import FetchApi from '@/api/fetchApiClass';
import XScroller from '@/components/common/XScroller';

// interface一般用于描述一个对象或者函数的结构
// type用等号声明，可以实现泛型和类型合并
// https://juejin.im/post/5c2723635188252d1d34dc7d
// ListViewer使用的对象格式，使用函数绑定vm或者直接返回数组对象
// 泛型用法： https://nodelover.gitbook.io/typescript/fan-xing
// 之前js写的组件类型定义d.ts（目前看起来不行：https://github.com/vuejs/vue-loader/issues/1281）

declare interface enumArgs {
  [key: string]: string
}

// element ui 下拉框对象格式
declare interface elOptionTag {
  label: string,
  value: string | number
}

// ListViewer组件所有方法
declare interface ListViewer extends Vue {
  handleModelChange: (data: any) => void,
  statusArgsWithElOptionsTag: (groupKey: string) => Array<elOptionTag>,
  handleSelectionChange: (value: any) => void,
  handleSortChange: (value: any) => void,
  doQuery: () => void,
  doDefaultReset: () => void,
  onPagerStateChange: (params: any) => void,
  clearSelection: () => void,
  fetchData: () => void,
  paginationState: paginationState
}

// 自带element ui弹框的单选ListViewer选择框
// 自动调用隐藏表头多选按钮方法
declare interface Selector extends Vue {
  showDialog: () => void, // 显示对话框
  hideDialog: () => void // 隐藏对话框
  doCancel: () => void
}

interface paginationState {
  pageSize: number,
  currentPageNo: number,
  getAjaxParam: () => {
    pageNumber: number,
    pageSize: number
  }
}

declare type DynamicTableColumn<T> = tableColumnFunction<T> | Array<ListViewerTableColumn>;

interface DynamicComp {
  tagName: string
  options: object,
  children?: string | Array<DynamicComp> | VNode
}

declare interface ListViewerState<T> {
  // T为对应绑定的vm实例
  filterOptions?: filterOptionsFunction<T> | Array<Array<ListViewerElTagItem>>, // 筛选栏表单配置
  filterModel?: Object, // 筛选栏表单绑定数据对象
  tableColumn: tableColumnFunction<T> | Array<ListViewerTableColumn>, // 表格列属性
  tableData: {
    records: Array<any>, // any类型为后端返回的接口数据内容
    totalRecordCount: number
  },
  tableProps?: object, // 表格属性
  paginationState?: paginationState
}

// element ui组件描述对象格式
declare interface ListViewerElTagItem {
  labelName: string,
  tagName: string,
  modelName: string,
  props?: object, // element ui 提供的props属性
  options?: Array<elOptionTag>
}

// dynamicTable组件使用的column对象格式
declare interface ListViewerTableColumn {
  label: string,
  dataKey: string,
  props?: Object,
  slotComps?: Array<any> // todo 类型
}

// dynamicForm公共方法列表
type validateFn = (valid: boolean) => void | Promise<any>
declare interface DynamicForm extends Vue{
  getFormValidate: () => (fn: validateFn) => void,
  validateForm: (fn: validateFn) => void
  resetFields: void
  statusArgsWithElOptionsTag: (groupKey: string) => Array<elOptionTag>
}

// filterOptions函数返回的对象格式
// 泛型T为实际vue实例对象
declare interface filterOptionsFunction<T> {
  (vm: T): Array<Array<ListViewerElTagItem>>
}

declare interface tableColumnFunction<T> {
  (vm: T): Array<ListViewerTableColumn>
}

declare interface ValidateRule {
  validator: (rule: any, value: any, callback: (fn?: Error) => {}) => void
  required?: boolean
}

declare interface formItem {
  formLabel: string,
  modelKey: string,
  formRules?: string | Array<ValidateRule>,
  inputProps?: { [key: string]: any },
  inputAttrs?: { [key: string]: any },
  inputEvents?: { [key: string]: any },
  inputTag: string,
  inputTagOptions?: Array<elOptionTag | DynamicComp>
}

type dynamicFormState = Array<Array<formItem>> | Array<formItem>

export { ListViewerState, ListViewer, enumArgs, formItem, dynamicFormState, DynamicForm, tableColumnFunction, Selector, Upload, DynamicTableColumn, elOptionTag };

declare class Upload {
  constructor({ uploadEleId }: {uploadEleId: number})
  setUploadHandler(callback: (files: File) => void): void // 选择文件后的回调，传入选择的file对象
  triggerUpload(): void // 打开上传对话框
  clearFile(): void // 清空文件选择
  getUploadInstance(id: string): Upload // 获取当前上传文件实例
  setTypeLimit(types: Array<any>): void
  setMaxSize(maxSize: string): void
  setTypeLimitErrorHandler(fn: (validTypes: Array<any>) => void): void
  setSizeErrorHandler(fn?: Function): void
}

declare module 'vue/types/vue' {


  interface Vue {
    $utils: any // todo utils类型补充,
    $bus: {
      $emit: (eventName: string, arg?: any) => void,
      $on: (eventName: string, fn?: Function) => void,
    },
    $fetch: {
      setParam: (uri: string, param: object, method?: 'post' | 'get') => FetchApi // FetchApiFactory里的静态方法
      getBasePath: () => string
    },
    $power: PowerCheck,
    $xScroller: XScroller
    $elAlert: (options: {
      msg: string,
      onConfirm: () => any
    }) => void,
    $upload: Upload
  }
}

