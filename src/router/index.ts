import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ── Public Routes ──
    {
      path: '/',
      name: 'Guest',
      component: () => import('../views/auth/GuestPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/auth/google/callback',
      name: 'GoogleCallback',
      component: () => import('../views/auth/GoogleCallbackView.vue'),
      meta: { requiresAuth: false },
    },

    // ── Protected Routes ──
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/auth/HomePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/auth/AdminPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/manager',
      name: 'Manager',
      component: () => import('../views/auth/ManagerPage.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },

    // ── Fallback ──
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// ── Navigation Guard ──────────────────────────────────────────────────────────
router.beforeEach((to) => {
  const auth       = useAuthStore()
  const isLoggedIn = auth.isAuthenticated  
  const isAdmin    = auth.isAdmin          
  const isManager  = auth.isManager        

  // 1. Redirect logged-in users away from guest page based on their role
  if (isLoggedIn && to.path === '/') {
    if (isAdmin)   return { path: '/admin' }
    if (isManager) return { path: '/manager' }
    return { path: '/home' }
  }

  // 2. Unauthenticated users can only access protected routes after login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { path: '/' }
  }

  // 3. Block non-admins from accessing /admin directly
  if (to.meta.requiresAdmin && !isAdmin) {
    return isManager ? { path: '/manager' } : { path: '/home' }
  }

  if (to.meta.requiresManager && !(isAdmin || isManager)) {
    return { path: '/home' }
  }
})

export default router