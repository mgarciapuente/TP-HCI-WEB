<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="secondary">mdi-package-variant-plus</v-icon>
        Agregar Nuevo Producto
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="productForm.name"
            label="Nombre del producto *"
            placeholder="ej: Leche descremada"
            variant="outlined"
            persistent-placeholder
            :rules="nameRules"
            required
            class="mb-4"
          />
          
          <v-select
            v-model="productForm.categoryId"
            label="Categoría *"
            :items="categories"
            item-title="name"
            item-value="id"
            variant="outlined"
            :rules="categoryRules"
            required
            :loading="loadingCategories"
            placeholder="Selecciona una categoría"
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
          Agregar Producto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { categoriesService, productsService, type Category, type CreateProductRequest } from '../services/productsService'
import { useAuthStore } from '../stores/auth'

// Props y emits
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'productCreated': [product: any]
}>()

// Stores
const authStore = useAuthStore()

// Estado reactivo
const dialog = ref(props.modelValue)
const valid = ref(false)
const loading = ref(false)
const loadingCategories = ref(false)
const formRef = ref()

const categories = ref<Category[]>([])

const productForm = reactive({
  name: '',
  categoryId: null as number | null
})

// Reglas de validación
const nameRules = [
  (v: string) => !!v || 'El nombre es requerido',
  (v: string) => (v && v.length >= 2) || 'El nombre debe tener al menos 2 caracteres',
]

const categoryRules = [
  (v: number | null) => !!v || 'La categoría es requerida',
]

// Watchers
watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
  if (newVal) {
    resetForm()
    loadCategories()
  }
})

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
})

// Métodos
const loadCategories = async () => {
  try {
    loadingCategories.value = true
    const response = await categoriesService.getCategories({ per_page: 50 }, authStore.token || undefined)
    categories.value = response.categories
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  } finally {
    loadingCategories.value = false
  }
}

const resetForm = () => {
  productForm.name = ''
  productForm.categoryId = null
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const handleCancel = () => {
  dialog.value = false
}

const handleSubmit = async () => {
  if (!valid.value) return

  try {
    loading.value = true
    
    const createRequest: CreateProductRequest = {
      name: productForm.name,
      category: {
        id: productForm.categoryId!
      },
      metadata: {}
    }
    
    const newProduct = await productsService.createProduct(createRequest, authStore.token || undefined)
    
    emit('productCreated', newProduct)
    dialog.value = false
    
  } catch (error) {
    console.error('Error al crear producto:', error)
    // Aquí podrías mostrar una notificación de error
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (dialog.value) {
    loadCategories()
  }
})
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