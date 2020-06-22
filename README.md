# gims-manage-system #
基于Vue.js + Element UI 的后台管理系统解决方案。

# HOST配置访问 #
```172.25.32.148  gims-admin.jd.com```

# bash上传访问 #
```bash cpgims.sh```

## 前言 ##
该方案作为一套多功能的后台框架模板，适用于绝大部分的后台管理系统（Web Management System）开发。基于vue.js,使用vue-cli@3.2.3脚手架快速生成项目目录，引用Element UI组件库，方便开发快速简洁好看的组件。分离颜色样式，支持手动切换主题色，而且很方便使用自定义主题色。
（已经升级到 vue-cli@3.2.3，请更新依赖）

## 功能 ##
- [x] Element UI
- [x] 登录/注销
- [x] Dashboard
- [x] 表格
- [x] Tab选项卡
- [x] 表单
- [x] 图表 :bar_chart:
- [x] 富文本编辑器
- [x] markdown编辑器
- [x] 图片拖拽/裁剪上传
- [x] 支持切换主题色 :sparkles:
- [x] 列表拖拽排序
- [x] 权限测试
- [x] 404 / 403
- [x] 三级菜单
- [x] 自定义图标
- [x] 可拖拽弹窗
- [x] 国际化

## 安装步骤 ##
```
git clone http://git.jd.com/gims/gims-manage-system.git      // 下载到本地
cd gims-manage-system    // 进入模板目录
npm install              // 安装项目依赖，等待安装完成之后，安装失败可用 cnpm 或 yarn

// 开启服务器，浏览器访问 http://localhost:8080
npm run serve

// 执行构建命令，生成的dist文件夹放在服务器下即可访问
npm run build
```
## 组件使用说明与演示 ##

### vue-schart ###
vue.js封装sChart.js的图表组件
<p><a href="https://www.npmjs.com/package/vue-schart"><img src="https://img.shields.io/npm/dm/vue-schart.svg" alt="Downloads"></a></p>

```html
<template>
    <div>
        <schart  class="wrapper"
				:canvasId="canvasId"
				:type="type"
				:data="data"
				:options="options"
		></schart>
    </div>
</template>
	
<script>
    import Schart from 'vue-schart';        // 导入Schart组件
    export default {
        data: function(){
            return {
                canvasId: 'myCanvas',       // canvas的id
                type: 'bar',                // 图表类型
                data: [
                    {name: '2014', value: 1342},
                    {name: '2015', value: 2123},
                    {name: '2016', value: 1654},
                    {name: '2017', value: 1795},
                ],
                options: {                  // 图表可选参数
                    title: 'Total sales of stores in recent years'
                }
            }
        },
        components: {
            Schart
        }
    }
</script>
<style>
.wrapper{
	width: 7rem;
	height: 5rem;
}
</style>
```

## 其他注意事项 ##
### 一、如果我不想用到上面的某些组件呢，那我怎么在模板中删除掉不影响到其他功能呢？ ###

举个栗子，我不想用 Vue-Quill-Editor 这个组件，那我需要分四步走。

第一步：删除该组件的路由，在目录 src/router/editShareForm.js 中，找到引入改组件的路由，删除下面这段代码。

```JavaScript
{
    // 富文本编辑器组件
    path: '/editor',
    component: resolve => require(['../components/page/VueEditor.vue'], resolve) 
},
```

第二步：删除引入该组件的文件。在目录 src/components/page/ 删除 VueEditor.vue 文件。

第三步：删除该页面的入口。在目录 src/components/common/Sidebar.vue 中，找到该入口，删除下面这段代码。
	
```js
{
	index: 'editor',
	title: '富文本编辑器'
},
```

第四步：卸载该组件。执行以下命令：
	
	npm un vue-quill-editor -S

完成。

### 二、如何切换主题色呢？ ###

第一步：打开 src/main.js 文件，找到引入 element 样式的地方，换成浅绿色主题。

```javascript
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
```

第二步：打开 src/App.vue 文件，找到 style 标签引入样式的地方，切换成浅绿色主题。

```javascript
@import "../static/css/main.css";
@import "../static/css/color-dark.css";     /*深色主题*/
/*@import "../static/css/theme-green/color-green.css";   !*浅绿色主题*!*/
```

第三步：打开 src/components/common/Sidebar.vue 文件，找到 el-menu 标签，把 background-color/text-color/active-text-color 属性去掉即可。

###有关eslint
代码强制要求eslint进行格式规范，如果不规范会编译报错，规范采用standard标准，具体参阅https://standardjs.com/readme-zhcn.html和https://eslint.vuejs.org/rules

#####相关命令
* `vue-cli-service lint` 手动检查一次代码规范
* `vue-cli-service lint --fix` 自动修复代码中出现的代码规范问题

####相关代码规范
* 变量命名规范：使用let和const命名，**禁止使用var**。变量，函数命名使用小驼峰，避免出现下划线，拼音
* 使用===进行判断
* 等号，小于号，大于号左右留空格，参数逗号后面跟一个空格
* 字符串使用es6字符串模板，不要使用加号进行字符串拼接
* 所有代码（模板代码，script，style）使用两个空格缩进
* methods里面统一使用someMethod() {}简写，不使用someMethod: function() {}这种写法
* import组件使用@号alias方法进行导入，或者当前路径(./)，不使用../返回上一层或多层目录进行导入
* fucntion() {} 括号后面跟一个空格 
* css class命名使用中划线法
* 不使用that = this方法，methods里面函数统一使用箭头函数（=>）
* 不出现声明但未使用的变量
* api相关调用代码，关键业务逻辑需要有注释体现
* 只要是api有返回数据的接口，都统一提交到store里面，组件里通过mapState或者mapGetters获取数据
* // 双斜杠注释后面跟一个空格

####提交代码强制转换为lf：
`git config --global core.autocrlf input   `

####nginx配置

host配置：`127.0.0.1 gims-new.jd.com`
http服务配置：
```
server {
    server_name gims-new.jd.com;
    proxy_buffering    off;
	 # web api
    location /djjf-web/ {
	client_max_body_size 500M;
	#proxy_pass http://10.13.248.62:8080;	
        proxy_pass http://172.25.49.143:8080;
        #proxy_pass http://localhost:8080;
        #proxy_pass http://10.13.246.138:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For roxy_add_x_forwarded_for;
    } 
	location /djjf-realty/ {
        client_max_body_size 500M;
        proxy_pass http://10.222.9.53:8001/;
	proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For roxy_add_x_forwarded_for;
    } 
	location /djjf-customer/ {
        client_max_body_size 500M;
        proxy_pass http://172.25.49.210:8004/;
	proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For roxy_add_x_forwarded_for;
    } 
    location / {
        proxy_pass http://127.0.0.1:8090/;
    }
}
```
