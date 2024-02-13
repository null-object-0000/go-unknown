import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/go'
      },
      {
        path: 'go',
        component: () => import('@/views/GoPage.vue')
      },
      {
        path: 'clock',
        component: () => import('@/views/ClockPage.vue')
      },
      {
        path: 'mine',
        component: () => import('@/views/MinePage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
