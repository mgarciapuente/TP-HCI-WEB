import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  const setAuth = (userData: any, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Cargar datos del usuario desde localStorage si existe token
  const initAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (token.value && storedUser) {
      user.value = JSON.parse(storedUser)
    } else if (token.value) {
      // Si hay token pero no datos de usuario, crear datos por defecto
      user.value = {
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        avatar: 'https://img.freepik.com/vector-premium/perfil-hombre-dibujos-animados_18591-58483.jpg'
      }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // Inicializar al crear el store
  initAuth()

  return {
    user,
    token,
    isLoggedIn,
    setAuth,
    logout,
    initAuth
  }
})