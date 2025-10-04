import { createRouter, createWebHistory } from 'vue-router'
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
    component: () => import('../pages/InitPage.vue')
  },
  {
    path: '/listas',
    name: 'listas',
    component: ListsPage
  },
  {
    path: '/productos',
    name: 'productos',
    component: ProductosPage
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes 
})

export default router