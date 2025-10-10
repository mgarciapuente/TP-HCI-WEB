<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listService } from '@/services/listService'
import { productService } from '@/services/productService'

interface Props {
    selectedList: { id: number; name: string; products?: any[] } | null;
    addProductMode: boolean;

}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'add-product', productId: number): void
}>()

const auth = useAuthStore()
const items = ref<any[]>([])
const loading = ref(false)

// modal state for adding selected product to the active list
const showAddModal = ref(false)
const productToAdd = ref<any>(null)
const addForm = reactive({ quantity: 1, unit: 'unidades' })

// Fetch global products list (to add to shopping list)
const fetchProducts = async () => {
    if (!auth.token) return
    loading.value = true
    try {
        const res = await productService.getProducts(auth.token, { page: 1, per_page: 200 })
        items.value = Array.isArray(res) ? res as any[] : (res as any) || []
    } catch (err) {
        console.error('Error obteniendo productos globales:', err)
        items.value = []
    } finally {
        loading.value = false
    }
}

// Si estamos en modo agregar productos, cargamos el listado global
watch(() => props.addProductMode, (val) => {
    if (val) fetchProducts()
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
    padding-right: 0.5em;
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
        <div class="products-scroll">
            <div v-if="loading" class="loading">Cargando...</div>

            <div v-else-if="items.length === 0" class="no-products">
                <v-icon size="48" color="grey">mdi-cube-outline</v-icon>
                <p class="text-grey">No hay productos disponibles</p>
                <p class="text-grey-lighten-1">Crea productos en el módulo de Productos o sincroniza tu almacén</p>
            </div>

            <div v-else class="products-list">
                <v-card v-for="product in items" :key="product.id" class="product-item mb-2" variant="flat">
                    <v-card-text class="product-content">
                        <div class="product-info">
                            <h4 class="product-name">{{ product.name || product.product?.name }}</h4>
                            <p class="product-details">{{ product.description || product.metadata?.notes || '' }}</p>
                        </div>
                        <v-spacer />
                        <v-btn icon color="secondary" @click="openAddForProduct(product)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-text>
                </v-card>
            </div>
        </div>

        <!-- Dialog para ingresar cantidad y unidad al agregar -->
        <v-dialog v-model="showAddModal" max-width="420">
            <v-card>
                <v-card-title>Agregar "{{ productToAdd?.name || productToAdd?.product?.name }}"</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model.number="addForm.quantity" label="Cantidad" type="number" min="0.01" step="0.01" />
                        <v-select v-model="addForm.unit" :items="['unidades','kg','gr','lt','ml','paquete']" label="Unidad" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="outlined" @click="showAddModal = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="confirmAdd">Agregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>