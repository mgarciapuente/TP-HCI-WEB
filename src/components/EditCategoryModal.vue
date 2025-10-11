<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="secondary">mdi-pencil</v-icon>
        Editar Categoría
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="categoryForm.name"
            label="Nombre de la categoría *"
            placeholder="ej: Cereales"
            variant="outlined"
            persistent-placeholder
            :rules="nameRules"
            required
            class="mb-4"
            autofocus
          />
          
          <v-select
            v-model="categoryForm.selectedIcon"
            label="Icono de la categoría *"
            :items="availableIconsForSelection"
            item-title="displayName"
            item-value="icon"
            variant="outlined"
            :rules="iconRules"
            required
            class="mb-4"
          >
            <template v-slot:selection="{ item }">
              <div class="d-flex align-center">
                <v-icon :icon="item.raw.icon" size="20" class="me-2" color="primary" />
                <span>{{ item.raw.displayName }}</span>
              </div>
            </template>
            
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" class="pa-2">
                <template v-slot:prepend>
                  <v-icon :icon="item.raw.icon" size="20" class="me-3" color="primary" />
                </template>
                <v-list-item-title>{{ item.raw.displayName }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
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
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { categoriesService, type Category } from '../services/productsService'
import { useAuthStore } from '../stores/auth'
import { useCategoryIcon } from '../composables/categoryIcons'

// Props y emits
const props = defineProps<{
  modelValue: boolean
  category: Category | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'categoryUpdated': [category: Category]
}>()

// Stores
const authStore = useAuthStore()

// Composables
const { getAvailableIcons, getCategoryIcon } = useCategoryIcon()

// Estado reactivo
const dialog = ref(props.modelValue)
const valid = ref(false)
const loading = ref(false)
const formRef = ref()
const existingCategories = ref<Category[]>([])

const categoryForm = reactive({
  name: '',
  selectedIcon: ''
})

// Reglas de validación
const nameRules = [
  (v: string) => !!v || 'El nombre es requerido',
  (v: string) => (v && v.length >= 2) || 'El nombre debe tener al menos 2 caracteres',
  (v: string) => (v && v.length <= 50) || 'El nombre debe tener máximo 50 caracteres',
]

const iconRules = [
  (v: string) => !!v || 'Selecciona un icono para la categoría',
]

// Computed para iconos disponibles
const availableIconsForSelection = computed(() => {
  // Filtrar las categorías existentes excluyendo la que estamos editando
  const otherCategories = existingCategories.value.filter(cat => cat.id !== props.category?.id)
  const availableIcons = getAvailableIcons(otherCategories)
  
  // Si la categoría actual tiene un icono, incluirlo en las opciones disponibles
  if (props.category) {
    const currentIcon = getCategoryIcon(props.category)
    const isCurrentIconInList = availableIcons.some(icon => icon.icon === currentIcon)
    
    if (!isCurrentIconInList) {
      // Buscar el nombre del icono actual en la lista completa
      const { getAllAvailableIcons } = useCategoryIcon()
      const allIcons = getAllAvailableIcons()
      const currentIconData = allIcons.find(icon => icon.icon === currentIcon)
      
      if (currentIconData) {
        availableIcons.unshift(currentIconData)
      }
    }
  }
  
  return availableIcons.map(iconData => ({
    ...iconData,
    displayName: iconData.name
  }))
})

// Watchers
watch(() => props.modelValue, async (newVal) => {
  dialog.value = newVal
  if (newVal && props.category) {
    await loadExistingCategories()
    initializeForm()
  }
})

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
})

// Lifecycle
onMounted(async () => {
  await loadExistingCategories()
})

// Métodos
const loadExistingCategories = async () => {
  try {
    const response = await categoriesService.getCategories({ per_page: 100 }, authStore.token || undefined)
    existingCategories.value = response.categories || []
  } catch (error) {
    console.error('Error al cargar categorías existentes:', error)
    existingCategories.value = []
  }
}

const initializeForm = () => {
  if (props.category) {
    categoryForm.name = props.category.name
    categoryForm.selectedIcon = getCategoryIcon(props.category)
  }
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const handleCancel = () => {
  dialog.value = false
}

const handleSubmit = async () => {
  if (!valid.value || !props.category) return

  try {
    loading.value = true
    
    const updateRequest = {
      name: categoryForm.name.trim(),
      metadata: {
        ...props.category.metadata,
        icon: categoryForm.selectedIcon
      }
    }
    
    const updatedCategory = await categoriesService.updateCategory(props.category.id, updateRequest, authStore.token || undefined)
    
    emit('categoryUpdated', updatedCategory)
    dialog.value = false
    
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    // Aquí podrías mostrar una notificación de error
  } finally {
    loading.value = false
  }
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