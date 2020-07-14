import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'

import './assets/scss/app.scss'

Vue.config.productionTip = false

// Allowing a user to edit or delete their comments and posts
// Letting users add other users as friends
// Adding better error handling using try/catch for all requests

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})