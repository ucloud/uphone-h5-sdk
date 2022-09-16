import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import $ from 'jquery'
import request from "./utils/request"
import "./utils/directives"

axios.defaults.withCredentials = true;
Vue.prototype.$request = request
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  axios,
  $,
  render: h => h(App)
}).$mount('#app')