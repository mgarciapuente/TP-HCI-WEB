<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="secondary">mdi-pencil</v-icon>
        Editar Perfil
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="profileForm.name"
            label="Nombre *"
            placeholder="ej: Juan"
            variant="outlined"
            persistent-placeholder
            :rules="nameRules"
            required
            class="mb-4"
          />
          
          <v-text-field
            v-model="profileForm.surname"
            label="Apellido *"
            placeholder="ej: Pérez"
            variant="outlined"
            persistent-placeholder
            :rules="surnameRules"
            required
            class="mb-4"
          />
          
          <!-- Selector de avatar -->
          <div class="mb-4">
            <label class="text-body-2 mb-3 d-block" style="color: #666;">
              Elige tu avatar
            </label>
            <div class="d-flex flex-wrap ga-3">
              <div 
                v-for="avatar in avatarOptions"
                :key="avatar.id"
                class="avatar-option pa-2 rounded-lg cursor-pointer"
                :class="{ 'bg-green-lighten-5 border': profileForm.avatarId === avatar.id }"
                @click="profileForm.avatarId = avatar.id"
              >
                <UserAvatar 
                  :avatarId="avatar.id"
                  :size="45"
                />
              </div>
            </div>
          </div>
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
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { userService, ApiException } from '../services'
import type { UpdateUserProfile } from '../types'
import { useAuthStore } from '../stores/auth'
import UserAvatar from './UserAvatar.vue'
import { useAvatars } from '@/composables/avatars'

// Props y emits
const props = defineProps<{
  modelValue: boolean
  initialName?: string
  initialSurname?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'profileUpdated': [updatedUser: any]
}>()

// Store
const authStore = useAuthStore()

// Estado reactivo
const dialog = ref(props.modelValue)
const valid = ref(false)
const loading = ref(false)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})
const formRef = ref()

const profileForm = reactive({
  name: props.initialName || '',
  surname: props.initialSurname || '',
  avatarId: 1
})

// Composables
const { avatarOptions } = useAvatars()

// Reglas de validación
const nameRules = [
  (v: string) => !!v || 'El nombre es requerido',
  (v: string) => (v && v.length >= 2) || 'El nombre debe tener al menos 2 caracteres',
  (v: string) => (v && v.length <= 50) || 'El nombre no puede exceder 50 caracteres',
]

const surnameRules = [
  (v: string) => !!v || 'El apellido es requerido',
  (v: string) => (v && v.length >= 2) || 'El apellido debe tener al menos 2 caracteres',
  (v: string) => (v && v.length <= 50) || 'El apellido no puede exceder 50 caracteres',
]

// Watchers
watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
  if (newVal) {
    // Resetear formulario con valores iniciales
    profileForm.name = props.initialName || ''
    profileForm.surname = props.initialSurname || ''
    profileForm.avatarId = authStore.user?.metadata?.avatarId || 1
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  }
})

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
})

// Métodos
const handleCancel = () => {
  dialog.value = false
}

const handleSubmit = async () => {
  if (!valid.value || !authStore.token) return

  try {
    loading.value = true
    
    const updateData: UpdateUserProfile = {
      name: profileForm.name.trim(),
      surname: profileForm.surname.trim(),
      metadata: {
        ...authStore.user?.metadata,
        avatarId: profileForm.avatarId
      }
    }
    
    const updatedUser = await userService.updateProfile(authStore.token, updateData)
    
    // Actualizar el store con los nuevos datos del servidor
    await authStore.refreshUserProfile()
    
    // Emitir evento de actualización exitosa
    emit('profileUpdated', updatedUser)
    
    // Mostrar mensaje de éxito
    snackbar.value = { show: true, text: 'Perfil actualizado exitosamente', color: 'success' }
    
    // Cerrar modal
    dialog.value = false
    
  } catch (error: any) {
    console.error('Error al actualizar perfil:', error)
    
    let errorMessage = 'Error al actualizar el perfil'
    if (error instanceof ApiException) {
      errorMessage = error.message
    }
    
    // Mostrar mensaje de error
    snackbar.value = { show: true, text: errorMessage, color: 'error' }
    
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

.avatar-option {
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.avatar-option:hover {
  background-color: rgba(70, 93, 70, 0.1) !important;
}
</style>