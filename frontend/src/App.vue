<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {useUserStore} from '@/stores/user.store.js'
import { ref } from 'vue';
import "@/assets/fonts/font.css"

const visible = ref(true)

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    visible.value = true
  } else {
    visible.value = false
  }
});
</script>

<template>
  <div class="wrapper" v-if="visible">
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
img {
  max-width: 100%;
}

</style>
