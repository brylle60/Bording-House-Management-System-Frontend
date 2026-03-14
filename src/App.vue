<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';

import logo from './assets/Logo.png';
import starTrail from './assets/Design.png';

const activeView = ref<'login' | 'register'>('login');
</script>

<template>
  <div class="page">
    <header class="brand">
      <img :src="logo" alt="" class="brand-logo" />
      <span class="brand-text">Boarding House Management System</span>
    </header>

    <main class="layout">
      <img :src="starTrail" alt="" class="decor-star" />

      <div class="form-wrapper">
        <LoginForm
          v-if="activeView === 'login'"
          @switch-to-register="activeView = 'register'"
        />
        <RegisterForm
          v-else
          @switch-to-login="activeView = 'login'"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40px 80px;
  background: #faf7ff;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 48px;
}

.brand-logo {
  width: 40px;
  height: 40px;
}

.brand-text {
  font-weight: 600;
  font-size: 18px;
  color: #1f2933;
}

.layout {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1100px;
  margin: 0 auto;
}

.decor-star {
  position: absolute;
  left: 0;
  top: 50%;
  width: 220px;
  height: auto;
  pointer-events: none;
  transform: translate(-20%, -50%);
}

.form-wrapper {
  flex: 0 0 520px;
}

@media (max-width: 900px) {
  .page {
    padding: 24px 16px;
  }

  .layout {
    justify-content: center;
  }

  .decor-star {
    display: none;
  }

  .form-wrapper {
    width: 100%;
  }
}
</style>