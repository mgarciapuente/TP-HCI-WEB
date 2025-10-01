<template>
  <v-app-bar 
    color="primary" 
    elevation="2"
  >
    <div class="navbar-title-container">
  <img src="@/assets/logo.png" alt="Logo" class="navbar-logo" height="32" />
      <v-app-bar-title class="text-buttons font-weight-medium navbar-title-text">
        Canasta
      </v-app-bar-title>
    </div>

    <v-spacer></v-spacer>

    <!-- Navegación del header -->
    <v-btn 
      variant="text" 
      color="buttons"
      class="text-none normal-case nav-button"
      :class="{ 'active-nav': isActive('/almacen') }"
      @click="$router.push('/almacen')"
    >
      Almacén
    </v-btn>

    <v-btn
      variant="text"
      color="buttons"
      class="text-none normal-case nav-button"
      :class="{ 'active-nav': isActive('/listas') }"
      @click="$router.push('/listas')"
    >
      Listas
    </v-btn>
    
    <v-btn 
      variant="text"
      color="buttons"
      class="text-none normal-case nav-button"
      :class="{ 'active-nav': isActive('/productos') }"
      @click="$router.push('/productos')"
    >
      Productos
    </v-btn>
    
    <v-btn 
      variant="text" 
      color="buttons"
      class="text-none normal-case nav-button"
      :class="{ 'active-nav': isActive('/perfil') }"
      @click="$router.push('/perfil')"
    >
      Perfil
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isActive = (path: string) => {
  return computed(() => route.path === path).value
}
</script>

<style scoped>
.normal-case {
  text-transform: none !important;
}

.nav-button {
  /* Remover outline y border en todos los estados */
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.navbar-title-container {
  display: flex;
  align-items: center;
}
.navbar-logo {
  vertical-align: middle;
  margin-left: 16px;
  margin-right: 12px;
}
.navbar-title-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

/* Estados hover, focus, active para los botones */
.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  outline: none !important;
  border: none !important;
}

.nav-button:focus {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.nav-button:active {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.nav-button:focus-visible {
  outline: none !important;
  border: none !important;
}

/* Estilo para el botón activo */
.active-nav {
  text-decoration: underline !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Remover cualquier efecto de ripple o overlay */
.nav-button :deep(.v-btn__overlay) {
  display: none !important;
}

.nav-button :deep(.v-ripple__container) {
  display: none !important;
}
</style>