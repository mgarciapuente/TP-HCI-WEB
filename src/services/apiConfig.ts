// Configuración de la API basada en la documentación Swagger

export const API_CONFIG = {
  // URL base del servidor (según la documentación Swagger)
  BASE_URL: 'http://localhost:8080',
  
  // Endpoints de usuarios
  ENDPOINTS: {
    USERS: {
      REGISTER: '/api/users/register',
      LOGIN: '/api/users/login',
      PROFILE: '/api/users/profile',
      VERIFY_ACCOUNT: '/api/users/verify-account',
      FORGOT_PASSWORD: '/api/users/forgot-password',
      RESET_PASSWORD: '/api/users/reset-password',
      SEND_VERIFICATION: '/api/users/send-verification',
      CHANGE_PASSWORD: '/api/users/change-password',
      LOGOUT: '/api/users/logout'
    }
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json', // Indica que enviamos JSON al servidor
    'Accept': 'application/json'
  }
}

// Función helper para crear headers con autenticación
export const createAuthHeaders = (token: string) => ({
  ...API_CONFIG.DEFAULT_HEADERS,
  'Authorization': `Bearer ${token}`
})

// Función helper para crear URL completa
export const createApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}