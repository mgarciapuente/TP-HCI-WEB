<template>
  <v-app>
    <!-- Navigation Bar siempre presente -->
    <NavigationBar />
    
    <!-- Contenido principal que cambia según la página -->
    <v-main>
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
.main-container {
  padding: 16px;
  min-height: calc(100vh - 64px);
}

.main-card { 
  min-height: calc(100vh - 96px);
  width: 100%;
  position: relative;
  background-color: transparent;
  border-radius: 16px;
}
</style>