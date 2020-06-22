'use strict';

const path = require('path');

/**
 * @typedef {Object}
 * @property {string} type - 是否单页面模式，只是目录结构不同，此项一般不动
 * @property {boolean} useHistory - 支持vue-router的history模式，自动打一个跟入口页面一样的html文件到各个路由目录
 * @property {object} dev - dev模式配置
 * @property {object} build - build模式配置
 * @property {object} deploy - deploy配置
 */
module.exports = {
    // type: 'singlePage',
    // useHistory: false,
    // 上传到预发环境，支持多配置
    deploy: {
        utest: {
            // 接收上传文件的地址,绑定host 172.25.32.148 gims2-upload.jd.com
            url: 'http://gims2-upload.jd.com/',
            localPath: './dist',
            // 远端解压目录
            remotePath: '/home/dj/gims-manage-system/latest/gims-manage-system',
            callback: (resp, accessPath) => {
                if (resp.code === 1) {
                    joyer.log.notice('upload success,  http://gims-admin.jd.com');
                } else {
                    joyer.log.warning(`upload failed, ${JSON.stringify(resp)}`);
                }
            }
        },
        // deploy-receiver(https://git.jd.com/jdjr/joyer-cli-server/tree/master/deploy-receiver) 的测试配置
        test: {
            // 接收上传文件的地址,绑定host 172.25.32.148 gims-upload.jd.com
            url: 'http://gims-upload.jd.com',
            // 本地路径，默认为当前项目目录下dist文件夹，发送./dist目录下的所有内容，不包含./dist,
            localPath: './dist',
            // 远端解压目录
            remotePath: '/home/dj/gims-manage-system/latest/gims-manage-system-new',
            callback: (resp, accessPath) => {
                // console.log(resp);
                if (resp.code === 1) {
                    joyer.log.notice('upload success, http://gims-admin2.jd.com');
                } else {
                    joyer.log.warning(`upload failed, ${JSON.stringify(resp)}`);
                }
            }
        }
    }
};
