import Vue from 'vue'
import VueRouter from 'vue-router';
import {routes} from '@/routes';
import {firestorePlugin} from 'vuefire'
import firebase from 'firebase'
import App from './App.vue'
import {firebaseSetting} from './setting'

Vue.config.productionTip = false

Vue.use(VueRouter);
const router = new VueRouter({
  routes
})

Vue.use(firestorePlugin)
firebase.initializeApp(firebaseSetting)
export const db = firebase.firestore()
export const auth = firebase.auth()

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
