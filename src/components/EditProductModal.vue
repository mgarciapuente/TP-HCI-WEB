<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start color="secondary">mdi-pencil</v-icon>
        Editar Producto
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="productForm.name"
            label="Nombre del producto *"
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
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { categoriesService, productsService, type Category, type Product, type CreateProductRequest } from '../services/productsService'
import { useAuthStore } from '../stores/auth'

const props = defineProps<{
  modelValue: boolean
  product: Product | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'productUpdated': [product: Product]
}>()

const authStore = useAuthStore()

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

const nameRules = [
  (v: string) => !!v || 'El nombre es requerido',
  (v: string) => (v && v.length >= 2) || 'El nombre debe tener al menos 2 caracteres',
]

const categoryRules = [
  (v: number | null) => !!v || 'La categoría es requerida',
]

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
  if (newVal && props.product) {
    loadCategories()
    populateForm()
  }
})

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
})

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

const populateForm = () => {
  if (props.product) {
    productForm.name = props.product.name
    productForm.categoryId = props.product.category.id
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
  resetForm()
}

const handleSubmit = async () => {
  if (!valid.value || !props.product) return

  try {
    loading.value = true
    
    const updateRequest: CreateProductRequest = {
      name: productForm.name,
      category: {
        id: productForm.categoryId!
      },
      metadata: props.product.metadata || {}
    }
    
    const updatedProduct = await productsService.updateProduct(props.product.id, updateRequest, authStore.token || undefined)
    
    emit('productUpdated', updatedProduct)
    dialog.value = false
    resetForm()
    
  } catch (error) {
    console.error('Error al actualizar producto:', error)
  } finally {
    loading.value = false
  }
}

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