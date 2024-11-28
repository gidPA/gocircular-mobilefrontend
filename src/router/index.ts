import { createRouter, createWebHistory, } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/homepage',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue')
  },
  {
    path: '/register-success',
    name: 'Registration Successful',
    component: () => import('@/pages/RegistrationSuccess.vue')
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: () => import('@/pages/HomePage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile-view',
    name: 'Profile View',
    component: () => import('@/pages/ProfileView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/history',
    name: 'Transaction History',
    component: () => import('@/pages/history/TransactionHistory.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/history/:id',
    name: 'Transaction History Details',
    component: () => import('@/pages/history/TransactionHistoryDetails.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/point_exchange',
    name: 'Exchange Points',
    component: () => import('@/pages/pointExchange/ExchangeHistory.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/point_exchange/new',
    name: 'New Exchange',
    component: () => import('@/pages/pointExchange/RequestExchange.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/point_exchange/new/success',
    name: 'Successfully Submitted Exchange Request',
    component: () => import('@/pages/pointExchange/SuccessfulRequest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/point_exchange/new/failed',
    name: 'Failed Submitting Exchange Request',
    component: () => import('@/pages/pointExchange/FailedRequest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/qr-code-scan',
    name: 'QR Code Scan',
    component: () => import('@/pages/QRCodeScan.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/transaction-viewer',
    name: 'Transaction Viewer',
    component: () => import('@/pages/TransactionViewer.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/failed-view',
    name: 'Fail View',
    component: () => import('@/pages/FailedView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/transaction-recap',
    name: 'Transaction Recap',
    component: () => import('@/pages/TransactionRecap.vue'),
    meta: {
      requiresAuth: true
    }
  },
];



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
