<template>
  <v-app>
    <!-- Navigation Bar siempre presente -->
    <NavigationBar 
      :active-tab="activeTab" 
      @navigate="handleNavigation" 
    />
    
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
import { ref } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

const activeTab = ref('listas') // Por defecto

const handleNavigation = (tab: string) => {
  activeTab.value = tab
  
  // Aquí puedes agregar la lógica de navegación según tu estructura de rutas
  switch (tab) {
    case 'almacen':
      console.log('Navegar a almacén')
      break
    case 'listas':
      console.log('Navegar a listas')
      break
    case 'productos':
      console.log('Navegar a productos')
      break
    case 'perfil':
      console.log('Navegar a perfil')
      break
  }
}
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