
import request from '../utils/request';

let BaseApi = 'https://ms.jr.jd.com';

const origin = location.origin;
if (origin.indexOf('minner.jr.jd.com') !== -1) {
    // 预发环境
    BaseApi = 'http://t.jsfgateway.jr.jd.com';
}
if (origin.indexOf('lee.jr.jd.com') !== -1 || origin.indexOf('localhost') !== -1 || origin.indexOf('gims-new.jd.com') !== -1) {
    // 测试环境
    BaseApi = 'https://www.easy-mock.com/mock/5d50f9d5181c4850ab085d27';
}
const configUrl = {
    // 页面数据接口
    getBaseTable: BaseApi + '/ms/table/list'// 查询用户权益账户接口
};

export const fetchData = (query) => {
    return request({
        url: configUrl.getBaseTable,
        method: 'post',
        data: query
    });
};
