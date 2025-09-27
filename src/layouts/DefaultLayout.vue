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
  height: calc(100vh - 64px);
}

.main-card { 
  height: calc(100% - 0px);
  width: 100%;
  position: relative;
  background-color: rgb(235, 238, 235);
  border-radius: 16px;
}
</style>