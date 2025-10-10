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

// Función asíncrona para inicializar la app
const initApp = async () => {
  try {
    // Inicializar autenticación desde localStorage
    await authStore.initAuth()
    console.log(' Autenticación inicializada:', authStore.isLoggedIn ? 'Usuario logueado' : 'Usuario no logueado')
  } catch (error) {
    console.error('Error al inicializar autenticación:', error)
    // Continuar con el montaje aunque falle la inicialización
  } finally {
    // Montar la app después de la inicialización de auth
    app.mount('#app')
  }
}

// Inicializar la aplicación
initApp()


