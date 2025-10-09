<template>
  <div class="perfil-page">
    <v-card class="perfil-card">
      <div class="perfil-content">
        <h1 class="perfil-title">Perfil</h1>
        <div>
          <UserProfile v-if="authStore.isLoggedIn" />
          <LoginForm v-else />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import UserProfile from '../components/UserProfile.vue'
import LoginForm from '../components/LoginForm.vue'

const authStore = useAuthStore()
</script>

<style scoped>
.perfil-page {
  min-height: calc(100vh - 96px);
  padding: 0;
}

.perfil-card {
  background-color: #F6F8F7 !important;
  border-radius: 16px !important;
  min-height: calc(100vh - 96px);
  box-shadow: none !important;
  border: none !important;
  overflow: hidden;
}

.perfil-content {
  padding: 24px;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.perfil-title {
  margin: 0.5em 0.5em;
  font-size: 2.5rem;
  font-weight: 500;
  color: #333;
  text-align: center;
}
</style>