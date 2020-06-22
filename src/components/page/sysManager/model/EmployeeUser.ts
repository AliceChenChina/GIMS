import Vue from 'vue';
import { deptItem } from '@/store/modules/systemManager/types';

export interface DeptEmployeeDto {
  createdTime: string;
  lastUpdate: string;
  id: number;
  deptId: number;
  empId: number;
  creator: number;
}

class EmployeeUser {
  empId: number = 0;
  loginName: string = '';
  name: string = '';
  trueName: string = '';
  mobile: string = '';
  status: number = 1;
  creator: number = 1;
  jobnumber: string = '';
  dummyMobile: string = '';
  classLevel: string = '';
  gender: number = 0;
  idcard?: any = '';
  birthday?: any = '';
  cardNo?: any = '';
  email: string = '';
  postcode?: any = '';
  address?: any = '';
  isSales?: any = 0;
  isAreaManager: number = 0;
  leaveDate?: any = '';
  deptEmployeeDto: DeptEmployeeDto[] = [];
  deptIds: string = '';
  deptNames: string = '';
  pinCode?: any = '';
  createdTime: string = '';
  lastUpdate: string = '';
  areaId?: any;
  empIdsInArea?: any;
  area?: any;
  areaCode?: any;
  avatar: string = '';
  bank?: any;
  city?: any;
  roleIds?: any;
  duty: string = '';
  hasQualification?: any;
  hasQualificationNo?: any;
  handPassword?: any;
  joinDate?: any;
  password: string = '';
  prov?: any;
  remark?: any;
  proSales?: any;
  proSalesName?: any;
  verificationCode: string = '';
  employeeRoleDto?: any;
  employeePowerKey?: any;
  employeePowerUrl?: any;
  deptDto?: any;
  deptIdValue: Array<number> = []; // 用来编辑的部门id节点路径,一定是路径否则element ui的radio样式显示不正确

  private constructor({ employeeUser }: { employeeUser: any }) {
    this.updateData(employeeUser);
  }

  private updateData(data: any) {
    for (const entityKey of Object.keys(this)) {
      if ((this as any)[entityKey] instanceof Function) {
        continue;
      }
      // todo 不是类型安全的初始化，暂时简单跳过函数
      if (typeof (this as any)[entityKey] === 'undefined') {
        (this as any)[entityKey] = '';
      }
      if (typeof data[entityKey] === 'undefined') {
        data[entityKey] = (this as any)[entityKey];
      }
      (this as any)[entityKey] = data[entityKey];
    }
  }

  public setDeptIdWithPath(rootNode: deptItem) {
    if (!this.deptEmployeeDto || this.deptEmployeeDto.length === 0) {
      this.deptIdValue = [];
    } else {
      this.getdeptIdPath(this.deptEmployeeDto[0].deptId, rootNode);
    }
  }

  private getdeptIdPath(targetDeptId: number, rootNode: deptItem) {
    const path: Array<deptItem> = [];
    function doFind(node: deptItem) {
      path.push(node);
      if (node.deptId === targetDeptId) {
        return true;
      }
      for (const child of node.children) {
        if (doFind(child)) {
          return true;
        }
      }
      path.pop();
      return false;
    }
    doFind(rootNode);
    this.deptIdValue = path.map(item => item.deptId);
  }

  static fromJSONObject(employeeUserObject: any) {
    return new this({ employeeUser: employeeUserObject });
  }

  static getDefaultUser() {
    return new this({ employeeUser: {} });
  }

  public setData(value: any) {
    // 更新数据
    this.updateData(value);
  }

  public getJson() {
    const rt = window.JSON.parse(window.JSON.stringify(this));
    rt.deptIds = this.deptIdValue[this.deptIdValue.length - 1];
    return rt;
  }
}

export { EmployeeUser };
