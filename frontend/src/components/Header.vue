<template>
    <header>
      <div class="logo">
        <h1 @click="$router.push({name: 'home'})">Chatter</h1>
      </div>
      <div>
        <h3 @click="$router.push({name: 'login'})">login</h3>
      </div>
    </header>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  header {
    background-color: #3498db;
    color: white;
    padding: 10px;
    text-align: center;
    display: flex;
    justify-content: space-between;
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  
  img {
    height: 40px;
    margin-right: 10px;
  }
  
  h1, h3 {
    margin: 0;
    font-size: 1.5em;
    cursor: pointer;
  }
  </style>
  