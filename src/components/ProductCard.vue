<template>
  <v-card
    class="product-card"
    elevation="2"
    hover
  >
    <v-card-text class="d-flex align-center pa-4">
      <v-icon
        size="40"
        color="orange"
        class="me-3"
      >
        mdi-package-variant
      </v-icon>
      
      <div class="flex-grow-1">
        <h4 class="product-name">{{ product.name }}</h4>
        <p class="product-category text-grey-600 ma-0">
          <v-icon size="16" class="me-1">mdi-tag</v-icon>
          {{ product.category.name }}
        </p>
      </div>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            v-bind="props"
          />
        </template>
        
        <v-list>
          <v-list-item @click="editProduct">
            <template v-slot:prepend>
              <v-icon>mdi-pencil</v-icon>
            </template>
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
          
          <v-list-item @click="deleteProduct" class="text-red">
            <template v-slot:prepend>
              <v-icon color="red">mdi-delete</v-icon>
            </template>
            <v-list-item-title>Eliminar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Product } from '../services/productsService'

// Props
const props = defineProps<{
  product: Product
}>()

// Emits
const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
}>()

// Métodos
const editProduct = () => {
  emit('edit', props.product)
}

const deleteProduct = () => {
  emit('delete', props.product)
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-radius: 12px;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}

.product-category {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}
</style>