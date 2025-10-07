// Servicio para manejar las operaciones de usuario con la API

import type { 
  RegistrationData, 
  Credentials, 
  AuthenticationToken, 
  GetUser, 
  NewUser, 
  UpdateUserProfile,
  PasswordChange,
  PasswordRecovery,
  PasswordReset,
  VerificationCode,
  ApiError 
} from '../types'
import { API_CONFIG, createAuthHeaders, createApiUrl } from './apiConfig'

// Clase de error personalizada para la API
export class ApiException extends Error {
  public code: number

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiException'
  }
}

// Función helper para manejar respuestas de la API
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'Error en la solicitud'
    
    try {
      const errorData: ApiError = await response.json()
      errorMessage = errorData.message || `Error ${response.status}`
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`
    }
    
    throw new ApiException(response.status, errorMessage)
  }
  
  return await response.json()
}

// Servicio de usuario
export const userService = {
  
  // Registrar nuevo usuario
  async register(userData: RegistrationData): Promise<NewUser> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.REGISTER),
      {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS, 
        body: JSON.stringify(userData)
      }
    )
    
    return handleApiResponse<NewUser>(response)
  },

  // Iniciar sesión
  async login(credentials: Credentials): Promise<AuthenticationToken> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.LOGIN),
      {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(credentials)
      }
    )
    
    return handleApiResponse<AuthenticationToken>(response)
  },

  // Obtener perfil del usuario autenticado
  async getProfile(token: string): Promise<GetUser> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.PROFILE),
      {
        method: 'GET',
        headers: createAuthHeaders(token)
      }
    )
    
    return handleApiResponse<GetUser>(response)
  },

  // Actualizar perfil del usuario
  async updateProfile(token: string, profileData: UpdateUserProfile): Promise<GetUser> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.PROFILE),
      {
        method: 'PUT',
        headers: createAuthHeaders(token),
        body: JSON.stringify(profileData)
      }
    )
    
    return handleApiResponse<GetUser>(response)
  },

  // Verificar cuenta de usuario
  async verifyAccount(verificationData: VerificationCode): Promise<void> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.VERIFY_ACCOUNT),
      {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(verificationData)
      }
    )
    
    if (!response.ok) {
      throw new ApiException(response.status, 'Error al verificar la cuenta')
    }
  },

  // Enviar código de verificación
  async sendVerificationCode(email: string): Promise<void> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.SEND_VERIFICATION),
      {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: new URLSearchParams({ email })
      }
    )
    
    if (!response.ok) {
      throw new ApiException(response.status, 'Error al enviar código de verificación')
    }
  },

  // Solicitar recuperación de contraseña
  async forgotPassword(recoveryData: PasswordRecovery): Promise<void> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.FORGOT_PASSWORD),
      {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: new URLSearchParams({ email: recoveryData.email })
      }
    )
    
    if (!response.ok) {
      throw new ApiException(response.status, 'Error al solicitar recuperación de contraseña')
    }
  },

  // Resetear contraseña
  async resetPassword(resetData: PasswordReset): Promise<void> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.RESET_PASSWORD),
      {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(resetData)
      }
    )
    
    if (!response.ok) {
      throw new ApiException(response.status, 'Error al resetear la contraseña')
    }
  },

  // Cambiar contraseña (usuario autenticado)
  async changePassword(token: string, passwordData: PasswordChange): Promise<void> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD),
      {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(passwordData)
      }
    )
    
    if (!response.ok) {
      throw new ApiException(response.status, 'Error al cambiar la contraseña')
    }
  },

  // Cerrar sesión
  async logout(token: string): Promise<void> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.LOGOUT),
      {
        method: 'POST',
        headers: createAuthHeaders(token)
      }
    )
    
    if (!response.ok) {
      throw new ApiException(response.status, 'Error al cerrar sesión')
    }
  }
}