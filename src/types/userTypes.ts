// Tipos basados en la documentación Swagger para la sección Users

// Datos para registro de usuario
export interface RegistrationData {
  email: string
  name: string
  surname: string
  password: string
  metadata?: object
}

// Datos para login
export interface Credentials {
  email: string
  password: string
}

// Respuesta del token de autenticación
export interface AuthenticationToken {
  token: string
}

// Datos del usuario (respuesta completa)
export interface User {
  id: number
  email: string
  name: string
  surname: string
  password?: string
  metadata?: UserMetadata
  updatedAt: string
  createdAt?: string
}

// Datos del usuario para obtener perfil (sin password)
export interface GetUser {
  id: number
  name: string
  surname: string
  email: string
  metadata?: UserMetadata
  updatedAt?: string
  createdAt?: string
}

// Metadatos del usuario
export interface UserMetadata {
  avatarId?: number
}

// Datos para actualizar perfil de usuario
export interface UpdateUserProfile {
  name?: string
  surname?: string
  metadata?: UserMetadata
}

// Datos para cambio de contraseña
export interface PasswordChange {
  currentPassword: string
  newPassword: string
}

// Datos para recuperación de contraseña
export interface PasswordRecovery {
  email: string
}

// Datos para resetear contraseña
export interface PasswordReset {
  code: string
  password: string
}

// Código de verificación
export interface VerificationCode {
  code: string
}

// Respuesta de error de la API
export interface ApiError {
  code: number
  message: string
}

// Usuario creado (respuesta del registro)
export interface NewUser {
  id: number
  email: string
  name: string
  surname: string
  metadata?: object
  updatedAt: string
  createdAt: string
}