<template>
  <v-dialog v-model="mostrarModal" max-width="600" persistent scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon start>{{ esEdicion ? 'mdi-pencil' : 'mdi-package-variant-plus' }}</v-icon>
        {{ esEdicion ? 'Editar Producto' : 'Agregar Producto' }}
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="formularioValido">
          <v-container>
            <v-row>
              <!-- Nombre del producto -->
              <v-col cols="12">
                <v-text-field
                  v-model="producto.nombre"
                  label="Nombre del producto *"
                  placeholder="ej: Asado de tira"
                  variant="solo"
                  persistent-placeholder
                  :rules="[v => !!v || 'El nombre es requerido']"
                  required
                  density="comfortable"
                  hide-details="auto"
                  class="nombre-producto-input"
                />
              </v-col>

              <!-- Cantidad y Unidad -->
              <v-col cols="6">
                <v-text-field
                  v-model.number="producto.cantidad"
                  label="Cantidad *"
                  type="number"
                  variant="solo"
                  persistent-placeholder
                  min="0.1"
                  step="0.1"
                  :rules="[v => v > 0 || 'La cantidad debe ser mayor a 0']"
                  required
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>
              
              <v-col cols="6">
                <v-select
                  v-model="producto.unidad"
                  label="Unidad *"
                  :items="unidades"
                  variant="solo"
                  persistent-placeholder
                  :rules="[v => !!v || 'La unidad es requerida']"
                  required
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Categoría de alimento -->
              <v-col cols="12">
                <v-select
                  v-model="producto.categoria"
                  label="Categoría de alimento"
                  :items="categorias"
                  variant="solo"
                  persistent-placeholder
                  clearable
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Descripción -->
              <v-col cols="12">
                <v-text-field
                  v-model="producto.descripcion"
                  label="Descripción"
                  placeholder="Detalles adicionales del producto..."
                  variant="solo"
                  persistent-placeholder
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Fecha de vencimiento -->
              <v-col cols="6">
                <v-text-field
                  v-model="producto.fechaVencimiento"
                  label="Fecha de vencimiento"
                  type="date"
                  variant="solo"
                  persistent-placeholder
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Precio -->
              <v-col cols="6">
                <v-text-field
                  v-model.number="producto.precio"
                  label="Precio"
                  type="number"
                  variant="solo"
                  persistent-placeholder
                  min="0"
                  step="0.01"
                  density="comfortable"
                  hide-details="auto"
                  style="appearance: textfield;"
                  inputmode="decimal"
                />
              </v-col>

              <!-- Marca -->
              <v-col cols="12">
                <v-text-field
                  v-model="producto.marca"
                  label="Marca"
                  placeholder="ej: La Anónima, Coto, etc."
                  variant="solo"
                  persistent-placeholder
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="cancelar" variant="outlined">
          Cancelar
        </v-btn>
        <v-btn 
          @click="guardar"
          color="primary"
          :disabled="!formularioValido || !producto.nombre.trim()"
        >
          {{ esEdicion ? 'Actualizar' : 'Agregar' }} Producto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'

interface ProductoForm {
  nombre: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  categoria: string;
  fechaVencimiento: string;
  precio: number | null;
  marca: string;
}

interface ProductoCompleto extends ProductoForm {
  id: number;
}

// Props
interface Props {
  modelValue: boolean;
  productoAEditar?: ProductoCompleto | null;
}

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'agregar', producto: ProductoForm): void;
  (e: 'editar', producto: ProductoCompleto): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Refs
const formRef = ref();
const formularioValido = ref(false);

// Computed para saber si estamos editando
const esEdicion = computed(() => !!props.productoAEditar);

// Computed para el v-model del modal
const mostrarModal = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  mostrarModal.value = newVal;
  if (newVal && props.productoAEditar) {
    // Cargar datos del producto a editar
    Object.assign(producto, props.productoAEditar);
  }
});

watch(mostrarModal, (newVal) => {
  emit('update:modelValue', newVal);
});

// Estado del formulario
const producto = reactive<ProductoForm>({
  nombre: '',
  cantidad: 1,
  unidad: 'unidades',
  descripcion: '',
  categoria: '',
  fechaVencimiento: '',
  precio: null,
  marca: ''
});

// Opciones para los selects
const unidades = [
  'unidades',
  'kg',
  'gr',
  'lt',
  'ml',
  'docena',
  'paquete',
  'lata',
  'botella',
  'bolsa'
];

const categorias = [
  'Carnes',
  'Lácteos',
  'Verduras',
  'Frutas',
  'Panificados',
  'Bebidas',
  'Condimentos',
  'Congelados',
  'Conservas',
  'Snacks',
  'Limpieza',
  'Otros'
];

// Métodos
const resetearFormulario = () => {
  producto.nombre = '';
  producto.cantidad = 1;
  producto.unidad = 'unidades';
  producto.descripcion = '';
  producto.categoria = '';
  producto.fechaVencimiento = '';
  producto.precio = null;
  producto.marca = '';
  
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const cancelar = () => {
  resetearFormulario();
  mostrarModal.value = false;
};

const guardar = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (valid && producto.nombre.trim()) {
      if (esEdicion.value && props.productoAEditar) {
        emit('editar', { ...props.productoAEditar, ...producto });
      } else {
        emit('agregar', { ...producto });
      }
      resetearFormulario();
      mostrarModal.value = false;
    }
  }
};
</script>

<style scoped>
.v-card-title {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.v-text-field input[type="number"]::-webkit-outer-spin-button,
.v-text-field input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.v-text-field input[type="number"] {
  -moz-appearance: textfield;
}

.nombre-producto-input .v-label {
  font-size: 1.1rem;
  font-weight: 500;
  top: 0 !important;
  left: 0 !important;
  transform: none !important;
  background: transparent !important;
  padding-left: 2px;
}
</style>