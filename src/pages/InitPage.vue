



<template>
  <div class="d-flex flex-column align-center mb-0" style="min-height: 70vh; gap: 18px;">
    <v-card class="pa-4" width="100%" height="100%" style="background-color:#C7D8BA">
    <div class="d-flex flex-column align-center justify-center" style="min-height: 70vh; gap: 18px;">
    <h1 class="text-h2">Bienvenido a canasta</h1>
    <h1 class="text-h5">Tu app de gestión de compras!</h1>
     <v-img class="justify-center align-center mb-0"
      :width="800"
      aspect-ratio="16/9"
      :src="carritoImagen"
    ></v-img>
    </div>
    </v-card>
    
  </div>
</template>


<script setup lang="ts">

import carritoImagen from '@/assets/carrito animado.png'

</script>