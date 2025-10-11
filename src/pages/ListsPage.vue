<script setup lang="ts">
import ListaListas from '@/components/ListaListas.vue'
import ListaProductos from '@/components/ListaProductos.vue'
import ListaAgregarProductos from '@/components/ListaAgregarProductos.vue'
import { VSnackbar } from 'vuetify/components'
import { ref, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'

// Definir el tipo de lista
interface Lista {
  id: number
  name: string
  products: any[]
}

interface Purchase {
  id: number
  list: Lista
  // otros campos relevantes de la compra
}

const selectedList = ref<Lista | null>(null) // Lista actualmente seleccionada
const listItems = ref<Lista[]>([]) // Array que contendrá las listas
const listasComponent = ref<any>(null)
const listsCount = ref(0)
const selectedPurchase = ref<Purchase | null>(null)

const addProductMode = ref(false)
const selectedCategoryId = ref<number | null>(null)

const auth = useAuthStore()

const showHistory = ref(false)
const snackbar = ref({ show: false, text: '', color: 'success' })

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

const handleSelect = (payload: { kind: 'list' | 'purchase', payload: any }) => {
  if (payload.kind === 'list') {
    // Selecting a normal list clears any selected purchase
    selectedPurchase.value = null
    selectedList.value = payload.payload as Lista
  } else if (payload.kind === 'purchase') {
    // When a purchase is selected from history, clear selectedList and set selectedPurchase
    selectedList.value = null
    selectedPurchase.value = payload.payload.purchase || { id: payload.payload.purchaseId, list: payload.payload.purchase?.list }
  }
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

const handleCategoryChanged = (id: number | null) => {
  selectedCategoryId.value = id
}

const handleListRestored = async (restored: any) => {
  // Exit history mode so restored list appears in the normal lists
  showHistory.value = false

  // Try to fetch the canonical list data from the API if we have an id
  let canonical = restored
  try {
    const id = Number(restored?.id || restored?.listId)
    if (id && !isNaN(id)) {
      // Attempt to get the fresh list from server to ensure it's in the 'active' lists
      const fetched = await listService.getListById(auth.token as string, id)
      if (fetched) canonical = fetched
    }
  } catch (err) {
    // If fetching fails, proceed with the provided restored object
    console.warn('No se pudo obtener la lista restaurada desde API, usando datos provisionales', err)
  }

  // show snackbar with list name when available
  const listName = canonical?.name || 'Lista restaurada'
  snackbar.value = { show: true, text: `${listName} restaurada`, color: 'success' }

  // select restored list and refresh children
  selectedList.value = canonical
  if (listasComponent.value && typeof listasComponent.value.refresh === 'function') {
    await listasComponent.value.refresh()
  }
  if (productosComponent.value && typeof productosComponent.value.refresh === 'function') {
    await productosComponent.value.refresh()
  }
}

const toggleHistory = async () => {
  showHistory.value = !showHistory.value
  // If entering history mode, clear any selected active list
  if (showHistory.value) {
    selectedList.value = null
  } else {
    // If exiting history mode, clear any selected purchase id
    selectedPurchase.value = null
  }
  // Wait for prop update to propagate to child, then refresh child lists
  await nextTick()
  if (listasComponent.value && typeof listasComponent.value.refresh === 'function') {
    await listasComponent.value.refresh()
  }
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
    <ListaListas v-if="!addProductMode" :selectedList="selectedList" :listItems="listItems"
      @toggle-history="toggleHistory" ref="listasComponent" @count-changed="(n) => listsCount = n" @list-restored="handleListRestored" @select="handleSelect" :historyMode="showHistory" />

    <ListaProductos v-if="selectedList || selectedPurchase" ref="productosComponent" :selectedList="selectedList"
      :selectedPurchase="selectedPurchase" :addProductMode="addProductMode" :historyMode="showHistory" @exit-add-mode="exitAddMode" @enter-add-mode="enterAddMode" @category-changed="handleCategoryChanged" @list-completed="onListCompleted" />

    <ListaAgregarProductos v-if="addProductMode" :selectedList="selectedList" :addProductMode="addProductMode"
      :selectedCategoryId="selectedCategoryId" @add-product="onProductAdded" />

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.text }}
  </v-snackbar>

  </div>
</template>
