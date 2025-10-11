<template>
  <div> 
    <div class="productos-page">
      <div class="page-header mb-6">
        <h1 class="page-title">Productos</h1>
      </div>

      <div class="search-section mb-4">
        <SearchBar v-model="searchTerm" placeholder="Buscar productos..." :debounce-ms="500" />
      </div>

      <CategoryFilters class="category-filters" @category-changed="handleCategoryChange" />

      <div v-if="loading" class="d-flex justify-center py-8">
        <v-progress-circular color="secondary" indeterminate size="48" />
      </div>

      <div v-else>
        <ProductsGrid
          v-if="products.length > 0"
          :products="products"
          :current-page="currentPage"
          :total-pages="totalPages"
          @edit-product="handleEditProduct"
          @delete-product="handleDeleteProduct"
          @page-changed="handlePageChange"
        />

        <EmptyProducts
          v-else
          @add-product="openAddProductModal"
        />
      </div>
    </div> <v-fab
      v-if="products.length > 0"
      color="secondary"
      icon="mdi-plus"
      @click="openAddProductModal"
      class="fab-inside-card"
    />

    <AddProductModal
      v-model="showAddModal"
      @product-created="handleProductCreated"
    />

    <EditProductModal
      v-model="showEditModal"
      :product="selectedProduct"
      @product-updated="handleProductUpdated"
    />
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { productsService, type Product } from '../services/productsService'
import { useAuthStore } from '../stores/auth'
import CategoryFilters from '../components/CategoryFilters.vue'
import ProductsGrid from '../components/ProductsGrid.vue'
import EmptyProducts from '../components/EmptyProducts.vue'
import AddProductModal from '../components/AddProductModal.vue'
import EditProductModal from '../components/EditProductModal.vue'
import SearchBar from '../components/SearchBar.vue'

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
const showEditModal = ref(false)
const selectedProduct = ref<Product | null>(null)

// Métodos
const loadProducts = async (resetPage = false) => {
  try {
    loading.value = true
    
    if (resetPage) {
      currentPage.value = 1
    }
    
    const params = {
      page: currentPage.value,
      per_page: 24,
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

const handleCategoryChange = (categoryId: number | null) => {
  selectedCategoryId.value = categoryId
  loadProducts(true)
}

// watch searchTerm to trigger search (SearchBar already debounces input)
watch(() => searchTerm.value, () => {
  loadProducts(true)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadProducts()
}

const handleEditProduct = (product: Product) => {
  selectedProduct.value = product
  showEditModal.value = true
}

const handleDeleteProduct = async (product: Product) => {
  try {
    const confirmed = confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)
    if (!confirmed) return

    await productsService.deleteProduct(product.id, authStore.token || undefined)
    
    await loadProducts()
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    alert('Error al eliminar el producto. Por favor intenta de nuevo.')
  }
}

const openAddProductModal = () => {
  showAddModal.value = true
}

const handleProductCreated = () => {
  loadProducts()
}

const handleProductUpdated = async () => {
  selectedProduct.value = null
  await loadProducts()
}

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.productos-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
}

.page-header {
  text-align: left;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 500;
  color: #333;
  padding: 0.5em
}

.search-section {
  width: 100%;
  margin: 0 auto;
  padding-left: 1em;
  padding-right: 1em;
}

.search-input {
  border-radius: 12px;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  border-radius: 12px;
}

.fab-inside-card {
  position: fixed;
  bottom: 2rem;  
  right: 2rem;    
  z-index: 1000; 
}

:deep(.fab-inside-card .v-btn) {
  background-color: rgb(var(--v-theme-secondary)) !important;
}

:deep(.fab-inside-card .v-btn:hover) {
  background-color: rgb(var(--v-theme-secondary)) !important;
  opacity: 0.9;
}

.category-filters {
  padding-left: 1em;
}
</style>

<style>
  /* ESTILOS GLOBALES PARA EL SCROLLBAR */

  /* Para navegadores basados en WebKit (Chrome, Safari, Edge, Opera) */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  /* El "track" por donde se desliza */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  /* La parte que se arrastra */
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
  }

  /* Cuando pasás el mouse por encima */
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
</style>