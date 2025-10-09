<template>
  <div class="empty-products">
    <div class="empty-content">
      <v-img
        :src="emptyFridgeImage"
        alt="No hay productos"
        max-width="200"
        class="mb-4"
      />
      
      <h3 class="empty-title mb-2">No hay productos</h3>
      <p class="empty-subtitle text-grey-600 mb-6">
        No encontramos productos que coincidan con tu búsqueda.
        <br>
        ¡Comienza agregando algunos productos!
      </p>
      
      <v-btn
        color="orange"
        variant="elevated"
        size="large"
        prepend-icon="mdi-plus"
        @click="handleAddProduct"
      >
        Agregar Productos
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import emptyFridgeImage from '../assets/empty-fridge1.svg'

// Emits
const emit = defineEmits<{
  addProduct: []
}>()

// Métodos
const handleAddProduct = () => {
  emit('addProduct')
}
</script>

<style scoped>
.empty-products {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 32px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}

.empty-subtitle {
  font-size: 1rem;
  line-height: 1.5;
}

:deep(.v-btn) {
  background-color: var(--color-orange) !important;
  color: white !important;
}

:deep(.v-btn:hover) {
  background-color: var(--color-orange-hover) !important;
}
</style>