<script setup lang="ts">
defineProps<{
  activeSection: string
  sidebarOpen:   boolean
  username?:     string
}>()

const emit = defineEmits<{
  (e: 'navigate', section: string): void
  (e: 'logout'): void
  (e: 'update:sidebarOpen', val: boolean): void
}>()

const navItems = [
  {
    section: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard',
        icon: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z' },
    ],
  },
  {
    section: 'Management',
    items: [
      { key: 'tenants', label: 'Tenants',
        icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
      { key: 'rooms',   label: 'Rooms',
        icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
      { key: 'leases',  label: 'Leases',
        icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8m8 4H8m2-8H8' },
      { key: 'billing', label: 'Billing',
        icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2' },
      { key: 'maintenance', label: 'Maintenance',
        icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
    ],
  },
  {
    section: 'System',
    items: [
      { key: 'users',    label: 'User Accounts',
        icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 11l-2 2-4-4' },
      { key: 'reports',  label: 'Reports',
        icon: 'M18 20V10m-6 10V4M6 20v-6' },
      { key: 'settings', label: 'Settings',
        icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
    ],
  },
]

const initials = (name?: string) =>
  name ? name.slice(0, 2).toUpperCase() : 'AD'
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: !sidebarOpen }">

    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <transition name="fade-text">
        <div v-if="sidebarOpen" class="logo-text-wrap">
          <span class="logo-name">ResidEase</span>
          <span class="logo-badge">ADMIN</span>
        </div>
      </transition>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <template v-for="group in navItems" :key="group.section">
        <div v-if="sidebarOpen" class="nav-section-label">{{ group.section }}</div>
        <div v-else class="nav-section-divider" />

        <button
          v-for="item in group.items"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeSection === item.key }"
          :title="!sidebarOpen ? item.label : ''"
          @click="emit('navigate', item.key)"
        >
          <svg class="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <path :d="item.icon"/>
          </svg>
          <transition name="fade-text">
            <span v-if="sidebarOpen" class="nav-label">{{ item.label }}</span>
          </transition>
        </button>
      </template>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="admin-profile">
        <div class="admin-avatar">{{ initials(username) }}</div>
        <transition name="fade-text">
          <div v-if="sidebarOpen" class="admin-meta">
            <span class="admin-name">{{ username ?? 'Admin' }}</span>
            <span class="admin-role">Administrator</span>
          </div>
        </transition>
      </div>
      <transition name="fade-text">
        <button v-if="sidebarOpen" class="logout-btn" title="Logout" @click="emit('logout')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </transition>
    </div>

  </aside>
</template>

<style scoped>
.sidebar {
  width: 224px; min-width: 224px;
  background: #160d27;
  display: flex; flex-direction: column;
  transition: width .25s ease, min-width .25s ease;
  overflow: hidden; flex-shrink: 0;
  position: relative; z-index: 10;
}
.sidebar.collapsed { width: 60px; min-width: 60px; }

/* ── Logo ─────────────────────────────────────────────────────────────────── */
.sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  flex-shrink: 0;
}
.logo-icon {
  width: 28px; height: 28px; border-radius: 8px;
  background: linear-gradient(135deg, #ae68fa, #f1966e);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.logo-text-wrap {
  display: flex; align-items: center; gap: 6px;
  white-space: nowrap; overflow: hidden;
}
.logo-name {
  font-size: 13px; font-weight: 700; color: #fff; letter-spacing: .02em;
}
.logo-badge {
  font-size: 9px; padding: 2px 6px;
  background: linear-gradient(90deg, #ae68fa, #f1966e);
  color: #fff; border-radius: 4px; font-weight: 700; letter-spacing: .05em;
}

/* ── Nav ──────────────────────────────────────────────────────────────────── */
.sidebar-nav {
  flex: 1; padding: 12px 8px;
  display: flex; flex-direction: column; gap: 1px;
  overflow-y: auto; overflow-x: hidden;
}
.nav-section-label {
  font-size: 9px; color: rgba(255,255,255,.25);
  text-transform: uppercase; letter-spacing: .1em;
  padding: 12px 8px 4px; white-space: nowrap;
}
.nav-section-divider {
  height: 1px; background: rgba(255,255,255,.06); margin: 8px 4px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 9px; border: none;
  background: transparent; color: rgba(255,255,255,.45);
  font-size: 13px; font-family: inherit; cursor: pointer;
  transition: background .15s, color .15s;
  white-space: nowrap; width: 100%; text-align: left;
}
.nav-item:hover {
  background: rgba(174,104,250,.12); color: rgba(255,255,255,.8);
}
.nav-item.active {
  background: linear-gradient(90deg, rgba(174,104,250,.25), rgba(241,150,110,.18));
  color: #fff;
  border-left: 2.5px solid #ae68fa;
}
.nav-icon  { flex-shrink: 0; }
.nav-label { font-size: 13px; overflow: hidden; }

/* ── Footer ───────────────────────────────────────────────────────────────── */
.sidebar-footer {
  padding: 12px 10px;
  border-top: 1px solid rgba(255,255,255,.06);
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.admin-profile {
  display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden;
}
.admin-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg, #ae68fa, #f1966e);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.admin-meta { display: flex; flex-direction: column; overflow: hidden; }
.admin-name {
  font-size: 12px; color: rgba(255,255,255,.8);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.admin-role {
  font-size: 10px; font-weight: 600;
  background: linear-gradient(90deg, #ae68fa, #f1966e);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.logout-btn {
  background: none; border: none; color: rgba(255,255,255,.3);
  cursor: pointer; padding: 5px; border-radius: 7px;
  display: flex; align-items: center; transition: color .15s, background .15s;
  flex-shrink: 0;
}
.logout-btn:hover { color: #ef4444; background: rgba(239,68,68,.12); }

/* ── Transitions ──────────────────────────────────────────────────────────── */
.fade-text-enter-active, .fade-text-leave-active { transition: opacity .15s; }
.fade-text-enter-from, .fade-text-leave-to { opacity: 0; }

.sidebar-nav::-webkit-scrollbar { width: 3px; }
.sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 3px; }
</style>
