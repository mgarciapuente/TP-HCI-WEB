<script setup lang="ts">
import CreateListModal from './CreateListModal.vue';
import DeleteListModal from './DeleteListModal.vue';
import { ref, defineProps, onMounted } from 'vue';
import { purchasesService } from '@/services/purchasesService'
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'
import type { ShoppingList } from '@/types/listTypes'
import { useListIcon } from '../composables/listIcons'

interface CreateList {
    nombre: string
    descripcion?: string
    selectedIcon?: string
}

interface Props {
    selectedList: { id: number; name: string; products: any[] } | null;
    selectedPurchase?: { id: number; list?: any } | null;
    listItems: { id: number; name: string; products: any[] }[];
    handleSelectList?: (list: { id: number; name: string; products: any[] }) => void;
    historyMode?: boolean;
}

const props = defineProps<Props & { historyMode?: boolean }>();
const emit = defineEmits<{
    (e: 'count-changed', count: number): void
    (e: 'list-restored', restoredList: any): void
    (e: 'toggle-history'): void
    // unified select event
    (e: 'select', payload: { kind: 'list' | 'purchase', payload: any }): void
}>()
const isModalVisible = ref(false);

const auth = useAuthStore()
const { getListIcon } = useListIcon()
const lists = ref<Array<ShoppingList & { products?: any[]; purchaseId?: number; productsCount?: number }>>([])
const loading = ref(false)
const showDeleteModal = ref(false)
const listToDelete = ref<any>(null)
const deleteModalRef = ref<any>(null)

const getLists = async () => {
    if (!auth.token) return
    loading.value = true
    try {
        // If historyMode is true, request purchased/completed lists
        const params: Record<string, any> = {}
        let res;
        if (props.historyMode) {
            // Obtener las compras y mapear a listas, preservando purchaseId para poder pedir la compra completa
            const purchases = await purchasesService.getPurchases(auth.token, params);
            res = purchases.map((p: any) => ({
                ...(p.list || {}),
                purchaseId: p.id,
                productsCount: (p.items && Array.isArray(p.items) ? p.items.length : undefined) ?? ((p.list && Array.isArray(p.list.products)) ? p.list.products.length : undefined) ?? 0
            }));
            console.log(res)
        } else {
            // Obtener las listas normalmente
            res = await listService.getLists(auth.token, params);
        }
        // Manejar la respuesta que puede ser array directo o objeto con estructura
        if (Array.isArray(res)) {
            lists.value = res as Array<ShoppingList & { products?: any[]; purchaseId?: number; productsCount?: number }>
        } else {
            lists.value = []
        }
        // Si estamos en modo normal, completar el productsCount consultando los items de cada lista
        if (!props.historyMode && lists.value.length > 0) {
            const token = auth.token
            const currentLists = [...lists.value]
            // Enriquecemos counts en segundo plano sin bloquear la UI
            Promise.allSettled(
                currentLists.map(async (l) => {
                    try {
                        if (!token) return
                        const items = await listService.getListItems(token, l.id)
                        // Proteger por si el usuario cambia de vista durante la carga
                        const target = lists.value.find(x => x.id === l.id)
                        if (target) target.productsCount = Array.isArray(items) ? items.length : (items?.items?.length || 0)
                    } catch (e) {
                        const target = lists.value.find(x => x.id === l.id)
                        if (target) target.productsCount = target.productsCount ?? 0
                    }
                })
            )
            .catch(() => {/* noop */})
        }
        // Emit count
        const count = lists.value.length
        const emitCount = (event: string, payload: any) => {
            // @ts-ignore
            if (typeof emit === 'function') emit(event, payload)
        }
        emitCount('count-changed', count)
    } catch (err) {
        console.error('Error obteniendo listas:', err)
    } finally {
        loading.value = false
    }
}

// Exponer método para que el padre pueda forzar un refresh
defineExpose({ refresh: getLists })

const handleOpen = () => {
    isModalVisible.value = true
}

const onSelect = (list: any) => {
    emit('select', { kind: props.historyMode ? 'purchase' : 'list', payload: list })
}

const restoreList = async (purchase: any) => {
    if (!auth.token) return
    try {
        // Determine purchaseId and candidate listId from the record
        const purchaseId = purchase.purchaseId
        let restoredList: any = purchase.list

        // Try purchasesService first; if it returns the purchase with embedded list, extract it
        if (purchaseId) {
            try {
                await purchasesService.restorePurchase(auth.token, purchaseId)
            } catch (e) {
                console.warn('purchasesService.restorePurchase failed, will try reset fallback', e)
            }
        }
        emit('list-restored', restoredList)

        // Refresh current view (still historyMode here). Parent will toggle history and refresh again.
        await getLists()
    } catch (err) {
        console.error('Error restoring list:', err)
    }
}
// Toggle de recurrencia
const toggleRecurring = async (list: any) => {
    if (!auth.token) return
    try {
        await listService.updateList(auth.token, list.id, { recurring: !list.recurring })
        await getLists()
    } catch (err) {
        console.error('Error actualizando recurrencia:', err)
    }
}

const handleConfirm = async (data: CreateList) => {
    // Crear la lista por API y refrescar
    if (!auth.token) return
    try {
        await listService.createList(auth.token, { 
            name: data.nombre, 
            description: data.descripcion, 
            metadata: {
                icon: data.selectedIcon || 'mdi-cart'
            }
        })
        // Refrescar listas para mostrar la nueva
        await getLists()
    } catch (err) {
        console.error('Error creando lista:', err)
    }
}

// Apertura del modal de confirmación de eliminación
const openDeleteModal = (list: any) => {
    listToDelete.value = list
    showDeleteModal.value = true
}

// Confirmación de eliminación desde el modal
const handleDeleteConfirmed = async (list: any) => {
    if (!auth.token) return
    try {
        await listService.deleteList(auth.token, list.id)
        // deseleccionar si era la lista seleccionada (antes de refrescar)
        if (props.selectedList && props.selectedList.id === list.id) {
            emit('select', { kind: 'list', payload: null })
        }
        await getLists()
    } catch (err) {
        console.error('Error eliminando lista:', err)
    } finally {
        if (deleteModalRef.value) deleteModalRef.value.finishLoading()
    }
}

onMounted(() => {
    getLists()
})

</script>

<style scoped>

.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.lists-panel {
    flex: 1 1 40%;
    display: flex;
    flex-direction: column;
    padding: 0.5em 2.5em 0.25em 2.5em;
    border-right: 1px solid #e0e0e0;
    position: relative;
    height: 100%;
}

.lists-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1em 0 1em 0.25em;
}

.list-item {
    margin-bottom: 1em;
    cursor: pointer;
    border-radius: 20px;
    border-width: 3px;
    border-style: solid;
    border-color: transparent;
}

.list-text {
    margin: 0 2em;
}

.list-item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fab-button-left {
    position: sticky;
    bottom: 1.5rem;
    align-self: flex-end;
    margin-right: 1.5rem;
    z-index: 2;
}

.lists-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.list-item.selected {
    border-color: #F5844E;
}
</style>

<template>
    <CreateListModal v-model="isModalVisible" @confirm="handleConfirm" v-if="!props.historyMode" />

    <div class="lists-panel">
        <div class="lists-header">
            <h2 class="panel-title">{{ props.historyMode ? 'Historial' : 'Listas' }}</h2>
            <v-btn icon="mdi-history" color="black" variant="text" class="history-button" @click="emit('toggle-history')">
                <v-icon>mdi-history</v-icon>
            </v-btn>
        </div>
        <div v-if="loading" class="d-flex justify-center py-8">
            <v-progress-circular color="secondary" indeterminate size="36" />
        </div>
        <div v-else-if="lists.length === 0" class="empty-content">
            <img src="../assets/empty-fridge1.svg" alt="Heladera vacía" class="empty-image" />
            <h3 class="empty-title">Parece que no tienes listas todavía...</h3>
            <p class="empty-subtitle">
                Pulsa el botón
                <v-icon color="secondary" size="small">mdi-plus</v-icon>
                para crear una nueva lista.
            </p>
        </div>
        <div v-else class="lists-scroll">
            <v-card v-for="list in lists" :key="list.id" class="list-item"
                :class="{ 'selected': (!props.historyMode && props.selectedList?.id === list.id) || (props.historyMode && props.selectedPurchase && list.purchaseId != null && (((props.selectedPurchase as any)?.purchaseId ?? (props.selectedPurchase as any)?.id) === list.purchaseId)) }" color="primary"
                @click="onSelect(list)">
                <v-card-text class="list-item-content">
                    <v-icon class="list-icon" color="white">{{ getListIcon(list) }}</v-icon>
                    <div class="list-text">
                        <h3 class="list-name">{{ list.name }}</h3>
                        <p class="list-count">{{ (typeof list.productsCount === 'number' ? list.productsCount : (list.products?.length || 0)) || 'Sin' }} Productos</p>
                    </div>
                    <v-spacer />
                    <v-btn v-if="!props.historyMode" :icon="list.recurring ? 'mdi-star' : 'mdi-star-outline'" variant="text" color="yellow" @click.stop="toggleRecurring(list)" :aria-label="list.recurring ? 'Quitar recurrencia' : 'Marcar como recurrente'" />
                    <v-btn v-if="!props.historyMode" icon="mdi-delete" variant="text" color="white" @click.stop="openDeleteModal(list)" />
                    <v-btn v-if="props.historyMode" icon="mdi-backup-restore" variant="text" color="white" @click.stop="restoreList(list)" />
                </v-card-text>
            </v-card>
        </div>
        <DeleteListModal
          ref="deleteModalRef"
          v-model="showDeleteModal"
          :list="listToDelete"
          @confirmed="handleDeleteConfirmed"
        />
        <v-btn v-if="!props.historyMode" color="secondary" class="fab-button-left" size="large" icon="mdi-playlist-plus" fab @click="handleOpen">
        </v-btn>
    </div>
</template>