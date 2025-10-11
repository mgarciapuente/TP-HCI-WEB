<template>
  <div class="category-filters">
    <div class="d-flex align-center category-scroll-container">
      <v-chip-group
        v-model="selectedCategory"
        selected-class="text-secondary"
        filter
        variant="outlined"
        @update:model-value="handleCategoryChange"
        class="flex-nowrap"
      >
      <v-chip
        v-for="category in categories"
        :key="category.id"
        :value="category.id"
        :color="selectedCategory === category.id ? 'secondary' : undefined"
        :variant="selectedCategory === category.id ? 'elevated' : 'outlined'"
        class="category-chip"
        @mouseenter="hoveredCategory = category.id"
        @mouseleave="hoveredCategory = null"
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
        
        <span class="category-name">{{ category.name }}</span>
        
        <!-- Menú de opciones siempre visible pero sutil -->
        <template v-slot:append>
          <v-menu 
            :open-on-hover="false" 
            :close-on-content-click="true"
            location="bottom end"
            offset="4"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-horizontal"
                variant="text"
                size="x-small"
                :color="selectedCategory === category.id ? 'white' : 'grey-lighten-1'"
                v-bind="props"
                class="ms-1 menu-trigger"
                :class="{ 'menu-visible': hoveredCategory === category.id }"
                @click.stop
              />
            </template>
            
            <v-list density="compact" class="py-1">
              <v-list-item 
                @click="editCategory(category)" 
                class="cursor-pointer"
                prepend-icon="mdi-pencil"
                title="Editar"
              />
              
              <v-list-item 
                @click="deleteCategory(category)" 
                class="cursor-pointer text-red"
                prepend-icon="mdi-delete"
                title="Eliminar"
              />
            </v-list>
          </v-menu>
        </template>
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
    </div>
    
    <!-- Modal para agregar categoría -->
    <AddCategoryModal
      v-model="showAddCategoryModal"
      @category-created="onCategoryCreated"
    />
    
    <!-- Modal para editar categoría -->
    <EditCategoryModal
      v-model="showEditCategoryModal"
      :category="categoryToEdit"
      @category-updated="onCategoryUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoriesService, type Category } from '../services/productsService'
import { useAuthStore } from '../stores/auth'
import { useCategoryIcon } from '../composables/categoryIcons'
import AddCategoryModal from './AddCategoryModal.vue'
import EditCategoryModal from './EditCategoryModal.vue'

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
const showEditCategoryModal = ref(false)
const categoryToEdit = ref<Category | null>(null)
const hoveredCategory = ref<number | null>(null)

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

const onCategoryUpdated = (updatedCategory: Category) => {
  // Encontrar y actualizar la categoría en la lista
  const index = categories.value.findIndex(cat => cat.id === updatedCategory.id)
  if (index !== -1) {
    categories.value[index] = updatedCategory
  }
  
  // Si la categoría actualizada está seleccionada, mantener la selección
  if (selectedCategory.value === updatedCategory.id) {
    emit('categoryChanged', updatedCategory.id)
  }
}

const editCategory = (category: Category) => {
  categoryToEdit.value = category
  showEditCategoryModal.value = true
}

const deleteCategory = (category: Category) => {
  // TODO: Implementar eliminación de categoría
  console.log('Eliminar categoría:', category.name)
}

// El menú ahora siempre está disponible, no necesitamos funciones de hover especiales

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-filters {
  margin: 16px 0;
}

.category-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.category-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.category-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.category-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.category-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

:deep(.v-chip-group) {
  flex-wrap: nowrap !important;
  overflow: visible !important;
}

:deep(.v-chip) {
  border-radius: 24px !important;
  padding: 8px 16px !important;
  font-weight: 500 !important;
  border: 1px solid #ddd !important;
  background-color: white !important;
  color: #666 !important;
  transition: all 0.2s ease !important;
  flex-shrink: 0 !important;
  white-space: nowrap !important;
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

/* Asegurar que el texto sea blanco en chips seleccionados */
:deep(.v-chip.v-chip--variant-elevated .category-name) {
  color: white !important;
}

:deep(.v-chip.v-chip--variant-elevated *) {
  color: white !important;
}

/* Asegurar que los iconos de Vuetify (como el tilde) sean visibles */
:deep(.v-chip.v-chip--variant-elevated .v-chip__append .v-icon) {
  color: white !important;
}

:deep(.v-chip.v-chip--variant-outlined) {
  background-color: white !important;
  color: #666 !important;
  border: 1px solid #ddd !important;
}

/* Efectos específicos para chips de categoría */
:deep(.category-chip) {
  transition: all 0.3s ease !important;
  position: relative !important;
}

/* Hover para chips NO seleccionados */
:deep(.category-chip:hover:not(.v-chip--selected)) {
  border-color: rgb(var(--v-theme-secondary)) !important;
  color: rgb(var(--v-theme-secondary)) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  padding: 8px 20px !important;
}


/* Estilo para el botón del menú */
:deep(.menu-trigger) {
  opacity: 0.6 !important;
  transition: all 0.2s ease !important;
}

:deep(.menu-trigger:hover) {
  opacity: 1 !important;
  background-color: rgba(0, 0, 0, 0.1) !important;
}

/* Hacer el menú más visible cuando hay hover en el chip */
.category-chip:hover :deep(.menu-trigger) {
  opacity: 0.9 !important;
}

.category-chip:hover :deep(.menu-trigger.menu-visible) {
  opacity: 1 !important;
  background-color: rgba(0, 0, 0, 0.15) !important;
}

/* Estilo para la lista del menú */
:deep(.v-list-item.cursor-pointer) {
  cursor: pointer !important;
}

:deep(.v-list-item.cursor-pointer:hover) {
  background-color: rgba(0, 0, 0, 0.04) !important;
}

/* El slot append personalizado sobrescribe automáticamente el de Vuetify */

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

/* Hover para chips seleccionados */
:deep(.category-chip.v-chip--selected:hover) {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
  border-color: rgb(var(--v-theme-secondary)) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  padding: 8px 20px !important;
}

/* Asegurar que el texto del nombre sea visible en chips seleccionados con hover */
:deep(.category-chip.v-chip--selected:hover .category-name) {
  color: white !important;
}

/* Asegurar que todos los elementos del chip seleccionado con hover sean blancos */
:deep(.category-chip.v-chip--selected:hover *) {
  color: white !important;
}
</style>