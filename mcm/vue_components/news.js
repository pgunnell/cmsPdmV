import Vue from 'vue'
import Vuetify from 'vuetify'

import app from './News.vue'

Vue.use(Vuetify)
// Vue.config.productionTip = false;
new Vue({
  el: '#app',
  template: '<app/>',
  components: { app },
  render: h => h(app)
})