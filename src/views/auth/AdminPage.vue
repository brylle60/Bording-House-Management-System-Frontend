<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

import AdminSidebar   from '@/components/admin_layout/AdminSidebar.vue'
import AdminTopbar    from '@/components/admin_layout/AdminTopbar.vue'
import AdminDashboard from '@/components/admin_layout/AdminDashboard.vue'
import AdminTenants   from '@/components/admin_layout/AdminTenants.vue'
import AdminRooms     from '@/components/admin_layout/AdminRooms.vue'

const router = useRouter()
const auth   = useAuthStore()

// ─── Layout state ─────────────────────────────────────────────────────────────
const sidebarOpen   = ref(true)
const activeSection = ref('dashboard')

function navigate(section: string) { activeSection.value = section }

function handleLogout() {
  auth.logout()
  router.push('/')
}

// ─── Mock data (replace with API calls) ──────────────────────────────────────
const tenants = ref([
  { id: 1, name: 'Ana Reyes',      room: '2A',    status: 'ACTIVE',   balance: 0,    move_in: 'Jan 3, 2025',  phone: '09171234567', email: 'ana@email.com' },
  { id: 2, name: 'Carlo Santos',   room: '3B',    status: 'ACTIVE',   balance: 4500, move_in: 'Feb 10, 2025', phone: '09281234567', email: 'carlo@email.com' },
  { id: 3, name: 'Diana Lopez',    room: '—',     status: 'PENDING',  balance: 0,    move_in: '—',            phone: '09391234567', email: 'diana@email.com' },
  { id: 4, name: 'Erick Bueno',    room: 'GF-01', status: 'ACTIVE',   balance: 9500, move_in: 'Dec 1, 2024',  phone: '09451234567', email: 'erick@email.com' },
  { id: 5, name: 'Faye Dela Cruz', room: '4D',    status: 'INACTIVE', balance: 0,    move_in: 'Mar 5, 2025',  phone: '09561234567', email: 'faye@email.com' },
  { id: 6, name: 'Gerald Tan',     room: '2F',    status: 'ACTIVE',   balance: 5500, move_in: 'Nov 20, 2024', phone: '09671234567', email: 'gerald@email.com' },
])

const rooms = ref([
  { id: 1, number: '2A',    type: 'SINGLE',    floor: '2nd', status: 'OCCUPIED',    rate: 4500, occupants: '1/1', amenities: 'WiFi, AC, CR own' },
  { id: 2, number: '3B',    type: 'DOUBLE',    floor: '3rd', status: 'OCCUPIED',    rate: 4200, occupants: '2/2', amenities: 'WiFi, Fan, CR shared' },
  { id: 3, number: '1C',    type: 'STUDIO',    floor: 'GF',  status: 'RESERVED',   rate: 6000, occupants: '0/1', amenities: 'WiFi, AC, Ref' },
  { id: 4, number: '4D',    type: 'DORMITORY', floor: '4th', status: 'OCCUPIED',    rate: 2800, occupants: '3/6', amenities: 'WiFi, Laundry, CCTV' },
  { id: 5, number: 'GF-01', type: 'SUITE',     floor: 'GF',  status: 'OCCUPIED',    rate: 9500, occupants: '1/2', amenities: 'WiFi, AC, CR own, Ref, Parking' },
  { id: 6, number: '2F',    type: 'DOUBLE',    floor: '2nd', status: 'MAINTENANCE', rate: 5500, occupants: '0/2', amenities: 'AC, CR own, Parking' },
  { id: 7, number: '5A',    type: 'SINGLE',    floor: '5th', status: 'VACANT',      rate: 3800, occupants: '0/1', amenities: 'WiFi, Fan' },
])
</script>

<template>
  <div class="admin-shell">

    <!-- Sidebar -->
    <AdminSidebar
      :active-section="activeSection"
      :sidebar-open="sidebarOpen"
      :username="auth.user?.username"
      @navigate="navigate"
      @logout="handleLogout"
      @update:sidebar-open="(v: boolean) => sidebarOpen = v"
    />

    <!-- Right pane -->
    <div class="main-area">

      <!-- Topbar -->
      <AdminTopbar
        :active-section="activeSection"
        :username="auth.user?.username"
        :notif-count="3"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <!-- Scrollable content -->
      <main class="content-area">

        <AdminDashboard
          v-if="activeSection === 'dashboard'"
          :tenants="tenants"
          :rooms="rooms"
          @navigate="navigate"
        />

        <AdminTenants
          v-else-if="activeSection === 'tenants'"
          :tenants="tenants"
          @add="() => {}"
          @view="() => {}"
          @edit="() => {}"
          @remove="() => {}"
        />

        <AdminRooms
          v-else-if="activeSection === 'rooms'"
          :rooms="rooms"
          @add="() => {}"
          @view="() => {}"
          @edit="() => {}"
        />

        <!-- Placeholder sections -->
        <section v-else class="section">
          <div class="section-hdr">
            <div>
              <h1 class="section-title">
                {{ {
                  leases:      'Lease Management',
                  billing:     'Billing & Payments',
                  maintenance: 'Maintenance',
                  users:       'User Accounts',
                  reports:     'Reports',
                  settings:    'System Settings',
                }[activeSection] ?? activeSection }}
              </h1>
              <p class="section-sub">This module is under construction.</p>
            </div>
          </div>
          <div class="placeholder-card">
            <div class="ph-icon">
              {{ { leases: '📋', billing: '💳', maintenance: '🔧', users: '👥', reports: '📊', settings: '⚙️' }[activeSection] ?? '🚧' }}
            </div>
            <h3>Coming soon</h3>
            <p>This section is being built. Check back soon.</p>
            <button class="back-btn" @click="navigate('dashboard')">← Back to Dashboard</button>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-shell {
  display: flex; height: 100vh; width: 100%;
  background: #f3f0fb;
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
}
.main-area {
  flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0;
}
.content-area {
  flex: 1; overflow-y: auto; padding: 28px 32px; background: #f3f0fb;
}
.content-area::-webkit-scrollbar { width: 5px; }
.content-area::-webkit-scrollbar-track { background: transparent; }
.content-area::-webkit-scrollbar-thumb { background: #e0ddf7; border-radius: 5px; }

.section-hdr {
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px;
}
.section-title { font-size: 22px; font-weight: 700; color: #160d27; }
.section-sub   { font-size: 13px; color: #9ca3af; margin-top: 2px; }

.placeholder-card {
  background: #fff; border: 1.5px dashed #e0ddf7; border-radius: 18px;
  padding: 60px 40px; display: flex; flex-direction: column;
  align-items: center; gap: 12px; text-align: center;
}
.ph-icon { font-size: 52px; }
.placeholder-card h3 { font-size: 18px; color: #374151; font-weight: 700; margin: 0; }
.placeholder-card p  { font-size: 13px; color: #9ca3af; max-width: 360px; margin: 0; }

.back-btn {
  margin-top: 8px; padding: 9px 20px; border-radius: 9px; border: none;
  background: linear-gradient(90deg, #ae68fa, #f1966e);
  color: #fff; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: opacity .15s;
}
.back-btn:hover { opacity: .88; }

@media (max-width: 768px) {
  .content-area { padding: 20px 16px; }
}
</style>