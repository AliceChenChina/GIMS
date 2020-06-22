import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import utils from './utils/index';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-red/index.css'; // 样式重新覆盖
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import store from './store';
import FetchApiFactory from '@/api/fetchApi';
import upload from './utils/upload';
import plugin from './utils/plugin';
import vueBus from './vue-bus/vue-bus';
import VueParticles from 'vue-particles';
import watermark from './assets/js/watermark';

import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.use(CKEditor);

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.use(plugin);
Vue.use(vueBus);
Vue.use(VueParticles);
Vue.prototype.$axios = axios;
Vue.prototype.$utils = utils;
Vue.prototype.$fetch = FetchApiFactory;
Vue.prototype.$upload = upload;
Vue.prototype.$watermark = watermark;
Vue.prototype.$vueStore = store;

const i18n = new VueI18n({
    locale: 'zh',
    messages
});

new Vue({
    store,
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
