<template>
  <v-dialog v-model="isVisible" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="secondary">mdi-share-variant</v-icon>
        Compartir lista
      </v-card-title>

      <v-card-text class="pa-4">
        <p class="text-body-2 text-grey-darken-1 mb-4">
          Comparte "<strong>{{ listName }}</strong>" con otra persona ingresando su email.
          Podrá agregar y eliminar productos de la lista.
        </p>
        <p class="text-body-2 text-grey-darken-2 mb-3">
          <v-icon size="16" class="me-1">mdi-information</v-icon>
          <em>Nota: El usuario debe tener una cuenta registrada en el sistema.</em>
        </p>

        <v-text-field
          v-model="email"
          label="Email del usuario *"
          type="email"
          variant="outlined"
          :rules="emailRules"
          :error-messages="errorMessage"
          prepend-inner-icon="mdi-email"
          density="comfortable"
          @keyup.enter="handleShare"
          @input="clearError"
          @focus="clearError"
        />

        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          class="mt-3"
        >
          {{ successMessage }}
        </v-alert>

        <!-- Lista de usuarios con acceso -->
        <div v-if="sharedUsers.length > 0 || loadingUsers" class="mt-4">
          <v-divider class="mb-3"></v-divider>
          <p class="text-body-2 font-weight-medium mb-3">
            <v-icon size="16" class="me-1">mdi-account-multiple</v-icon>
            Personas con acceso a la lista:
          </p>
          
          <v-progress-linear v-if="loadingUsers" indeterminate class="mb-3"></v-progress-linear>
          
          <div v-for="user in sharedUsers" :key="user.id" class="d-flex align-center justify-space-between pa-2 mb-2 bg-grey-lighten-5 rounded">
            <div class="d-flex align-center">
              <v-icon color="grey-darken-1" class="me-2">mdi-account</v-icon>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ user.name && user.surname ? `${user.name} ${user.surname}` : user.email }}
                </div>
                <div v-if="user.name && user.surname" class="text-caption text-grey-darken-1">
                  {{ user.email }}
                </div>
              </div>
            </div>
            <v-btn
              size="small"
              variant="outlined"
              color="error"
              @click="revokeAccess(user)"
              :disabled="loadingUsers"
            >
              <v-icon size="16" class="me-1">mdi-account-remove</v-icon>
              Revocar
            </v-btn>
          </div>
          
          <p v-if="!loadingUsers && sharedUsers.length === 0" class="text-caption text-grey-darken-1 text-center pa-3">
            No hay usuarios con acceso compartido a esta lista.
          </p>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="handleCancel"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="secondary"
          variant="elevated"
          @click="handleShare"
          :loading="loading"
          :disabled="!isValidEmail || !email.trim()"
        >
          Compartir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { listService } from '@/services/listService'
import type { SharedUser } from '@/types/listTypes'
import { useAuthStore } from '@/stores/auth'

interface Props {
  modelValue: boolean
  listId: number | null
  listName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'shared': [email: string]
}>()

const auth = useAuthStore()

// Estado del componente
const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const sharedUsers = ref<SharedUser[]>([])
const loadingUsers = ref(false)

// Computed
const isVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Reglas de validación
const emailRules = [
  (v: string) => !!v || 'El email es requerido',
  (_v: string) => isValidEmail.value || 'Ingresa un email válido'
]

// Watcher para cargar usuarios cuando se abre el modal
watch(() => props.modelValue, (newValue) => {
  if (newValue && props.listId) {
    loadSharedUsers()
  }
})

// Métodos
const clearError = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const resetForm = () => {
  email.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  sharedUsers.value = []
}

const handleShare = async () => {
  if (!props.listId || !auth.token || !isValidEmail.value) return

  loading.value = true
  clearError()

  try {
    await listService.shareList(auth.token, props.listId, email.value.trim())
    successMessage.value = `Lista compartida exitosamente con ${email.value}`
    emit('shared', email.value)
    
    // Recargar lista de usuarios compartidos
    await loadSharedUsers()
    
    // Limpiar solo el campo de email, mantener el modal abierto para ver la lista actualizada
    email.value = ''
    
    // Limpiar mensaje después de un tiempo
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (error: any) {
    console.error('Error al compartir lista:', error)
    
    // Manejo de errores específicos basado en el código de estado HTTP
    if (error.code === 404 || error.status === 404) {
      errorMessage.value = `El email "${email.value}" no está registrado en el sistema. La persona debe crear una cuenta primero.`
    } else if (error.code === 400 || error.status === 400) {
      errorMessage.value = 'No se puede compartir la lista. Verifica que el email esté escrito correctamente.'
    } else if (error.code === 401 || error.status === 401) {
      errorMessage.value = 'No tienes permisos para compartir esta lista.'
    } else if (error.code === 409 || error.status === 409) {
      errorMessage.value = 'Esta lista ya está compartida con este usuario.'
    } else if (error.code === 403 || error.status === 403) {
      errorMessage.value = 'No puedes compartir la lista contigo mismo.'
    } else {
      // Usar el mensaje del servidor si está disponible, o mensaje genérico
      const serverMessage = error.message || error.response?.data?.message
      errorMessage.value = serverMessage || 'Error al compartir la lista. Intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}

// Cargar usuarios con acceso a la lista
const loadSharedUsers = async () => {
  if (!props.listId || !auth.token) return
  
  loadingUsers.value = true
  try {
    const users = await listService.getSharedUsers(auth.token, props.listId)
    sharedUsers.value = users || []
  } catch (error) {
    console.error('Error al cargar usuarios compartidos:', error)
    sharedUsers.value = []
  } finally {
    loadingUsers.value = false
  }
}

// Revocar acceso de un usuario
const revokeAccess = async (user: SharedUser) => {
  if (!props.listId || !auth.token) return
  
  try {
    await listService.revokeShare(auth.token, props.listId, user.id)
    successMessage.value = `Acceso revocado para ${user.name || user.email}`
    // Recargar la lista de usuarios
    await loadSharedUsers()
    // Limpiar mensaje después de un tiempo
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error al revocar acceso:', error)
    errorMessage.value = 'Error al revocar acceso. Intenta nuevamente.'
  }
}

const handleCancel = () => {
  isVisible.value = false
  resetForm()
}
</script>

<style scoped>
:deep(.v-btn--variant-elevated.text-secondary) {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
}

:deep(.v-btn--variant-elevated.text-secondary:hover) {
  background-color: rgb(var(--v-theme-secondary)) !important;
  opacity: 0.9;
}
</style>