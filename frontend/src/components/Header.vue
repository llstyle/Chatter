<template>
    <header>
      <div>
        <p class="nav-item logo-item" @click="$router.push({name: 'home'})">Ch</p>
      </div>
      <div>
        <p class="nav-item" @click="$router.push({name: 'login'})">login</p>
      </div>
    </header>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  header {
    background-color: black;
    color: chartreuse;
    padding: 10px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
  }
  
  img {
    margin-right: 10px;
  }
  
  p {
    margin: 0;
    cursor: pointer;
  }
  .nav-item {
    background-color: black;
    color: chartreuse;
    padding: 3px;
  }
  .logo-item {
    border: 1px solid #ddd;
  }
  </style>
  