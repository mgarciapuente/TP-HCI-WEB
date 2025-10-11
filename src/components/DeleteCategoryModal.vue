<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="error">mdi-delete-alert</v-icon>
        Eliminar Categoría
      </v-card-title>
      
      <v-card-text class="pa-4">
        <div class="text-body-1 mb-4">
          ¿Estás seguro de que quieres eliminar la categoría 
          <strong class="text-error">{{ category?.name }}</strong>?
        </div>
        
        <v-alert
          type="warning"
          variant="tonal"
          class="mb-4"
          icon="mdi-information"
        >
          <div class="text-body-2">
            <strong>Importante:</strong> Todos los productos de esta categoría 
            se moverán automáticamente a la categoría "Sin categoría" 
            para que no se pierdan.
          </div>
        </v-alert>
        
        <div class="text-body-2 text-medium-emphasis">
          Esta acción no se puede deshacer.
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn 
          @click="handleCancel" 
          variant="outlined"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn 
          @click="handleConfirm"
          color="error"
          variant="elevated"
          :loading="loading"
          :disabled="loading"
        >
          Eliminar Categoría
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { type Category } from '../services/productsService'

// Props y emits
const props = defineProps<{
  modelValue: boolean
  category: Category | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirmed': [category: Category]
}>()

// Estado reactivo
const dialog = ref(props.modelValue)
const loading = ref(false)

// Watchers
watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
})

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
})

// Métodos
const handleCancel = () => {
  if (!loading.value) {
    dialog.value = false
  }
}

const handleConfirm = () => {
  if (props.category && !loading.value) {
    loading.value = true
    emit('confirmed', props.category)
    // El loading se desactivará cuando el padre termine la operación y cierre el modal
  }
}

// Exponer función para finalizar loading (llamada desde el padre)
const finishLoading = () => {
  loading.value = false
  dialog.value = false
}

defineExpose({
  finishLoading
})
</script>

<style scoped>
:deep(.v-btn--variant-elevated.text-error) {
  background-color: rgb(var(--v-theme-error)) !important;
  color: white !important;
}

:deep(.v-btn--variant-elevated.text-error:hover) {
  background-color: rgb(var(--v-theme-error)) !important;
  opacity: 0.9;
}
</style>