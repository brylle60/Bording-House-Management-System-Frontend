<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tenants: any[]
  rooms:   any[]
}>()

const emit = defineEmits<{
  (e: 'navigate', section: string): void
}>()

const today = computed(() =>
  new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
)

const stats = computed(() => {
  const active   = props.tenants.filter(t => t.status === 'ACTIVE').length
  const occupied = props.rooms.filter(r => r.status === 'OCCUPIED').length
  const vacant   = props.rooms.filter(r => r.status === 'VACANT').length
  const balance  = props.tenants.reduce((s, t) => s + (t.balance ?? 0), 0)
  return [
    { label: 'Active Tenants',   value: active,              sub: `${props.tenants.length} total registered`, trend: 'up',   icon: 'users', color: '#ae68fa', bg: 'rgba(174,104,250,.12)' },
    { label: 'Occupied Rooms',   value: occupied,            sub: `${props.rooms.length} total rooms`,       trend: 'up',   icon: 'door',  color: '#f1966e', bg: 'rgba(241,150,110,.12)' },
    { label: 'Vacant Rooms',     value: vacant,              sub: `${props.rooms.filter(r => r.status === 'RESERVED').length} reserved`, trend: 'neutral', icon: 'key', color: '#22c55e', bg: 'rgba(34,197,94,.12)' },
    { label: 'Pending Balance',  value: '₱' + balance.toLocaleString(), sub: `${props.tenants.filter(t => (t.balance ?? 0) > 0).length} tenants with dues`, trend: balance > 0 ? 'alert' : 'neutral', icon: 'peso', color: '#ef4444', bg: 'rgba(239,68,68,.12)' },
  ]
})

const recentActivity = [
  { icon: '🔑', action: 'Ana Reyes paid ₱4,500 for Room 2A',        time: '2m ago',  color: '#dcfce7' },
  { icon: '🛏️', action: 'Room 2F set to Maintenance status',         time: '18m ago', color: '#fef3c7' },
  { icon: '👤', action: 'New tenant Diana Lopez registered',          time: '1h ago',  color: 'rgba(174,104,250,.1)' },
  { icon: '📋', action: 'Lease renewed for Erick Bueno — Room GF-01', time: '3h ago',  color: '#dbeafe' },
  { icon: '⚠️', action: 'Gerald Tan has overdue balance ₱5,500',      time: '5h ago',  color: '#fee2e2' },
]

function statusClass(s: string) {
  return ({
    ACTIVE:      'badge-active',
    PENDING:     'badge-pending',
    INACTIVE:    'badge-inactive',
    MOVED_OUT:   'badge-moved',
    OCCUPIED:    'badge-occupied',
    VACANT:      'badge-vacant',
    MAINTENANCE: 'badge-maint',
    RESERVED:    'badge-reserved',
  } as any)[s] ?? ''
}

function chipClass(s: string) {
  return ({
    OCCUPIED:    'chip-occupied',
    VACANT:      'chip-vacant',
    MAINTENANCE: 'chip-maint',
    RESERVED:    'chip-reserved',
  } as any)[s] ?? ''
}
</script>

<template>
  <section class="section">

    <!-- Header -->
    <div class="section-hdr">
      <div>
        <h1 class="section-title">Admin Dashboard</h1>
        <p class="section-sub">System overview · {{ today }}</p>
      </div>
      <div class="hdr-actions">
        <button class="btn-outline">Export report</button>
        <button class="btn-primary-sm" @click="emit('navigate', 'tenants')">+ Add Tenant</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-top">
          <span class="stat-label">{{ s.label }}</span>
          <div class="stat-icon" :style="{ background: s.bg }">
            <!-- Users -->
            <svg v-if="s.icon === 'users'" width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="s.color" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <!-- Door -->
            <svg v-else-if="s.icon === 'door'" width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="s.color" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <!-- Key -->
            <svg v-else-if="s.icon === 'key'" width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="s.color" stroke-width="2">
              <circle cx="7.5" cy="15.5" r="5.5"/>
              <path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5L17 6l3 3-1.5 1.5"/>
            </svg>
            <!-- Peso -->
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="s.color" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
              <path d="M8 8h5a3 3 0 0 1 0 6H8v-6zm0 6h8m-8-3h8"/>
            </svg>
          </div>
        </div>
        <div class="stat-value">{{ s.value }}</div>
        <div class="stat-sub"
             :class="{ 'sub-up': s.trend === 'up', 'sub-alert': s.trend === 'alert' }">
          {{ s.sub }}
        </div>
      </div>
    </div>

    <!-- Two-col grid -->
    <div class="dash-grid">

      <!-- Recent tenants table -->
      <div class="card">
        <div class="card-hdr">
          <span class="card-title">Recent Tenants</span>
          <button class="card-link" @click="emit('navigate', 'tenants')">View all →</button>
        </div>
        <table class="mini-table">
          <thead>
            <tr><th>Tenant</th><th>Room</th><th>Status</th><th>Balance</th></tr>
          </thead>
          <tbody>
            <tr v-for="t in tenants.slice(0, 6)" :key="t.id">
              <td>
                <div class="user-cell">
                  <div class="user-av">{{ t.name.split(' ').map((n: string) => n[0]).join('').slice(0,2) }}</div>
                  <span>{{ t.name }}</span>
                </div>
              </td>
              <td>{{ t.room }}</td>
              <td><span class="badge" :class="statusClass(t.status)">{{ t.status }}</span></td>
              <td :class="{ 'text-red': (t.balance ?? 0) > 0 }">
                {{ (t.balance ?? 0) > 0 ? '₱' + t.balance.toLocaleString() : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Activity feed -->
      <div class="card">
        <div class="card-hdr">
          <span class="card-title">Recent Activity</span>
          <span class="card-sub">Today</span>
        </div>
        <div class="activity-list">
          <div v-for="a in recentActivity" :key="a.action" class="activity-item">
            <div class="activity-icon" :style="{ background: a.color }">{{ a.icon }}</div>
            <div class="activity-body">
              <div class="activity-text">{{ a.action }}</div>
              <div class="activity-time">{{ a.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Room status strip -->
    <div class="card mt-16">
      <div class="card-hdr">
        <span class="card-title">Room Status Overview</span>
        <button class="card-link" @click="emit('navigate', 'rooms')">Manage rooms →</button>
      </div>
      <div class="status-legend">
        <span class="legend-dot dot-occupied"/>  <span class="legend-label">Occupied</span>
        <span class="legend-dot dot-vacant"/>     <span class="legend-label">Vacant</span>
        <span class="legend-dot dot-reserved"/>   <span class="legend-label">Reserved</span>
        <span class="legend-dot dot-maint"/>      <span class="legend-label">Maintenance</span>
      </div>
      <div class="room-strip">
        <div v-for="r in rooms" :key="r.id"
             class="room-chip" :class="chipClass(r.status)"
             :title="`${r.type} · ₱${r.rate?.toLocaleString()}/mo · ${r.occupants}`">
          <span class="chip-num">{{ r.number }}</span>
          <span class="chip-type">{{ r.type }}</span>
          <span class="chip-rate">₱{{ r.rate?.toLocaleString() }}</span>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
/* ── Section ──────────────────────────────────────────────────────────────── */
.section-hdr {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 22px;
}
.section-title { font-size: 22px; font-weight: 700; color: #160d27; }
.section-sub   { font-size: 13px; color: #9ca3af; margin-top: 2px; }
.hdr-actions   { display: flex; gap: 8px; }

.btn-outline {
  padding: 8px 16px; border-radius: 9px;
  border: 1.5px solid #e0ddf7; background: #fff;
  color: #374151; font-size: 13px; font-weight: 500; cursor: pointer;
  font-family: inherit; transition: border-color .15s;
}
.btn-outline:hover { border-color: #ae68fa; }

.btn-primary-sm {
  padding: 8px 16px; border-radius: 9px; border: none;
  background: linear-gradient(90deg, #ae68fa, #f1966e);
  color: #fff; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: opacity .15s;
}
.btn-primary-sm:hover { opacity: .88; }

/* ── Stats ────────────────────────────────────────────────────────────────── */
.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 14px; margin-bottom: 18px;
}
.stat-card {
  background: #fff; border: 1px solid #e0ddf7; border-radius: 14px;
  padding: 16px 18px; box-shadow: 0 2px 12px rgba(149,132,226,.07);
  transition: box-shadow .2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(149,132,226,.15); }
.stat-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.stat-label { font-size: 12px; color: #9ca3af; font-weight: 500; }
.stat-icon  {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.stat-value { font-size: 26px; font-weight: 800; color: #160d27; letter-spacing: -.5px; }
.stat-sub   { font-size: 12px; margin-top: 3px; color: #9ca3af; }
.sub-up     { color: #22c55e; }
.sub-alert  { color: #ef4444; }

/* ── Cards ────────────────────────────────────────────────────────────────── */
.dash-grid {
  display: grid; grid-template-columns: 1.5fr 1fr;
  gap: 16px; margin-bottom: 0;
}
.card {
  background: #fff; border: 1px solid #e0ddf7; border-radius: 14px;
  padding: 18px; box-shadow: 0 2px 12px rgba(149,132,226,.06);
}
.mt-16 { margin-top: 16px; }

.card-hdr {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.card-title { font-size: 13px; font-weight: 700; color: #160d27; }
.card-sub   { font-size: 11px; color: #c4b8e8; }
.card-link  {
  background: none; border: none; font-size: 12px; color: #ae68fa;
  cursor: pointer; font-weight: 600; font-family: inherit; padding: 0;
  transition: color .15s;
}
.card-link:hover { color: #f1966e; }

/* ── Mini table ───────────────────────────────────────────────────────────── */
.mini-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.mini-table th {
  text-align: left; padding: 6px 8px; color: #c4b8e8;
  font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: .05em;
  border-bottom: 1px solid #f3f0fb;
}
.mini-table td { padding: 8px 8px; color: #374151; border-bottom: 1px solid #f9f7ff; }
.mini-table tr:last-child td { border-bottom: none; }
.mini-table tr:hover td { background: #faf7ff; }

.user-cell { display: flex; align-items: center; gap: 8px; }
.user-av {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #ae68fa, #f1966e);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: #fff;
}
.text-red { color: #ef4444; font-weight: 600; }

/* ── Activity ─────────────────────────────────────────────────────────────── */
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-item { display: flex; gap: 10px; align-items: flex-start; }
.activity-icon {
  width: 32px; height: 32px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.activity-body { flex: 1; }
.activity-text { font-size: 12.5px; color: #374151; line-height: 1.45; }
.activity-time { font-size: 11px; color: #c4b8e8; margin-top: 2px; }

/* ── Room strip ───────────────────────────────────────────────────────────── */
.status-legend {
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 12px; font-size: 11px; color: #9ca3af;
}
.legend-dot {
  width: 8px; height: 8px; border-radius: 50%; display: inline-block;
}
.dot-occupied { background: #ae68fa; }
.dot-vacant   { background: #22c55e; }
.dot-reserved { background: #f59e0b; }
.dot-maint    { background: #ef4444; }
.legend-label { margin-right: 8px; }

.room-strip { display: flex; flex-wrap: wrap; gap: 8px; }
.room-chip {
  display: flex; flex-direction: column; align-items: center;
  padding: 8px 14px; border-radius: 11px;
  border: 1.5px solid transparent; gap: 2px; min-width: 74px;
  transition: transform .15s, box-shadow .15s; cursor: default;
}
.room-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.08); }
.chip-num  { font-size: 13px; font-weight: 800; }
.chip-type { font-size: 9px; opacity: .65; text-transform: uppercase; letter-spacing: .04em; }
.chip-rate { font-size: 11px; font-weight: 600; margin-top: 1px; }

.chip-occupied { background: rgba(174,104,250,.1);  border-color: #ae68fa; color: #7c3aed; }
.chip-vacant   { background: rgba(34,197,94,.1);    border-color: #22c55e; color: #15803d; }
.chip-maint    { background: rgba(239,68,68,.1);    border-color: #ef4444; color: #b91c1c; }
.chip-reserved { background: rgba(245,158,11,.1);   border-color: #f59e0b; color: #b45309; }

/* ── Badges ───────────────────────────────────────────────────────────────── */
.badge {
  display: inline-block; font-size: 10px; padding: 3px 9px;
  border-radius: 999px; font-weight: 600; white-space: nowrap;
}
.badge-active   { background: #dcfce7; color: #166534; }
.badge-pending  { background: #fef3c7; color: #92400e; }
.badge-inactive { background: #f1f5f9; color: #64748b; }
.badge-moved    { background: #f3e8ff; color: #7e22ce; }
.badge-occupied { background: rgba(174,104,250,.12); color: #7c3aed; }
.badge-vacant   { background: #dcfce7; color: #15803d; }
.badge-maint    { background: #fee2e2; color: #991b1b; }
.badge-reserved { background: #fef3c7; color: #b45309; }

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-grid  { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
  .section-hdr { flex-direction: column; gap: 12px; }
}
</style>
