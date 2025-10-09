<template>
  <div class="productos-page">
    <v-card class="productos-card">
      <div class="productos-content">
        <!-- Header -->
        <div class="page-header mb-6">
          <h1 class="page-title">Productos</h1>

        <!-- Buscador -->
        <div class="search-section mb-4">
          <v-text-field
            v-model="searchTerm"
            label="Encontrá tus productos"
            placeholder="Buscar productos..."
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            @update:model-value="debouncedSearch"
            class="search-input"
          />
        </div>

        <!-- Filtros por categorías -->
        <CategoryFilters @category-changed="handleCategoryChange" />

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-center py-8">
          <v-progress-circular color="orange" indeterminate size="48" />
        </div>

        <!-- Contenido principal -->
        <div v-else>
          <!-- Grid de productos -->
          <ProductsGrid
            v-if="products.length > 0"
            :products="products"
            :current-page="currentPage"
            :total-pages="totalPages"
            @edit-product="handleEditProduct"
            @delete-product="handleDeleteProduct"
            @page-changed="handlePageChange"
          />

          <!-- Estado vacío -->
          <EmptyProducts
            v-else
            @add-product="openAddProductModal"
          />
        </div>
        
        <!-- FAB para agregar productos (visible cuando hay productos) -->
        <v-fab
          v-if="products.length > 0"
          color="orange"
          icon="mdi-plus"
          @click="openAddProductModal"
          class="fab-inside-card"
        />
      </div>
    </v-card>

    <!-- Modal para agregar productos -->
    <AddProductModal
      v-model="showAddModal"
      @product-created="handleProductCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productsService, type Product } from '../services/productsService'
import { useAuthStore } from '../stores/auth'
import CategoryFilters from '../components/CategoryFilters.vue'
import ProductsGrid from '../components/ProductsGrid.vue'
import EmptyProducts from '../components/EmptyProducts.vue'
import AddProductModal from '../components/AddProductModal.vue'

// Stores
const authStore = useAuthStore()

// Estado reactivo
const products = ref<Product[]>([])
const loading = ref(false)
const searchTerm = ref('')
const selectedCategoryId = ref<number | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const showAddModal = ref(false)

// Función debounce personalizada
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

// Métodos
const loadProducts = async (resetPage = false) => {
  try {
    loading.value = true
    
    if (resetPage) {
      currentPage.value = 1
    }
    
    const params = {
      page: currentPage.value,
      per_page: 12,
      ...(searchTerm.value && { name: searchTerm.value }),
      ...(selectedCategoryId.value && { category_id: selectedCategoryId.value }),
      sort_by: 'name',
      order: 'ASC'
    }
    
    const response = await productsService.getProducts(params, authStore.token || undefined)
    
    products.value = response.products || []
    totalPages.value = response.totalPages || 1
    totalCount.value = response.totalCount || 0
    currentPage.value = response.currentPage || 1
    
  } catch (error) {
    console.error('Error al cargar productos:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  loadProducts(true)
}, 500)

const handleCategoryChange = (categoryId: number | null) => {
  selectedCategoryId.value = categoryId
  loadProducts(true)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadProducts()
}

const handleEditProduct = (product: Product) => {
  // TODO: Implementar edición de productos
  console.log('Editar producto:', product)
}

const handleDeleteProduct = (product: Product) => {
  // TODO: Implementar eliminación de productos
  console.log('Eliminar producto:', product)
}

const openAddProductModal = () => {
  showAddModal.value = true
}

const handleProductCreated = () => {
  // Recargar los productos después de agregar uno nuevo
  loadProducts()
}

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.productos-page {
  min-height: calc(100vh - 96px);
  padding: 0;
}

.productos-card {
  background-color: #e7edea !important;
  border-radius: 16px !important;
  min-height: calc(100vh - 96px);
  box-shadow: none !important;
  border: none !important;
  overflow: hidden;
  position: relative;
}

.productos-content {
  padding: 24px;
  padding-bottom: 100px; /* Espacio para el FAB */
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.page-header {
  text-align: left;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.search-section {
  width: 100%;
  margin: 0 auto;
}

.search-input {
  border-radius: 12px;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  border-radius: 12px;
}

/* FAB fijo dentro de la card */
.fab-inside-card {
  position: absolute !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 10 !important;
}

:deep(.fab-inside-card .v-btn) {
  background-color: var(--color-orange) !important;
}

:deep(.fab-inside-card .v-btn:hover) {
  background-color: var(--color-orange-hover) !important;
}
</style>