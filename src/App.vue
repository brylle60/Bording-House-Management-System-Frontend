<script setup lang="ts">
import { ref } from 'vue';
import { loginUser } from './services/authService';

const username = ref('');
const password = ref('');
const statusMessage = ref('');

const handleLogin = async () => {
  try {
    const data = await loginUser({ 
      username: username.value, 
      password: password.value 
    });
    statusMessage.value = `Success: Welcome ${data.user || username.value}!`;
  } catch (error: any) {
    statusMessage.value = "Error: Invalid credentials.";
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Boarding House Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="handleLogin">Login</button>
    <p v-if="statusMessage">{{ statusMessage }}</p>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: 50px auto;
}
input, button {
  padding: 8px;
}
</style>