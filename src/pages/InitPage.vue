



<template>
  <div style="background-color:#C7D8BA; overflow-y: auto; min-height: 100vh; width: 100%;">
    <!-- Sección principal -->
    <div class="d-flex flex-column align-center" style="padding: 60px 20px 10px;">
      <div style="width:100%; max-width:800px; text-align:center;">
        <h1 class="text-h2" style="margin-bottom: 8px;">Bienvenido a canasta</h1>
        <h2 class="text-h5" style="margin-bottom: 8px; ">Tu app de gestión de compras</h2>
        
        <!-- Imagen del carrito -->
        <v-img
          width="100%"
          style="max-width:500px; margin: 0 auto 10px;"
          aspect-ratio="16/9"
          :src="carritoImagen"
        />
        
        <!-- Botones principales -->
        <div class="d-flex justify-center" style="gap: 16px; margin-bottom: 40px; flex-wrap: wrap;">
          <v-btn
            size="large"
            style="background-color: #465D46; color: white; border-radius: 12px; padding: 12px 28px;min-width: 180px;"
            to="/listas"
          >
            Crear lista ahora 
          </v-btn>
          <v-btn
            size="large"
            style="background-color: #F5844E; color: white; border-radius: 12px; padding: 12px 28px;min-width: 180px;"
            to="/productos"
          >
            ver productos
          </v-btn>
        </div>
      </div>
    </div>
    
    <!-- Sección "Por qué Canasta" -->
    <div style="padding: 10px 20px 60px;">
      <div style="width:100%; max-width:800px; margin: 0 auto; text-align:center;">
        <h2 class="text-h4" style="margin-bottom: 24px; color: #333;">Por qué Canasta</h2>
        <p class="text-body-1" style="margin-bottom: 40px; color: #555; line-height: 1.6;">
          Canasta te permite organizar y compartir tus compras sin complicaciones. 
          Diseñada con tus hábitos en mente, combina rapidez, claridad y colaboración en tiempo real
        </p>
        
        <!-- Grid de características -->
        <div class="d-flex justify-center" style="gap: 16px; flex-wrap: wrap;">
          <!-- Listas compartidas -->
          <v-card 
            class="text-center pa-4" 
            style="width: 160px; height: 140px; background-color: rgba(255,255,255,0.7); border-radius: 16px;"
          >
            <v-icon size="48" style="color: #465D46; margin-bottom: 8px;">mdi-account-multiple</v-icon>
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Listas compartidas</div>
            <div style="font-size: 12px; color: #666;">en tiempo real</div>
          </v-card>
          
          <!-- Listas recurrentes -->
          <v-card 
            class="text-center pa-4" 
            style="width: 160px; height: 140px; background-color: rgba(255,255,255,0.7); border-radius: 16px;"
          >
            <v-icon size="48" style="color: #465D46; margin-bottom: 8px;">mdi-calendar-clock</v-icon>
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Listas recurrentes</div>
            <div style="font-size: 12px; color: #666;">e historial</div>
          </v-card>
          
          <!-- Categorías -->
          <v-card 
            class="text-center pa-4" 
            style="width: 160px; height: 140px; background-color: rgba(255,255,255,0.7); border-radius: 16px;"
          >
            <v-icon size="48" style="color: #465D46; margin-bottom: 8px;">mdi-view-grid</v-icon>
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Categorías</div>
            <div style="font-size: 12px; color: #666;">por pasillos</div>
          </v-card>
          
          <!-- Recordatorios -->
          <v-card 
            class="text-center pa-4" 
            style="width: 160px; height: 140px; background-color: rgba(255,255,255,0.7); border-radius: 16px;"
          >
            <v-icon size="48" style="color: #465D46; margin-bottom: 8px;">mdi-bell</v-icon>
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Recordatorios</div>
            <div style="font-size: 12px; color: #666;">inteligentes</div>
          </v-card>
        </div>
      </div>
    </div>
  
    <!-- Footer -->
    <div style="background-color: #465D46; color: white; padding: 40px 20px;">
      <div style="width:100%; max-width:800px; margin: 0 auto; text-align:center;">
        <!-- Enlaces del footer -->
        <div class="d-flex justify-center" style="gap: 32px; margin-bottom: 24px; flex-wrap: wrap;">
          <a href="#" style="color: white; text-decoration: none;">Sobre Canasta</a>
          <a href="#" style="color: white; text-decoration: none;">Contacto</a>
          <a href="#" style="color: white; text-decoration: none;">Privacidad</a>
        </div>
        
        <!-- Texto del footer -->
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">
          Hecha por estudiantes del ITBA
        </p>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">

import carritoImagen from '@/assets/carrito animado.png'

</script>