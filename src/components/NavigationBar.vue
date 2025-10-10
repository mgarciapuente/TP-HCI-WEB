<template>
  <v-app-bar 
    color="primary" 
    elevation="2"
  >
    <div class="navbar-title-container">
      <img src="@/assets/logo.png" alt="Logo" class="navbar-logo" height="32" />
      <v-app-bar-title class="text-buttons font-weight-medium navbar-title-text">
        Canasta
      </v-app-bar-title>
    </div>

    <v-spacer></v-spacer>

    <!-- Navegación del header -->
    <v-btn 
      v-if="!authStore.isLoggedIn"
      variant="text" 
      color="buttons"
      class="text-none normal-case nav-button"
      :class="{ 'active-nav': isActive('/inicio') }"
      @click="$router.push('/inicio')"
    >
      Inicio
    </v-btn>

    <v-btn
      v-if="authStore.isLoggedIn"
      variant="text"
      color="buttons"
      class="text-none normal-case nav-button"
      :class="{ 'active-nav': isActive('/listas') }"
      @click="$router.push('/listas')"
    >
      Listas
    </v-btn>
    
    <v-btn 
      v-if="authStore.isLoggedIn"
      variant="text"
      color="buttons"
      class="text-none normal-case nav-button"
      :class="{ 'active-nav': isActive('/productos') }"
      @click="$router.push('/productos')"
    >
      Productos
    </v-btn>
    
    <!-- Avatar de perfil con desplegable -->
    <div 
      v-if="authStore.isLoggedIn"
      class="profile-dropdown-container"
      @mouseenter="showDropdown = true"
      @mouseleave="hideDropdownDelayed"
    >
      <v-avatar 
        size="40"
        class="profile-avatar"
        :class="{ 'active-avatar': isActive('/perfil') || isActive('/configuracion') }"
      >
        <span class="profile-initials">{{ userInitials }}</span>
      </v-avatar>

      <!-- Desplegable -->
      <div 
        v-show="showDropdown"
        class="profile-dropdown"
        @mouseenter="cancelHideDropdown"
        @mouseleave="hideDropdownDelayed"
      >
        <div class="dropdown-item" @click="navigateToProfile">
          <v-icon size="20" class="dropdown-icon">mdi-account</v-icon>
          <span>Perfil</span>
        </div>
        
        <div class="dropdown-item" @click="navigateToSettings">
          <v-icon size="20" class="dropdown-icon">mdi-cog</v-icon>
          <span>Configuración</span>
        </div>
        
        <div 
          v-if="!isActive('/perfil')"
          class="dropdown-item logout-item" 
          @click="handleLogout"
        >
          <v-icon size="20" class="dropdown-icon">mdi-logout</v-icon>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Estado del dropdown
const showDropdown = ref(false)
let hideTimeout: number | null = null

const isActive = (path: string) => {
  return computed(() => route.path === path).value
}

// Funciones para manejar el dropdown con delay
const hideDropdownDelayed = () => {
  hideTimeout = setTimeout(() => {
    showDropdown.value = false
  }, 150) // 150ms de delay
}

const cancelHideDropdown = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  showDropdown.value = true
}

// Computed para las iniciales del usuario
const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  
  const firstName = authStore.user.name || ''
  const lastName = authStore.user.surname || ''
  
  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()
  
  return firstInitial + lastInitial
})

// Funciones de navegación
const navigateToProfile = () => {
  showDropdown.value = false
  router.push('/perfil')
}

const navigateToSettings = () => {
  showDropdown.value = false
  router.push('/configuracion')
}

const handleLogout = async () => {
  showDropdown.value = false
  await authStore.logout()
  router.push('/inicio')
}

</script>

<style scoped>
.normal-case {
  text-transform: none !important;
}

.nav-button {
  /* Remover outline y border en todos los estados */
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.navbar-title-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.navbar-logo {
  vertical-align: middle;
  margin-left: 16px;
  margin-right: 12px;
}
.navbar-title-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

.bypass-indicator {
  margin-left: 8px;
  font-size: 10px;
  height: 20px;
}

/* Estados hover, focus, active para los botones */
.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  outline: none !important;
  border: none !important;
}

.nav-button:focus {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.nav-button:active {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.nav-button:focus-visible {
  outline: none !important;
  border: none !important;
}

/* Estilo para el botón activo */
.active-nav {
  text-decoration: underline !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Remover cualquier efecto de ripple o overlay */
.nav-button :deep(.v-btn__overlay) {
  display: none !important;
}

.nav-button :deep(.v-ripple__container) {
  display: none !important;
}

/* Estilos para el avatar de perfil */
.profile-avatar {
  background-color: rgb(var(--v-theme-surface)) !important;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-avatar:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

.profile-initials {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
  font-size: 14px;
}

.active-avatar {
  border-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

/* Estilos para el desplegable */
.profile-dropdown-container {
  position: relative;
  z-index: 10000;
}

.profile-dropdown {
  position: fixed;
  top: 60px;
  right: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 10000;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #333;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.dropdown-item:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.dropdown-icon {
  color: rgb(var(--v-theme-primary)) !important;
}

.logout-item {
  border-top: 1px solid #eee;
}

.logout-item:hover {
  background-color: #fef2f2;
}

.logout-item .dropdown-icon {
  color: #dc2626 !important;
}

.logout-item span {
  color: #dc2626;
}
</style>