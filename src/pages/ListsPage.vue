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
    <div class="main-container">
      <v-card 
        class="main-card"
        rounded="lg"
      >
        <!-- Cuando no hay listas (lists === 0) -->
        <div v-if="lists === 0" class="empty-state">
          <div class="empty-content">
            <img src="../assets/empty-fridge1.svg" alt="Heladera vacía" class="empty-image" />
            <h3 class="empty-title">Parece que no tienes listas todavía...</h3>
            <p class="empty-subtitle">
              Pulsa el botón 
              <v-icon color="secondary" size="small">mdi-plus</v-icon>
              para crear una nueva lista.
            </p>
          </div>
        </div>

        <!-- Cuando hay listas (lists > 0) -->
        <div v-else class="lists-container">
          <div class="lists-layout">
            <!-- Panel izquierdo: Lista de listas -->
            <div class="lists-panel">
              <h2 class="panel-title">Listas</h2>
              <div class="lists-scroll">
                <v-card
                  v-for="list in listItems"
                  :key="list.id"
                  class="list-item"
                  :class="{ 'selected': selectedList && selectedList.id === list.id }"
                  color="primary"
                  @click="selectedList = list"
                >
                  <v-card-text class="list-item-content">
                    <v-icon class="list-icon" color="white">mdi-format-list-bulleted</v-icon>
                    <div>
                      <div class="list-name">{{ list.name }}</div>
                      <div class="list-count">{{ list.products.length }} Productos</div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>

            <!-- Panel derecho: Productos de la lista seleccionada -->
            <div class="products-panel">
              <div v-if="!selectedList" class="no-selection">
                <v-icon size="64" color="grey">mdi-format-list-bulleted</v-icon>
                <h3>Seleccione una lista para ver los productos</h3>
              </div>
              <div v-else class="products-content">
                <h3 class="panel-title">{{ selectedList.name }}</h3>
                <div class="products-scroll">
                  <!-- Aca van a ir los productos cuando los implementemos -->
                  <p class="text-grey">No hay productos en esta lista aún</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <v-btn
          color="secondary"
          class="fab-button"
          size="large"
          icon="mdi-plus"
          fab
          @click="createNewList"
        >
        </v-btn>
      </v-card>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Definir el tipo de lista
interface Lista {
  id: number
  name: string
  products: any[]
}

const activeTab = ref('listas') // Por defecto está en listas ya que es la página actual
const lists = ref(0) // Variable para contar la cantidad de listas
const selectedList = ref<Lista | null>(null) // Lista actualmente seleccionada
const listItems = ref<Lista[]>([]) // Array que contendrá las listas

const createNewList = () => {
  lists.value++
  listItems.value.push({
    id: lists.value,
    name: `Lista ${lists.value}`,
    products: []
  })
}

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
</script>

<style scoped>
.normal-case {
  text-transform: none !important;
}

.main-container {
  padding: 16px;
  height: calc(100vh - 64px);
}

.main-card {
  height: calc(100% - 0px);
  width: 100%;
  position: relative;
  background-color: rgb(235, 238, 235);
}

.fab-button {
  position: absolute;
  bottom: 0.5em;
  right: 0.5em;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.empty-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.empty-image {
  width: 200px;
  height: auto;
  margin-bottom: 2rem;
}

.empty-title {
  color: #666;
  font-weight: 400;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.empty-subtitle {
  color: #888;
  font-size: 1rem;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Layout de dos columnas */
.lists-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

.lists-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.25em 1em 0.25em 1em; 
  border-right: 1px solid #e0e0e0;
}

.products-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
}

.panel-title {
  margin-bottom: 1rem;
  padding: 1rem;
  color: #333;
  font-weight: 500;
}

.lists-scroll {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.list-item.selected {
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  border: 2px solid #ff8c5a;
}

.list-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem !important;
}

.list-icon {
  font-size: 2rem;
}

.list-name {
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
}

.list-count {
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #666;
}

.products-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.products-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
</style>