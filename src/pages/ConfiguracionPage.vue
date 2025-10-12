<template>
  <div class="d-flex flex-column" style="height: 100%; padding: 20px;">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h4 mb-2" style="color: rgb(var(--v-theme-primary)); font-weight: 600;">
        Configuración
      </h1>
      <p class="text-body-1" style="color: #666;">
        Personaliza tu experiencia en Canasta
      </p>
    </div>

    <!-- Secciones de configuración -->
    <div class="flex-grow-1">
      <!-- Sección Cuenta -->
      <v-card class="mb-4" elevation="2" style="border-radius: 16px;">
        <v-card-title class="d-flex align-center" style="background-color: rgba(70, 93, 70, 0.05);">
          <v-icon class="mr-3" color="primary">mdi-account-circle</v-icon>
          <span style="color: rgb(var(--v-theme-primary));">Cuenta</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="d-flex flex-column" style="gap: 12px;">
            <div class="d-flex justify-space-between align-center py-2">
              <div>
                <div class="font-weight-medium">Cambiar contraseña</div>
                <div class="text-caption text-grey">Actualiza tu contraseña de acceso</div>
              </div>
              <v-btn 
                variant="outlined" 
                color="primary" 
                size="small"
                style="border-radius: 8px;"
                @click="openChangePasswordModal"
              >
                Cambiar
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>




      <!-- Sección Sobre la app -->
      <v-card elevation="2" style="border-radius: 16px;">
        <v-card-title class="d-flex align-center" style="background-color: rgba(70, 93, 70, 0.05);">
          <v-icon class="mr-3" color="primary">mdi-information</v-icon>
          <span style="color: rgb(var(--v-theme-primary));">Sobre Canasta</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="d-flex flex-column" style="gap: 12px;">
            <div class="d-flex justify-space-between align-center py-2">
              <div>
                <div class="font-weight-medium">Versión</div>
                <div class="text-caption text-grey">1.0.0</div>
              </div>
            </div>
            
            <v-divider></v-divider>
            
            <div class="d-flex justify-space-between align-center py-2">
              <div>
                <div class="font-weight-medium">Términos y condiciones</div>
                <div class="text-caption text-grey">Lee nuestros términos de uso</div>
              </div>
              <v-btn 
                variant="text" 
                color="primary" 
                size="small"
                style="text-transform: none;"
              >
                Ver
              </v-btn>
            </div>
            
            <div class="d-flex justify-space-between align-center py-2">
              <div>
                <div class="font-weight-medium">Política de privacidad</div>
                <div class="text-caption text-grey">Cómo manejamos tus datos</div>
              </div>
              <v-btn 
                variant="text" 
                color="primary" 
                size="small"
                style="text-transform: none;"
              >
                Ver
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Modal de cambio de contraseña -->
    <ChangePasswordModal
      v-model="showChangePasswordModal"
      @password-changed="handlePasswordChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChangePasswordModal from '../components/ChangePasswordModal.vue'



// Estado del modal de cambio de contraseña
const showChangePasswordModal = ref(false)

// Abrir modal de cambio de contraseña
const openChangePasswordModal = () => {
  showChangePasswordModal.value = true
}

// Manejar cambio exitoso de contraseña
const handlePasswordChanged = () => {
  console.log('Contraseña cambiada exitosamente')
  // Aquí podrías mostrar un snackbar o notificación de éxito
}

// TODO: Aquí se implementarían las funciones para guardar las configuraciones
// const saveSettings = async () => {
//   // Llamar al API para guardar las configuraciones
// }
</script>

<style scoped>
.v-card-title {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}
</style>