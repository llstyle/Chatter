<template>
    <header>
      <div>
        <p class="nav-item back" @click="emit('back')"><span>&#8592;</span></p>
      </div>
      <div>
        <p class="nav-item logo-item">
          <span >{{ chatStore.chat.name.at(0).firstname }} {{ chatStore.chat.name.at(0).lastname }}</span> 
          <span v-if="chatStore.chat.name.at(0).online">(online)</span>
          <span v-else>(offline)</span>
        </p>
      </div>

    </header>
  </template>
  
  <script setup>
  import { useChatStore } from '@/stores/chat.store';

  const emit = defineEmits(['back'])

  const chatStore = useChatStore()

  </script>
  
  <style scoped>
  header {
    background-color: black;
    color: black;
    padding: 10px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
  }
  
  .logo {
    display: flex;
    align-items: center;
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
    padding: 4px;
  }
  @media (min-width:960px) {
    .back {
      display: none;
    }
  }
  </style>
  