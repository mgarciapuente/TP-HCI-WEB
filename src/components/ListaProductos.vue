
<script>
    export default {
        props: ['selectedList']
}
</script>

<template>
    <div class="products-panel">
        <div v-if="!selectedList" class="no-selection">
            <v-icon size="64" color="grey">mdi-format-list-bulleted</v-icon>
            <h3>Seleccione una lista para ver los productos</h3>
        </div>
        <div v-else class="products-content">
            <h3 class="panel-title">{{ selectedList.name }}</h3>
            <div class="products-scroll">
                <div v-if="selectedList.products.length === 0" class="no-products">
                    <v-icon size="48" color="grey">mdi-cart-outline</v-icon>
                    <p class="text-grey">No hay productos en esta lista aún</p>
                    <p class="text-grey-lighten-1">Usa el botón + de la derecha para agregar productos</p>
                </div>
                <div v-else class="products-list">
                    <v-card v-for="product in selectedList.products" :key="product.id" class="product-item mb-2"
                        variant="flat">
                        <v-card-text class="product-content">
                            <div class="product-info">
                                <h4 class="product-name">{{ product.name }}</h4>
                                <p class="product-details">{{ product.quantity }} {{ product.unit }}</p>
                            </div>
                            <v-checkbox density="compact" hide-details></v-checkbox>
                        </v-card-text>
                    </v-card>
                </div>
            </div>
        </div>
    </div>
</template>