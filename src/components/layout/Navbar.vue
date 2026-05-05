<script setup lang="ts">
import logo from '@/assets/Logo.png'

defineProps<{ availableCount: number }>()
const emit = defineEmits<{
  (e: 'scroll-to-rooms'): void
  (e: 'open-login'): void
  (e: 'open-register'): void
}>()
</script>

<template>
  <nav class="navbar">
    <div class="brand">
      <img :src="logo" alt="ResidEase" class="logo">
      <span class="brand-name">ResidEase</span>
    </div>

    <div class="nav-links">
      <button class="nav-btn" @click="emit('scroll-to-rooms')">Browse Rooms</button>
      <button class="nav-btn">About</button>
      <button class="nav-btn">Contact Us</button>
    </div>

    <div class="auth-actions">
      <button class="text-link" @click="emit('open-login')">Log In</button>
      <button class="btn-primary mini" @click="emit('open-register')">Sign Up</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 80px;
  z-index: 10;
  position: relative;
}
.brand       { display: flex; align-items: center; gap: 12px; }
.logo        { width: 45px; height: 40px; }
.brand-name  { font-size: 20px; font-weight: 700; color: #6b7280; }
.nav-links   { display: flex; gap: 32px; }
.nav-btn {
  background: none; border: none;
  color: #6b7280; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: color 0.2s;
}
.nav-btn:hover  { color: #ae68fa; }
.auth-actions   { display: flex; align-items: center; }
.text-link {
  background: transparent; border: none;
  font-size: 14px; font-weight: 600; color: #6366f1;
  cursor: pointer; margin-right: 20px;
}
.btn-primary {
  background: #ae68fa; color: #fff; border: none;
  padding: 12px 28px; border-radius: 24px;
  font-weight: 600; font-size: 14px; cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(174,104,250,0.3);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(174,104,250,0.4); }
.btn-primary.mini  { padding: 8px 20px; }

@media (max-width: 768px) {
  .navbar    { padding: 20px; }
  .nav-links { display: none; }
}
</style>