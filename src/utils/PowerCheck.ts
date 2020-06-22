import { userInfo } from '@/store/types';
import { ElPowerTreeItem } from '@/components/page/sysManager/powerList';
import { Powers } from '@/utils/powers';

/*
权限验证
 */
export default class PowerCheck {
  private userInfo: userInfo;
  private noPowerFn!: Function;
  private powerListState!: ElPowerTreeItem;
  private alertFn!: Function;

  static getPowerCheck(userInfo: userInfo, powerList: ElPowerTreeItem, alertFn: Function) {
    return new this(userInfo, powerList, alertFn);
  }

  constructor(userInfo: userInfo, powerList: ElPowerTreeItem, alertFn: Function) {
    this.userInfo = userInfo;
    this.powerListState = powerList;
    this.alertFn = alertFn;
  }

  /*
  检查权限并返回一个promise
   */
  public checkPower(powerKey: Powers): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.userInfo.userPowerKey.has(powerKey)) {
        resolve(true);
      } else {
        const msg = '你没有操作权限！';
        this.alertFn(msg);
        throw new Error(msg);
        // reject(msg);
      }
    });
  }
  public checkPowerWithThrowError(powerKey: string) {
    const splitedPowerKey = powerKey.split('.');
    const powerNodeInfo = this.findPowerItemWithKey(splitedPowerKey, this.powerListState);
    if (!powerNodeInfo) return true;
    if (this.userInfo.userPowerKey.has(powerKey)) {
      return true;
    }
    const msg = `没有权限操作${powerNodeInfo.label}`;
    this.alertFn(msg);
    throw new Error(msg);
  }

  public hasPower(powerKey: string) {
    return this.userInfo.userPowerKey.has(powerKey);
  }

  private findPowerItemWithKey(splitedKeys: Array<string>, parentNode: ElPowerTreeItem) {
    function find(key: string, lv: number, parentNode: ElPowerTreeItem): ElPowerTreeItem {
      const node = parentNode.children.filter(node => {
        return node.powerKey.indexOf(key) >= 0;
      })[0];
      if (lv === splitedKeys.length - 1) {
        return node;
      }
      return node && find(splitedKeys[lv + 1], lv + 1, node);
    }
    return find(splitedKeys[0], 0, parentNode);
  }

  public catchNoPower(fn: () => void) {
    this.noPowerFn = fn;
  }
}
