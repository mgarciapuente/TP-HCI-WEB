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
            
            <v-divider></v-divider>
            
            <div class="d-flex justify-space-between align-center py-2">
              <div>
                <div class="font-weight-medium">Eliminar cuenta</div>
                <div class="text-caption text-grey">Elimina permanentemente tu cuenta</div>
              </div>
              <v-btn 
                variant="outlined" 
                color="error" 
                size="small"
                style="border-radius: 8px;"
              >
                Eliminar
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Sección Notificaciones -->
      <v-card class="mb-4" elevation="2" style="border-radius: 16px;">
        <v-card-title class="d-flex align-center" style="background-color: rgba(70, 93, 70, 0.05);">
          <v-icon class="mr-3" color="primary">mdi-bell</v-icon>
          <span style="color: rgb(var(--v-theme-primary));">Notificaciones</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="d-flex flex-column" style="gap: 16px;">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="font-weight-medium">Notificaciones por email</div>
                <div class="text-caption text-grey">Recibe actualizaciones por correo</div>
              </div>
              <v-switch 
                v-model="emailNotifications"
                color="primary"
                hide-details
              ></v-switch>
            </div>
            
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="font-weight-medium">Recordatorios de listas</div>
                <div class="text-caption text-grey">Te avisamos cuando tengas listas pendientes</div>
              </div>
              <v-switch 
                v-model="listReminders"
                color="primary"
                hide-details
              ></v-switch>
            </div>
            
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="font-weight-medium">Listas compartidas</div>
                <div class="text-caption text-grey">Notificaciones cuando alguien modifica una lista compartida</div>
              </div>
              <v-switch 
                v-model="sharedListNotifications"
                color="primary"
                hide-details
              ></v-switch>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Sección Privacidad -->
      <v-card class="mb-4" elevation="2" style="border-radius: 16px;">
        <v-card-title class="d-flex align-center" style="background-color: rgba(70, 93, 70, 0.05);">
          <v-icon class="mr-3" color="primary">mdi-shield-check</v-icon>
          <span style="color: rgb(var(--v-theme-primary));">Privacidad</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="d-flex flex-column" style="gap: 16px;">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="font-weight-medium">Perfil público</div>
                <div class="text-caption text-grey">Permite que otros usuarios te encuentren</div>
              </div>
              <v-switch 
                v-model="publicProfile"
                color="primary"
                hide-details
              ></v-switch>
            </div>
            
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="font-weight-medium">Compartir estadísticas</div>
                <div class="text-caption text-grey">Ayuda a mejorar la app compartiendo datos anónimos</div>
              </div>
              <v-switch 
                v-model="shareAnalytics"
                color="primary"
                hide-details
              ></v-switch>
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

// Estado de las configuraciones
const emailNotifications = ref(true)
const listReminders = ref(true)
const sharedListNotifications = ref(true)
const publicProfile = ref(false)
const shareAnalytics = ref(true)

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