<template>
  <div class="perfil-page">
    <h1 class="perfil-title">Perfil</h1>
    <div>
      <UserProfile v-if="authStore.isLoggedIn" />
      <LoginForm v-else />
    </div>
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
  padding: 24px;
  min-height: calc(100vh - 96px);
}

.perfil-title {
  margin: 0.5em 0.5em;
  font-size: 2.5rem;
  font-weight: 500;
  color: #333;
  text-align: center;
}
</style>