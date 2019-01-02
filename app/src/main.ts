import '@mdi/font/css/materialdesignicons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import Vue from 'vue';
import '@/styles/index.scss';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './stores';
import './registerServiceWorker';


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
