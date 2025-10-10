<script setup lang="ts">
import CreateListModal from './CreateListModal.vue';
import { ref, defineProps, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'

interface CreateList {
    nombre: string
    recurrente: boolean
    descripcion?: string
}

interface Props {
    selectedList: { id: number; name: string; products: any[] } | null;
    listItems: { id: number; name: string; products: any[] }[];
    handleSelectList: (list: { id: number; name: string; products: any[] }) => void;
    openHistory: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'count-changed', count: number): void
}>()
const isModalVisible = ref(false);

const auth = useAuthStore()
const lists = ref<Props['listItems']>([])
const loading = ref(false)

const getLists = async () => {
    if (!auth.token) return
    loading.value = true
    try {
        // Usamos el servicio de listas; el endpoint devuelve estructura paginada o array
        const res = await listService.getLists(auth.token)
        // Si viene paginado, intentar mapear a array
        if (Array.isArray(res)) {
            lists.value = res as any
        } else if (res && (res as any).data) {
            lists.value = (res as any).data
        } else {
            lists.value = []
        }
        // Emitir la cantidad de listas para que el padre ajuste el layout
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

const handleConfirm = async (data: CreateList) => {
    // Crear la lista por API y refrescar
    if (!auth.token) return
    try {
        await listService.createList(auth.token, { name: data.nombre, description: data.descripcion, recurring: data.recurrente })
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
            props.handleSelectList(null as any)
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
    <CreateListModal v-model="isModalVisible" @confirm="handleConfirm" />

    <div class="lists-panel">
        <div class="lists-header">
            <h2 class="panel-title">Listas</h2>
            <v-btn icon="mdi-history" color="black" variant="text" class="history-button" @click="props.openHistory()">
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
                @click="props.handleSelectList(list)">
                <v-card-text class="list-item-content">
                    <v-icon class="list-icon" color="white">mdi-format-list-bulleted</v-icon>
                    <div>
                        <div class="list-name">{{ list.name }}</div>
                        <div class="list-count">{{ (list.products && list.products.length) || 'Sin' }} Productos</div>
                    </div>
                    <v-spacer />
                    <v-btn icon="mdi-delete" variant="text" color="white" @click.stop="handleDelete(list.id)" />
                </v-card-text>
            </v-card>
        </div>
        <v-btn color="secondary" class="fab-button-left" size="large" icon="mdi-playlist-plus" fab @click="handleOpen">
        </v-btn>
    </div>
</template>