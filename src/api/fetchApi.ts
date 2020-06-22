import FetchApi from '@/api/fetchApiClass';
import { DefaultResultWrapper, ResultWrapper } from '@/api/ResultWrapper';

export default class FetchApiFactory {
  static basePath: string = '/djjf-web';
  static publicKey = 'aUF3dHB3ZA==YHRD'; // todo 配置

  static _getDefaultFetchInstance() {
    return new FetchApi({
      basePath: FetchApiFactory.basePath,
      publicKey: FetchApiFactory.publicKey,
      isEncrypt: true,
      resultWrapper: new DefaultResultWrapper() // 默认接口返回格式解析
    });
  }

  /*
  接口基础路径，默认返回/djjf-web
   */
  static getBasePath() {
    return FetchApiFactory._getDefaultFetchInstance().basePath;
  }

  static getFetchInstance(basePath: string, isEncrypt: boolean, resultWrapper: ResultWrapper) {
    return new FetchApi({
      basePath: basePath,
      publicKey: FetchApiFactory.publicKey,
      isEncrypt: isEncrypt,
      resultWrapper: resultWrapper
    });
  }

  static setParam(uri: string, param: object | Array<any>, method?: 'get' | 'post') {
    // 如果没有设置basePath，返回默认配置fetch对象后直接调用新对象setParam函数
    const instance = FetchApiFactory._getDefaultFetchInstance();
    return instance.setParam(uri, param, method);
  }
}
