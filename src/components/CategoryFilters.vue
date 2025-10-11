<template>
  <div class="category-filters">
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
        {{ category.name }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoriesService, type Category } from '../services/productsService'
import { useAuthStore } from '../stores/auth'

// Props y emits
const emit = defineEmits<{
  categoryChanged: [categoryId: number | null]
}>()

// Stores
const authStore = useAuthStore()

// Estado reactivo
const categories = ref<Category[]>([])
const selectedCategory = ref<number | null>(null)
const loading = ref(false)

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

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-filters {
  margin: 16px 0;
  overflow-x: auto;
  /* -webkit-overflow-scrolling: touch; */
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

:deep(.v-chip-group) {
  display: flex !important;
  gap: 8px !important;
  white-space: nowrap !important;
}
</style>