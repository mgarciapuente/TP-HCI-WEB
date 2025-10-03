<template>
  <div>
    <button @click="simulateLogin" class="login-button">
      Iniciar Sesión
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Función temporal para simular login
const simulateLogin = () => {
  authStore.setAuth(
    { 
      name: 'Juan Pérez', 
      email: 'juan.perez@email.com',
      avatar: 'https://img.freepik.com/vector-premium/perfil-hombre-dibujos-animados_18591-58483.jpg'
    }, 
    'fake-token-123'
  )
}
</script>

<style scoped>

.login-info {
  text-align: center;
}

.login-button {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #45a049;
}
</style>