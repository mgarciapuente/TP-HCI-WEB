<template>
  <div class="almacen-page">
    <h1>Almacén</h1>
    <p>Aquí podrás ver todos los productos disponibles en tu almacén.</p>
    
    <!-- Placeholder para el contenido del almacén -->
    <div class="content-placeholder">
      <v-icon size="64" color="grey">mdi-warehouse</v-icon>
      <h3>Contenido del almacén en desarrollo</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
// Lógica del almacén aquí
</script>

<style scoped>
.almacen-page {
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