<template>
  <div class="almacen-page">
    <div class="header">
      <h1>Mi Almacén</h1>
      <p>Organiza tus productos por categorías y eventos</p>
      
      <v-btn 
        color="primary" 
        @click="mostrarDialogoCategoria = true"
        prepend-icon="mdi-plus"
        class="mb-4"
      >
        Nueva Categoría
      </v-btn>
    </div>

    <!-- Grid de categorías -->
    <div v-if="almacenStore.categorias.length === 0" class="content-placeholder">
      <v-icon size="64" color="grey">mdi-warehouse</v-icon>
      <h3>No tienes categorías creadas</h3>
      <p>Comienza creando tu primera categoría como "Asado del domingo"</p>
    </div>

    <div v-else class="categorias-grid">
      <v-card
        v-for="categoria in almacenStore.categorias"
        :key="categoria.id"
        class="categoria-card"
        elevation="2"
      >
        <v-card-title class="categoria-title">
          <span>{{ categoria.nombre }}</span>
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
            class="delete-btn"
            @click="eliminarCategoria(categoria.id)"
          />
        </v-card-title>

        <v-card-text>
          <div class="productos-container">
            <!-- Lista de productos agrupados por categoría -->
            <div v-if="categoria.productos.length === 0" class="no-productos">
              <v-icon color="grey-lighten-1">mdi-package-variant</v-icon>
              <p class="text-grey-lighten-1">Sin productos</p>
            </div>
            
            <div v-else class="productos-lista">
              <!-- Grupos de productos como paneles desplegables -->
              <v-expansion-panels
                multiple
                class="grupos-expansion"
                :model-value="panelesActivos[categoria.id] || []"
                @update:model-value="val => actualizarPaneles(categoria.id, val)"
              >
                <v-expansion-panel
                  v-for="(grupo, categoriaAlimento) in productosAgrupados(categoria.productos)"
                  :key="categoriaAlimento"
                  :value="categoriaAlimento"
                  class="grupo-categoria"
                >
                  <v-expansion-panel-title>
                    <v-icon start size="18">mdi-tag</v-icon>
                    <span class="grupo-titulo">{{ categoriaAlimento || 'Sin categoría' }} ({{ grupo.length }})</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div
                      v-for="producto in grupo"
                      :key="producto.id"
                      class="producto-row"
                    >
                      <div class="producto-header">
                        <div class="producto-main">
                          <h4 class="producto-nombre">{{ producto.nombre }}</h4>
                          <div class="producto-metas">
                            <span class="pill cantidad-pill">{{ producto.cantidad }} {{ producto.unidad }}</span>
                            <span
                              v-if="producto.fechaVencimiento"
                              class="pill fecha-pill"
                            >
                              <v-icon size="14" start>mdi-calendar</v-icon>
                              {{ formatearFecha(producto.fechaVencimiento) }}
                            </span>
                            <span v-if="producto.precio" class="pill precio-pill">
                              <v-icon size="14" start>mdi-currency-usd</v-icon>{{ producto.precio }}
                            </span>
                          </div>
                        </div>
                        <div class="acciones-producto horizontal">
                          <v-btn
                            icon="mdi-pencil"
                            size="small"
                            variant="text"
                            color="primary"
                            density="compact"
                            @click="editarProducto(categoria.id, producto)"
                          />
                          <v-btn
                            icon="mdi-delete"
                            size="small"
                            variant="text"
                            color="error"
                            density="compact"
                            @click="almacenStore.eliminarProducto(categoria.id, producto.id)"
                          />
                        </div>
                      </div>
                      <p v-if="producto.descripcion" class="descripcion text-grey-darken-1 mt-2">
                        {{ producto.descripcion }}
                      </p>
                      <div v-if="producto.marca" class="marca-row mt-2">
                        <v-icon size="14" start>mdi-tag</v-icon>
                        <small class="text-grey-darken-2">{{ producto.marca }}</small>
                      </div>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="categoria-actions">
          <!-- Botón para agregar producto (chip estilo) -->
          <div class="agregar-wrapper w-100 d-flex justify-center">
            <v-btn
              @click="abrirModalProducto(categoria.id)"
              size="large"
              variant="flat"
              prepend-icon="mdi-plus"
              class="agregar-producto-btn"
            >
              Agregar
            </v-btn>
          </div>
          <div class="w-100 d-flex justify-end mt-1">
            <small class="text-grey">
              {{ categoria.productos.length }} producto{{ categoria.productos.length !== 1 ? 's' : '' }}
            </small>
          </div>
        </v-card-actions>
      </v-card>
    </div>

    <!-- Dialog para crear nueva categoría -->
    <v-dialog v-model="mostrarDialogoCategoria" max-width="400">
      <v-card>
        <v-card-title>Nueva Categoría</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="nombreNuevaCategoria"
            label="Nombre de la categoría"
            placeholder="ej: Asado del domingo"
            variant="outlined"
            @keyup.enter="crearCategoria"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="mostrarDialogoCategoria = false">Cancelar</v-btn>
          <v-btn 
            @click="crearCategoria" 
            color="primary"
            :disabled="!nombreNuevaCategoria.trim()"
          >
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para agregar producto -->
    <AgregarProductoModal
      v-model="mostrarModalProducto"
      :producto-a-editar="productoAEditar"
      @agregar="agregarProductoCompleto"
      @editar="editarProductoCompleto"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAlmacenStore } from '@/stores/almacen'
import AgregarProductoModal from '@/components/AgregarProductoModal.vue'

const almacenStore = useAlmacenStore()

// Estados reactivos
const mostrarDialogoCategoria = ref(false)
const nombreNuevaCategoria = ref('')
const mostrarModalProducto = ref(false)
const categoriaSeleccionada = ref<number | null>(null)
const productoAEditar = ref<any>(null)
// Control de paneles abiertos por categoría (idCategoria -> array de claves abiertas)
const panelesActivos = ref<Record<number, string[]>>({})

const actualizarPaneles = (categoriaId: number, val: unknown) => {
  if (!Array.isArray(val)) return
  panelesActivos.value = {
    ...panelesActivos.value,
    [categoriaId]: val as string[]
  }
}

// Métodos
const crearCategoria = () => {
  if (nombreNuevaCategoria.value.trim()) {
    almacenStore.agregarCategoria(nombreNuevaCategoria.value.trim())
    // Resetear formulario
    nombreNuevaCategoria.value = ''
    mostrarDialogoCategoria.value = false
  }
}

const eliminarCategoria = (categoriaId: number) => {
  almacenStore.eliminarCategoria(categoriaId)
}

const abrirModalProducto = (categoriaId: number) => {
  categoriaSeleccionada.value = categoriaId
  productoAEditar.value = null
  mostrarModalProducto.value = true
}

const editarProducto = (categoriaId: number, producto: any) => {
  categoriaSeleccionada.value = categoriaId
  productoAEditar.value = producto
  mostrarModalProducto.value = true
}

const agregarProductoCompleto = (producto: any) => {
  if (categoriaSeleccionada.value) {
    almacenStore.agregarProducto(categoriaSeleccionada.value, producto)
    categoriaSeleccionada.value = null
  }
}

const editarProductoCompleto = (producto: any) => {
  if (categoriaSeleccionada.value) {
    almacenStore.editarProducto(categoriaSeleccionada.value, producto)
    categoriaSeleccionada.value = null
    productoAEditar.value = null
  }
}

// Función para agrupar productos por categoría de alimento
const productosAgrupados = (productos: any[]) => {
  return productos.reduce((grupos: any, producto: any) => {
    const categoria = producto.categoria || 'Sin categoría'
    if (!grupos[categoria]) {
      grupos[categoria] = []
    }
    grupos[categoria].push(producto)
    return grupos
  }, {})
}

// Función para formatear fechas
const formatearFecha = (fecha: string) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<style scoped>
.almacen-page {
  padding: 12px 20px 24px;
}

.header {
  margin-bottom: 16px;
  padding-top: 4px;
}

.header h1 {
  margin: 0 0 4px;
}

.header p {
  margin-top: 0;
  margin-bottom: 12px;
  line-height: 1.2;
}

.categorias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
}

.categoria-card {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.productos-container {
  min-height: 180px;
}

.productos-container:has(.no-productos) {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.no-productos {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  text-align: center;
}

.productos-lista {
  min-height: 120px;
  margin-bottom: 8px;
  max-height: 260px;
  overflow-y: auto;
}

.grupo-categoria {
  margin-bottom: 16px;
}

.categoria-titulo {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
  padding: 4px 8px;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
}

/* Fila de producto full-width dentro del panel */
.producto-row {
  width: 100%;
  padding: 14px 4px 16px 4px; /* luego se compensa con padding del panel interno */
  border-bottom: 1px solid #eceff1;
  position: relative;
}

.producto-row:last-of-type {
  border-bottom: none;
  padding-bottom: 4px;
}

/* Ajustar el padding interno que añade v-expansion-panel-text */
:deep(.v-expansion-panel-text__wrapper) {
  padding: 4px 20px 8px 20px; /* mismo left/right que el card padre */
}

.producto-row:hover {
  background: #fafafa;
  border-radius: 12px;
}

.producto-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.producto-main {
  flex: 1;
  min-width: 0;
}

.producto-metas {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 12px;
  letter-spacing: .5px;
  background: #e3f2fd;
  color: #1565c0;
  text-transform: uppercase;
  white-space: nowrap;
}

.cantidad-pill { background: #fff3e0; color: #e65100; }
.fecha-pill { background: #ede7f6; color: #4527a0; }
.precio-pill { background: #e8f5e9; color: #2e7d32; }

.acciones-producto.horizontal {
  flex-direction: row;
  gap: 6px;
  height: fit-content;
  padding: 4px 0 0 12px;
}

.acciones-producto.horizontal .v-btn {
  background: #f5f7fa;
  border-radius: 10px;
  transition: background .15s;
}

.acciones-producto.horizontal .v-btn:hover {
  background: #edf1f5;
}

.acciones-producto.horizontal .v-btn:active {
  background: #e2e8ed;
}

.marca-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  letter-spacing: .3px;
}

.producto-info {
  min-width: 0; /* Permite que el texto se trunque si es necesario */
}

.producto-nombre {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.producto-detalles {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.cantidad-unidad {
  font-weight: 500;
  color: #1976d2;
}

.descripcion {
  font-size: 0.85rem;
  line-height: 1.3;
}

.info-adicional {
  border-top: 1px solid #eee;
  padding-top: 6px;
}

.info-adicional small {
  font-size: 0.75rem;
  line-height: 1.2;
}

.acciones-producto {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.categoria-actions {
  margin-top: auto;
  flex-direction: column;
  padding-top: 0;
}

.agregar-producto-btn {
  font-weight: 600;
  /* Color principal de la píldora: naranja base */
  background: var(--color-orange) !important;
  color: #fff !important; /* Texto blanco para contraste */
  border-radius: 22px;
  text-transform: none;
  letter-spacing: 0.5px;
  padding: 10px 34px !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.agregar-producto-btn:hover {
  /* Naranja anterior (el claro) al hacer hover */
  background: var(--color-orange-light) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
}

/* El overlay de Vuetify (que aclara) lo anulamos para que no se vea blanco */
.agregar-producto-btn .v-btn__overlay,
.agregar-producto-btn:hover .v-btn__overlay,
.agregar-producto-btn:focus-visible .v-btn__overlay {
  background-color: transparent !important;
  opacity: 0 !important;
}

/* Pequeño outline accesible al enfocar con teclado */
.agregar-producto-btn:focus-visible {
  outline: 2px solid var(--color-orange-light);
  outline-offset: 2px;
}

.agregar-producto-btn:active {
  transform: translateY(1px);
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
  text-align: center;
}

.categoria-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.categoria-title .delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
}

@media (max-width: 768px) {
  .categorias-grid {
    grid-template-columns: 1fr;
  }
  
  .almacen-page {
    padding: 8px 14px 16px;
  }
  
  .acciones-producto {
    flex-direction: row;
  }
}
</style>