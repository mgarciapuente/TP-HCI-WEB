<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="error">mdi-delete-alert</v-icon>
        Eliminar Lista
      </v-card-title>
      
      <v-card-text class="pa-4">
        <div class="text-body-1 mb-4">
          ¿Estás seguro de que quieres eliminar la lista 
          <strong class="text-error">{{ list?.name }}</strong>?
        </div>
        
        <v-alert
          type="warning"
          variant="tonal"
          class="mb-4"
          icon="mdi-information"
        >
          <div class="text-body-2">
            <strong>Importante:</strong> Esta acción no se puede deshacer. Los productos asociados a esta lista se eliminarán de la misma.
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
          Eliminar Lista
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Lista { id: number; name: string }

const props = defineProps<{ modelValue: boolean; list: Lista | null }>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean]; 'confirmed': [list: Lista] }>()

const dialog = ref(props.modelValue)
const loading = ref(false)

watch(() => props.modelValue, (v) => dialog.value = v)
watch(dialog, (v) => emit('update:modelValue', v))

const handleCancel = () => {
  if (!loading.value) dialog.value = false
}

const handleConfirm = () => {
  if (props.list && !loading.value) {
    loading.value = true
    emit('confirmed', props.list)
  }
}

const finishLoading = () => {
  loading.value = false
  dialog.value = false
}

defineExpose({ finishLoading })
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
