<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useListIcon } from '../composables/listIcons'

interface CreateList {
    nombre: string
    descripcion?: string
    selectedIcon?: string
}

// 1. Cambiamos la prop a 'modelValue' para que funcione con v-model
const props = defineProps<{
    modelValue: boolean
}>()

// 2. Cambiamos el emit para soportar v-model y también 'confirm'
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void,
    (e: 'confirm', data: CreateList): void
}>()

// 3. Creamos la propiedad computada para manejar el v-model de forma segura
const isVisible = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

// Composables
const { getAllAvailableListIcons } = useListIcon()

const formRef = ref()
const formularioValido = ref(false)

const form = reactive<CreateList>({
    nombre: '',
    recurrente: false,
    descripcion: '',
    selectedIcon: 'mdi-cart'
})

// Computed para iconos disponibles
const availableIconsForSelection = computed(() => {
  const allIcons = getAllAvailableListIcons()
  return allIcons.map(iconData => ({
    ...iconData,
    displayName: iconData.name
  }))
})



// Reglas de validación para el icono
const iconRules = [
  (v: string) => !!v || 'Selecciona un icono para la lista',
]

const resetForm = () => {
    form.nombre = ''
    form.descripcion = ''
    form.selectedIcon = 'mdi-cart'
}

const handleConfirm = () => {
    // 4. Emitimos el objeto 'form' con los datos del usuario
    emit('confirm', { ...form }) // Usamos una copia para romper la reactividad
    isVisible.value = false // Cerramos el modal
    resetForm();
}

const handleCancel = () => {
    isVisible.value = false // Cerramos el modal
    resetForm();
}

</script>

<style scoped>
.v-card-title {
    background-color: rgba(var(--v-theme-primary), 0.06);
}

.cursor-pointer {
    cursor: pointer;
}
</style>

<template>
    <v-dialog v-model="isVisible" max-width="600" persistent :fullscreen="$vuetify.display.xs">
        <v-card>
            <v-card-title class="d-flex align-center pa-4">
                <v-icon start>mdi-playlist-plus</v-icon>
                Crear nueva lista
            </v-card-title>

            <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formularioValido">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="form.nombre" label="Nombre de la lista *"
                                    placeholder="ej: Compras semanal" variant="solo" persistent-placeholder
                                    :rules="[v => !!v || 'El nombre es requerido']" required density="comfortable"
                                    hide-details="auto" />
                            </v-col>

                            <v-col cols="12">
                                <v-select
                                    v-model="form.selectedIcon"
                                    label="Icono de la lista *"
                                    :items="availableIconsForSelection"
                                    item-title="displayName"
                                    item-value="icon"
                                    variant="solo"
                                    :rules="iconRules"
                                    required
                                    density="comfortable"
                                    hide-details="auto"
                                >
                                    <template v-slot:selection="{ item }">
                                        <div class="d-flex align-center">
                                            <v-icon :icon="item.raw.icon" size="20" class="me-2" color="primary" />
                                            <span>{{ item.raw.displayName }}</span>
                                        </div>
                                    </template>
                                    
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props" class="pa-2">
                                            <template v-slot:prepend>
                                                <v-icon :icon="item.raw.icon" size="20" class="me-3" color="primary" />
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </v-col>

                            <v-col cols="12">
                                <v-checkbox v-model="form.recurrente" label="Lista recurrente" density="comfortable" />
                            </v-col>

                            <v-col cols="12">
                                <v-text-field v-model="form.descripcion" label="Descripción (opcional)"
                                    placeholder="Detalles adicionales..." variant="solo" persistent-placeholder
                                    density="comfortable" hide-details="auto" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn @click="handleCancel" variant="outlined">Cancelar</v-btn>
                <v-btn color="primary" :disabled="!formularioValido || !form.nombre.trim()" @click="handleConfirm">
                    Crear lista
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>