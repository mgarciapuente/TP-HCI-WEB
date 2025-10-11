<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import CantidadModal from './CantidadModal.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'
import { productsService } from '@/services/productsService'

interface Props {
    selectedList: { id: number; name: string; products?: any[] } | null;
    addProductMode: boolean;
    selectedCategoryId?: number | null;

}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'add-product', productId: number): void
}>()

const auth = useAuthStore()
const items = ref<any[]>([])
const loading = ref(false)

const searchQuery = ref('')

// modal state for adding selected product to the active list
const showAddModal = ref(false)
const productToAdd = ref<any>(null)
const addForm = reactive({ quantity: 1, unit: 'unidades' })

// Fetch global products list (to add to shopping list)
const fetchProducts = async () => {
    if (!auth.token) return
    loading.value = true
    try {
        const params: Record<string, any> = {
            page: 1,
            per_page: 200
        }
        if (searchQuery.value && searchQuery.value.trim()) params.name = searchQuery.value.trim()

        const res = await productsService.getProducts(params, auth.token || undefined)
        
        items.value = res.products || [];
    } catch (err) {
        console.error('Error obteniendo productos globales:', err)
        items.value = []
    } finally {
        loading.value = false
    }
}

// El componente se renderiza únicamente cuando addProductMode === true (v-if en el padre),
// por lo que basta con cargar los productos al montarse.
onMounted(() => {
    fetchProducts()
})

watch(() => props.selectedCategoryId, () => {
    fetchProducts()
})

watch(() => searchQuery.value, () => {
    // simple immediate search; can debounce if needed
    fetchProducts()
})

// handleOpen removed; use openAddForProduct from template buttons

const openAddForProduct = (product: any) => {
    productToAdd.value = product
    addForm.quantity = 1
    addForm.unit = 'unidades'
    showAddModal.value = true
}

const confirmAdd = async () => {
    if (!productToAdd.value || !props.selectedList || !auth.token) return
    try {
        const payload = {
            product: { id: productToAdd.value.id },
            quantity: addForm.quantity,
            unit: addForm.unit
        }
        await listService.addListItem(auth.token, props.selectedList.id, payload)
        // Emitir evento para que el padre refresque
        emit('add-product', productToAdd.value.id)
        showAddModal.value = false
    } catch (err) {
        console.error('Error agregando producto a la lista:', err)
        window.alert('No se pudo agregar el producto')
    }
}

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
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e0e0e0;
    position: relative;
    padding: 0.5em 2.5em 0.25em 2.5em;
}

.products-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1em 0 1em 0.25em;
}

.products-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0.5em;
}

.product-item {
    margin-bottom: 1em;
    border-radius: 20px;
    border-width: 3px;
    border-style: solid;
    border-color: transparent;
}

.product-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
            <h2 class="panel-title">Productos</h2>
        </div>
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:0.5rem;">
            <SearchBar v-model="searchQuery" placeholder="Buscar producto..." :debounce-ms="500" />
        </div>
        <div class="products-scroll">
            <div v-if="loading" class="loading">Cargando...</div>

            <div v-else-if="items.length === 0" class="no-products">
                <v-icon size="48" color="grey">mdi-cube-outline</v-icon>
                <p class="text-grey">No hay productos disponibles</p>
                <p class="text-grey-lighten-1">Crea productos en el módulo de Productos o sincroniza tu almacén</p>
            </div>

            <div v-else class="products-list">
                <v-card v-for="product in items" :key="product.id" class="product-item" variant="flat"
                    color="backgroundColor">
                    <v-card-text class="product-content">
                        <div class="product-info">
                            <h3 class="product-name">{{ product.name || product.product?.name }}</h3>
                            <p class="product-details">{{ product.description || product.metadata?.notes || '' }}</p>
                        </div>
                        <v-spacer />
                        <v-icon size="x-large" @click="openAddForProduct(product)" color="secondary">mdi-plus</v-icon>
                    </v-card-text>
                </v-card>
            </div>
        </div>

                        <CantidadModal
                            :model-value="showAddModal"
                            :quantity="addForm.quantity"
                            :unit="addForm.unit"
                            :mode="'add'"
                            :title="'Agregar ' + (productToAdd?.name || productToAdd?.product?.name || '')"
                            @update:modelValue="showAddModal = $event"
                            @save="({ quantity, unit }) => { addForm.quantity = quantity; addForm.unit = unit; confirmAdd(); }"
                        />
    </div>
</template>