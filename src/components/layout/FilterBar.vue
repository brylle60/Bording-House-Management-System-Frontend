<script setup lang="ts">
import { RoomType, RoomStatus, TYPE_LABEL, STATUS_LABEL } from '../../models/room'

defineProps<{
  selectedType:   string
  selectedStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedType',   val: string): void
  (e: 'update:selectedStatus', val: string): void
}>()

const roomTypes   = ['All', ...Object.values(RoomType)]
const roomStatuses = ['All', ...Object.values(RoomStatus)]

const typeLabel   = (t: string) => t === 'All' ? 'All rooms' : TYPE_LABEL[t as RoomType]
const statusLabel = (s: string) => s === 'All' ? 'All'       : STATUS_LABEL[s as RoomStatus]
</script>

<template>
  <div class="filter-bar-wrap">
    <div class="filter-card">
      <div class="filter-row">
        <span class="filter-label">Type:</span>
        <div class="chip-group">
          <button
            v-for="t in roomTypes" :key="t"
            :class="['chip', { active: selectedType === t }]"
            @click="emit('update:selectedType', t)"
          >{{ typeLabel(t) }}</button>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">Status:</span>
        <div class="chip-group">
          <button
            v-for="s in roomStatuses" :key="s"
            :class="['chip', { active: selectedStatus === s }]"
            @click="emit('update:selectedStatus', s)"
          >{{ statusLabel(s) }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-bar-wrap {
  display: flex; justify-content: center;
  padding: 32px 80px 0; z-index: 5; position: relative;
}
.filter-card {
  background: #fff; border-radius: 24px; padding: 24px;
  border: 1px solid rgba(210,196,255,0.4);
  display: flex; flex-direction: column; gap: 16px;
  width: 100%; max-width: 900px;
}
.filter-row   { display: flex; align-items: center; gap: 16px; }
.filter-label { font-size: 14px; font-weight: 700; color: #9ca3af; min-width: 60px; }
.chip-group   { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  background: transparent; border: 1px solid #e0ddf7;
  padding: 6px 16px; border-radius: 12px;
  font-size: 13px; font-weight: 600; color: #6b7280; cursor: pointer; transition: 0.2s;
}
.chip.active { background: rgba(174,104,250,0.1); border-color: #ae68fa; color: #ae68fa; }
@media (max-width: 768px) { .filter-bar-wrap { padding: 24px 16px 0; } }
</style>