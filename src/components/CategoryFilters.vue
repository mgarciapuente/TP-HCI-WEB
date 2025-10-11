<template>
  <div class="category-filters d-flex align-center flex-wrap">
    <v-chip-group
      v-model="selectedCategory"
      selected-class="text-secondary"
      filter
      variant="outlined"
      @update:model-value="handleCategoryChange"
    >
      <v-chip
        v-for="category in categories"
        :key="category.id"
        :value="category.id"
        :color="selectedCategory === category.id ? 'secondary' : undefined"
        :variant="selectedCategory === category.id ? 'elevated' : 'outlined'"
      >
        <template v-slot:prepend>
          <v-icon 
            size="16" 
            :color="selectedCategory === category.id ? 'white' : 'grey'"
            class="me-1"
          >
            {{ getCategoryIcon(category) }}
          </v-icon>
        </template>
        {{ category.name }}
      </v-chip>
    </v-chip-group>
    
    <!-- Botón independiente para agregar nueva categoría -->
    <v-btn
      @click="openAddCategoryModal"
      variant="outlined"
      color="secondary"
      class="add-category-btn ml-3"
      size="small"
    >
      <template v-slot:prepend>
        <v-icon size="16">
          mdi-plus
        </v-icon>
      </template>
      Agregar categoría
    </v-btn>
    
    <!-- Modal para agregar categoría -->
    <AddCategoryModal
      v-model="showAddCategoryModal"
      @category-created="onCategoryCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoriesService, type Category } from '../services/productsService'
import { useAuthStore } from '../stores/auth'
import { useCategoryIcon } from '../composables/categoryIcons'
import AddCategoryModal from './AddCategoryModal.vue'

// Props y emits
const emit = defineEmits<{
  categoryChanged: [categoryId: number | null]
}>()

// Stores
const authStore = useAuthStore()

// Composables
const { getCategoryIcon } = useCategoryIcon()

// Estado reactivo
const categories = ref<Category[]>([])
const selectedCategory = ref<number | null>(null)
const loading = ref(false)
const showAddCategoryModal = ref(false)

// Métodos
const loadCategories = async () => {
  try {
    loading.value = true
    const response = await categoriesService.getCategories({ per_page: 50 }, authStore.token || undefined)
    categories.value = response.categories
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  } finally {
    loading.value = false
  }
}

const handleCategoryChange = (value: number | null) => {
  selectedCategory.value = value
  emit('categoryChanged', value)
}

const openAddCategoryModal = () => {
  showAddCategoryModal.value = true
}

const onCategoryCreated = (newCategory: Category) => {
  // Agregar la nueva categoría a la lista
  categories.value.push(newCategory)
  // Opcionalmente, seleccionar la nueva categoría
  selectedCategory.value = newCategory.id
  emit('categoryChanged', newCategory.id)
}

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-filters {
  margin: 16px 0;
}

:deep(.v-chip) {
  border-radius: 24px !important;
  padding: 8px 16px !important;
  font-weight: 500 !important;
  border: 1px solid #ddd !important;
  background-color: white !important;
  color: #666 !important;
  transition: all 0.2s ease !important;
}

:deep(.v-chip:hover) {
  border-color: rgb(var(--v-theme-secondary)) !important;
  color: rgb(var(--v-theme-secondary)) !important;
}

:deep(.v-chip--selected.text-secondary) {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
  border-color: rgb(var(--v-theme-secondary)) !important;
}

:deep(.v-chip.v-chip--variant-elevated) {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
  border-color: rgb(var(--v-theme-secondary)) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

:deep(.v-chip.v-chip--variant-outlined) {
  background-color: white !important;
  color: #666 !important;
  border: 1px solid #ddd !important;
}

/* Estilos específicos para el botón de agregar categoría */
.add-category-btn {
  border: 2px dashed rgb(var(--v-theme-secondary)) !important;
  background-color: rgba(var(--v-theme-secondary), 0.05) !important;
  color: rgb(var(--v-theme-secondary)) !important;
  height: 32px !important;
  border-radius: 24px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.add-category-btn:hover {
  background-color: rgba(var(--v-theme-secondary), 0.1) !important;
  border-color: rgb(var(--v-theme-secondary)) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}
</style>