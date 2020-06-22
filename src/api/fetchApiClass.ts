import request from '../utils/request';
import { ResultWrapper } from '@/api/ResultWrapper';

const CryptoJS = require('crypto-js');

export type CustomRejectHandler = (reject: Function, res: any) => void;

class FetchApi {
  basePath: string = '';
  publicKey: string = '';
  isEncrypt: boolean = true;
  encryptParam: object = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  };
  defaultHeaders: object = {
    source: 'WEBSITE',
    'Content-Type': 'application/json'
  };
  uri: string = ''; // 请求资源路径
  param: object | Array<any> = {};
  method: 'post' | 'get' = 'post';
  customRejectHandler!: CustomRejectHandler; // 自定义Promise异常处理
  resultWrapper: ResultWrapper;

  constructor({ basePath, publicKey, isEncrypt, resultWrapper }:
                {basePath: string, publicKey: string, isEncrypt: boolean, resultWrapper: ResultWrapper}) {
    this.basePath = basePath; // 请求路径前
    // this.realtyPath = '/djjf-realty';
    // this.customerPath = '/djjf-customer';
    this.publicKey = publicKey; // 加密请求参数的publicKey
    this.isEncrypt = isEncrypt; // 是否加密参数
    this.resultWrapper = resultWrapper;
  }

  /**
   * 静态工厂初始化请求类
   * @param uri
   * @param param
   * @param method
   * @returns {FetchApi}
   */
  setParam(uri: string, param: object, method: 'post' | 'get' = 'post') {
    this.uri = uri;
    this.param = param;
    console.log('param', this.param);
    this.method = method;
    return this;
  }

  /*
  基础路径
   */
  getBasePath() {
    return this.basePath;
  }

  /**
   * 设置请求方法
   * @param method
   */
  setMethod(method: 'post' | 'get') {
    this.method = method;
    return this;
  }

  /**
   * 设置请求头
   */
  setHeaders(headers: object | Array<any>) {
    this.defaultHeaders = Object.assign(this.defaultHeaders, headers);
    return this;
  }

  /**
   * 设置auth token
   * @private
   */
  _setRequestToken() {
    const token = window.localStorage.getItem('token');
    this.defaultHeaders = Object.assign(this.defaultHeaders, {
      token
    });
  }

  /**
   * 加密请求参数
   * @returns {string}
   * @private
   */
  _encryptParam(word: string) {
    const key = CryptoJS.enc.Utf8.parse(this.publicKey);
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, this.encryptParam);
    return encrypted.toString();
  }

  /*
  自定义请求promise reject处理
   */
  setRejectHandler(handler: CustomRejectHandler) {
    this.customRejectHandler = handler;
    return this;
  }

  /**
   * 进行请求，返回promise对象
   * @returns {Promise<*>}
   */
  doRequest() {
    let paramStr;
    let reqParam;
    if (!(this.param instanceof FormData)) {
      paramStr = window.JSON.stringify(this.param);
      if (this.isEncrypt) {
        // 默认不是房产需要加密请求body
        reqParam = this._encryptParam(paramStr);
      } else {
        reqParam = this.param;
      }
    } else {
      reqParam = this.param; // 上传文件data直接放formData对象
    }
    const baseUri = this.basePath;

    this._setRequestToken();
    this.resultWrapper.setFetching(request({
      url: `${baseUri}${this.uri}`,
      method: this.method,
      data: reqParam,
      headers: this.defaultHeaders
    }));
    if (this.customRejectHandler instanceof Function) {
      this.resultWrapper.setCustomRejectHandler(this.customRejectHandler);
    }
    return this.resultWrapper.getFetchedData();
  }
}

export default FetchApi;
