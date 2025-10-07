import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ListsPage from '../pages/ListsPage.vue'
import ProductosPage from '../pages/ProductosPage.vue'
import PerfilPage from '../pages/PerfilPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/inicio'
  },
  {
    path: '/inicio',
    name: 'inicio',
    component: () => import('../pages/InitPage.vue'),
    beforeEnter: (_to: any, _from: any, next: any) => {
      const authStore = useAuthStore()
      // Si el usuario está logueado, redirigir al perfil en lugar de mostrar inicio
      if (authStore.isLoggedIn) {
        next('/perfil')
      } else {
        next()
      }
    }
  },
  {
    path: '/auth/login',
    name: 'auth',
    component: () => import('../pages/AuthPage.vue'),
    beforeEnter: (_to: any, _from: any, next: any) => {
      const authStore = useAuthStore()
      // Si el usuario ya está logueado, redirigir al perfil
      if (authStore.isLoggedIn) {
        next('/perfil')
      } else {
        next()
      }
    }
  },
  {
    path: '/listas',
    name: 'listas',
    component: ListsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/productos',
    name: 'productos',
    component: ProductosPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes 
})

// Guard global para proteger rutas que requieren autenticación
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  // Si la ruta requiere autenticación y el usuario no está logueado
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Redirigir al login
    next('/auth/login')
  } else {
    next()
  }
})

export default router