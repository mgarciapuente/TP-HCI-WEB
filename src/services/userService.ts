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
import { userInitializationService } from './userInitializationService'

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
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData: ApiError = await response.json()
        errorMessage = errorData.message || `Error ${response.status}`
      } else {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`
    }

    throw new ApiException(response.status, errorMessage)
  }

  // Para respuestas exitosas, verificar si hay contenido
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  } else {
    // Para respuestas sin contenido JSON (como 200 sin body)
    return undefined as T
  }
}

// Función helper específica para respuestas void
const handleVoidResponse = async (response: Response): Promise<void> => {
  if (!response.ok) {
    let errorMessage = 'Error en la solicitud'

    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData: ApiError = await response.json()
        errorMessage = errorData.message || `Error ${response.status}`
      } else {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`
    }

    throw new ApiException(response.status, errorMessage)
  }
  // Para respuestas void exitosas, no intentamos parsear JSON
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

    return handleVoidResponse(response)
  },

  // Enviar código de verificación
  async sendVerificationCode(email: string): Promise<VerificationCode> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.USERS.SEND_VERIFICATION) + `?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
      }
    )

    return handleApiResponse<VerificationCode>(response)
  },

  // Solicitar recuperación de contraseña
  async forgotPassword(recoveryData: PasswordRecovery): Promise<void> {
    const url = `${createApiUrl(API_CONFIG.ENDPOINTS.USERS.FORGOT_PASSWORD)}?email=${encodeURIComponent(recoveryData.email)}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
    })

    return handleVoidResponse(response)
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

    return handleVoidResponse(response)
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
  },

  // Registrar nuevo usuario y redirigir a verificación
  async registerWithInitialization(userData: RegistrationData): Promise<NewUser> {
    console.log('🔴 REGISTRANDO USUARIO (requiere verificación)', userData.email)
    try {
      // Registrar el usuario - ahora requiere verificación
      const newUser = await this.register(userData)
      console.log('🔴 Usuario registrado. Verificación requerida.')
      
      return newUser
      
    } catch (error) {
      console.error('❌ Error durante el registro del usuario:', error)
      throw error
    }
  },

  // Verificar e inicializar datos si es necesario (para usuarios existentes)
  async checkAndInitializeUserData(token: string): Promise<boolean> {
    try {
      const hasData = await userInitializationService.checkIfUserHasData(token)
      
      if (!hasData) {
        console.log('� Creando datos iniciales para aplicación...')
        return await userInitializationService.initializeUserData(token)
      }
      
      return true
    } catch (error) {
      console.error('Error al verificar/inicializar datos del usuario:', error)
      return false
    }
  }
}