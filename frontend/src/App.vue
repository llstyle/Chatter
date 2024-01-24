<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
import {useUserStore} from '@/stores/user.store.js'
import "@/assets/fonts/font.css"

const userStore = useUserStore()

</script>

<template>
  <div class="wrapper">
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
  background-color: black;
  color: chartreuse;
}

* {
  box-sizing: border-box;
  font-family: "Pixel";
}
::placeholder {
  color: black;
}
</style>
