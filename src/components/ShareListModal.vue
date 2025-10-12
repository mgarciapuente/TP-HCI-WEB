<template>
  <v-dialog v-model="isVisible" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon class="me-2" color="primary">mdi-share-variant</v-icon>
        <span>Compartir lista</span>
      </v-card-title>

      <v-card-text class="pa-4">
        <p class="text-body-2 text-grey-darken-1 mb-4">
          Comparte "<strong>{{ listName }}</strong>" con otra persona ingresando su email.
          Podrá agregar y eliminar productos de la lista.
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
        />

        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          class="mt-3"
        >
          {{ successMessage }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleCancel"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
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
import { ref, computed } from 'vue'
import { listService } from '@/services/listService'
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
  (v: string) => isValidEmail.value || 'Ingresa un email válido'
]

// Métodos
const clearError = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const resetForm = () => {
  email.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

const handleShare = async () => {
  if (!props.listId || !auth.token || !isValidEmail.value) return

  loading.value = true
  clearError()

  try {
    await listService.shareList(auth.token, props.listId, email.value.trim())
    successMessage.value = `Lista compartida exitosamente con ${email.value}`
    emit('shared', email.value)
    
    // Cerrar el modal después de 1.5 segundos
    setTimeout(() => {
      isVisible.value = false
      resetForm()
    }, 1500)

  } catch (error: any) {
    console.error('Error al compartir lista:', error)
    
    // Manejo de errores específicos
    if (error.status === 404) {
      errorMessage.value = 'El email ingresado no está registrado en el sistema'
    } else if (error.status === 400) {
      errorMessage.value = 'No se puede compartir la lista. Verifica los datos ingresados'
    } else if (error.status === 401) {
      errorMessage.value = 'No tienes permisos para compartir esta lista'
    } else {
      errorMessage.value = 'Error al compartir la lista. Intenta nuevamente'
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  isVisible.value = false
  resetForm()
}
</script>

<style scoped>
.v-card-title {
  background-color: rgba(var(--v-theme-primary), 0.06);
}
</style>