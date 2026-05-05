<script setup lang="ts">
import type { Room } from '../../models/room'
import RoomCard from '../../components/layout/RoomCard.vue'

defineProps<{
  rooms:      Room[]
  loading:    boolean
  sortOption: string
}>()

const emit = defineEmits<{
  (e: 'update:sortOption', val: string): void
  (e: 'inquire',           room: Room):  void
  (e: 'clear-filters'): void
}>()

const sortOptions = ['Price low to high', 'Price high to low', 'Newest first']
</script>

<template>
  <div class="rooms-area">
    <div class="rooms-header">
      <span class="rooms-count">
        <template v-if="loading">Loading rooms…</template>
        <template v-else>{{ rooms.length }} room{{ rooms.length !== 1 ? 's' : '' }} found</template>
      </span>
      <select
        :value="sortOption"
        class="sort-select"
        @change="emit('update:sortOption', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="s in sortOptions" :key="s" :value="s">Sort: {{ s }}</option>
      </select>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="rooms-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="rooms.length === 0" class="empty-state">
      <div class="empty-icon">🏠</div>
      <p>No rooms match your filters.</p>
      <button class="btn-clear" @click="emit('clear-filters')">Clear filters</button>
    </div>

    <!-- Grid -->
    <div v-else class="rooms-grid">
      <RoomCard
        v-for="room in rooms"
        :key="room.id"
        :room="room"
        @inquire="emit('inquire', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.rooms-area { flex: 1; min-width: 0; }

.rooms-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
}
.rooms-count { font-size: 14px; font-weight: 600; color: #6b7280; }
.sort-select {
  padding: 8px 14px; border-radius: 10px;
  border: 1px solid #e0ddf7; font-size: 13px; font-weight: 600;
  color: #4b5563; background: #fff; cursor: pointer; outline: none;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* Skeleton */
.skeleton-card {
  height: 300px; border-radius: 18px;
  background: linear-gradient(90deg, #ede9fe 25%, #f5f3ff 50%, #ede9fe 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty */
.empty-state { text-align: center; padding: 80px 20px; color: #9ca3af; }
.empty-icon  { font-size: 48px; margin-bottom: 12px; }
.btn-clear {
  background: #ae68fa; color: #fff; border: none;
  padding: 8px 20px; border-radius: 24px;
  font-weight: 600; font-size: 14px; cursor: pointer; margin-top: 8px;
}
</style>