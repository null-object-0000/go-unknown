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
      },

      {
        path: 'mine/personal-profile',
        component: () => import('@/views/mine/PersonalProfilePage.vue')
      },
      {
        path: 'mine/account-bind',
        component: () => import('@/views/mine/AccountBindPage.vue')
      },
      {
        path: 'mine/order-collection',
        component: () => import('@/views/mine/OrderCollectionPage.vue')
      },
      {
        path: 'mine/settings',
        component: () => import('@/views/mine/SettingsPage.vue')
      },
      {
        path: 'mine/salt-demo',
        component: () => import('@/views/mine/SaltDemoPage.vue')
      },
      {
        path: 'mine/about',
        component: () => import('@/views/mine/AboutPage.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
