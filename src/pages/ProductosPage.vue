<template>
  <div class="productos-page">
    <h1>Productos</h1>
    <p>Gestiona todos tus productos desde aquí.</p>
    
    <!-- Placeholder para el contenido de productos -->
    <div class="content-placeholder">
      <v-icon size="64" color="grey">mdi-package-variant</v-icon>
      <h3>Gestión de productos en desarrollo</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
// Lógica de productos aquí
</script>

<style scoped>
.productos-page {
  padding: 20px;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
}
</style>