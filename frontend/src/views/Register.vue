<script setup>
import axios from 'axios';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const registerData = reactive({
  username: '',
  email: '',
  password: '',
  firstname: '',
  lastname: ''
});

const register = async () => {
  try {
    const response = await axios.post('/auth/register', registerData);
    localStorage.setItem("token", response.data.token)
    await router.push({name: "home"})
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
</script>

<template>
    <div class="auth-container">
      <form @submit.prevent="register" class="auth-form">
        <h2>Create an account</h2>
  
        <label for="username">Username:</label>
        <input v-model="registerData.username" type="text" id="username" required />
  
        <label for="email">Email:</label>
        <input v-model="registerData.email" type="email" id="email" required />
  
        <label for="password">Password:</label>
        <input v-model="registerData.password" type="password" id="password" required />

        <label for="firstname">First Name:</label>
        <input v-model="registerData.firstname" type="text" id="firstname" required/>

        <label for="lastname">Last Name:</label>
        <input v-model="registerData.lastname" type="text" id="lastname" />
  
        <button type="submit">Register</button>
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
    background-color: #fff;
    border: 1px solid #ddd;
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
    border-radius: 4px;
  }
  
  .auth-form button {
    width: 100%;
    padding: 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  </style>