<script setup lang="ts">
import { RoomType, FloorLevel, TYPE_LABEL, FLOOR_LABEL } from '../../models/room'

const props = defineProps<{
  priceMin:         number
  priceMax:         number
  checkedTypes:     string[]
  checkedAmenities: string[]
  checkedFloors:    string[]
}>()

// Vue 3.4+ record-style — cleaner and avoids the overload ambiguity
const emit = defineEmits<{
  'update:priceMin':         [val: number]
  'update:priceMax':         [val: number]
  'update:checkedTypes':     [val: string[]]
  'update:checkedAmenities': [val: string[]]
  'update:checkedFloors':    [val: string[]]
  'reset':                   []
}>()

const typeOptions    = Object.values(RoomType)
const floorOptions   = Object.values(FloorLevel)
const amenityOptions = ['WiFi', 'AC', 'CR shared', 'CR own', 'Ref', 'Laundry', 'CCTV', 'Parking']

type ListEvent = 'update:checkedTypes' | 'update:checkedAmenities' | 'update:checkedFloors'

function toggle(list: string[], val: string, event: ListEvent) {
  const copy = [...list]
  const i    = copy.indexOf(val)
  i === -1 ? copy.push(val) : copy.splice(i, 1)
  // Cast needed because TS cannot narrow a union event to its paired payload type
  ;(emit as (e: ListEvent, val: string[]) => void)(event, copy)
}
</script>

<template>
  <aside class="sidebar">

    <!-- Price Range -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">Price range</h3>
      <div class="price-inputs">
        <input
          :value="priceMin" type="number" class="price-input" min="0"
          @input="emit('update:priceMin', +($event.target as HTMLInputElement).value)"
        >
        <span class="price-dash">–</span>
        <input
          :value="priceMax" type="number" class="price-input" min="0"
          @input="emit('update:priceMax', +($event.target as HTMLInputElement).value)"
        >
      </div>
      <input
        :value="priceMax" type="range" min="1000" max="20000" step="500"
        class="range-slider"
        @input="emit('update:priceMax', +($event.target as HTMLInputElement).value)"
      >
    </div>

    <!-- Room Type -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">Room type</h3>
      <label v-for="t in typeOptions" :key="t" class="check-label">
        <input type="checkbox" class="check-input" :checked="checkedTypes.includes(t)"
          @change="toggle(checkedTypes, t, 'update:checkedTypes')">
        <span class="check-box" :class="{ checked: checkedTypes.includes(t) }"></span>
        {{ TYPE_LABEL[t] }}
      </label>
    </div>

    <!-- Amenities -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">Amenities</h3>
      <div class="amenity-chips">
        <button
          v-for="a in amenityOptions" :key="a"
          :class="['amenity-chip', { active: checkedAmenities.includes(a) }]"
          @click="toggle(checkedAmenities, a, 'update:checkedAmenities')"
        >{{ a }}</button>
      </div>
    </div>

    <!-- Floor -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">Floor</h3>
      <label v-for="f in floorOptions" :key="f" class="check-label">
        <input type="checkbox" class="check-input" :checked="checkedFloors.includes(f)"
          @change="toggle(checkedFloors, f, 'update:checkedFloors')">
        <span class="check-box" :class="{ checked: checkedFloors.includes(f) }"></span>
        {{ FLOOR_LABEL[f] }}
      </label>
    </div>

    <button class="reset-btn" @click="emit('reset')">Reset filters</button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px; flex-shrink: 0; display: flex; flex-direction: column;
  background: #fff; border-radius: 20px;
  border: 1px solid rgba(210,196,255,0.4);
  padding: 24px; align-self: flex-start;
  position: sticky; top: 20px;
}
.sidebar-section {
  padding-bottom: 20px; margin-bottom: 20px;
  border-bottom: 1px solid #f0eeff;
}
.sidebar-section:last-of-type { border-bottom: none; margin-bottom: 0; }
.sidebar-title { font-size: 13px; font-weight: 700; color: #1f2937; margin: 0 0 14px; }

.price-inputs { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.price-input {
  width: 80px; padding: 6px 10px; border-radius: 8px;
  border: 1px solid #e0ddf7; font-size: 14px; font-weight: 600;
  color: #6366f1; outline: none; background: #faf7ff;
}
.price-dash  { color: #9ca3af; }
.range-slider { width: 100%; accent-color: #ae68fa; cursor: pointer; }

.check-label {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; color: #4b5563; cursor: pointer;
  margin-bottom: 10px; user-select: none;
}
.check-input { display: none; }
.check-box {
  width: 16px; height: 16px; border-radius: 4px;
  border: 1.5px solid #4B5563; flex-shrink: 0; transition: 0.2s;
}
.check-box.checked {
  background: #ae68fa; border-color: #ae68fa;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M2 5l2.5 2.5L8 3' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: center;
}
.amenity-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.amenity-chip {
  background: #f3f4f6; border: 1px solid #4B5563;
  padding: 4px 12px; border-radius: 8px;
  font-size: 12px; font-weight: 600; color: #6b7280; cursor: pointer; transition: 0.2s;
}
.amenity-chip.active { background: #ede9fe; border-color: #ae68fa; color: #7c3aed; }
.reset-btn {
  width: 100%; padding: 10px; border-radius: 12px;
  border: 1px dashed #4B5563; background: transparent;
  color: #9ca3af; font-size: 13px; font-weight: 600;
  cursor: pointer; margin-top: 8px; transition: 0.2s;
}
.reset-btn:hover { border-color: #ae68fa; color: #ae68fa; }
@media (max-width: 900px) { .sidebar { width: 100%; position: static; } }
</style>