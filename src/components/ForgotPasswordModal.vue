<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="secondary">mdi-lock-question</v-icon>
        {{ step === 1 ? 'Recuperar Contraseña' : 'Resetear Contraseña' }}
      </v-card-title>
      
      <v-card-text class="pa-4">
        <!-- Paso 1: Solicitar código -->
        <div v-if="step === 1">
          <p class="mb-4 text-body-2" style="color: #666;">
            Ingresa tu email y te enviaremos un código para resetear tu contraseña.
          </p>
          
          <v-form ref="emailFormRef" v-model="emailValid">
            <v-text-field
              v-model="forgotPasswordForm.email"
              label="Correo electrónico *"
              type="email"
              variant="outlined"
              persistent-placeholder
              :rules="emailRules"
              required
              class="mb-4"
            />
          </v-form>
        </div>

        <!-- Paso 2: Ingresar código y nueva contraseña -->
        <div v-if="step === 2">
          <v-alert type="success" density="compact" class="mb-4">
            Código enviado a {{ forgotPasswordForm.email }}. 
            Revisa tu email (incluyendo spam).
          </v-alert>
          
          <v-form ref="resetFormRef" v-model="resetValid">
            <v-text-field
              v-model="resetPasswordForm.code"
              label="Código de verificación *"
              variant="outlined"
              persistent-placeholder
              :rules="codeRules"
              required
              class="mb-4"
              placeholder="ej: 098acc849b7cc56c"
            />
            
            <v-text-field
              v-model="resetPasswordForm.password"
              label="Nueva contraseña *"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              persistent-placeholder
              :rules="passwordRules"
              required
              class="mb-4"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
            />
          </v-form>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn 
          v-if="step === 2" 
          @click="goBackToStep1" 
          variant="text"
        >
          Volver
        </v-btn>
        <v-spacer />
        <v-btn @click="handleCancel" variant="outlined">
          Cancelar
        </v-btn>
        <v-btn 
          @click="handleSubmit"
          color="secondary"
          variant="elevated"
          :disabled="!isFormValid || loading"
          :loading="loading"
        >
          {{ step === 1 ? 'Enviar Código' : 'Resetear Contraseña' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { userService, ApiException } from '../services'
import type { PasswordRecovery, PasswordReset } from '../types'

// Props y emits
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'passwordReset': []
}>()

// Estado reactivo
const dialog = ref(props.modelValue)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})
const step = ref(1) // 1 = enviar código, 2 = resetear contraseña
const emailValid = ref(false)
const resetValid = ref(false)
const loading = ref(false)
const emailFormRef = ref()
const resetFormRef = ref()
const showPassword = ref(false)

const forgotPasswordForm = reactive({
  email: ''
})

const resetPasswordForm = reactive({
  code: '',
  password: ''
})

// Reglas de validación
const emailRules = [
  (v: string) => !!v || 'El email es requerido',
  (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Ingresa un email válido'
  }
]

const codeRules = [
  (v: string) => !!v || 'El código es requerido',
  (v: string) => (v && v.length >= 8) || 'El código debe tener al menos 8 caracteres'
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres',
  (v: string) => (v && v.length <= 100) || 'La contraseña no puede exceder 100 caracteres'
]

// Computed
const isFormValid = computed(() => {
  return step.value === 1 ? emailValid.value : resetValid.value
})

// Watchers
watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
  if (newVal) {
    resetForms()
  }
})

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
})

// Métodos
const resetForms = () => {
  step.value = 1
  forgotPasswordForm.email = ''
  resetPasswordForm.code = ''
  resetPasswordForm.password = ''
  showPassword.value = false
  
  if (emailFormRef.value) {
    emailFormRef.value.resetValidation()
  }
  if (resetFormRef.value) {
    resetFormRef.value.resetValidation()
  }
}

const goBackToStep1 = () => {
  step.value = 1
  resetPasswordForm.code = ''
  resetPasswordForm.password = ''
  if (resetFormRef.value) {
    resetFormRef.value.resetValidation()
  }
}

const handleCancel = () => {
  dialog.value = false
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  if (step.value === 1) {
    await sendRecoveryCode()
  } else {
    await resetPassword()
  }
}

const sendRecoveryCode = async () => {
  try {
    loading.value = true
    
    const recoveryData: PasswordRecovery = {
      email: forgotPasswordForm.email
    }
    
    await userService.forgotPassword(recoveryData)
    
    // Pasar al paso 2
    step.value = 2
    
  } catch (error: any) {
    console.error('Error al enviar código de recuperación:', error)
    
    let errorMessage = 'Error al enviar el código'
    if (error instanceof ApiException) {
      if (error.code === 404) {
        errorMessage = 'No existe una cuenta con ese email'
      } else {
        errorMessage = error.message
      }
    }
    
    snackbar.value = { show: true, text: errorMessage, color: 'error' }
    
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  try {
    loading.value = true
    
    const resetData: PasswordReset = {
      code: resetPasswordForm.code,
      password: resetPasswordForm.password
    }
    
    await userService.resetPassword(resetData)
    
    // Emitir evento de reseteo exitoso
    emit('passwordReset')
    
    // Cerrar modal
    dialog.value = false
    
    // Mostrar mensaje de éxito
    snackbar.value = { show: true, text: 'Contraseña cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.', color: 'success' }
    
  } catch (error: any) {
    console.error('Error al resetear contraseña:', error)
    
    let errorMessage = 'Error al resetear la contraseña'
    if (error instanceof ApiException) {
      if (error.code === 400) {
        errorMessage = 'Código inválido o expirado'
      } else {
        errorMessage = error.message
      }
    }
    
    snackbar.value = { show: true, text: errorMessage, color: 'error' }
    
  } finally {
    loading.value = false
  }
}
</script>