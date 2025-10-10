<template>
  <v-app class="app-container">
    <!-- Navigation Bar siempre presente -->
    <NavigationBar />
    
    <!-- Contenido principal que cambia según la página -->
    <v-main class="main-wrapper">
      <div class="main-container">
        <v-card 
          class="main-card"  
        >
          <slot />
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import NavigationBar from '../components/NavigationBar.vue'
</script>

<style scoped>
.app-container {
  height: 100vh !important;
  overflow: hidden !important;
}

.main-wrapper {
  height: calc(100vh - 64px) !important;
  overflow: hidden !important;
}

.main-container {
  padding: 1.5em;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-card { 
  height: calc(100vh - 96px);
  width: 100%;
  box-sizing: border-box;
  position: relative;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 16px;
  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
}
</style>
<!-- padding: 20px; le quite esto al main card-->

<style>
/* Estilos globales para eliminar scroll del body */
html, body {
  overflow: hidden !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
}

.v-application {
  height: 100vh !important;
  overflow: hidden !important;
}
</style>