import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import App from './App.vue';
import router from './router';


Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(VueCompositionApi);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
