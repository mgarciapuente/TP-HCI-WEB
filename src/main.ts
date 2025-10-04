import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

// Vuetify global styles (required)
import 'vuetify/styles'

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(vuetify)
  .use(router)
  .mount('#app')


