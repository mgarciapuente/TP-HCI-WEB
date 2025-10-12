<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

interface CreateList {
    nombre: string
    descripcion?: string
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

const formRef = ref()
const formularioValido = ref(false)

const form = reactive<CreateList>({
    nombre: '',
    descripcion: ''
})

const resetForm = () => {
    form.nombre = ''
    form.descripcion = ''
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
</style>

<template>
    <v-dialog v-model="isVisible" max-width="600" persistent>
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