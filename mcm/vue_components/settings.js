// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
// import VueMaterial from 'vue-material'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'

import app from './Settings.vue'
import store from './../vue_store/store.js'

// Vue.use(VueMaterial);
Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
})

new Vue({
  el: '#app',
  // template: '<app/>',
  components: { app },
  router,
  store,
  mounted: function () {
    this.$store.dispatch("FETCH_ROLES")
    this.$store.dispatch("FETCH_DATA")
    // this.$store.dispatch("CHECK_NOTIFICATIONS")

  },
  render: h => h(app)
})
