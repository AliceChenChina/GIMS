import { sysManagerState } from '@/store/modules/systemManager/types';
import { initPaginationAndTableState } from '@/store/mutations';

const sysManagerStateData: sysManagerState = {
  deptTreeData: {
    deptId: 0,
    parentId: 0,
    name: '',
    children: []
  },
  employeeListState: initPaginationAndTableState({}),
  roleListState: initPaginationAndTableState({}),
  argListState: initPaginationAndTableState({}),
  workdayCalendarState: initPaginationAndTableState({})
};

export { sysManagerStateData, sysManagerState };
