<script setup lang="ts">
import { ref, computed } from 'vue'

export interface TenantRow {
  id:       number
  name:     string
  room:     string
  status:   string
  balance:  number
  move_in:  string
  phone:    string
  email?:   string
}

const props = defineProps<{ tenants: TenantRow[] }>()
const emit  = defineEmits<{ (e: 'add'): void; (e: 'view', t: TenantRow): void; (e: 'edit', t: TenantRow): void; (e: 'remove', t: TenantRow): void }>()

const search = ref('')
const filter = ref('ALL')

const filtered = computed(() => {
  let list = [...props.tenants]
  if (filter.value !== 'ALL') list = list.filter(t => t.status === filter.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(t => t.name.toLowerCase().includes(q) || t.room.toLowerCase().includes(q) || (t.email ?? '').toLowerCase().includes(q))
  return list
})

const counts = computed(() => {
  const c: Record<string, number> = { ALL: props.tenants.length }
  props.tenants.forEach(t => { c[t.status] = (c[t.status] ?? 0) + 1 })
  return c
})

function statusClass(s: string) {
  return ({ ACTIVE: 'badge-active', PENDING: 'badge-pending', INACTIVE: 'badge-inactive', MOVED_OUT: 'badge-moved' } as any)[s] ?? ''
}

const tabs = ['ALL', 'ACTIVE', 'PENDING', 'INACTIVE', 'MOVED_OUT']
</script>

<template>
  <section class="section">

    <!-- Header -->
    <div class="section-hdr">
      <div>
        <h1 class="section-title">Tenant Management</h1>
        <p class="section-sub">{{ tenants.length }} registered tenants</p>
      </div>
      <div class="hdr-actions">
        <button class="btn-outline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
        <button class="btn-primary-sm" @click="emit('add')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Tenant
        </button>
      </div>
    </div>

    <!-- Tab filter -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab"
        :class="{ active: filter === tab }"
        @click="filter = tab"
      >
        {{ tab === 'MOVED_OUT' ? 'Moved Out' : tab.charAt(0) + tab.slice(1).toLowerCase() }}
        <span class="tab-count">{{ counts[tab] ?? 0 }}</span>
      </button>
    </div>

    <!-- Table card -->
    <div class="table-card">

      <!-- Controls -->
      <div class="table-controls">
        <div class="search-wrap">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input v-model="search" class="search-input" placeholder="Search by name, room, or email…" />
          <button v-if="search" class="search-clear" @click="search = ''">✕</button>
        </div>
        <div class="table-meta">
          <span class="meta-count">{{ filtered.length }} result{{ filtered.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Room</th>
              <th>Move-in</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in filtered" :key="t.id">
              <td>
                <div class="user-cell">
                  <div class="user-av">
                    {{ t.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ t.name }}</span>
                    <span v-if="t.email" class="user-email">{{ t.email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span :class="t.room === '—' ? 'text-muted' : 'room-tag'">{{ t.room }}</span>
              </td>
              <td class="text-muted">{{ t.move_in }}</td>
              <td class="text-muted">{{ t.phone }}</td>
              <td><span class="badge" :class="statusClass(t.status)">{{ t.status }}</span></td>
              <td>
                <span :class="(t.balance ?? 0) > 0 ? 'balance-due' : 'balance-clear'">
                  {{ (t.balance ?? 0) > 0 ? '₱' + t.balance.toLocaleString() : '—' }}
                </span>
              </td>
              <td>
                <div class="action-row">
                  <button class="act-btn primary" @click="emit('view', t)">View</button>
                  <button class="act-btn"         @click="emit('edit', t)">Edit</button>
                  <button class="act-btn danger"   @click="emit('remove', t)">Remove</button>
                </div>
              </td>
            </tr>

            <tr v-if="filtered.length === 0">
              <td colspan="7" class="empty-row">
                <div class="empty-state">
                  <span class="empty-icon">🔍</span>
                  <span>No tenants match your search.</span>
                  <button class="clear-link" @click="search = ''; filter = 'ALL'">Clear filters</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Section ──────────────────────────────────────────────────────────────── */
.section-hdr {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 18px;
}
.section-title { font-size: 22px; font-weight: 700; color: #160d27; }
.section-sub   { font-size: 13px; color: #9ca3af; margin-top: 2px; }
.hdr-actions   { display: flex; gap: 8px; align-items: center; }

.btn-outline {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 9px;
  border: 1.5px solid #e0ddf7; background: #fff;
  color: #374151; font-size: 13px; font-weight: 500;
  cursor: pointer; font-family: inherit; transition: border-color .15s;
}
.btn-outline:hover { border-color: #ae68fa; }

.btn-primary-sm {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 9px; border: none;
  background: linear-gradient(90deg, #ae68fa, #f1966e);
  color: #fff; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: opacity .15s;
}
.btn-primary-sm:hover { opacity: .88; }

/* ── Tabs ─────────────────────────────────────────────────────────────────── */
.tab-bar {
  display: flex; gap: 4px; margin-bottom: 14px;
  border-bottom: 1.5px solid #e0ddf7;
}
.tab {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border: none; background: none;
  font-size: 13px; color: #9ca3af; cursor: pointer;
  font-family: inherit; border-bottom: 2px solid transparent;
  margin-bottom: -1.5px; transition: color .15s, border-color .15s;
}
.tab:hover { color: #ae68fa; }
.tab.active { color: #ae68fa; border-bottom-color: #ae68fa; font-weight: 600; }
.tab-count {
  font-size: 10px; padding: 1px 6px; border-radius: 999px;
  background: #f3f0fb; color: #9ca3af; font-weight: 600;
}
.tab.active .tab-count { background: rgba(174,104,250,.15); color: #ae68fa; }

/* ── Table card ───────────────────────────────────────────────────────────── */
.table-card {
  background: #fff; border: 1px solid #e0ddf7; border-radius: 14px;
  box-shadow: 0 2px 12px rgba(149,132,226,.06); overflow: hidden;
}
.table-controls {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; border-bottom: 1px solid #f3f0fb;
}
.search-wrap {
  flex: 1; position: relative; display: flex; align-items: center;
}
.search-icon { position: absolute; left: 11px; color: #c4b8e8; pointer-events: none; }
.search-input {
  width: 100%; padding: 9px 36px 9px 34px;
  border: 1.5px solid #e0ddf7; border-radius: 10px;
  font-size: 13px; outline: none; font-family: inherit;
  background: #faf7ff; color: #160d27;
  transition: border-color .15s, box-shadow .15s;
}
.search-input:focus { border-color: #ae68fa; box-shadow: 0 0 0 3px rgba(174,104,250,.1); }
.search-input::placeholder { color: #c4b8e8; }
.search-clear {
  position: absolute; right: 11px; background: none; border: none;
  color: #c4b8e8; cursor: pointer; font-size: 12px; padding: 0;
  transition: color .15s;
}
.search-clear:hover { color: #ae68fa; }

.table-meta { display: flex; align-items: center; }
.meta-count { font-size: 12px; color: #c4b8e8; white-space: nowrap; }

.table-scroll { overflow-x: auto; }

/* ── Table ────────────────────────────────────────────────────────────────── */
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 700px; }
.data-table th {
  text-align: left; padding: 10px 16px;
  color: #c4b8e8; font-weight: 600; font-size: 10.5px;
  text-transform: uppercase; letter-spacing: .06em;
  background: #faf7ff; border-bottom: 1px solid #e0ddf7;
  white-space: nowrap;
}
.data-table td {
  padding: 11px 16px; color: #374151;
  border-bottom: 1px solid #f3f0fb; vertical-align: middle;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #faf7ff; }

/* ── Cells ────────────────────────────────────────────────────────────────── */
.user-cell  { display: flex; align-items: center; gap: 10px; }
.user-av {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #ae68fa, #f1966e);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
}
.user-info { display: flex; flex-direction: column; gap: 1px; }
.user-name  { font-size: 13px; font-weight: 600; color: #160d27; }
.user-email { font-size: 11px; color: #c4b8e8; }

.room-tag {
  background: rgba(174,104,250,.1); color: #7c3aed;
  padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;
}
.text-muted { color: #9ca3af; }

.balance-due   { color: #ef4444; font-weight: 700; }
.balance-clear { color: #c4b8e8; }

/* ── Badges ───────────────────────────────────────────────────────────────── */
.badge {
  display: inline-block; font-size: 10px; padding: 3px 9px;
  border-radius: 999px; font-weight: 700; white-space: nowrap;
}
.badge-active   { background: #dcfce7; color: #166534; }
.badge-pending  { background: #fef3c7; color: #92400e; }
.badge-inactive { background: #f1f5f9; color: #64748b; }
.badge-moved    { background: #f3e8ff; color: #7e22ce; }

/* ── Actions ──────────────────────────────────────────────────────────────── */
.action-row { display: flex; gap: 4px; }
.act-btn {
  padding: 5px 11px; border-radius: 7px; font-size: 11px; font-weight: 600;
  cursor: pointer; border: 1px solid #e0ddf7; background: transparent;
  color: #9ca3af; font-family: inherit; transition: all .15s;
}
.act-btn:hover { background: #f9f5ff; border-color: #c4b8e8; color: #374151; }
.act-btn.primary { color: #ae68fa; border-color: rgba(174,104,250,.3); }
.act-btn.primary:hover { background: rgba(174,104,250,.08); border-color: #ae68fa; }
.act-btn.danger  { color: #ef4444; border-color: rgba(239,68,68,.3); }
.act-btn.danger:hover  { background: #fee2e2; border-color: #ef4444; }

/* ── Empty ────────────────────────────────────────────────────────────────── */
.empty-row { text-align: center; padding: 40px 0; }
.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: #9ca3af; font-size: 13px;
}
.empty-icon  { font-size: 36px; }
.clear-link  {
  background: none; border: none; color: #ae68fa;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  text-decoration: underline; padding: 0;
}

@media (max-width: 600px) {
  .section-hdr { flex-direction: column; gap: 12px; }
  .tab-bar { overflow-x: auto; }
}
</style>
