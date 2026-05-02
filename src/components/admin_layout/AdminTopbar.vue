<script setup lang="ts">
defineProps<{
  activeSection: string
  username?:     string
  notifCount?:   number
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'open-notifs'):    void
}>()

function sectionLabel(key: string): string {
  const labels: Record<string, string> = {
    dashboard:   'Dashboard',
    tenants:     'Tenant Management',
    rooms:       'Room Management',
    leases:      'Lease Management',
    billing:     'Billing & Payments',
    maintenance: 'Maintenance',
    users:       'User Accounts',
    reports:     'Reports',
    settings:    'System Settings',
  }
  return labels[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

const today = new Date().toLocaleDateString('en-PH', {
  weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
})

const initials = (name?: string) =>
  name ? name.slice(0, 2).toUpperCase() : 'AD'
</script>

<template>
  <header class="topbar">
    <!-- Left -->
    <div class="topbar-left">
      <button class="icon-btn" title="Toggle sidebar" @click="emit('toggle-sidebar')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div class="breadcrumb">
        <span class="bc-root">ResidEase</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span class="bc-current">{{ sectionLabel(activeSection) }}</span>
      </div>
    </div>

    <!-- Right -->
    <div class="topbar-right">
      <span class="topbar-date">{{ today }}</span>

      <!-- Notifications -->
      <button class="icon-action" title="Notifications" @click="emit('open-notifs')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span v-if="(notifCount ?? 0) > 0" class="notif-badge">{{ notifCount }}</span>
      </button>

      <!-- User chip -->
      <div class="user-chip">
        <div class="chip-avatar">{{ initials(username) }}</div>
        <div class="chip-meta">
          <span class="chip-name">{{ username ?? 'Admin' }}</span>
          <span class="chip-role">Administrator</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c4b8e8" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 54px;
  background: #fff;
  border-bottom: 1px solid #e0ddf7;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 22px;
  flex-shrink: 0;
  box-shadow: 0 1px 6px rgba(149,132,226,.07);
  position: relative; z-index: 5;
}

/* ── Left ─────────────────────────────────────────────────────────────────── */
.topbar-left { display: flex; align-items: center; gap: 12px; }

.icon-btn {
  width: 34px; height: 34px; border-radius: 9px;
  background: none; border: 1px solid transparent;
  color: #9ca3af; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s, border-color .15s;
}
.icon-btn:hover { background: rgba(174,104,250,.08); color: #ae68fa; border-color: rgba(174,104,250,.2); }

.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.bc-root    { color: #c4b8e8; font-weight: 500; }
.bc-current { color: #160d27; font-weight: 700; }

/* ── Right ────────────────────────────────────────────────────────────────── */
.topbar-right { display: flex; align-items: center; gap: 10px; }

.topbar-date { font-size: 11px; color: #c4b8e8; font-weight: 500; white-space: nowrap; }

.icon-action {
  width: 34px; height: 34px; border-radius: 9px;
  background: #faf7ff; border: 1px solid #e0ddf7;
  color: #9ca3af; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative; transition: border-color .15s, color .15s;
}
.icon-action:hover { border-color: #ae68fa; color: #ae68fa; }

.notif-badge {
  position: absolute; top: 5px; right: 5px;
  width: 14px; height: 14px; border-radius: 50%;
  background: linear-gradient(135deg, #ae68fa, #f1966e);
  color: #fff; font-size: 8px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid #fff;
}

.user-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 10px 5px 5px;
  border: 1px solid #e0ddf7; border-radius: 999px;
  background: #faf7ff; cursor: pointer;
  transition: border-color .15s, box-shadow .15s;
}
.user-chip:hover { border-color: #ae68fa; box-shadow: 0 0 0 3px rgba(174,104,250,.1); }

.chip-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #ae68fa, #f1966e);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: #fff;
}
.chip-meta { display: flex; flex-direction: column; line-height: 1.2; }
.chip-name { font-size: 12px; color: #160d27; font-weight: 600; }
.chip-role { font-size: 10px; color: #ae68fa; font-weight: 600; }

@media (max-width: 600px) {
  .topbar-date { display: none; }
  .chip-meta   { display: none; }
}
</style>
