import { Message } from 'element-ui';
import { CustomRejectHandler } from '@/api/fetchApiClass';

export interface ExtractedResponseResult {success: boolean, data: any, msg: string}

export abstract class ResultWrapper {
  fetchingPromise!: Promise<any>;
  customRejectHandler: CustomRejectHandler | undefined;

  setCustomRejectHandler(handler: CustomRejectHandler) {
    // 自定义reject的内容
    this.customRejectHandler = handler;
  }

  /*
  设置请求中的promise
   */
  setFetching(_fetchingPromise: Promise<any>) {
    this.fetchingPromise = _fetchingPromise;
  }

  /*
   * 解析promise，从接口数据中获取结果，错误弹出element ui错误toast
   */
  abstract async getFetchedData(): Promise<any>;

  /*
  解析出接口返回的格式
   */
  abstract extractResult(res: any): ExtractedResponseResult
}

/*
gims默认接口处理返回
 */
export class DefaultResultWrapper extends ResultWrapper {
  async getFetchedData(): Promise<any> {
    try {
      const res = await this.fetchingPromise;
      return new Promise((resolve, reject) => {
        const extractedResult: ExtractedResponseResult = this.extractResult(res);
        if (extractedResult.success) {
          extractedResult.data === null ? resolve(extractedResult) : resolve(extractedResult.data);
        } else if (extractedResult.data === 'dologin') {
          window.location.href = '/#/login'; // 退出
        } else {
          if (this.customRejectHandler instanceof Function) {
            this.customRejectHandler(reject, res);
          } else {
            reject(extractedResult.data);
          }
        }
      });
    } catch (e) {
      Message({
        message: '网络错误，请稍后重试',
        type: 'error'
      });
      throw new Error(e);
    }
  }

  extractResult(res: any): ExtractedResponseResult {
    if (parseInt(res.code) === 200 && res.succ) {
      return {
        success: true,
        data: res.data,
        msg: res.message || ''
      };
    } else if (parseInt(res.code) === 401 && !res.succ) {
      return {
        success: false,
        data: 'dologin',
        msg: res.message || ''
      };
    } else if (parseInt(res.code) === 700 && !res.succ) {
      return {
        success: true,
        data: res.message,
        msg: res.message || ''
      };
    } else {
      return {
        success: false,
        data: res.message,
        msg: res.message || ''
      };
    }
  }
}

/*
活动接口处理返回
 */
export class ActivityResultWrapper extends ResultWrapper {
  async getFetchedData(): Promise<any> {
    try {
      const res = await this.fetchingPromise;
      return new Promise((resolve, reject) => {
        const extractedResult = this.extractResult(res);
        if (extractedResult.success) {
          resolve(extractedResult.data);
        } else {
          if (this.customRejectHandler instanceof Function) {
            this.customRejectHandler(reject, res);
          } else {
            reject(extractedResult.data);
          }
        }
      });
    } catch (e) {
      Message({
        message: '网络错误，请稍后重试',
        type: 'error'
      });
      throw new Error(e);
    }
  }

  extractResult(res: any): ExtractedResponseResult {
    if (res.errorCode === '00000') {
      let data;
      if (typeof res.datas === 'undefined') {
        data = res;
      } else {
        data = res.datas;
      }
      return {
        success: true,
        msg: res.message || '',
        data
      };
    } else {
      return {
        success: false,
        msg: res.message || '',
        data: res.errorMessage
      };
    }
  }
}
