<<<<<<< HEAD
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import VueTheMask from 'vue-the-mask'

Vue.use(VueTheMask)
=======
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueTheMask from "vue-the-mask";
Vue.use(VueTheMask);
>>>>>>> e01c0f714b67f6cfd38639b53b2203d9c88c79b2

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  VueTheMask,
  render: h => h(App)
}).$mount("#app");