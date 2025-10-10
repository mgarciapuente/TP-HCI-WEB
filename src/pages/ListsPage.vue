<script setup lang="ts">
import ListaListas from '@/components/ListaListas.vue'
import ListaProductos from '@/components/ListaProductos.vue'
import ListaAgregarProductos from '@/components/ListaAgregarProductos.vue'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'

// Definir el tipo de lista
interface Lista {
  id: number
  name: string
  products: any[]
}

const selectedList = ref<Lista | null>(null) // Lista actualmente seleccionada
const listItems = ref<Lista[]>([]) // Array que contendrá las listas
const listasComponent = ref<any>(null)
const listsCount = ref(0)

const addProductMode = ref(false)



const auth = useAuthStore()

const onListCompleted = async (listId: number) => {
  if (!auth.token) {
    window.alert('No estás autenticado')
    return
  }

  try {
    await listService.purchaseList(auth.token, listId, { metadata: { auto: true } })
    window.alert('Lista marcada como comprada y movida al historial')
    // Refrescar el panel de listas
    if (listasComponent.value && typeof listasComponent.value.refresh === 'function') {
      await listasComponent.value.refresh()
    }
    // Si la lista seleccionada fue la completada, deseleccionarla
    if (selectedList.value && selectedList.value.id === listId) {
      selectedList.value = null
    }
  } catch (err) {
    console.error('Error al marcar lista como completada:', err)
    window.alert('No se pudo completar la lista. Intente nuevamente.')
  }
}

const handleSelectList = (list: Lista) => {
  selectedList.value = list
}

const productosComponent = ref<any>(null)

const enterAddMode = () => {
  addProductMode.value = true
}

const exitAddMode = () => {
  addProductMode.value = false
}

const onProductAdded = async () => {
  // Refresh lists and products
  if (listasComponent.value && typeof listasComponent.value.refresh === 'function') {
    await listasComponent.value.refresh()
  }
  if (productosComponent.value && typeof productosComponent.value.refresh === 'function') {
    await productosComponent.value.refresh()
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
.lists-container {
  display: flex;
  height: 100%;
  width: 100%;
}
</style>

<template>
  <!-- Cuando hay listas (lists > 0) -->
  <div class="lists-container">
    <ListaListas v-if="!addProductMode" :selectedList="selectedList" :listItems="listItems" :handleSelectList="handleSelectList"
      :openHistory="openHistory" ref="listasComponent" @count-changed="(n) => listsCount = n" />

    <ListaProductos v-if="selectedList" ref="productosComponent" :selectedList="selectedList"
      :addProductMode="addProductMode" @exit-add-mode="exitAddMode" @enter-add-mode="enterAddMode" />

    <ListaAgregarProductos v-if="addProductMode" :selectedList="selectedList" :addProductMode="addProductMode"
      @add-product="onProductAdded" />

  </div>
</template>
