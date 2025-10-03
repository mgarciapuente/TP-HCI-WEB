<template>
  <div class="profile-container">
    <!-- Información del usuario -->
    <div class="profile-info">
      <img 
        :src="authStore.user?.avatar || defaultAvatar"
        class="profile-avatar"
        :alt="authStore.user?.name || 'Usuario'"
      />
      <p class="perfil-name">{{ authStore.user?.name }}</p>
      <p class="perfil-email">{{ authStore.user?.email }}</p>
    </div>
    
    <!-- Grilla de botones 2x2 -->
    <v-container fluid class="buttons-grid">
      <v-row>
        <v-col cols="6">
          <v-btn 
            variant="outlined" 
            block 
            class="grid-button"
          >
            Configuración
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn 
            variant="outlined" 
            block 
            class="grid-button"
          >
            Configuración de Alacena
          </v-btn>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="6">
          <v-btn 
            variant="outlined" 
            block 
            class="grid-button"
          >
            Idioma
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn 
            variant="outlined" 
            block 
            class="grid-button"
          >
            Editar perfil
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Botón de logout -->
    <v-btn @click="authStore.logout()" class="logout-button">
      Cerrar sesión
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const defaultAvatar = 'https://img.freepik.com/vector-premium/perfil-hombre-dibujos-animados_18591-58483.jpg'
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

.buttons-grid {
  margin: 1rem 0;
  width: 100%;
}

.grid-button {
  height: 48px;
  font-size: 0.9em;
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

.logout-button {
  background-color: #F5844E;
  margin-top: 0.25em;
}
</style>