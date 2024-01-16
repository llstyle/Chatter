<template>
    <div class="profile-container">
      <div class="profile-header">
        <img :src="user.avatar" alt="User Avatar" class="avatar" />
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </div>
  
      <div class="profile-details">
        <h3>About Me</h3>
        <p>{{ user.about }}</p>
  
        <h3>Contact Information</h3>
        <ul>
          <li><strong>Email:</strong> {{ user.email }}</li>
          <li v-if="user.phone"><strong>Phone:</strong> {{ user.phone }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';  

  const user = reactive({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'avatar.jpg',
    about: 'I love programming and exploring new technologies.',
    phone: '123-456-7890',
  });
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 8px;
  }
  
  .profile-header {
    text-align: center;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  
  .profile-details h3 {
    margin-top: 20px;
  }
  
  .profile-details ul {
    list-style: none;
    padding: 0;
  }
  
  .profile-details li {
    margin-bottom: 10px;
  }
  </style>