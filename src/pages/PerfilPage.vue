<template>
  <div class="perfil-page">
    <h2 class="perfil-title">Perfil</h2>
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
  padding-left: 0.75em;
}

</style>