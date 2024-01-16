<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';

const router = useRouter()

const loginData = reactive({
  email: '',
  password: '',
});

const userStore = useUserStore()


const login = async () => {
  try {
    const response = await axios.post('/auth/login', {email: loginData.email, password: loginData.password}, { withCredentials: true });
    userStore.user.token = response.data.accessToken
    userStore.startRefreshTokenTimer()
    await router.push({ name: "home" })
  } catch (error) {
    alert(error.response.data.message)
    console.error('Login failed:', error);
  }
};

</script>

<template>
  <div class="auth-container">
    <form @submit.prevent="login" class="auth-form">
      <h2>Login to your account</h2>

      <label for="loginemail">Email:</label>
      <input v-model="loginData.email" type="text" id="loginemail" required />

      <label for="loginPassword">Password:</label>
      <input v-model="loginData.password" type="password" id="loginPassword" required />

      <button type="submit">Login</button>
    </form>
  </div>
</template>


<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 -50% 0 0;
  transform: translate(-50%, -50%)
}

.auth-form {
  background-color: black;
  border: 1px solid darkgrey;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
}

.auth-form h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
}

.auth-form label {
  display: block;
  margin-bottom: 8px;
}

.auth-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  background-color: chartreuse;
  color: black;
  border-radius: 4px;
}

.auth-form button {
  width: 100%;
  padding: 10px;
  background-color: chartreuse;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

</style>

