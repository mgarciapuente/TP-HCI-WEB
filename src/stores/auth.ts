import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GetUser } from '../types'
import { userService } from '../services'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<GetUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  // Actions
  const setAuth = (userData: GetUser, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {

    // 🔧 CÓDIGO REAL para cuando el backend esté disponible
    // Llamar al endpoint de logout si hay token
    if (token.value) {
      try {
        await userService.logout(token.value)
      } catch (error) {
        console.error('Error al cerrar sesión en el servidor:', error)
        // Continuar con el logout local aunque falle el servidor
      }
    }


    // Limpiar estado local
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Cargar datos del usuario desde localStorage si existe token
  const initAuth = async () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    console.log(' Inicializando auth...', { hasToken: !!storedToken, hasUser: !!storedUser })

    if (storedToken && storedUser) {
      try {
        // Primero intentar usar los datos almacenados
        const parsedUser = JSON.parse(storedUser)
        user.value = parsedUser
        token.value = storedToken
        
        console.log(' Datos cargados desde localStorage:', parsedUser.email)

        // 🔧 CÓDIGO REAL para cuando el backend esté disponible
        // Verificar que el token sigue siendo válido obteniendo el perfil
        try {
          const userProfile = await userService.getProfile(storedToken)
          // Actualizar con datos frescos del servidor
          user.value = userProfile
          localStorage.setItem('user', JSON.stringify(userProfile))
          console.log(' Token validado con el servidor')
        } catch (apiError) {
          console.warn('No se pudo validar el token con el servidor (posiblemente modo bypass):', apiError)
          // En modo bypass, mantener los datos del localStorage
          // Solo limpiar si es un error de autenticación real
        }
        
      } catch (error) {
        console.error(' Error al parsear datos almacenados, limpiando sesión:', error)
        // Si hay error parseando los datos, limpiar todo
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        user.value = null
        token.value = null
      }
    } else {
      console.log('No hay sesión almacenada')
    }
  }

  // Función para refrescar datos del usuario
  const refreshUserProfile = async () => {
    // 🔧 CÓDIGO REAL para cuando el backend esté disponible
    if (token.value) {
      try {
        const userProfile = await userService.getProfile(token.value)
        user.value = userProfile
        localStorage.setItem('user', JSON.stringify(userProfile))
      } catch (error) {
        console.error('Error al refrescar perfil de usuario:', error)
        throw error
      }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    setAuth,
    logout,
    initAuth,
    refreshUserProfile
  }
})