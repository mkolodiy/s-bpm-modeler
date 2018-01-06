import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import store from '@/store/'
import '@/api/feathers-client'
import Notifications from 'vue-notification'
import VModal from 'vue-js-modal'

Vue.use(Vuetify)
Vue.use(Notifications)
Vue.use(VModal)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
