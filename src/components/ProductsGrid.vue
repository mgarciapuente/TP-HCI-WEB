<template>
  <div class="products-grid">
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard
          :product="product"
          @edit="handleEditProduct"
          @delete="handleDeleteProduct"
        />
      </v-col>
    </v-row>
    
    <!-- Paginación -->
    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        color="secondary"
        @update:model-value="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ProductCard from './ProductCard.vue'
import type { Product } from '../services/productsService'

// Props
const props = defineProps<{
  products: Product[]
  currentPage: number
  totalPages: number
}>()

// Emits
const emit = defineEmits<{
  editProduct: [product: Product]
  deleteProduct: [product: Product]
  pageChanged: [page: number]
}>()

// Estado reactivo
const currentPage = ref(props.currentPage)

// Watchers
watch(() => props.currentPage, (newPage) => {
  currentPage.value = newPage
})

// Métodos
const handleEditProduct = (product: Product) => {
  emit('editProduct', product)
}

const handleDeleteProduct = (product: Product) => {
  emit('deleteProduct', product)
}

const handlePageChange = (page: number) => {
  emit('pageChanged', page)
}
</script>

<style scoped>
.products-grid {
  margin-top: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
}

.products-grid .v-row {
  flex: 1;
  width: 100%;
  margin: 0 !important;
}
</style>