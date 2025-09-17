<template>
    <!-- Navigation Bar -->
    <v-app-bar 
      color="primary" 
      elevation="2"
    >
      <v-app-bar-title class="text-buttons font-weight-medium">
        Canasta
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navegación del header -->
      <v-btn 
        variant="text" 
        color="buttons"
        class="text-none normal-case"
        :style="{ textDecoration: activeTab === 'almacen' ? 'underline' : 'none' }"
        @click="navigateTo('almacen')"
      >
        Almacén
      </v-btn>

      <v-btn
        variant="text"
        color="buttons"
        class="text-none normal-case"
        :style="{ textDecoration: activeTab === 'listas' ? 'underline' : 'none' }"
        @click="navigateTo('listas')"
      >
        Listas
      </v-btn>
      
      <v-btn 
        variant="text"
        color="buttons"
        class="text-none normal-case"
        :style="{ textDecoration: activeTab === 'productos' ? 'underline' : 'none' }"
        @click="navigateTo('productos')"
      >
        Productos
      </v-btn>
      
      <v-btn 
        variant="text" 
        color="buttons"
        class="text-none normal-case"
        :style="{ textDecoration: activeTab === 'perfil' ? 'underline' : 'none' }"
        @click="navigateTo('perfil')"
      >
        Perfil
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-8">
        <!-- Título de la página -->
        <h1 class="text-h4 font-weight-bold text-titles">
          Listas de compra
        </h1>

        <!-- Contenido central con estado vacío -->
        <div class="d-flex flex-column align-center justify-center" style="min-height: 50vh;">
          <!-- Mensaje de estado vacío -->
          <div class="text-center mb-4">
            <p class="text-body-1 text-grey-darken-1 mb-2">
              Parece que no tienes listas todavía...
            </p>
            <p class="text-body-2 text-grey">
              Pulsa el botón "+" para crear una nueva lista.
            </p>
          </div>
        </div>
      </v-container>

      <!-- Botón flotante para agregar - FUERA de v-main -->
      <v-fab
        icon="mdi-plus"
        location="bottom end"
        size="large"
        color="secondary"
        style="position: fixed; bottom: 0.25em; right: 0.25em; z-index: 1000;"
        @click="createNewList"
      ></v-fab>
    </v-main>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('listas') // Por defecto está en listas ya que es la página actual

const navigateTo = (tab: string) => {
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

const createNewList = () => {
  // Aquí se implementaría la lógica para crear una nueva lista
  console.log('Crear nueva lista')
}
</script>

<style scoped>
.normal-case {
  text-transform: none !important;
}
</style>