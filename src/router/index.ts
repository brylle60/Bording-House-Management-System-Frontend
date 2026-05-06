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
      path: '/tenant/dashboard',
      name: 'TenantPage',
      component: () => import('../views/auth/TenantPage.vue'),
      meta: { requiresAuth: true, requiresTenant: true },
    },

    // ── Fallback ──
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// ── Navigation Guard ──────────────────────────────────────────────────────────
router.beforeEach((to) => {
  const auth = useAuthStore()

  const isLoggedIn = auth.isAuthenticated
  const userRole   = auth.user?.role

  const isAdmin  = userRole === 'ROLE_ADMIN'
  const isTenant = userRole === 'ROLE_TENANT'

  console.log('Guard - role:', userRole, '| isTenant:', isTenant, '| to:', to.path)

  // Always allow public routes
  if (!to.meta.requiresAuth) {
    // ✅ BUT if logged in and going to '/', redirect to their page
    if (isLoggedIn && to.path === '/') {
      if (isAdmin)  return { path: '/admin' }
      if (isTenant) return { path: '/tenant/dashboard' }
    }
    return true
  }

  // Not logged in → guest page
  if (!isLoggedIn) return { path: '/' }

  // Block non-admins from /admin
  if (to.meta.requiresAdmin && !isAdmin) {
    return isTenant ? { path: '/tenant/dashboard' } : { path: '/' }
  }

  // Block non-tenants from /tenant/dashboard
  if (to.meta.requiresTenant && !isTenant) {
    return isAdmin ? { path: '/admin' } : { path: '/' }
  }
})

export default router