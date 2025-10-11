<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="#465D46">mdi-lock-reset</v-icon>
        Cambiar Contraseña
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="passwordForm.currentPassword"
            label="Contraseña actual *"
            :type="showCurrentPassword ? 'text' : 'password'"
            variant="outlined"
            persistent-placeholder
            :rules="currentPasswordRules"
            required
            class="mb-4"
            :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showCurrentPassword = !showCurrentPassword"
          />
          
          <v-text-field
            v-model="passwordForm.newPassword"
            label="Nueva contraseña *"
            :type="showNewPassword ? 'text' : 'password'"
            variant="outlined"
            persistent-placeholder
            :rules="newPasswordRules"
            required
            class="mb-4"
            :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showNewPassword = !showNewPassword"
          />

          <v-text-field
            v-model="passwordForm.confirmPassword"
            label="Confirmar nueva contraseña *"
            :type="showConfirmPassword ? 'text' : 'password'"
            variant="outlined"
            persistent-placeholder
            :rules="confirmPasswordRules"
            required
            class="mb-4"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="handleCancel" variant="outlined">
          Cancelar
        </v-btn>
        <v-btn 
          @click="handleSubmit"
          color="secondary"
          variant="elevated"
          :disabled="!valid || loading"
          :loading="loading"
        >
          Cambiar Contraseña
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { userService, ApiException } from '../services'
import type { PasswordChange } from '../types'
import { useAuthStore } from '../stores/auth'

// Props y emits
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'passwordChanged': []
}>()

// Store
const authStore = useAuthStore()

// Estado reactivo
const dialog = ref(props.modelValue)
const valid = ref(false)
const loading = ref(false)
const formRef = ref()

// Estados para mostrar/ocultar contraseñas
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Reglas de validación
const currentPasswordRules = [
  (v: string) => !!v || 'La contraseña actual es requerida',
]

const newPasswordRules = [
  (v: string) => !!v || 'La nueva contraseña es requerida',
  (v: string) => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres',
  (v: string) => (v && v.length <= 100) || 'La contraseña no puede exceder 100 caracteres',
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Debes confirmar la nueva contraseña',
  (v: string) => v === passwordForm.newPassword || 'Las contraseñas no coinciden',
]

// Watchers
watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
  if (newVal) {
    resetForm()
  }
})

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
})

// Métodos
const resetForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const handleCancel = () => {
  dialog.value = false
}

const handleSubmit = async () => {
  if (!valid.value || !authStore.token) return

  try {
    loading.value = true
    
    const changeData: PasswordChange = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    }
    
    await userService.changePassword(authStore.token, changeData)
    
    // Emitir evento de cambio exitoso
    emit('passwordChanged')
    
    // Cerrar modal
    dialog.value = false
    
    // Mostrar mensaje de éxito
    alert('Contraseña cambiada exitosamente')
    
  } catch (error: any) {
    console.error('Error al cambiar contraseña:', error)
    
    let errorMessage = 'Error al cambiar la contraseña'
    if (error instanceof ApiException) {
      // Manejar errores específicos
      if (error.code === 401) {
        errorMessage = 'La contraseña actual es incorrecta'
      } else if (error.code === 400) {
        errorMessage = 'Los datos de la contraseña son inválidos'
      } else {
        errorMessage = error.message
      }
    }
    
    alert(errorMessage)
    
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card-title {
  background-color: rgba(70, 93, 70, 0.1);
}
</style>