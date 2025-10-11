<script setup lang="ts">
import { ref, watch } from 'vue'
import CategoryFilters from './CategoryFilters.vue'
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'
import { purchasesService } from '@/services/purchasesService'
import type { ListItem } from '@/types/listTypes'

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
}>()

const auth = useAuthStore()
const items = ref<ListItem[]>([])
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
                const res: any = await purchasesService.getPurchase(auth.token, props.selectedPurchase.id)
                const purchaseListItems = res?.list?.items || []
                items.value = purchaseListItems
                // Apply category filter client-side if present
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

watch(() => props.selectedList, () => {
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
    gap: 8px;
    margin-bottom: 0.5rem;
}

.products-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0.5em;
}

.product-item {
    display: flex;
    flex-direction: row;
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
    bottom: 1.5em;
    right: 1.5em;
}
</style>

<template>
    <div class="products-panel">
        <div class="products-header">
            <div class="header-top">
                <v-btn v-if="props.addProductMode" icon @click="emit('exit-add-mode')">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <h2 class="panel-title">{{ props.selectedList?.name }}</h2>
            </div>
            <CategoryFilters @categoryChanged="onCategoryChanged" />
        </div>
        <div class="products-scroll">
            <div v-if="loading" class="loading">Cargando...</div>

            <div v-else-if="items.length === 0" class="no-products">
                <v-icon size="48" color="grey">mdi-cart-outline</v-icon>
                <p class="text-grey">No hay productos en esta lista aún</p>
                <p class="text-grey-lighten-1">Usa el botón + de la derecha para agregar productos</p>
            </div>

            <div v-else class="products-list">
                <v-card v-for="product in items" :key="product.id" class="product-item mb-2" variant="flat"
                    color="backgroundColor">
                    <v-card-text class="product-content">
                        <div class="product-info">
                            <h4 class="product-name">{{ product.product?.name }}</h4>
                            <p class="product-details">{{ product.quantity }} {{ product.unit }}</p>
                        </div>
                    </v-card-text>
                        <v-checkbox v-if="!props.historyMode" :model-value="product.purchased" density="compact" hide-details
                            @click="togglePurchased(product)" />
                </v-card>
            </div>
        </div>
        <v-btn v-if="!props.historyMode" color="secondary" class="fab-button-right" size="large" icon="mdi-playlist-plus" fab
                @click="emit('enter-add-mode')">
            </v-btn>

        <v-snackbar v-model="errorSnackbar.show" color="error" timeout="4000">
            {{ errorSnackbar.text }}
        </v-snackbar>
    </div>
</template>