<template>
  <v-app-bar 
    color="primary" 
    elevation="2"
  >
    <v-app-bar-title class="text-buttons font-weight-medium">
      Canasta
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Navegación del header -->
    <v-btn 
      variant="text" 
      color="buttons"
      class="text-none normal-case"
      :style="{ textDecoration: activeTab === 'almacen' ? 'underline' : 'none' }"
      @click="navigateTo('almacen')"
    >
      Almacén
    </v-btn>

    <v-btn
      variant="text"
      color="buttons"
      class="text-none normal-case"
      :style="{ textDecoration: activeTab === 'listas' ? 'underline' : 'none' }"
      @click="navigateTo('listas')"
    >
      Listas
    </v-btn>
    
    <v-btn 
      variant="text"
      color="buttons"
      class="text-none normal-case"
      :style="{ textDecoration: activeTab === 'productos' ? 'underline' : 'none' }"
      @click="navigateTo('productos')"
    >
      Productos
    </v-btn>
    
    <v-btn 
      variant="text" 
      color="buttons"
      class="text-none normal-case"
      :style="{ textDecoration: activeTab === 'perfil' ? 'underline' : 'none' }"
      @click="navigateTo('perfil')"
    >
      Perfil
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
interface Props {
  activeTab: string
}

interface Emits {
  (event: 'navigate', tab: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const navigateTo = (tab: string) => {
  emit('navigate', tab)
}
</script>

<style scoped>
.normal-case {
  text-transform: none !important;
}
</style>