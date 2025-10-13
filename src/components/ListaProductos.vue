<script setup lang="ts">
import { ref, watch } from 'vue'
import CategoryFilters from './CategoryFilters.vue'
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'
import { purchasesService } from '@/services/purchasesService'
import CantidadModal from './CantidadModal.vue'
import ShareListModal from './ShareListModal.vue'
import type { ListItem } from '@/types/listTypes'

const editItemModal = ref(false)
const itemToEdit = ref<ListItem | null>(null)
const shareModal = ref(false)

const openEditItemModal = (item: ListItem) => {
    itemToEdit.value = item
    editItemModal.value = true
}

const handleItemEdit = async (payload: { quantity: number, unit: string }) => {
    if (!auth.token || !props.selectedList || !itemToEdit.value) return
    saveLoading.value = true
    try {
        await listService.updateListItem(auth.token, props.selectedList.id, itemToEdit.value.id, payload)
        await fetchItems()
        editItemModal.value = false
        itemToEdit.value = null
    } catch (err) {
        errorSnackbar.value = { show: true, text: 'No se pudo editar el producto' }
    } finally {
        saveLoading.value = false
    }
}

const openShareModal = () => {
    shareModal.value = true
}

const handleListShared = (email: string) => {
    console.log(`Lista compartida con: ${email}`)
    // Aquí podrías agregar lógica adicional como mostrar un snackbar de éxito
}

interface Props {
    selectedList: { id: number; name: string; products?: any[] } | null;
    selectedPurchase?: any | null;
    addProductMode: boolean;
    historyMode?: boolean;
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'list-completed', listId: number): void
    (e: 'exit-add-mode'): void
    (e: 'enter-add-mode'): void
    (e: 'list-renamed', payload: { id: number, name: string }): void
}>()

const auth = useAuthStore()
const items = ref<ListItem[]>([])
const editMode = ref(false)
const editedName = ref('')
const itemsToDelete = ref<number[]>([])
const saveLoading = ref(false)
const loading = ref(false)
const selectedCategoryId = ref<number | null>(null)
const errorSnackbar = ref({ show: false, text: '' })

const fetchItems = async () => {
    if (!auth.token) {
        items.value = []
        return
    }

    loading.value = true
    try {
        const params: Record<string, any> = {}
        if (selectedCategoryId.value) params.category_id = selectedCategoryId.value

        // If we're viewing history, the items live under the purchase resource: purchase.list.items
        if (props.historyMode && props.selectedPurchase) {
            try {
                const res: any = await purchasesService.getPurchase(auth.token, props.selectedPurchase.purchaseId)
                console.log(res);
                const purchaseListItems = res?.items || []
                items.value = purchaseListItems
                console.log(purchaseListItems);
            } catch (err) {
                console.error('Error al obtener purchase para historial:', err)
                items.value = []
                errorSnackbar.value = { show: true, text: 'No se pudo cargar la compra del historial' }
            }
        } else {
            if (!props.selectedList) {
                items.value = []
            } else {
                const res = await listService.getListItems(auth.token, props.selectedList.id, params)
                // El endpoint devuelve array de items
                const parsed = Array.isArray(res) ? res : (res && (res.items || res.data)) || []
                items.value = parsed
            }
        }
    } catch (err) {
        console.error('Error al obtener items de la lista:', err)
        items.value = []
    } finally {
        loading.value = false
    }
}

// Refetch items when the selected list changes (including switching between lists)
watch(() => props.selectedList?.id, (newId, oldId) => {
    if (newId !== oldId) {
        editMode.value = false
        itemsToDelete.value = []
        editedName.value = props.selectedList?.name || ''
        fetchItems()
    }
}, { immediate: true })

watch(() => props.selectedPurchase?.id, () => {
    fetchItems()
}, { immediate: true })

const onCategoryChanged = (id: number | null) => {
    selectedCategoryId.value = id
    fetchItems()
}

const togglePurchased = async (item: ListItem) => {
    if (!auth.token || !props.selectedList) return
    try {
        const updated = await listService.toggleListItemPurchased(auth.token, props.selectedList.id, item.id, !item.purchased)
        // Actualizar item localmente
        const idx = items.value.findIndex(i => i.id === item.id)
        if (idx >= 0) items.value[idx] = updated

        // Si todos los items están comprados emitimos evento
        const allPurchased = items.value.length > 0 && items.value.every(i => i.purchased)
        if (allPurchased) {
            // Notify parent that all items are purchased. Parent will handle marking the list as purchased.
            emit('list-completed', props.selectedList.id)
        }
    } catch (err) {
        console.error('Error toggling purchased:', err)
    }
}

const startEdit = () => {
    editMode.value = true
    editedName.value = props.selectedList?.name || ''
    itemsToDelete.value = []
}

const toggleMarkForDelete = (itemId: number) => {
    const idx = itemsToDelete.value.indexOf(itemId)
    if (idx >= 0) {
        // unmark (restore)
        itemsToDelete.value.splice(idx, 1)
    } else {
        // mark for delete
        itemsToDelete.value.push(itemId)
    }
}


const saveEdit = async () => {
    if (!auth.token || !props.selectedList) return
    saveLoading.value = true
    try {
        // Actualizar nombre si cambió
        if (editedName.value !== props.selectedList.name) {
            await listService.updateList(auth.token ?? '', props.selectedList.id, { name: editedName.value })
            // Notificar al padre para actualizar el título inmediatamente
            emit('list-renamed', { id: props.selectedList.id, name: editedName.value })
        }
        // Eliminar productos marcados
        for (const itemId of itemsToDelete.value) {
            await listService.deleteListItem(auth.token ?? '', props.selectedList.id, itemId)
        }
        await fetchItems()
        editMode.value = false
    } catch (err) {
        errorSnackbar.value = { show: true, text: 'No se pudo guardar los cambios' }
    } finally {
        saveLoading.value = false
    }
}

const cancelEdit = () => {
    editedName.value = props.selectedList?.name || ''
    itemsToDelete.value = []
    editMode.value = false
}
// handleOpen removed

// Exponer refresh para que el padre pueda forzar recarga
defineExpose({ refresh: fetchItems })
</script>

<style scoped>
.no-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: grey;
    text-align: center;
    padding: 1em;
}

.products-panel {
    flex: 0 1 60%;
    max-width: 60%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e0e0e0;
    position: relative;
    height: 100%;
    min-height: 100%;
    padding: 0.5em 2.5em 0.25em 2.5em;
}

.products-header {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: space-between;
    margin: 1em 0 1em 0.25em;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.header-right {
    display: flex;
    align-items: center;
}

.panel-title {
    width: 100%;
    display: block;
    margin: 0;
}

.title-edit-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
}

.title-input {
    flex: 1;
    min-width: 420px;
    max-width: 100%;
}

.title-actions {
    display: flex;
    justify-content: flex-end;
    /* keep buttons together on the right */
    gap: 12px;
    margin-left: auto;
    /* add big space between input and buttons */
}

.products-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 1em;
}

.product-item {
    display: flex;
    flex-direction: row;
    background-color: rgba(var(--v-theme-on-surface), 0.06) !important;
    border-radius: 12px;
    transition: background-color 0.15s ease;
    padding: 1em 2em;
    /* slightly more lateral spacing */
}

.item-deleted {
    opacity: 0.6;
}

/* Purchased state: use primary theme color */
.item-purchased {
    background-color: rgb(var(--v-theme-primary)) !important;
}

.item-purchased,
.item-purchased :deep(.v-card-text),
.item-purchased .product-info,
.item-purchased .product-details,
.item-purchased .product-name {
    color: rgb(var(--v-theme-on-primary)) !important;
}

.item-purchased .product-name {
    text-decoration: line-through;
}

/* Disable hover lighten to avoid click affordance */
/* No hover background change to avoid clickable affordance */
/* (intentionally left without a :hover override) */

/* Remove default padding from v-card-text; we apply it at the card level */
.product-item :deep(.v-card-text) {
    padding: 0 !important;
}

.product-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.no-products {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: grey;
    text-align: center;
    padding: 2em;
    height: 100%;
}

.loading {
    text-align: center;
    align-items: center;
    justify-content: center;
    padding: 2em;
}

.fab-button-right {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 3;
}

.product-checkbox {
    margin-right: 0;
}

/* Actions container for edit/delete with spacing */
.item-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: 8px;
}

/* Edit button contrast background (white/light) */
.edit-btn-contrast {
    background-color: #ffffff !important;
    color: rgb(var(--v-theme-on-surface)) !important;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}
</style>

<template>
    <CantidadModal :model-value="editItemModal" :quantity="itemToEdit?.quantity || 1"
        :unit="itemToEdit?.unit || 'unidades'" :mode="'edit'" :title="'Editar ' + (itemToEdit?.product?.name || '')"
        @update:modelValue="editItemModal = $event" @save="handleItemEdit" />

    <ShareListModal v-model="shareModal" :list-id="props.selectedList?.id || null"
        :list-name="props.selectedList?.name || ''" @shared="handleListShared" />
    <div class="products-panel">
        <div class="products-header">
            <div class="header-top">
                <div class="header-left">
                    <v-btn v-if="props.addProductMode" icon @click="emit('exit-add-mode')">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <h2 class="panel-title" style="display: flex; align-items: center; gap: 8px;">
                        <template v-if="editMode">
                        <div class="title-edit-row">
                            <v-text-field
                              class="title-input"
                              v-model="editedName"
                              density="compact"
                              variant="outlined"
                              hide-details
                            />
                            <div class="title-actions">
                                <v-btn color="primary" size="small" @click="saveEdit" :loading="saveLoading">Guardar</v-btn>
                                <v-btn size="small" variant="text" @click="cancelEdit">Cancelar</v-btn>
                            </div>
                        </div>
                        </template>
                        <template v-else>
                            <span>{{ props.historyMode ? props.selectedPurchase.name : props.selectedList?.name
                                }}</span>
                            <v-btn v-if="!props.historyMode && !editMode && props.selectedList" icon size="small"
                                variant="text" @click="startEdit" aria-label="Editar lista">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                    </h2>
                </div>
                <div class="header-right">
                    <v-btn 
                        v-if="!props.historyMode && props.selectedList"
                        icon 
                        variant="text" 
                        color="primary"
                        @click="openShareModal"
                        aria-label="Compartir lista"
                    >
                        <v-icon>mdi-share-variant</v-icon>
                    </v-btn>
                </div>
            </div>
            <CategoryFilters v-if="!props.historyMode" mode="filter-only" @categoryChanged="onCategoryChanged" />
        </div>
        <div class="products-scroll">
            <div v-if="loading" class="loading"><v-progress-circular color="secondary" indeterminate size="36" /></div>

            <div v-else-if="items.length === 0" class="no-products">
                <v-icon size="48" color="grey">mdi-cart-outline</v-icon>
                <p class="text-grey">No hay productos en esta lista aún</p>
                <p class="text-grey-lighten-1">Usa el botón + de la derecha para agregar productos</p>
            </div>

            <div v-else class="products-list">
                <v-card v-for="product in items" :key="product.id" class="product-item mb-2" variant="flat"
                    color="backgroundColor"
                    :class="{ 'item-deleted': itemsToDelete.includes(product.id), 'item-purchased': (!props.historyMode && product.purchased) }">
                    <v-card-text class="product-content">
                        <div class="product-info">
                            <h4 class="product-name">{{ product.product?.name }}</h4>
                            <p class="product-details">{{ product.quantity }} {{ product.unit }}</p>
                        </div>
                    </v-card-text>
                    <div v-if="editMode" class="item-actions">
                        <!-- Edit button; hide when item is marked for deletion; add light background for contrast -->
                        <v-btn v-if="!itemsToDelete.includes(product.id)" icon size="small" color="primary"
                            class="edit-btn-contrast" @click="openEditItemModal(product)" aria-label="Editar cantidad">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <!-- Delete/Restore toggle button; hide for purchased unless already marked (to allow restore) -->
                        <v-btn v-if="(!product.purchased) || itemsToDelete.includes(product.id)" icon size="small"
                            :color="itemsToDelete.includes(product.id) ? 'warning' : 'error'"
                            @click="toggleMarkForDelete(product.id)"
                            :aria-label="itemsToDelete.includes(product.id) ? 'Restaurar producto' : 'Eliminar producto'">
                            <v-icon>{{ itemsToDelete.includes(product.id) ? 'mdi-backup-restore' : 'mdi-close'
                                }}</v-icon>
                        </v-btn>
                    </div>
                    <v-checkbox v-else-if="!props.historyMode" :model-value="product.purchased" density="compact"
                        class="product-checkbox" hide-details :color="product.purchased ? 'white' : 'primary'"
                        @click="togglePurchased(product)" />
                </v-card>
            </div>
        </div>
        <v-btn v-if="!props.historyMode" color="secondary" class="fab-button-right" size="large" icon="mdi-basket-plus"
            fab :disabled="editMode" @click="emit('enter-add-mode')">
        </v-btn>

        <v-snackbar v-model="errorSnackbar.show" color="error" timeout="4000">
            {{ errorSnackbar.text }}
        </v-snackbar>
    </div>
</template>