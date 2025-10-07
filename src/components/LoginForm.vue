<template>
  <div class="login-container">
    <div class="login-content">
      <div class="text-center mb-6">
        <v-icon size="80" color="#465D46" class="mb-4">mdi-account-circle</v-icon>
        <h2 class="text-h4 mb-2" style="color: #465D46;">¡Bienvenido!</h2>
        <p class="text-body-1" style="color: #666;">
          Inicia sesión para acceder a todas las funciones de Canasta
        </p>
      </div>

      <v-btn
        size="large"
        block
        to="/auth/login"
        style="background-color: #465D46; color: white; border-radius: 12px; padding: 12px; font-weight: 600; margin-bottom: 16px;"
      >
        <v-icon start>mdi-login</v-icon>
        Iniciar Sesión
      </v-btn>

      <v-btn
        size="large"
        block
        variant="outlined"
        to="/auth/login"
        style="border-color: #F5844E; color: #F5844E; border-radius: 12px; padding: 12px; font-weight: 600;"
      >
        <v-icon start>mdi-account-plus</v-icon>
        Crear Cuenta
      </v-btn>

      <div class="text-center mt-4">
        <p class="text-body-2" style="color: #666;">
          ¿Necesitas ayuda? 
          <a href="#" style="color: #F5844E; text-decoration: none;">Contáctanos</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Este componente ahora solo redirige a la página de autenticación
// La lógica de login real está en AuthPage.vue
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 20px;
}

.login-content {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(70, 93, 70, 0.1);
}

.v-btn {
  letter-spacing: 0.5px;
}
</style>