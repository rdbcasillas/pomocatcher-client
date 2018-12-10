import Vue from 'vue';
import App from './App.vue';
import Autocomplete from 'v-autocomplete'
import router from './router';
import firebase from 'firebase'

Vue.config.productionTip = false;
let app = null;
Vue.use(Autocomplete)

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      render: h => h(App),
      components: {
        Autocomplete,
      }
    }).$mount('#app');
  }
})