import { ListViewerState } from '@/types/types';
import EmployeeListVueClass from '@/components/page/sysManager/EmployeeList';
import ArgList from '@/components/page/sysManager/argList';
import WorkdayCalendar from '@/components/page/sysManager/workdayCalendar';
import { roleListStateType } from '@/store/pageConf/sysManager/roleList';

interface sysManagerState {
  deptTreeData: deptItem,
  employeeListState: ListViewerState<EmployeeListVueClass>,
  roleListState: ListViewerState<roleListStateType>,
  argListState: ListViewerState<ArgList>,
  workdayCalendarState: ListViewerState<WorkdayCalendar>
}

interface deptItem {
  deptId: number,
  parentId: number,
  name: string,
  children: Array<deptItem>
}

interface powerItem {
  powerCaption: string, // 权限名称
  powerId: number,
  powerKey: string,
  parentId: number // 父权限id
}

interface ElPowerTreeItem {
  powerId: number,
  parentId: number,
  label: string,
  powerKey: string,
  children: Array<ElPowerTreeItem>
}

export { sysManagerState, deptItem, powerItem, ElPowerTreeItem };
