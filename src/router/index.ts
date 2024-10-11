import { createRouter, createWebHistory, } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import LoginPage from "../pages/LoginPage.vue";
import HomePage from '@/pages/HomePage.vue';
import QRCodeScan from "@/pages/QRCodeScan.vue";
import TransactionViewer from '@/pages/TransactionViewer.vue';
import FailedView from '@/pages/FailedView.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/homepage',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage    
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: HomePage,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/qr-code-scan',
    name: 'QR Code Scan',
    component: QRCodeScan,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/transaction-viewer',
    name: 'Transaction Viewer',
    component: TransactionViewer,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/failed-view',
    name: 'Fail View',
    component: FailedView,
    meta:{
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.accessToken) {
    await authStore.checkAuth();
  }   
  
  if (to.meta.requiresAuth && !authStore.accessToken) {
    next('/login');       
  } else {
    next();
  }
});

export default router;
