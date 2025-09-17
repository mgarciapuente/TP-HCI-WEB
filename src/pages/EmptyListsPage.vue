<template>
    <!-- Navigation Bar -->
    <v-app-bar 
      color="primary" 
      density="comfortable"
      elevation="2"
    >
      <v-app-bar-nav-icon>
        <v-icon color="white">mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      
      <v-app-bar-title class="text-white font-weight-medium">
        Canasta
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navegación del header -->
      <v-btn 
        variant="text" 
        color="white"
        class="text-none"
      >
        Almacén
      </v-btn>
      
      <v-btn 
        variant="text" 
        color="white"
        class="text-none"
        style="text-decoration: underline;"
      >
        Listas
      </v-btn>
      
      <v-btn 
        variant="text" 
        color="white"
        class="text-none"
      >
        Productos
      </v-btn>
      
      <v-btn 
        variant="text" 
        color="white"
        class="text-none"
      >
        Perfil
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-8">
        <!-- Título de la página -->
        <h1 class="text-h4 font-weight-bold mb-12 text-grey-darken-3">
          Listas de compras
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

      <!-- Botón flotante para agregar -->
      <v-fab
        icon="mdi-plus"
        location="bottom end"
        size="large"
        color="secondary"
        class="ma-4"
        @click="createNewList"
      ></v-fab>
    </v-main>
</template>

<script setup lang="ts">

const createNewList = () => {
  // Aquí se implementaría la lógica para crear una nueva lista
  console.log('Crear nueva lista')
}
</script>