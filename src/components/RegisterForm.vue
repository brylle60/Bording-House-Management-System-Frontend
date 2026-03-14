<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type RegisterPayload } from '../services/authService'
import logo      from '../assets/Logo.png'
import starTrail from '../assets/Design.png'

const router = useRouter()

const form = reactive<RegisterPayload>({
  firstName:   '',
  lastName:    '',
  email:       '',
  phoneNumber: '',
  password:    '',
})
const error   = ref('')
const success = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value   = ''
  success.value = ''
  loading.value = true

  try {
    const data = await authService.register(form)
    success.value = data?.message || 'Account created successfully!'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err: any) {
    error.value =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      'Unable to register. Please check your details.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <header class="brand">
      <img :src="logo" alt="ResidEase" class="brand-logo" />
      <span class="brand-text">Boarding House Management System</span>
    </header>

    <main class="layout">
      <img :src="starTrail" alt="" class="decor" />

      <div class="form-card">
        <h1>Signup now</h1>
        <p class="form-sub">Create your account to get started.</p>

        <div class="name-row">
          <div class="field">
            <label>First name</label>
            <input v-model="form.firstName" type="text" placeholder="First name" class="input" />
          </div>
          <div class="field">
            <label>Last name</label>
            <input v-model="form.lastName"  type="text" placeholder="Last name"  class="input" />
          </div>
        </div>

        <div class="field">
          <label>Email address</label>
          <input v-model="form.email" type="email" placeholder="Enter your email" autocomplete="email" class="input" />
        </div>

        <div class="field">
          <label>Phone number</label>
          <input v-model="form.phoneNumber" type="tel" placeholder="Enter your phone number" class="input" />
        </div>

        <div class="field">
          <label>Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Create a password"
            autocomplete="new-password"
            class="input"
            @keyup.enter="handleRegister"
          />
        </div>

        <p v-if="error"   class="msg error">{{ error }}</p>
        <p v-if="success" class="msg success">{{ success }} Redirecting to login…</p>

        <button class="btn-primary" :disabled="loading" @click="handleRegister">
          {{ loading ? 'Signing up…' : 'Signup' }}
        </button>

        <p class="switch-text">
          Already have an account?
          <RouterLink to="/login" class="link">Login</RouterLink>
        </p>
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
.brand { display:flex; align-items:center; gap:10px; margin-bottom:48px; }
.brand-logo { width:40px; height:40px; }
.brand-text { font-weight:600; font-size:18px; color:#1f2933; }

.layout {
  position:relative; display:flex;
  align-items:center; justify-content:center;
  max-width:1100px; margin:0 auto;
}
.decor {
  position:absolute; left:0; top:50%; width:220px;
  pointer-events:none; transform:translate(-20%,-50%);
}

.form-card {
  width:100%; max-width:480px; background:#fff;
  border-radius:30px; padding:40px 48px 36px;
  box-shadow:0 26px 60px rgba(149,132,226,.25);
  border:1px solid rgba(210,196,255,.7);
  display:flex; flex-direction:column; gap:18px;
}

h1 { font-size:28px; font-weight:700; color:#111827; margin:0; }
.form-sub { font-size:14px; color:#6b7280; margin-top:-8px; }

.name-row { display:flex; gap:12px; }
.name-row .field { flex:1; }

.field { display:flex; flex-direction:column; gap:6px; }
.field label { font-size:14px; color:#4b5563; font-weight:500; }
.input {
  border-radius:24px; border:1px solid #e0ddf7;
  padding:11px 16px; font-size:14px; outline:none;
  transition:border-color .15s,box-shadow .15s;
}
.input:focus { border-color:#ae68fa; box-shadow:0 0 0 3px rgba(174,104,250,.18); }

.msg { font-size:13px; padding:10px 14px; border-radius:10px; }
.error   { background:#fee2e2; color:#dc2626; }
.success { background:#dcfce7; color:#16a34a; }

.btn-primary {
  width:100%; padding:12px; border-radius:999px; border:none;
  background:linear-gradient(90deg,#ae68fa,#f1966e);
  color:#fff; font-size:15px; font-weight:600;
  cursor:pointer; transition:opacity .15s;
}
.btn-primary:hover    { opacity:.9; }
.btn-primary:disabled { opacity:.6; cursor:not-allowed; }

.switch-text { font-size:14px; color:#6b7280; text-align:center; }
.link { color:#ae68fa; font-weight:600; text-decoration:none; }
.link:hover { text-decoration:underline; }

@media (max-width:900px) {
  .page { padding:24px 16px; }
  .decor { display:none; }
  .form-card { padding:32px 24px; }
  .name-row { flex-direction:column; }
}
</style>