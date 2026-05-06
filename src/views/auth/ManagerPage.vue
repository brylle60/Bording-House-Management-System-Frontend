<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import DashboardSidebar from '@/components/dashboard_layout/DashboardSidebar.vue'
import DashboardTopbar from '@/components/dashboard_layout/DashboardTopbar.vue'
import { managerService, type ManagerDashboardPayload, type ManagerLease, type ManagerMaintenance, type ManagerPayment, type ManagerRoom } from '../../services/managerService'

const router = useRouter()
const auth = useAuthStore()

const sidebarOpen = ref(true)
const activeSection = ref<'dashboard' | 'rooms' | 'leases' | 'payments' | 'maintenance'>('dashboard')
const loading = ref(false)
const error = ref('')

const dashboard = ref<ManagerDashboardPayload | null>(null)
const rooms = ref<ManagerRoom[]>([])
const leases = ref<ManagerLease[]>([])
const payments = ref<ManagerPayment[]>([])
const maintenance = ref<ManagerMaintenance[]>([])

function navigate(section: string) {
  if (['dashboard', 'rooms', 'leases', 'payments', 'maintenance'].includes(section)) {
    activeSection.value = section as typeof activeSection.value
  }
}

function logout() {
  auth.logout()
  router.push('/')
}

function formatDate(value?: string | null) {
  if (!value) return 'N/A'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-PH')
}

function formatMoney(value?: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value ?? 0)
}

async function loadManagerData() {
  loading.value = true
  error.value = ''
  try {
    const [dashboardRes, roomsRes, leasesRes, paymentsRes, maintenanceRes] = await Promise.all([
      managerService.getDashboard(),
      managerService.listRooms(8),
      managerService.listLeases(8),
      managerService.listPayments(),
      managerService.listMaintenance(),
    ])
    dashboard.value = dashboardRes
    rooms.value = roomsRes
    leases.value = leasesRes
    payments.value = paymentsRes.slice(0, 8)
    maintenance.value = maintenanceRes.slice(0, 8)
  } catch (e: any) {
    error.value = e?.message ?? 'Failed to load manager dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadManagerData()
})
</script>

<template>
  <div class="admin-shell">
    <DashboardSidebar
      :active-section="activeSection"
      :sidebar-open="sidebarOpen"
      :username="auth.user?.username"
      variant="manager"
      @navigate="navigate"
      @logout="logout"
    />

    <div class="main-area">
      <DashboardTopbar
        :active-section="activeSection"
        :username="auth.user?.username"
        :notif-count="2"
        variant="manager"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <main class="content-area">
        <div v-if="error" class="error-banner">{{ error }}</div>
        <div class="section-hdr">
          <h1 class="section-title">Manager Operations</h1>
          <button class="refresh-btn" :disabled="loading" @click="loadManagerData">
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <section v-if="activeSection === 'dashboard'" class="section">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">Total Rooms</span>
              <h3>{{ dashboard?.rooms?.total ?? 0 }}</h3>
              <p>Vacant: {{ dashboard?.rooms?.vacant ?? 0 }}</p>
            </div>
            <div class="stat-card">
              <span class="stat-label">Occupancy</span>
              <h3>{{ Math.round(dashboard?.rooms?.occupancy_rate_pct ?? 0) }}%</h3>
              <p>Occupied: {{ dashboard?.rooms?.occupied ?? 0 }}</p>
            </div>
            <div class="stat-card">
              <span class="stat-label">Active Leases</span>
              <h3>{{ dashboard?.leases?.active ?? 0 }}</h3>
              <p>Total leases: {{ dashboard?.leases?.total ?? 0 }}</p>
            </div>
            <div class="stat-card">
              <span class="stat-label">Maintenance Queue</span>
              <h3>{{ dashboard?.maintenance?.in_progress ?? 0 }}</h3>
              <p>Submitted: {{ dashboard?.maintenance?.submitted ?? 0 }}</p>
            </div>
          </div>
        </section>

        <section v-if="activeSection === 'rooms' || activeSection === 'dashboard'" class="card">
          <div class="card-hdr">
            <h3>Rooms</h3>
            <button class="mini-btn" @click="navigate('rooms')">View section</button>
          </div>
          <table class="table">
            <thead><tr><th>Room</th><th>Status</th><th>Occupants</th><th>Rent</th></tr></thead>
            <tbody>
              <tr v-if="loading"><td colspan="4">Loading...</td></tr>
              <tr v-for="room in rooms" :key="room.id">
                <td>{{ room.room_number }}</td>
                <td>{{ room.status }}</td>
                <td>{{ room.current_occupants ?? 0 }}/{{ room.capacity ?? 0 }}</td>
                <td>{{ formatMoney(room.monthly_rent) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="activeSection === 'leases' || activeSection === 'dashboard'" class="card">
          <div class="card-hdr">
            <h3>Leases</h3>
            <button class="mini-btn" @click="navigate('leases')">View section</button>
          </div>
          <table class="table">
            <thead><tr><th>Lease ID</th><th>Status</th><th>Start</th><th>End</th></tr></thead>
            <tbody>
              <tr v-if="loading"><td colspan="4">Loading...</td></tr>
              <tr v-for="lease in leases" :key="lease.id">
                <td>{{ lease.id.slice(0, 8) }}...</td>
                <td>{{ lease.status }}</td>
                <td>{{ formatDate(lease.start_date) }}</td>
                <td>{{ formatDate(lease.end_date) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="activeSection === 'payments' || activeSection === 'dashboard'" class="card">
          <div class="card-hdr">
            <h3>Recent Payments</h3>
            <button class="mini-btn" @click="navigate('payments')">View section</button>
          </div>
          <table class="table">
            <thead><tr><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              <tr v-if="loading"><td colspan="4">Loading...</td></tr>
              <tr v-for="p in payments" :key="p.id">
                <td>{{ formatMoney(p.amount) }}</td>
                <td>{{ p.method }}</td>
                <td>{{ p.status }}</td>
                <td>{{ formatDate(p.payment_date) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="activeSection === 'maintenance' || activeSection === 'dashboard'" class="card">
          <div class="card-hdr">
            <h3>Maintenance Requests</h3>
            <button class="mini-btn" @click="navigate('maintenance')">View section</button>
          </div>
          <table class="table">
            <thead><tr><th>Title</th><th>Priority</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              <tr v-if="loading"><td colspan="4">Loading...</td></tr>
              <tr v-for="m in maintenance" :key="m.id">
                <td>{{ m.title }}</td>
                <td>{{ m.priority }}</td>
                <td>{{ m.status }}</td>
                <td>{{ formatDate(m.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-shell { display: flex; height: 100vh; width: 100%; background: #f3f0fb; overflow: hidden; }
.main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.content-area { flex: 1; overflow-y: auto; padding: 24px; }
.error-banner { margin-bottom: 12px; padding: 10px; border: 1px solid #fecaca; background: #fef2f2; color: #991b1b; border-radius: 10px; }
.section-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-title { font-size: 22px; color: #160d27; margin: 0; }
.refresh-btn { border: none; background: #160d27; color: #fff; border-radius: 8px; padding: 8px 14px; cursor: pointer; }
.refresh-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
.stat-card { background: #fff; border-radius: 14px; padding: 14px; border: 1px solid #e0ddf7; }
.stat-label { color: #9ca3af; font-size: 12px; }
.stat-card h3 { margin: 6px 0; font-size: 24px; color: #160d27; }
.stat-card p { margin: 0; color: #6b7280; font-size: 12px; }
.card { margin-bottom: 14px; background: #fff; border: 1px solid #e0ddf7; border-radius: 14px; padding: 14px; }
.card-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.card-hdr h3 { margin: 0; color: #160d27; }
.mini-btn { border: 1px solid #e0ddf7; background: #faf7ff; color: #6b7280; border-radius: 8px; padding: 6px 10px; cursor: pointer; }
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th { text-align: left; color: #9ca3af; font-weight: 600; border-bottom: 1px solid #f3f0fb; padding: 8px; }
.table td { border-bottom: 1px solid #f9f7ff; padding: 8px; }
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
