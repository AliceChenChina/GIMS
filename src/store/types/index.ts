// store的state类型定义

import { ElPowerTreeItem } from '@/components/page/sysManager/powerList';

interface userInfo {
  userId: number,
  userName: string,
  deptId: number,
  deptName: string,
  loginName: string,
  userPowerKey: Set<string> // 用户权限信息，xxx.xxx.xxx
}

interface RootState {
  version: string,
  argEnum: Object,
  // 当前登陆用户信息
  userInfo: userInfo,
  powerListState: ElPowerTreeItem
}

export { RootState, userInfo };
