import Vue from "vue"
import Vuelidate from "vuelidate"
import App from "./App.vue"

// sync store and router...
import { sync } from "vuex-router-sync"
import router from "./router"
import store from "./store"
sync(store, router)
Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
