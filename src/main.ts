import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { useAuthStore } from './stores/auth'

// Vuetify global styles (required)
import 'vuetify/styles'

const pinia = createPinia()
const app = createApp(App)

app
  .use(pinia)
  .use(vuetify)
  .use(router)

// Inicializar autenticación después de que Pinia esté configurado
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.mount('#app')
}).catch((error) => {
  console.error('Error al inicializar autenticación:', error)
  // Montar la app aunque falle la inicialización
  app.mount('#app')
})


