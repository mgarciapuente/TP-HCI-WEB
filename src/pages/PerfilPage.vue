<template>
  <h1 class="perfil-title">Perfil</h1>
  <div>
    <UserProfile v-if="authStore.isLoggedIn" />
    <LoginForm v-else />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import UserProfile from '../components/UserProfile.vue'
import LoginForm from '../components/LoginForm.vue'

const authStore = useAuthStore()
</script>

<style scoped>

.perfil-title{
  margin: 0.5em 0.5em;
}
</style>