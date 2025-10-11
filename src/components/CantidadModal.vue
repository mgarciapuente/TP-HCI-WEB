<template>
  <v-dialog v-model="dialogProxy" max-width="420">
    <v-card>
      <v-card-title>{{ modalTitle }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model.number="localQuantity" label="Cantidad" type="number" min="0.01" step="0.01" />
          <v-select v-model="localUnit" :items="units" label="Unidad" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="handleCancel">Cancelar</v-btn>
        <v-btn color="primary" @click="handleSave">{{ mode === 'edit' ? 'Guardar' : 'Agregar' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
const props = defineProps<{
  modelValue: boolean,
  quantity?: number,
  unit?: string,
  mode?: 'add' | 'edit',
  title?: string
}>()
const emit = defineEmits(['update:modelValue', 'save'])

const localQuantity = ref(props.quantity ?? 1)
const localUnit = ref(props.unit ?? 'unidades')
const units = ['unidades', 'kg', 'gr', 'lt', 'ml', 'paquete']

const modalTitle = computed(() => {
  if (props.title) return props.title
  return props.mode === 'edit' ? 'Editar cantidad' : 'Agregar producto'
})

const dialogProxy = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

watch(() => props.modelValue, (val) => {
  if (val) {
    localQuantity.value = props.quantity ?? 1
    localUnit.value = props.unit ?? 'unidades'
  }
})

const handleCancel = () => {
  emit('update:modelValue', false)
}
const handleSave = () => {
  emit('save', { quantity: localQuantity.value, unit: localUnit.value })
  emit('update:modelValue', false)
}
</script>
