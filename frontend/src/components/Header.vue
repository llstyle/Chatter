<template>
    <header>
      <div class="logo">
        <h1 class="nav-item" @click="$router.push({name: 'home'})">Chatter</h1>
      </div>
      <div>
        <h3 class="nav-item" @click="$router.push({name: 'login'})">login</h3>
      </div>
    </header>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  header {
    background-color: chartreuse;
    color: black;
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
  .nav-item {
    color: black;
    background-color: chartreuse;
  }
  </style>
  