import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GetUser } from '../types'
import { userService } from '../services'
import { DEV_CONFIG, logBypass } from '../config/dev'

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
    if (DEV_CONFIG.BYPASS_AUTH) {
      //  BYPASS TEMPORAL - No llamar al endpoint de logout
      logBypass('Logout sin llamar al backend')
    } else {
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
    }
    
    // Limpiar estado local
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    if (DEV_CONFIG.BYPASS_AUTH) {
      logBypass('Logout local completado')
    }
  }

  // Cargar datos del usuario desde localStorage si existe token
  const initAuth = async () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedToken && storedUser) {
      if (DEV_CONFIG.BYPASS_AUTH) {
        // BYPASS TEMPORAL - No verificar con API
        logBypass('Cargando usuario desde localStorage sin verificar API')
        user.value = JSON.parse(storedUser)
        token.value = storedToken
        logBypass('Usuario cargado desde localStorage')
        return
      }

      try {
        // 🔧 CÓDIGO REAL para cuando el backend esté disponible
        // Verificar que el token sigue siendo válido obteniendo el perfil
        const userProfile = await userService.getProfile(storedToken)
        user.value = userProfile
        token.value = storedToken
      } catch (error) {
        console.error('Token inválido, limpiando sesión:', error)
        // Si el token no es válido, limpiar todo
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        user.value = null
        token.value = null
      }
    }
  }

  // Función para refrescar datos del usuario
  const refreshUserProfile = async () => {
    if (DEV_CONFIG.BYPASS_AUTH) {
      //  BYPASS TEMPORAL - No refrescar desde API
      logBypass('No refrescando perfil desde API')
      return
    }

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