// Configuración de la API basada en la documentación Swagger

// Helper para mapear respuestas de la API que pueden venir en diferentes formatos
export const mapApiResponse = (data: any, expectedKey: string = 'data') => {
  // Si es un array directo, lo devolvemos tal como está
  if (Array.isArray(data)) {
    return {
      [expectedKey]: data,
      totalCount: data.length,
      totalPages: 1,
      currentPage: 1
    }
  }
  
  // Si tiene la estructura {data: [...], pagination: {...}}
  if (data.data && Array.isArray(data.data)) {
    return {
      [expectedKey]: data.data,
      totalCount: data.pagination?.totalCount || data.data.length,
      totalPages: data.pagination?.totalPages || 1,
      currentPage: data.pagination?.currentPage || 1,
      ...data.pagination // Incluir toda la información de paginación
    }
  }
  
  // Si ya tiene la estructura esperada o es un objeto individual, lo devolvemos tal como está
  return data
}

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
    },
    LISTS: {
      ROOT: '/api/shopping-lists'
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