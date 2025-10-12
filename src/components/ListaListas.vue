<script setup lang="ts">
import CreateListModal from './CreateListModal.vue';
import { ref, defineProps, onMounted } from 'vue';
import { purchasesService } from '@/services/purchasesService'
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'
import { useListIcon } from '../composables/listIcons'

interface CreateList {
    nombre: string
    recurrente: boolean
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
const lists = ref<Props['listItems']>([])
const loading = ref(false)

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
            res = purchases.map((p: any) => ({ ...(p.list || {}), purchaseId: p.id}));
            console.log(res)
        } else {
            // Obtener las listas normalmente
            res = await listService.getLists(auth.token, params);
        }
        // If paginated, map to array
        if (Array.isArray(res)) {
            lists.value = res as any
        } else {
            lists.value = []
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

const handleConfirm = async (data: CreateList) => {
    // Crear la lista por API y refrescar
    if (!auth.token) return
    try {
        await listService.createList(auth.token, { 
            name: data.nombre, 
            description: data.descripcion, 
            recurring: data.recurrente,
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

// Método para eliminar una lista y refrescar
const handleDelete = async (id: number) => {
    if (!auth.token) return
    try {
        await listService.deleteList(auth.token, id)
        await getLists()
        // deseleccionar si era la lista seleccionada
        if (props.selectedList && props.selectedList.id === id) {
            if (props.handleSelectList && typeof props.handleSelectList === 'function') {
                props.handleSelectList(null as any)
            }
        }
    } catch (err) {
        console.error('Error eliminando lista:', err)
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
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
}

.selected {
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
        <div v-if="lists.length === 0" class="empty-content">
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
                :class="{ 'selected': props.selectedList && props.selectedList.id === list.id }" color="primary"
                @click="onSelect(list)">
                <v-card-text class="list-item-content">
                    <v-icon class="list-icon" color="white">{{ getListIcon(list) }}</v-icon>
                    <div class="list-text">
                        <h3 class="list-name">{{ list.name }}</h3>
                        <p class="list-count">{{ (list.products && list.products.length) || 'Sin' }} Productos</p>
                    </div>
                    <v-spacer />
                    <v-btn v-if="!props.historyMode" icon="mdi-delete" variant="text" color="white" @click.stop="handleDelete(list.id)" />
                    <v-btn v-if="props.historyMode" icon="mdi-backup-restore" variant="text" color="white" @click.stop="restoreList(list)" />
                </v-card-text>
            </v-card>
        </div>
        <v-btn v-if="!props.historyMode" color="secondary" class="fab-button-left" size="large" icon="mdi-playlist-plus" fab @click="handleOpen">
        </v-btn>
    </div>
</template>