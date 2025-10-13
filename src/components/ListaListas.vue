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
    selectedList: ShoppingList | null;
    selectedPurchase?: { id: number; list?: any } | null;
    listItems: ShoppingList[];
    handleSelectList?: (list: ShoppingList) => void;
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
const snackbar = ref({ show: false, text: '', color: 'success' })

// Helper para verificar si el usuario actual es propietario de una lista
const isListOwner = (list: ShoppingList): boolean => {
    if (!list.owner || !auth.user?.id) return true // Por defecto permitir si no hay información
    return list.owner.id === auth.user.id
}

const getLists = async () => {
    if (!auth.token) return
    loading.value = true
    try {
        // If historyMode is true, request purchased/completed lists
        const params: Record<string, any> = {}
        let res;
        if (props.historyMode) {
            // Obtener las compras y mapear a listas, preservando purchaseId para poder pedir la compra completa
            const purchasesResponse = await purchasesService.getPurchases(auth.token, params);
            // El servicio puede devolver diferentes estructuras, necesitamos manejarlas
            let purchases: any[] = [];
            
            if (Array.isArray(purchasesResponse)) {
                purchases = purchasesResponse;
            } else if (purchasesResponse && typeof purchasesResponse === 'object') {
                // Puede ser un objeto con paginación o estructura anidada
                purchases = purchasesResponse.data || purchasesResponse.purchases || [];
            }
            
            // Filtrar purchases: solo listas NO recurrentes (las recurrentes se auto-recrean)
            const validPurchases = purchases.filter((p: any) => {
                // Verificar que la purchase tenga una lista asociada
                if (!p.list) return false
                
                // EXCLUIR listas recurrentes del historial
                // Las listas recurrentes se auto-recrean, no necesitan restauración manual
                if (p.list.recurring) return false;
                
                return true;
            });
            
            res = validPurchases.map((p: any) => ({
                ...(p.list || {}),
                purchaseId: p.id,
                productsCount: (p.items && Array.isArray(p.items) ? p.items.length : undefined) ?? ((p.list && Array.isArray(p.list.products)) ? p.list.products.length : undefined) ?? 0
            }));
        } else {
            // Obtener las listas normalmente (activas, no completadas)
            res = await listService.getLists(auth.token, params);
            
            // Si obtenemos un array de listas, filtrar las que no han sido completadas
            if (Array.isArray(res)) {
                // Filtrar listas que no tengan lastPurchasedAt (no han sido completadas)
                res = res.filter((list: any) => {
                    // Mostrar solo listas que no han sido compradas/completadas recientemente
                    // o que sean recurrentes (que se auto-recrean)
                    return !list.lastPurchasedAt || list.recurring;
                });
            }
        }
        // Manejar la respuesta que puede ser array directo o objeto con estructura
        if (Array.isArray(res)) {
            lists.value = res as Array<ShoppingList & { products?: any[]; purchaseId?: number; productsCount?: number }>
        } else if (res && typeof res === 'object' && 'lists' in res && Array.isArray(res.lists)) {
            // Respuesta paginada del backend
            lists.value = res.lists as Array<ShoppingList & { products?: any[]; purchaseId?: number; productsCount?: number }>
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
        
        // Mostrar mensaje de éxito
        snackbar.value = { 
            show: true, 
            text: 'Lista restaurada exitosamente', 
            color: 'success' 
        }

        // Refresh current view (still historyMode here). Parent will toggle history and refresh again.
        await getLists()
    } catch (err) {
        console.error('Error restoring list:', err)
    }
}
// Toggle de recurrencia
const toggleRecurring = async (list: any) => {
    if (!auth.token) return
    
    // Solo el propietario puede cambiar si una lista es recurrente
    if (!isListOwner(list)) {
        snackbar.value = { show: true, text: 'Solo el propietario puede cambiar la configuración de recurrencia', color: 'error' }
        return
    }
    
    try {
        await listService.updateList(auth.token, list.id, { recurring: !list.recurring })
        await getLists()
        snackbar.value = { show: true, text: list.recurring ? 'Lista marcada como no recurrente' : 'Lista marcada como recurrente', color: 'success' }
    } catch (err) {
        console.error('Error actualizando recurrencia:', err)
        snackbar.value = { show: true, text: 'Error al cambiar recurrencia', color: 'error' }
    }
}

const handleConfirm = async (data: CreateList) => {
    // Crear la lista por API y refrescar
    if (!auth.token) return
    try {
        await listService.createList(auth.token, { 
            name: data.nombre, 
            description: data.descripcion, 
            recurring: false,
            metadata: {
                icon: data.selectedIcon || 'mdi-cart'
            }
        })
        // Refrescar listas para mostrar la nueva
        await getLists()
        snackbar.value = { show: true, text: 'Lista creada exitosamente', color: 'success' }
    } catch (err) {
        console.error('Error creando lista:', err)
        snackbar.value = { show: true, text: 'Error al crear la lista', color: 'error' }
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
        snackbar.value = { show: true, text: 'Lista eliminada exitosamente', color: 'success' }
    } catch (err) {
        console.error('Error eliminando lista:', err)
        snackbar.value = { show: true, text: 'Error al eliminar la lista. Permisos insuficientes.', color: 'error' }
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
    margin: 1em 0 1em 0.25em;
}

.header-normal {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-with-back {
    display: flex;
    align-items: center;
    gap: 12px;
}

.back-button {
    margin-left: -8px;
}

.list-item {
    margin-bottom: 1em;
    cursor: pointer;
    border-radius: var(--border-radius-lg);
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

.fab-button {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 10;
}

:deep(.fab-button .v-btn) {
    background-color: rgb(var(--v-theme-secondary)) !important;
}

:deep(.fab-button .v-btn:hover) {
    background-color: rgb(var(--v-theme-secondary)) !important;
    opacity: 0.9;
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
            <div v-if="props.historyMode" class="header-with-back">
                <v-btn icon variant="text" color="black" @click="emit('toggle-history')" class="back-button">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <h2 class="panel-title">Historial</h2>
            </div>
            <div v-else class="header-normal">
                <h2 class="panel-title">Listas</h2>
                <v-btn variant="text" color="black" class="history-button" @click="emit('toggle-history')">
                    <v-icon start>mdi-history</v-icon>
                    Historial
                </v-btn>
            </div>
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
                    <v-btn v-if="!props.historyMode && isListOwner(list)" :icon="list.recurring ? 'mdi-star' : 'mdi-star-outline'" variant="text" color="yellow" @click.stop="toggleRecurring(list)" :aria-label="list.recurring ? 'Quitar recurrencia' : 'Marcar como recurrente'" />
                    <v-btn v-if="!props.historyMode" icon="mdi-delete" variant="text" color="white" @click.stop="openDeleteModal(list)" />
                    <v-tooltip text="Restaurar lista" location="top">
                        <template v-slot:activator="{ props: tooltipProps }">
                            <v-btn v-if="props.historyMode" v-bind="tooltipProps" icon="mdi-backup-restore" variant="text" color="white" @click.stop="restoreList(list)" />
                        </template>
                    </v-tooltip>
                </v-card-text>
            </v-card>
        </div>
        <DeleteListModal
          ref="deleteModalRef"
          v-model="showDeleteModal"
          :list="listToDelete"
          @confirmed="handleDeleteConfirmed"
        />
        <v-btn v-if="!props.historyMode" color="secondary" class="fab-button" size="large" icon="mdi-playlist-plus" fab @click="handleOpen">
        </v-btn>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
            {{ snackbar.text }}
        </v-snackbar>
    </div>
</template>