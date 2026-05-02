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

    // ── Fallback ──
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// ── Navigation Guard ──────────────────────────────────────────────────────────
router.beforeEach((to) => {
  const auth       = useAuthStore()
  const isLoggedIn = !!auth.isAuthenticated
  const isAdmin    = auth.isAdmin

  // 1. Redirect logged-in users away from guest page based on their role
  if (isLoggedIn && to.path === '/') {
    return isAdmin ? { path: '/admin' } : { path: '/home' }
  }

  // 2. Unauthenticated users can only access protected routes after login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { path: '/' }
  }

  // 3. Block non-admins from accessing /admin directly
  if (to.meta.requiresAdmin && !isAdmin) {
    return { path: '/home' }
  }
})

export default router