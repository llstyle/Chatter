<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
</script>

<template>
  <div class="wrapper">
    <Header />
    <RouterView style="flex-grow: 1;" />
  </div>
</template>

<style>
body, html, #app {
  height: 100vh;
  margin: 0;
  padding: 0;
}

.wrapper {
  display: flex;
  flex-flow: column;
  height: 100vh;
}

* {
  box-sizing: border-box;
}
</style>
