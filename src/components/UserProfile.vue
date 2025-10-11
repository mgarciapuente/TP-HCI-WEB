<template>
  <div class="profile-container">
    <!-- Información del usuario -->
    <div class="profile-info">
      <div class="profile-avatar-container">
        <v-avatar size="100" style="margin-bottom: 16px;">
          <v-icon size="60" color="#465D46">mdi-account-circle</v-icon>
        </v-avatar>
      </div>
      <h2 class="perfil-name">{{ fullName }}</h2>
      <p class="perfil-email">{{ authStore.user?.email }}</p>
      <p class="perfil-date" v-if="authStore.user?.createdAt">
        Miembro desde {{ formatDate(authStore.user.createdAt) }}
      </p>
    </div>
    
    <!-- Botón de editar perfil -->
    <div class="edit-profile-section">
      <v-btn 
        variant="outlined" 
        class="edit-profile-button"
        style="border-color: #465D46; color: #465D46;"
        @click="openEditModal"
      >
        <v-icon start>mdi-pencil</v-icon>
        Editar perfil
      </v-btn>
    </div>

    <!-- Modal de edición de perfil -->
    <EditProfileModal
      v-model="showEditModal"
      :initial-name="authStore.user?.name"
      :initial-surname="authStore.user?.surname"
      @profile-updated="handleProfileUpdated"
    />
    
    <!-- Botón de logout -->
    <div class="logout-section">
      <v-btn 
        @click="handleLogout" 
        class="logout-button"
        :loading="loggingOut"
        size="large"
        style="background-color: #F5844E; color: white; border-radius: 12px;"
      >
        <v-icon start>mdi-logout</v-icon>
        Cerrar sesión
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import EditProfileModal from './EditProfileModal.vue'

const authStore = useAuthStore()
const router = useRouter()
const loggingOut = ref(false)
const showEditModal = ref(false)

// Computed para el nombre completo
const fullName = computed(() => {
  if (authStore.user?.name && authStore.user?.surname) {
    return `${authStore.user.name} ${authStore.user.surname}`
  }
  return authStore.user?.name || 'Usuario'
})

// Función para formatear fecha
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    })
  } catch {
    return 'Fecha no disponible'
  }
}

// Abrir modal de edición
const openEditModal = () => {
  showEditModal.value = true
}

// Manejar actualización exitosa del perfil
const handleProfileUpdated = (updatedUser: any) => {
  console.log('Perfil actualizado exitosamente:', updatedUser)
  // Aquí podrías mostrar un mensaje de éxito si quieres
}

// Manejar logout
const handleLogout = async () => {
  loggingOut.value = true
  try {
    await authStore.logout()
    // Redirigir a la página de inicio después del logout
    router.push('/inicio')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Incluso si hay error, redirigir (el logout local ya se hizo)
    router.push('/inicio')
  } finally {
    loggingOut.value = false
  }
}
</script>

<style scoped>
.perfil-name {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 0.25em;
  margin-top: 0.25em;
  text-align: center;
}

.perfil-email {
  font-size: 1em;
  text-align: center;
  margin-bottom: 0.25em;
  margin-top: 0.25em;
}

.profile-avatar{
  max-width: 100px;
  border-radius: 50%;
  align-items: center;
  margin: 0.25em auto;
  display: block;
}

.edit-profile-section {
  margin: 1rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.edit-profile-button {
  height: 48px;
  font-size: 0.9em;
  min-width: 200px;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.profile-info {
  margin-bottom: 1rem;
  text-align: center;
}

.logout-section {
  margin-top: 3rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.logout-button {
  background-color: #F5844E;
  min-width: 180px;
  max-width: 250px;
}
</style>