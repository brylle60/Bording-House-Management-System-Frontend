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

    // ── Fallback ──
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Navigation Guard
router.beforeEach((to) => {
  const auth = useAuthStore()
  const isLoggedIn = !!auth.isAuthenticated

  // Redirect unauthenticated users away from protected pages
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { path: '/' }
  }

  // Redirect logged-in users away from the guest page to home
  if (isLoggedIn && to.path === '/') {
    return { path: '/home' }
  }
})

export default router