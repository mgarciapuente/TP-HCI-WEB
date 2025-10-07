<template>
  <div style="background-color:#C7D8BA; min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
    <v-card 
      class="auth-card"
      style="width: 100%; max-width: 450px; padding: 40px; border-radius: 16px; background-color: rgba(255,255,255,0.95);"
      elevation="8"
    >
      <!-- Header con logo y título -->
      <div class="text-center mb-6">
        <v-img
          :src="logoImg"
          alt="Canasta Logo"
          style="width: 60px; height: 60px; margin: 0 auto 16px;"
        />
        <h1 class="text-h4 mb-2" style="color: #465D46; font-weight: 600;">
          {{ isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </h1>
        <p class="text-body-2" style="color: #666;">
          {{ isLoginMode ? 'Accede a tu cuenta de Canasta' : 'Únete a Canasta y organiza tus compras' }}
        </p>
      </div>

      <!-- Formulario -->
      <v-form @submit.prevent="handleSubmit" ref="formRef">
        <!-- Campos para registro (nombre y apellido) -->
        <div v-if="!isLoginMode" class="mb-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="formData.name"
                label="Nombre"
                variant="outlined"
                :rules="[rules.required]"
                style="border-radius: 12px;"
                density="comfortable"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="formData.surname"
                label="Apellido"
                variant="outlined"
                :rules="[rules.required]"
                style="border-radius: 12px;"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Email -->
        <v-text-field
          v-model="formData.email"
          label="Correo electrónico"
          type="email"
          variant="outlined"
          :rules="[rules.required, rules.email]"
          class="mb-4"
          style="border-radius: 12px;"
          density="comfortable"
        />

        <!-- Contraseña -->
        <v-text-field
          v-model="formData.password"
          :label="isLoginMode ? 'Contraseña' : 'Contraseña (mínimo 6 caracteres)'"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          :rules="isLoginMode ? [rules.required] : [rules.required, rules.minLength]"
          class="mb-4"
          style="border-radius: 12px;"
          density="comfortable"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
        />

        <!-- Botón principal -->
        <v-btn
          type="submit"
          size="large"
          block
          :loading="loading"
          style="background-color: #465D46; color: white; border-radius: 12px; padding: 12px; font-weight: 600; margin-bottom: 16px;"
          :disabled="!isFormValid"
        >
          {{ isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </v-btn>

        <!-- Mensaje de error -->
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          style="border-radius: 12px;"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- Mensaje de éxito -->
        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          class="mb-4"
          style="border-radius: 12px;"
        >
          {{ successMessage }}
        </v-alert>

        <!-- Divisor -->
        <v-divider class="my-4" />

        <!-- Cambiar entre login y registro -->
        <div class="text-center">
          <p class="text-body-2 mb-2" style="color: #666;">
            {{ isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
          </p>
          <v-btn
            variant="text"
            @click="toggleMode"
            style="color: #F5844E; font-weight: 600; text-transform: none;"
          >
            {{ isLoginMode ? 'Crear una cuenta' : 'Iniciar sesión' }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { userService, ApiException } from '../services'
import type { RegistrationData, Credentials } from '../types'
import { DEV_CONFIG, logBypass } from '../config/dev'
import logoImg from '@/assets/logo.png'

// Composables
const router = useRouter()
const authStore = useAuthStore()

// Estado reactivo
const isLoginMode = ref(true)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const formRef = ref()

// Datos del formulario
const formData = ref({
  name: '',
  surname: '',
  email: '',
  password: ''
})

// Reglas de validación
const rules = {
  required: (value: string) => !!value || 'Este campo es obligatorio',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Ingresa un email válido'
  },
  minLength: (value: string) => value.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
}

// Computed
const isFormValid = computed(() => {
  if (isLoginMode.value) {
    return formData.value.email && formData.value.password
  } else {
    return formData.value.name && 
           formData.value.surname && 
           formData.value.email && 
           formData.value.password &&
           formData.value.password.length >= 6
  }
})

// Métodos
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  errorMessage.value = ''
  successMessage.value = ''
  // Limpiar formulario al cambiar de modo
  formData.value = {
    name: '',
    surname: '',
    email: '',
    password: ''
  }
}

const handleSubmit = async () => {
  // Validar formulario
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isLoginMode.value) {
      await handleLogin()
    } else {
      await handleRegister()
    }
  } catch (error: any) {
    if (error instanceof ApiException) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'
    }
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  if (DEV_CONFIG.BYPASS_AUTH) {
    // 🚨 BYPASS TEMPORAL - Simular login exitoso sin backend
    logBypass('Simulando login para:', formData.value.email)
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simular datos de usuario basados en el email ingresado
    const mockUserProfile = {
      ...DEV_CONFIG.MOCK_USER_DATA,
      name: formData.value.email.split('@')[0], // Usar parte del email como nombre
      email: formData.value.email,
    }
    
    // Guardar en el store
    authStore.setAuth(mockUserProfile, DEV_CONFIG.MOCK_TOKEN)
    
    logBypass('Login simulado exitoso')
    
    // Redirigir al perfil
    router.push('/perfil')
    return
  }

  // 🔧 CÓDIGO REAL para cuando el backend esté disponible
  const credentials: Credentials = {
    email: formData.value.email,
    password: formData.value.password
  }
  
  try {
    // Llamar al servicio de login
    const authResponse = await userService.login(credentials)
    
    // Obtener el perfil del usuario con el token
    const userProfile = await userService.getProfile(authResponse.token)
    
    // Guardar en el store
    authStore.setAuth(userProfile, authResponse.token)
    
    // Redirigir al perfil
    router.push('/perfil')
  } catch (error) {
    throw error // Re-lanzar para que sea manejado por handleSubmit
  }
}

const handleRegister = async () => {
  if (DEV_CONFIG.BYPASS_AUTH) {
    // 🚨 BYPASS TEMPORAL - Simular registro exitoso sin backend
    logBypass('Simulando registro para:', formData.value.email)
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simular verificación de email ya existe (opcional)
    if (formData.value.email === 'admin@test.com') {
      throw new Error('Este email ya está registrado')
    }
    
    logBypass('Registro simulado exitoso')
    
    // Mostrar mensaje de éxito
    successMessage.value = 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.'
    
    // Cambiar a modo login después del registro exitoso
    isLoginMode.value = true
    formData.value = {
      name: '',
      surname: '',
      email: formData.value.email, // Mantener el email
      password: ''
    }
    return
  }

  // 🔧 CÓDIGO REAL para cuando el backend esté disponible
  const registrationData: RegistrationData = {
    name: formData.value.name,
    surname: formData.value.surname,
    email: formData.value.email,
    password: formData.value.password,
    metadata: {}
  }
  
  try {
    // Llamar al servicio de registro
    await userService.register(registrationData)
    
    // Mostrar mensaje de éxito
    successMessage.value = 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.'
    
    // Cambiar a modo login después del registro exitoso
    isLoginMode.value = true
    formData.value = {
      name: '',
      surname: '',
      email: formData.value.email, // Mantener el email
      password: ''
    }
  } catch (error) {
    throw error // Re-lanzar para que sea manejado por handleSubmit
  }
}
</script>

<style scoped>
.auth-card {
  box-shadow: 0 8px 32px rgba(70, 93, 70, 0.15) !important;
}

/* Personalizar los campos de texto */
:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-opacity: 0.3;
}

:deep(.v-field--variant-outlined.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
  color: #465D46;
}

/* Personalizar el botón */
.v-btn {
  letter-spacing: 0.5px;
}
</style>