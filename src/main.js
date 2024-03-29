import Vue from 'vue';
import router from './router';
import store from './store';

import 'material-icons/iconfont/material-icons.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuesax from 'vuesax';
import 'vuesax/dist/vuesax.css';
import './assets/style/global.css';
import Index from './layout/Index.vue';

import Api from './api/Api';

Vue.use(ElementUI); // Vuesax styles
Vue.use(Vuesax, {
  theme: {
    colors: {
      primary: '#11047A',
      success: 'rgb(23, 201, 100)',
      danger: '#FF313C',
      warning: 'rgb(255, 130, 0)',
      dark: 'rgb(36, 33, 69)',
    },
  },
});
Vue.prototype.$api = Api;

new Vue({
  router,
  store,
  render: (h) => h(Index),
}).$mount('#app');
