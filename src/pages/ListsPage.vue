


<template>
   
        <!-- Cuando no hay listas (lists === 0) -->
        <div v-if="lists === 0" class="empty-state">
          <!-- Botón de historial para estado vacío -->
          <v-btn
            icon="mdi-history"
            color="black"
            variant="text"
            class="history-button-empty"
            @click="openHistory"
          >
          </v-btn>
          
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
              <div class="lists-header">
                <h2 class="panel-title">Listas</h2>
                <v-btn
                  icon="mdi-history"
                  color="black"
                  variant="text"
                  class="history-button"
                  @click="openHistory"
                >
                </v-btn>
              </div>
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
            <ListaProductos :selectedList="selectedList" />
          </div>
        </div>

        <!-- FAB único cuando no hay listas -->
        <v-btn
          v-if="lists === 0"
          color="secondary"
          class="fab-button-center"
          size="large"
          icon="mdi-playlist-plus"
          fab
          @click="createNewList"
        >
        </v-btn>

        <!-- FABs duales cuando hay listas -->
        <template v-else>
          <!-- FAB izquierdo: Agregar nueva lista -->
          <v-btn
            color="secondary"
            class="fab-button-left"
            size="large"
            icon="mdi-playlist-plus"
            fab
            @click="createNewList"
          >
          </v-btn>

          <!-- FAB derecho: Agregar item a lista seleccionada -->
          <v-btn
            color="secondary"
            class="fab-button-right"
            size="large"
            icon="mdi-cart-plus"
            fab
            :disabled="!selectedList"
            @click="addItemToList"
          >
          </v-btn>
        </template>
      
</template>

<script setup lang="ts">
import ListaProductos from '@/components/ListaProductos.vue'
import { ref } from 'vue'

// Definir el tipo de lista
interface Lista {
  id: number
  name: string
  products: any[]
}


const lists = ref(0) // Variable para contar la cantidad de listas
const selectedList = ref<Lista | null>(null) // Lista actualmente seleccionada
const listItems = ref<Lista[]>([]) // Array que contendrá las listas

const createNewList = () => {
  lists.value++
  const newList = {
    id: lists.value,
    name: `Lista ${lists.value}`,
    products: []
  }
  listItems.value.push(newList)
  
  // Auto-seleccionar la nueva lista si es la primera
  if (lists.value === 1) {
    selectedList.value = newList
  }
}

const addItemToList = () => {
  if (selectedList.value) {
    // Por ahora agregamos un item placeholder
    // Más adelante esto abrirá un modal o formulario
    const newItem = {
      id: selectedList.value.products.length + 1,
      name: `Producto ${selectedList.value.products.length + 1}`,
      quantity: 1,
      unit: 'unidad'
    }
    selectedList.value.products.push(newItem)
  }
}

const openHistory = () => {
  // Función para abrir el historial de listas
  console.log('Abriendo historial de listas...')
  // Aquí puedes agregar la lógica para mostrar el historial
  // Por ejemplo, abrir un modal, navegar a otra página, etc.
}


</script>

<style scoped>
/* FAB único cuando no hay listas (centrado) */
.fab-button-center {
  position: absolute;
  bottom: 0.5em;
  right: 0.5em;
  /* Arreglar problemas de focus/active states */
  outline: none !important;
  border: none !important;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12) !important;
}

/* FAB izquierdo para agregar listas */
.fab-button-left {
  position: absolute;
  bottom: 0.5em;
  left: calc(50% - 4em);
  /* Arreglar problemas de focus/active states */
  outline: none !important;
  border: none !important;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12) !important;
}

/* FAB derecho para agregar items */
.fab-button-right {
  position: absolute;
  bottom: 0.5em;
  right: 0.5em;
  /* Arreglar problemas de focus/active states */
  outline: none !important;
  border: none !important;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12) !important;
}

/* Estados hover, focus, active para todos los FABs */
.fab-button-center:hover,
.fab-button-left:hover,
.fab-button-right:hover {
  outline: none !important;
  border: none !important;
  box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12) !important;
}

.fab-button-center:focus,
.fab-button-left:focus,
.fab-button-right:focus {
  outline: none !important;
  border: none !important;
}

.fab-button-center:active,
.fab-button-left:active,
.fab-button-right:active {
  outline: none !important;
  border: none !important;
}

.fab-button-center:focus-visible,
.fab-button-left:focus-visible,
.fab-button-right:focus-visible {
  outline: none !important;
  border: none !important;
}

/* Remover efectos de overlay y ripple */
.fab-button-center :deep(.v-btn__overlay),
.fab-button-left :deep(.v-btn__overlay),
.fab-button-right :deep(.v-btn__overlay) {
  display: none !important;
}

.fab-button-center :deep(.v-ripple__container),
.fab-button-left :deep(.v-ripple__container),
.fab-button-right :deep(.v-ripple__container) {
  opacity: 0.3 !important;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
}

.history-button-empty {
  position: absolute;
  top: 1rem;
  right: 1rem;
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
  position: relative;
}

.lists-panel::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #e0e0e0;
  z-index: 1;
}

.products-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
}

.lists-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.history-button {
  margin-left: auto;
}

.panel-title {
  margin-bottom: 1rem;
  padding: 1rem;
  color: #333;
  font-weight: 500;
}

.lists-scroll {
  flex: 1;
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

.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #666;
  gap: 0.5rem;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-item {
  border-radius: 8px;
  border: none !important;
  background-color: #d6d6d6 !important;
  box-shadow: none !important;
}

.product-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px !important;
}

.product-info {
  flex: 1;
}

.product-name {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 500;
}

.product-details {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}
</style>