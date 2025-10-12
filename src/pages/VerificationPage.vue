<template>
  <div class="d-flex justify-center align-center" style="min-height: 100%; padding: 20px;">
    <v-card 
      class="verification-card"
      style="width: 100%; max-width: 450px; padding: 40px; border-radius: 16px; background-color: rgba(255,255,255,0.95);"
      elevation="8"
    >
      <!-- Header con logo y título -->
      <div class="text-center mb-6">
        <v-img :src="logoImg" alt="Canasta Logo" style="width: 10em; height: 10em; margin: 0 auto;" />
        <h1 class="text-h4 mb-2" style="color: #465D46; font-weight: 600;">
          Verificar tu cuenta
        </h1>
        <p class="text-body-2" style="color: #666;">
          Hemos enviado un código de verificación a
        </p>
        <p class="text-body-2 font-weight-medium" style="color: #465D46;">
          {{ userEmail }}
        </p>
        <p class="text-body-2 mt-3" style="color: #666;">
          Ingresa el código para activar tu cuenta
        </p>
      </div>

      <!-- Formulario de verificación -->
      <v-form @submit.prevent="handleVerification" ref="formRef">
        <!-- Input para código de verificación -->
        <v-text-field
          v-model="verificationCode"
          label="Código de verificación"
          variant="outlined"
          :rules="[rules.required, rules.codeFormat]"
          class="mb-4"
          style="border-radius: 12px;"
          density="comfortable"
          placeholder="08e8cc040b7ce56c"
          :disabled="loading"
        />

        <!-- Botón de verificar -->
        <v-btn
          type="submit"
          size="large"
          block
          :loading="loading"
          style="background-color: #465D46; color: white; border-radius: 12px; padding: 12px; font-weight: 600; margin-bottom: 16px;"
          :disabled="!isFormValid"
        >
          Verificar cuenta
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

        <!-- Opción de reenviar código -->
        <div class="text-center">
          <p class="text-body-2 mb-2" style="color: #666;">
            ¿No recibiste el código?
          </p>
          <v-btn 
            variant="text" 
            @click="handleResendCode"
            :loading="resendLoading"
            :disabled="resendCooldown > 0"
            style="color: #F5844E; font-weight: 600; text-transform: none;"
          >
            {{ resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código' }}
          </v-btn>
        </div>

        <!-- Volver al registro -->
        <div class="text-center mt-3">
          <v-btn 
            variant="text" 
            @click="goBackToAuth"
            style="color: #666; text-transform: none;"
          >
            Volver al registro
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { userService, ApiException } from '../services'
import type { VerificationCode } from '../types'
import logoImg from '@/assets/logo.png'

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado reactivo
const loading = ref(false)
const resendLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const verificationCode = ref('')
const formRef = ref()
const resendCooldown = ref(0)
let cooldownInterval: number | null = null

// Email del usuario (desde la query o store)
const userEmail = computed(() => {
  return (route.query.email as string) || authStore.user?.email || 'tu email'
})

// Reglas de validación
const rules = {
  required: (value: string) => !!value || 'Este campo es obligatorio',
  codeFormat: (value: string) => {
    if (!value) return true // El required ya maneja esto
    // Código hexadecimal de 16 caracteres
    const pattern = /^[a-fA-F0-9]{16}$/
    return pattern.test(value) || 'El código debe tener 16 caracteres hexadecimales'
  }
}

// Computed
const isFormValid = computed(() => {
  return verificationCode.value && verificationCode.value.length === 16
})

// Funciones
const handleVerification = async () => {
  // Validar formulario
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Verificar la cuenta
    const verificationData: VerificationCode = {
      code: verificationCode.value.toLowerCase()
    }

    await userService.verifyAccount(verificationData)
    
    successMessage.value = '¡Cuenta verificada exitosamente! Iniciando sesión...'
    
    // Esperar un momento para mostrar el mensaje de éxito
    setTimeout(async () => {
      // Ahora hacer login automático
      await autoLogin()
    }, 1500)

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

const autoLogin = async () => {
  try {
    // Obtener las credenciales almacenadas temporalmente
    const storedEmail = route.query.email as string
    const storedPassword = route.query.password as string
    
    if (!storedEmail || !storedPassword) {
      // Si no hay credenciales, redirigir al login
      router.push('/auth/login')
      return
    }

    // Hacer login
    const authResponse = await userService.login({
      email: storedEmail,
      password: storedPassword
    })

    // Obtener el perfil del usuario
    const userProfile = await userService.getProfile(authResponse.token)

    // Guardar en el store
    authStore.setAuth(userProfile, authResponse.token)

    // Inicializar datos del usuario
    try {
      await userService.checkAndInitializeUserData(authResponse.token)
    } catch (error) {
      console.warn('No se pudieron inicializar los datos del usuario:', error)
    }

    // Redirigir al perfil
    router.push('/perfil')

  } catch (error) {
    console.error('Error en login automático:', error)
    errorMessage.value = 'Cuenta verificada, pero hubo un error al iniciar sesión. Por favor, inicia sesión manualmente.'
    
    // Redirigir al login después de un momento
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
  }
}

const handleResendCode = async () => {
  const email = userEmail.value
  if (!email || email === 'tu email') {
    errorMessage.value = 'No se pudo determinar el email. Vuelve al registro.'
    return
  }

  resendLoading.value = true
  errorMessage.value = ''

  try {
    await userService.sendVerificationCode(email)
    successMessage.value = 'Código reenviado exitosamente. Revisa tu email.'
    
    // Iniciar cooldown de 60 segundos
    startResendCooldown()

  } catch (error: any) {
    if (error instanceof ApiException) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Error al reenviar el código. Inténtalo de nuevo.'
    }
  } finally {
    resendLoading.value = false
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval!)
      cooldownInterval = null
    }
  }, 1000)
}

const goBackToAuth = () => {
  router.push('/auth/login')
}

// Lifecycle
onMounted(() => {
  // Verificar que tenemos el email necesario
  if (!userEmail.value || userEmail.value === 'tu email') {
    console.warn('No hay email para verificación, redirigiendo al registro')
    router.push('/auth/login')
  }
})

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>

<style scoped>
.verification-card {
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