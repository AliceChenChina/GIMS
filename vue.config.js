const path = require('path');
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
  // lintOnSave: 'error',
  devServer: {
    open: true, // 是否自动打开浏览器
    port: 8090,
    disableHostCheck: true, // 内网穿透
    inline: false // 关闭热重载
  },
// 配置目录别名 webpack 配置进行更细粒度的修改  https://cli.vuejs.org/zh/config/#chainwebpack
    chainWebpack: (config) => {
        // 修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('src'))
            .set('style', resolve('src/assets/css'))
            .set('img', resolve('src/assets/img'))
            .set('common', resolve('src/components/common'))
            .set('page', resolve('src/components/page'))
            .set('qq', resolve('src/assets/UEditor'))
            .set('components', resolve('src/components'));
    }
};
